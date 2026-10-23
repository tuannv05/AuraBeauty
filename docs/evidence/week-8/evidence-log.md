# Báo Cáo Minh Chứng Tuần 8: Payment Service Mock, Hoàn Tất Saga Đặt Hàng & Bù Trừ

## 1. Mục tiêu tuần 8 (MỐC QUAN TRỌNG NHẤT ĐỒ ÁN)
- Triển khai `payment-service` với luồng xử lý mock thanh toán, phát hành các sự kiện `PaymentSucceeded` hoặc `PaymentFailed`.
- Hoàn thiện chu trình phân tán Saga Choreography giữa 3 service: `order-service` ↔ `inventory-service` ↔ `payment-service`:
  1. `order-service`: Khách tạo đơn → lưu DB + Outbox `OrderPlaced`.
  2. `inventory-service`: Lắng nghe `OrderPlaced` → thực hiện giữ hàng nguyên tử:
     - Nếu đủ hàng: phát `InventoryReserved`.
     - Nếu thiếu hàng: phát `InventoryRejected`.
  3. `payment-service`:
     - Lắng nghe `InventoryReserved` → gọi mock cổng thanh toán:
       - Nếu thành công: ghi nhận thanh toán, phát `PaymentSucceeded`.
       - Nếu thất bại: phát `PaymentFailed`.
  4. Luồng bồi hoàn / Bù trừ (Compensating Transactions):
     - Nếu `InventoryRejected`: `order-service` hủy đơn (`OrderCancelled`), thông báo hết hàng.
     - Nếu `PaymentFailed`: `order-service` chuyển `OrderCancelled`, đồng thời `inventory-service` nhận sự kiện giải phóng kho (`ReleaseStock`) trả lại lượng tồn đã giữ tạm.

## 2. Kết quả kiểm chứng
- Chu trình Saga khép kín hoạt động thông suốt qua các Kafka topics:
  - `order.events.v1`
  - `inventory.events.v1`
  - `payment.events.v1`
- Idempotent Consumer ở tất cả các bên đảm bảo không xử lý lặp sự kiện trùng lặp.
