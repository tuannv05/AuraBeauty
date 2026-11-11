# PLAN: TÍCH HỢP ĐỒ THỊ TRI THỨC GRAPHIFY
> **Mã quy trình**: QT-10 | **Đặc tả đồng bộ**: `docs/flows/graphify-integration-plan.md`

## 4 Giai đoạn phẫu thuật
1. Engine trích xuất đồ thị Node.js tại `/ai/graphify-engine/`.
2. Backend Reactive Hexagonal tại `backend/ai-advisor-service`.
3. Frontend Canvas Force-Directed UI tại `/frontend/src/features/graphify/`.
4. Kiểm định tự động toàn diện (ArchUnit, CAS, Vite build, Clean Root).
