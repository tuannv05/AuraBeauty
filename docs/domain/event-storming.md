# Event Storming: Multi-Vendor Cosmetics Platform

Tài liệu ghi lại kết quả buổi Event Storming cho 4 luồng nghiệp vụ cốt lõi, các luồng bù trừ (Compensating Flows) và phân tích các điểm nóng kỹ thuật (Hotspots).

---

## 1. Các Luồng Nghiệp Vụ Cốt Lõi

### Luồng A. Seller vào sàn (Shop Onboarding)
- **Command:** `RegisterShop` (Seller gửi thông tin đăng ký gian hàng)
- **Domain Event:** `ShopRegistered` (Gian hàng tạo ở trạng thái `PENDING`)
- **Command:** `ApproveShop` / `RejectShop` (Admin kiểm tra giấy tờ kinh doanh)
- **Domain Event:** `ShopApproved` (Gian hàng chính thức hoạt động, được phép đăng sản phẩm) / `ShopRejected` (Gian hàng bị từ chối kèm lý do)

---

### Luồng B. Đăng và kiểm duyệt sản phẩm (Product Catalog)
- **Command:** `CreateProduct` (Seller tạo sản phẩm mới kèm danh sách Variant, giá và thành phần INCI)
- **Domain Event:** `ProductDrafted` (Sản phẩm ở trạng thái nháp `DRAFT`)
- **Command:** `SubmitForReview` (Seller gửi hồ sơ sản phẩm kèm Registration No.)
- **Domain Event:** `ProductSubmitted` (Trạng thái chuyển sang `SUBMITTED`)
- **Command:** `ApproveProduct` / `RejectProduct` (Admin kiểm duyệt Registration No. và công bố thành phần)
- **Domain Event:** `ProductPublished` (Admin duyệt, phát sự kiện sang Inventory tạo SKU mặc định và sang AI Advisor để lập chỉ mục vector)
- **Domain Event:** `ProductRejected` (Admin từ chối duyệt)
- **Command:** `UpdateProduct` $\to$ **Domain Event:** `ProductUpdated` (Cập nhật thông tin, kích hoạt re-indexing RAG)
- **Command:** `DeactivateProduct` $\to$ **Domain Event:** `ProductDeactivated` (Tạm ẩn sản phẩm, xóa vector chunk khỏi AI Advisor)

---

### Luồng C. Mua hàng đa người bán (Multi-Vendor Checkout & Saga) - Trọng tâm hệ thống
1. **Buyer chuẩn bị giỏ hàng:**
   - **Command:** `AddToCart`
   - **Domain Event:** `CartItemAdded` (Thêm dòng hàng vào giỏ, gộp theo Shop)
2. **Buyer đặt hàng (Checkout):**
   - **Command:** `PlaceOrder` (Chốt giá snapshot từ Catalog, tách giỏ hàng thành nhiều `SubOrder` theo Shop)
   - **Domain Event:** `OrderPlaced` (Order lưu vào DB `order_db` cùng Outbox message chứa payload danh sách các dòng SKU và Sub-order)
3. **Giữ tồn kho phân tán (Inventory Reservation):**
   - **Event Consumer:** `InventoryService` nhận `OrderPlaced`
   - **Command:** `ReserveStock` (Thực hiện câu lệnh UPDATE nguyên tử trên từng SKU: `reserved = reserved + qty WHERE on_hand - reserved >= qty`)
   - **Domain Event:** `InventoryReserved` (Tất cả SKU đều giữ thành công) **HOẶC** `InventoryRejected` (Ít nhất một SKU bị thiếu hàng)
4. **Thanh toán (Payment Execution):**
   - **Event Consumer:** `PaymentService` nhận `InventoryReserved`
   - **Command:** `ProcessPayment` (Khởi tạo phiên thanh toán giả lập / COD)
   - **Domain Event:** `PaymentSucceeded` **HOẶC** `PaymentFailed`
5. **Cập nhật trạng thái đơn:**
   - **Event Consumer:** `OrderService` nhận `PaymentSucceeded` $\to$ chuyển Order sang `PAID`, các `SubOrder` chuyển sang `READY_FOR_PROCESSING`
6. **Xử lý từng Sub-order tại từng Shop:**
   - **Command:** `ConfirmSubOrder` (Seller xác nhận chuẩn bị hàng) $\to$ `SubOrderConfirmed`
   - **Command:** `ShipSubOrder` (Bàn giao vận chuyển mock) $\to$ `SubOrderShipped`
   - **Command:** `DeliverSubOrder` (Khách nhận hàng thành công) $\to$ `SubOrderDelivered`
7. **Hạch toán doanh thu và đối soát (Commission & Ledger):**
   - **Event Consumer:** `PaymentService` nhận `SubOrderDelivered`
   - **Command:** `CalculateCommission`
   - **Domain Event:** `CommissionCalculated` (Hạch toán bút toán kép: Chuyển tiền từ tài khoản ký quỹ sang tài khoản Seller sau khi khấu trừ hoa hồng sàn)

---

### Luồng Bù Trừ (Compensating Transactions)
- **Kịch bản 1: Hết hàng khi đặt (`InventoryRejected`)**
  - `OrderService` nhận `InventoryRejected` $\to$ chuyển trạng thái Order sang `ORDER_CANCELLED`.
  - Không kích hoạt luồng thanh toán. Thông báo lý do cho Buyer.
- **Kịch bản 2: Thanh toán thất bại hoặc quá hạn (`PaymentFailed` / `ReservationExpired`)**
  - `OrderService` chuyển trạng thái sang `ORDER_CANCELLED`.
  - Phát lệnh bù trừ `ReleaseStock` $\to$ `InventoryService` tiêu thụ sự kiện và giảm `reserved`: `reserved = reserved - qty`.
- **Kịch bản 3: Seller từ chối 1 Sub-order sau khi đã thanh toán (`SubOrderRejected`)**
  - Seller bấm từ chối Sub-order của mình $\to$ `SubOrderRejected`.
  - `InventoryService` giải phóng tồn kho cho riêng các SKU của Sub-order đó (`InventoryReleased`).
  - `PaymentService` hoàn lại số tiền tương ứng của Sub-order đó cho Buyer (`SubOrderRefunded`), ghi bút toán đảo vào Ledger.
  - Các Sub-order khác của các Shop còn lại trong cùng Order vẫn tiếp tục được xử lý bình thường.

---

### Luồng D. Trợ lý tư vấn AI & RAG (AI Advisor)
- **Ingestion Pipeline:**
  - Nhận sự kiện `ProductPublished` từ Kafka.
  - Anti-Corruption Layer (ACL) chuyển đổi Product DTO thành Knowledge Document: Tên, Phân loại, Công dụng, Danh sách thành phần INCI, Loại da phù hợp.
  - Bộ cắt chunk (Chunking ~300-500 tokens, overlap ~50 tokens).
  - Sinh vector embedding (qua Embedding Model) $\to$ Lưu vào `ai_db` bảng `knowledge_chunks` (PostgreSQL `pgvector`).
- **Interactive Consultation (Chat SSE):**
  - Buyer gửi câu hỏi: `AskAdvisor(query, conversationId, skinProfile)`
  - Embedding truy vấn câu hỏi $\to$ Vector Search Top-$K$ ($K \approx 5$) bằng Cosine Distance qua SQL R2DBC (`ORDER BY embedding <=> :q::vector`).
  - Kết hợp lịch sử hội thoại gần nhất + Ngữ cảnh Skin Profile + Tri thức từ Top-$K$ chunks vào System Prompt.
  - Streaming câu trả lời về client qua Server-Sent Events (`text/event-stream`), hiển thị rõ nguồn trích dẫn sản phẩm (Citations) và khuyến cáo an toàn da liễu.
  - Lưu hội thoại (`ConversationSaved`).

---

## 2. Phân Tích & Chốt 4 Điểm Nóng (Hotspots)

1. **Hotspot 1: Seller từ chối một Sub-order thì xử lý hoàn tiền toàn bộ Order hay chỉ phần của Sub-order đó?**
   - **Quyết định:** Chỉ hoàn tiền phần giá trị của riêng Sub-order bị từ chối.
   - **Lý do:** Đây là đặc trưng sống còn của sàn thương mại điện tử đa người bán (Multi-vendor). Hành động của Shop này không được gây ảnh hưởng làm hủy ngang các giao dịch độc lập của các Shop khác trong cùng một giỏ hàng của Buyer.
2. **Hotspot 2: Hạn giữ tồn kho (Reservation TTL) là bao lâu?**
   - **Quyết định:** 15 phút cho môi trường mock / phát triển.
   - **Lý do:** Đủ thời gian để Buyer thao tác thanh toán hoặc mô phỏng lỗi mạng; đồng thời giải phóng tồn kho kịp thời qua Scheduled Job quét các Reservation quá hạn để tránh treo hàng ảo.
3. **Hotspot 3: Xử lý giá thay đổi giữa lúc đưa vào giỏ và lúc bấm đặt hàng?**
   - **Quyết định:** Giá trong giỏ hàng chỉ là tham khảo. Giá bán chính thức được chốt tại thời điểm Buyer gửi lệnh `PlaceOrder`.
   - **Lý do:** Trước khi tạo Order, hệ thống gọi Catalog để lấy snapshot giá mới nhất. Nếu có chênh lệch, trả cảnh báo kèm giá mới cho Buyer xác nhận lại trước khi tạo Order.
4. **Hotspot 4: Quan hệ giữa Product, Variant, tồn kho và dòng đơn hàng?**
   - **Quyết định:** Một `Product` có nhiều `Variant` (SKU). Tồn kho và giá được quản lý chặt chẽ ở cấp độ từng `Variant`. Dòng đơn hàng (`OrderLine`) luôn gắn với một `VariantId`/`SKU` cụ thể.
