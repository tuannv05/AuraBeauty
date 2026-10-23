# Ubiquitous Language (Thuật ngữ Domain cốt lõi)

Tài liệu này định nghĩa ngôn ngữ chung (Ubiquitous Language) được áp dụng thống nhất giữa tài liệu thiết kế, mã nguồn (Domain model, API, Event, DTO) và cơ sở dữ liệu của hệ thống sàn thương mại điện tử mỹ phẩm đa người bán (Multi-vendor Cosmetics Platform).

| Thuật ngữ | Định nghĩa | Ghi chú & Quy tắc bất biến |
| :--- | :--- | :--- |
| **Buyer** | Người mua hàng trên sàn mỹ phẩm | Có thể tạo Skin Profile, xem hàng, tạo giỏ và đặt đơn hàng. Một tài khoản có thể đóng vai trò cả Buyer và Seller. |
| **Seller** | Người bán hàng sở hữu gian hàng (Shop) | Đăng ký gian hàng, quản lý sản phẩm, xác nhận và xử lý giao vận cho Sub-order thuộc Shop mình. |
| **Admin** | Quản trị viên hệ thống sàn | Duyệt đăng ký Shop, kiểm duyệt hồ sơ công bố mỹ phẩm (Registration No.) để duyệt Product lên sàn. |
| **Shop** | Gian hàng của Seller | Trạng thái: `PENDING` $\to$ `APPROVED` hoặc `REJECTED`. Chỉ Shop ở trạng thái `APPROVED` mới được đăng và bán sản phẩm. |
| **Product** | Sản phẩm mỹ phẩm do Seller đăng bán | Trạng thái: `DRAFT` $\to$ `SUBMITTED` $\to$ `PUBLISHED` / `REJECTED` $\to$ `DEACTIVATED`. Chỉ hiển thị công khai cho Buyer khi `PUBLISHED`. Bắt buộc có $\ge 1$ Variant và hợp lệ về thành phần INCI. |
| **Variant / SKU** | Biến thể cụ thể bán được của sản phẩm (theo dung tích, thể tích, màu sắc, loại đóng gói) | Đơn vị quản lý tồn kho và là đơn vị của dòng đơn hàng. Mỗi Variant có mã SKU riêng, giá riêng và tồn kho riêng. |
| **INCI** | *International Nomenclature of Cosmetic Ingredients* - Danh mục danh pháp thành phần mỹ phẩm chuẩn quốc tế | Dùng làm cơ sở phân tích độ an toàn, tương thích loại da, cảnh báo kích ứng và là nguyên liệu tri thức cốt lõi cho RAG AI Advisor. |
| **Registration No.** | Số tiếp nhận phiếu công bố sản phẩm mỹ phẩm do cơ quan quản lý y tế cấp | Trường bắt buộc để Admin phê duyệt sản phẩm từ `SUBMITTED` sang `PUBLISHED`. |
| **Skin Profile** | Hồ sơ phân tích đặc điểm làn da của Buyer | Bao gồm: Loại da (Dầu, Khô, Hỗn hợp, Nhạy cảm, Thường), các vấn đề da quan tâm (Mụn, Lão hóa, Tăng sắc tố,...), các thành phần kích ứng/dị ứng. Dùng để lọc sản phẩm và cá nhân hóa câu trả lời tư vấn chatbot. |
| **Cart** | Giỏ hàng tạm thời của Buyer | Lưu trữ các mặt hàng định mua, có thể chứa các dòng sản phẩm từ nhiều Shop khác nhau. Chưa thực hiện giữ tồn kho. |
| **Order** | Đơn hàng tổng thể do Buyer đặt trong một lần thanh toán | Aggregate cha. Chứa thông tin người nhận, tổng số tiền thanh toán, và tập hợp các `SubOrder`. |
| **Sub-order** | Đơn hàng con thuộc về một Shop cụ thể | Mỗi Shop trong giỏ hàng sẽ được tách thành một Sub-order riêng biệt. Vòng đời xử lý, xác nhận, giao hàng, từ chối và đối soát hoa hồng diễn ra độc lập ở cấp độ Sub-order. |
| **Reservation** | Bản ghi giữ tồn kho tạm thời cho một Order/Sub-order | Khi Order được khởi tạo, tồn kho được giữ nguyên tử (`reserved`). Có thời hạn (TTL mặc định 15 phút). Nếu thanh toán thất bại hoặc quá hạn mà chưa thanh toán, tồn kho sẽ tự động được hoàn trả (`release`). |
| **Payment** | Giao dịch thanh toán tài chính cho toàn bộ Order | Trạng thái: `PENDING` $\to$ `SUCCESS` hoặc `FAILED`. Hỗ trợ luồng hoàn tiền (`REFUNDED`) khi đơn hàng hoặc Sub-order bị từ chối/hủy. |
| **Commission** | Tỷ lệ hoa hồng sàn thu trên giá trị Sub-order hoàn tất | Được tính toán và hạch toán vào sổ cái khi Sub-order chuyển sang trạng thái `DELIVERED`. |
| **Ledger Entry** | Bút toán kế toán sổ cái kép (Double-entry Ledger) | Ghi nhận tài chính: Nợ (Debit) và Có (Credit). Quy tắc bất biến: $\sum \text{Debit} = \sum \text{Credit}$. Dùng để quản lý số dư ký quỹ, tiền chờ thanh toán cho Seller và doanh thu hoa hồng sàn. |
| **Knowledge Chunk** | Phân đoạn tri thức văn bản kèm vector embedding | Chứa thông tin trích xuất từ Product (tên, công dụng, INCI, loại da phù hợp) kèm vector $N$-chiều lưu trong PostgreSQL (`pgvector`) phục vụ tìm kiếm ngữ nghĩa tương đồng (Semantic Similarity Search). |
| **Conversation** | Phiên hội thoại giữa Buyer và trợ lý AI Advisor | Lưu trữ lịch sử câu hỏi, câu trả lời streaming SSE, các nguồn trích dẫn sản phẩm (Citations) và ngữ cảnh Skin Profile của người dùng. |
