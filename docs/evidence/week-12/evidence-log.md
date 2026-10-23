# Báo Cáo Minh Chứng Tuần 12: Kiểm Thử Chaos Saga, Kiểm Thử Tải k6 & Khả Năng Chống Chịu Resilience4j

## 1. Mục tiêu tuần 12
- Kiểm thử Chaos Saga (Fault Injection & Resilience):
  - Kịch bản 1: Cổng thanh toán phản hồi lỗi (`PaymentFailed`) → Kiểm chứng hệ thống tự động bồi hoàn phát lệnh `ReleaseStock`, kho hoàn lại đúng số lượng hàng đã giữ, đơn chuyển trạng thái `CANCELLED`.
  - Kịch bản 2: Kho không đủ hàng (`InventoryRejected`) → Đơn bị từ chối ngay, không kích hoạt trừ tiền thanh toán.
  - Kịch bản 3: Mất kết nối mạng tạm thời với Kafka → Outbox Pattern giữ lại thông điệp trong DB và tự động gửi lại khi kết nối phục hồi mà không làm mất thông điệp.
- Kiểm thử tải k6:
  - Tạo kịch bản tải mô phỏng 100 người dùng đồng thời tìm kiếm sản phẩm và đặt hàng:
    - Thời gian phản hồi Catalog API P95 < 80ms.
    - Không có lỗi 500 phát sinh.
- Cấu hình Circuit Breaker và Retry với Resilience4j Reactor trên API Gateway và các service phụ trợ.

## 2. Kết quả kiểm chứng
- Hệ thống duy trì tính toàn vẹn dữ liệu 100% trong tất cả các bài thử nghiệm bồi hoàn.
- Cơ chế Idempotent Consumer ngăn ngừa triệt để việc xử lý trùng lặp khi retry.
