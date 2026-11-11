# 📋 KẾ HOẠCH NÂNG CẤP & HOÀN THIỆN TOÀN DIỆN HỆ THỐNG (MASTER UPGRADE PLAN)

> **Mã kế hoạch:** `master-upgrade-plan`  
> **Căn cứ đặc tả:** `docs/flows/QT-07-complete-platform-master-upgrade.md` (và `.specify/specs/master-upgrade/spec.md`)  
> **Phương pháp thực thi:** Spec-Driven Development (SDD) & Surgical Changes (Phẫu thuật không gián đoạn)

---

## 1. PHÂN BỔ NHÓM CÔNG VIỆC CHÍNH

### Nhóm 1: Domain Aggregates, CAS, FEFO, Split Order & Double-Entry Ledger
- **Mục tiêu:** Kiểm tra và bảo vệ tính nguyên vẹn của toàn bộ tầng Domain thuần Java 21, đảm bảo logic nghiệp vụ không phụ thuộc framework bên ngoài.
- **Tập tin can thiệp:**
  - `backend/inventory-service/src/main/java/com/cosmetics/inventory/domain/`
  - `backend/inventory-service/src/main/java/com/cosmetics/inventory/adapter/out/persistence/StockItemRepository.java`
  - `backend/order-service/src/main/java/com/cosmetics/order/domain/`
  - `backend/payment-service/src/main/java/com/cosmetics/payment/domain/`
- **Tiêu chuẩn nghiệm thu:** Vượt qua `HexagonalArchitectureTest`, `AtomicStockConcurrencyTest`, `FefoAllocationPolicyTest`, `DoubleEntryLedgerTest`.

### Nhóm 2: Transactional Outbox/Inbox, Saga Compensation & Non-blocking Check
- **Mục tiêu:** Đảm bảo 100% Non-blocking Reactive Streams, cơ chế Idempotent Consumer và Saga bù trừ tự động khi hết hạn 15 phút.
- **Tập tin can thiệp:**
  - `backend/common-outbox/src/main/java/com/cosmetics/common/outbox/`
  - `backend/common-events/src/main/java/com/cosmetics/events/`
- **Tiêu chuẩn nghiệm thu:** BlockHound không phát hiện blocking call trong Netty event loop; không duplicate event khi retry.

### Nhóm 3: AI Advisor Hybrid RAG (RRF) + 28-Day Skin Cycling + Multi-Stage SSE
- **Mục tiêu:** Cung cấp trải nghiệm tư vấn thông minh, phân tích thành phần INCI, cảnh báo tương tác hoạt chất và phát luồng SSE mượt mà.
- **Tập tin can thiệp:**
  - `backend/ai-advisor-service/src/main/java/com/cosmetics/ai/`
- **Tiêu chuẩn nghiệm thu:** API endpoint `/api/v1/ai/advisor/chat` phát luồng dữ liệu thời gian thực không buffer.

### Nhóm 4: Frontend UI/UX, 51 Sub-menus Mega Menu, Seller Zone & Admin Zone
- **Mục tiêu:** Cam kết 0% màn hình trắng trên toàn bộ giao diện; đủ 4 trạng thái (Loading, Empty, Error, Data); nút bấm API tự động disabled + spinner chống double submit.
- **Tập tin can thiệp:**
  - `frontend/src/App.jsx`
  - `frontend/src/lib/submenuCatalogMapper.js`
  - `frontend/src/components/Navbar.jsx`
  - `frontend/src/components/AdminZone.jsx`
  - `frontend/src/components/SellerZone.jsx`
  - `frontend/src/components/ProductDetailView.jsx`
- **Tiêu chuẩn nghiệm thu:** `npm --prefix frontend run build` thành công 100%, không lỗi cú pháp hoặc runtime error.

### Nhóm 5: Đảm bảo Chất lượng Hình ảnh & Catalog
- **Mục tiêu:** Ảnh sản phẩm chuẩn Studio Packshot 1:1, dung lượng > 8KB, 0% trùng lặp, 0% ảnh rác.
- **Tập tin can thiệp:**
  - `frontend/public/products/`
  - `backend/catalog-service/src/main/resources/products_seed.json`

---

## 2. MA TRẬN PHÂN CHIA NHIỆM VỤ CHI TIẾT (TASK BREAKDOWN)

| Mã Task | Phân hệ | Nhiệm vụ kỹ thuật | Lệnh xác thực (Verification) |
| :--- | :--- | :--- | :--- |
| **TSK-01** | Backend Domain | Xác nhận độc lập 100% của tầng Domain và Rich DDD | `mvn test -pl backend/account-service -Dtest=HexagonalArchitectureTest` |
| **TSK-02** | Inventory | Kiểm tra kiểm soát tồn kho nguyên tử CAS và lô FEFO | `mvn test -pl backend/inventory-service -Dtest=AtomicStockConcurrencyTest` |
| **TSK-03** | Order & Payment| Kiểm tra Split Order Pro-rata và Sổ cái kép Debit = Credit | `mvn test -pl backend/payment-service -Dtest=DoubleEntryLedgerTest` |
| **TSK-04** | AI Advisor | Kiểm tra biên dịch và kiến trúc AI Advisor RAG | `mvn test-compile -pl backend/ai-advisor-service` |
| **TSK-05** | Frontend | Kiểm tra Mega Menu 51 sub-menus, Dashboards và Build Production | `npm --prefix frontend run build` |
| **TSK-06** | Toàn sàn | Kiểm tra hội tụ toàn hệ thống (Clean Root + Build Maven + Frontend) | Chạy chuỗi lệnh Convergence |
