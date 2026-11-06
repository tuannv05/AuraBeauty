# 📋 KẾ HOẠCH NÂNG CẤP TOÀN DIỆN HỆ THỐNG: COMPLETE PLATFORM UPGRADE PLAN

> **Mã kế hoạch:** `complete-platform-upgrade-plan`  
> **Căn cứ nghiệp vụ:** [QT-06: Hoàn Thiện Toàn Diện Hệ Thống](file:///d:/A_javaFW/WebBanMP/docs/flows/QT-06-complete-ddd-reactive-hybrid-rag-vto-mcp.md)  
> **Hiến pháp tuân thủ:** [AGENTS.md](file:///d:/A_javaFW/WebBanMP/AGENTS.md) & [GEMINI.md](file:///d:/A_javaFW/WebBanMP/GEMINI.md)

---

## 1. BẢNG PHÂN BỔ 5 HẠNG MỤC KỸ THUẬT & DANH SÁCH FILE CAN THIỆP

### HẠNG MỤC 1: Rich DDD, Bảo Mật 5 Tầng & ArchUnit Tests (`/backend`)
- **Phân hệ Catalog & INCI (`backend/catalog-service`)**:
  - `com.cosmetics.catalog.domain.model.Product`: Củng cố `CosmeticSafetySpecification`, số CBMP hợp lệ (`cbmpNumber`), kiểm tra danh mục chất cấm (Corticoid, Thủy ngân, Hydroquinone).
  - `com.cosmetics.catalog.domain.model.InciIngredient`: Điểm bít tắc lỗ chân lông (`comedogenicRating`), kích ứng (`irritationRating`), nhãn an toàn (`PREGNANCY_SAFE`, `ALCOHOL_FREE`).
  - `com.cosmetics.catalog.HexagonalArchitectureTest`: Đảm bảo 100% domain độc lập với Spring framework/database.
- **Phân hệ Inventory & Lô hàng FEFO (`backend/inventory-service`)**:
  - `com.cosmetics.inventory.domain.model.StockItem`: Giữ kho nguyên tử CAS (`version`, `(on_hand - reserved) >= quantity`).
  - `com.cosmetics.inventory.domain.model.InventoryLot`: Thuật toán FEFO (First-Expired, First-Out), cảnh báo và khóa xuất kho các lô có hạn dùng `< 180 ngày` (< 6 tháng).
- **Phân hệ Order & Tách Đơn (`backend/order-service`)**:
  - `com.cosmetics.order.domain.model.MasterOrder`: Tách thành `SubOrder` theo `shopId`.
  - `com.cosmetics.order.domain.model.OrderLineSnapshot`: Anti-Corruption Layer (ACL) bảo toàn giá, tên, CBMP tại thời điểm đặt.
  - Phân bổ giảm giá Pro-rata theo tỷ lệ giá trị hàng hóa với `BigDecimal` và `RoundingMode.HALF_UP`.
  - Java 21 `sealed interface OrderStatus` & State Machine đơn hàng.
  - `com.cosmetics.order.HexagonalArchitectureTest`: Bộ kiểm thử ArchUnit cho phân hệ đơn hàng.
- **Phân hệ Payment & Sổ cái kép (`backend/payment-service`)**:
  - `com.cosmetics.payment.domain.model.DoubleEntryLedger`: Bất biến $\sum \text{Debit} = \sum \text{Credit}$, kiểu `NUMERIC(19,4)` và tiền tệ `BigDecimal`.
  - `com.cosmetics.payment.domain.model.EscrowAccount`: Tự động trích 10% hoa hồng sàn (`PLATFORM_COMMISSION`) và 90% công nợ Shop (`SELLER_PAYABLE`).
  - `com.cosmetics.payment.HexagonalArchitectureTest`: Bộ kiểm thử ArchUnit cho phân hệ thanh toán.

---

### HẠNG MỤC 2: Reactive Microservices, Transactional Outbox/Inbox & Saga Resilience (`/libs` & `/backend`)
- **`backend/common-outbox`**:
  - Gắn `aggregateId` làm Kafka Partition Key cho Outbox Publisher.
  - `TransactionalInbox` / `IdempotentConsumer`: Ngăn chặn lặp sự kiện Kafka/Webhook.
  - Xử lý bù trừ Saga (Saga Compensation) và Timeout Recovery (nhả tồn kho CAS khi quá 15 phút chưa thanh toán).

---

### HẠNG MỤC 3: Hybrid RAG (pgvector + Lexical INCI + RRF) & Multi-Stage SSE (`backend/ai-advisor-service` & `/ai`)
- **Hybrid Retrieval + Reciprocal Rank Fusion (RRF)**:
  - Kết hợp độ tương đồng vector (`cosine_similarity`) với so khớp từ khóa chính xác INCI.
- **Deterministic INCI Conflict Engine**:
  - Ma trận phát hiện xung đột hoạt chất mạnh (Retinoids, AHA/BHA, Vit C, Benzoyl Peroxide).
  - Tự động sinh chu trình Skin Cycling 28 ngày (Exfoliate -> Retinoid -> Recovery -> Recovery).
- **Multi-Stage SSE**:
  - Kênh `/api/ai/advisor/stream` phát tuần tự các event: `skin_analysis`, `inci_safety_matrix`, `routine_28_days`, `token`, `recommended_skus`.

---

### HẠNG MỤC 4: MCP Server Chuẩn Model Context Protocol (`/mcp`)
- Khởi tạo `mcp/aura-beauty-mcp-server/`:
  - `package.json`, `index.js`, `README.md`, `mcp/AGENTS.md`.
  - Cung cấp 4 MCP Tools:
    1. `check_inci_conflict`: Kiểm tra thành phần & xung đột hoạt chất.
    2. `get_fefo_stock_status`: Kiểm tra tồn kho CAS và các lô FEFO cận date.
    3. `audit_double_entry_ledger`: Kiểm toán bất biến Sổ cái kép và tỷ lệ 10%/90%.
    4. `inspect_split_order_saga`: Kiểm tra hành trình tách đơn hàng và Outbox events.

---

### HẠNG MỤC 5: Aura VTO 2.0 & UI/UX 4 Trạng Thái (`/frontend`)
- **Aura VTO 2.0 (`frontend/src/features/vto/`)**:
  - Bộ lọc One-Euro Filter (1€ Filter) chống rung giật điểm mốc mặt 60 FPS.
  - PBR Blending giữ vân môi tự nhiên (CIELAB $L^*$), không lem vào răng.
  - Tự động tạm dừng hiệu ứng nền (Intro/Particles) khi mở Modal AR để tiết kiệm 100% tài nguyên GPU.
- **Chuẩn hóa UI/UX 4 Trạng Thái**:
  - Buyer Zone (51 Sub-menus), Seller Zone (9 phân hệ), Admin Zone (9 phân hệ), Footer (15 trang) đủ 4 trạng thái (`Loading`, `Empty`, `Error`, `Data`).
  - Chống bấm đúp (Anti-Double-Submit) trên nút thanh toán/tạo đơn.
  - Confirm Modal cho các hành động hủy/xóa/khóa.
