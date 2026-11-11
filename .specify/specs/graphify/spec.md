# SPEC: TÍCH HỢP ĐỒ THỊ TRI THỨC GRAPHIFY VÀO SÀN TMĐT MỸ PHẨM AURA BEAUTY MALL
> **Mã quy trình**: QT-10 | **Tài liệu đặc tả**: `docs/flows/QT-10-tich-hop-do-thi-tri-thuc-graphify.md`
> **Bản thiết kế OSS**: `docs/blueprints/OSS-BLUEPRINT-graphify.md`

## Tóm tắt đặc tả kỹ thuật
- Port công nghệ Knowledge Graph từ `Graphify-Labs/graphify` theo Chiến lược C (Clean-room).
- Xây dựng `/ai/graphify-engine/` trích xuất Đồ thị Tri thức từ 157 sản phẩm.
- Mở rộng Backend Reactive `ai-advisor-service` (8086) với Domain Value Objects và non-blocking endpoints.
- Xây dựng bộ visualizer tương tác tại `/frontend/src/features/graphify/` với 4 trạng thái UI, pause physics khi bật AR camera để bảo vệ 60 FPS.
- Gắn vào 3 phân khu: Buyer Zone, Seller Zone, Admin Zone.
