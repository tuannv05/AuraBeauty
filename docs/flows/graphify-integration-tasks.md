# DANH SÁCH NHIỆM VỤ THỰC THI (TASKS): TÍCH HỢP GRAPHIFY KNOWLEDGE GRAPH
> **Quy trình**: QT-10 | **Kế hoạch**: `docs/flows/graphify-integration-plan.md`

---

- [x] **Task 1: Biên soạn tài liệu kiến trúc OSS Blueprint & Quy trình nghiệp vụ QT-10**
  - Hoàn tất `docs/blueprints/OSS-BLUEPRINT-graphify.md` đủ 17 mục chuẩn.
  - Hoàn tất `docs/flows/QT-10-tich-hop-do-thi-tri-thuc-graphify.md` đủ 15 mục chuẩn.
  - `Verify: node -e "const fs = require('fs'); ['docs/blueprints/OSS-BLUEPRINT-graphify.md', 'docs/flows/QT-10-tich-hop-do-thi-tri-thuc-graphify.md'].forEach(f => console.log(f, fs.existsSync(f)));"`

- [ ] **Task 2: Xây dựng Động cơ Đồ thị Tri thức Mỹ phẩm tại `/ai/graphify-engine/`**
  - Tạo thư mục `/ai/graphify-engine/src/` và `/ai/graphify-engine/output/`.
  - Viết `graphBuilder.js` đọc 157 sản phẩm, trích xuất nodes (`PRODUCT`, `INGREDIENT`, `SKIN_TYPE`, `SKIN_CONCERN`, `BRAND`) và edges (`CONTAINS_ACTIVE`, `TREATS_CONCERN`, `SUITABLE_FOR`, `SYNERGY_WITH`, `CONFLICTS_WITH`).
  - Xuất ra `ai/graphify-engine/output/cosmetics_knowledge_graph.json`.
  - `Verify: node ai/graphify-engine/src/graphBuilder.js`

- [ ] **Task 3: Nâng cấp Reactive Backend tại `backend/ai-advisor-service`**
  - Thêm Domain Records trong `domain/model/graph/`: `KnowledgeGraphNode`, `KnowledgeGraphEdge`, `SkinRoutineGraphAnalysis`.
  - Thêm Endpoints Reactive Non-blocking trong `AiAdvisorController`: `GET /graph/product/{id}`, `POST /graph/routine-check`.
  - `Verify: $env:JAVA_HOME = 'C:\Program Files\Java\jdk-22'; mvn test -pl backend/account-service,backend/catalog-service -Dtest=HexagonalArchitectureTest`

- [ ] **Task 4: Xây dựng Bộ giao diện Đồ thị Tương tác tại `/frontend/src/features/graphify/`**
  - Tạo `CosmeticKnowledgeGraphModal.jsx` (Buyer PDP & Routine) hỗ trợ zoom/pan, force simulation, spotlight hover, pause khi AR bật.
  - Tạo `AdminGraphifyExplorer.jsx` (Admin Antifraud & Topology) tích hợp vào Admin Zone submenu `antifraud` & `system`.
  - Tạo `SellerProductSynergyGraph.jsx` (Seller Cross-Sell) tích hợp vào Seller Zone submenu `products` & `marketing`.
  - Đảm bảo đủ 4 trạng thái UI (Loading, Empty, Error, Data).
  - `Verify: npm --prefix frontend run build`

- [ ] **Task 5: Kiểm định nghiệm thu hội tụ toàn diện (`/speckit-converge`)**
  - Kiểm tra Clean Root.
  - Chạy toàn bộ test suites (`HexagonalArchitectureTest`, `AtomicStockConcurrencyTest`).
  - Xác nhận Frontend Vite Build xanh 100%.
