# KẾ HOẠCH TRIỂN KHAI KỸ THUẬT: TÍCH HỢP ĐỒ THỊ TRI THỨC GRAPHIFY (SPEC-KIT PLAN)
> **Mã quy trình**: QT-10 | **Chiến lược**: Clean-room Modular Architecture

---

## 1. CÁC GIAI ĐOẠN THỰC THI CHÍNH
1. **Giai đoạn 1**: Hoàn tất tài liệu kiến trúc OSS Blueprint và Quy trình nghiệp vụ QT-10.
2. **Giai đoạn 2**: Xây dựng Động cơ Đồ thị Tri thức Mỹ phẩm tại `/ai/graphify-engine/`:
   - Script trích xuất `graphBuilder.js` quét 157 sản phẩm, trích xuất thực thể và quan hệ.
   - Xuất dữ liệu `cosmetics_knowledge_graph.json`.
3. **Giai đoạn 3**: Nâng cấp Reactive Backend tại `backend/ai-advisor-service`:
   - Domain models: `KnowledgeGraphNode`, `KnowledgeGraphEdge`, `SkinRoutineGraphAnalysis`.
   - Reactive controller endpoints: `GET /graph/product/{productId}`, `POST /graph/routine-check`.
   - Đảm bảo độc lập kiến trúc Hexagonal (ArchUnit) và Non-blocking Reactive (BlockHound).
4. **Giai đoạn 4**: Xây dựng bộ giao diện trực quan hóa tại `/frontend/src/features/graphify/`:
   - `CosmeticKnowledgeGraphModal.jsx` (Buyer PDP & Routine).
   - `AdminGraphifyExplorer.jsx` (Admin Antifraud & Topology).
   - `SellerProductSynergyGraph.jsx` (Seller Cross-Sell Synergy).
   - Tích hợp 4 trạng thái UI và cơ chế tự ngắt vòng lặp vật lý khi AR VTO camera bật.
5. **Giai đoạn 5**: Kiểm định nghiệm thu (`/speckit-converge`):
   - Clean Root check.
   - Maven test suite (`HexagonalArchitectureTest`, `AtomicStockConcurrencyTest`).
   - Frontend Vite build.
