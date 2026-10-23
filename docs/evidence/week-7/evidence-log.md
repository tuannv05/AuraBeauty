# Báo Cáo Minh Chứng Tuần 7: Tách Đơn Hàng (Split-Order), State Machine & Outbox Relay

## 1. Mục tiêu tuần 7
- Nghiệp vụ Multi-Vendor then chốt: **Split Order** (Tách đơn hàng):
  - Khách hàng thanh toán một lần cho toàn bộ đơn hàng (Master Order).
  - Hệ thống tự động phân nhóm các `OrderItem` theo `shopId` và sinh ra các `SubOrder` độc lập tương ứng.
  - Vòng đời giao nhận, đóng gói và đối soát diễn ra độc lập trên từng `SubOrder`.
- Triển khai Transactional Outbox Pattern:
  - Khi lưu `Order` và `SubOrder` vào DB, bản ghi sự kiện `OrderPlacedEvent` được ghi đồng thời vào bảng `outbox_messages` trong cùng một transaction R2DBC.
  - Worker nền `OutboxRelayWorker` định kỳ quét các thông điệp `PENDING`, phát lên Kafka topic `order.events.v1`, và cập nhật trạng thái `SENT` hoặc `FAILED` với cơ chế retry an toàn.
  - Loại bỏ hoàn toàn nguy cơ Dual-Write lỗi giữa DB và Kafka broker.

## 2. Kết quả kiểm chứng
- Mô hình tách đơn hoạt động chính xác khi có nhiều Seller trong một giỏ hàng.
- Bảng `outbox_messages` và `OutboxRelayWorker` đảm bảo tính đảm bảo phân phát At-least-once.
