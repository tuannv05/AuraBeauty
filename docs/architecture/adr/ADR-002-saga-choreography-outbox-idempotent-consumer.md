# ADR-002: Áp Dụng Saga Choreography, Transactional Outbox và Idempotent Consumer

## Bối cảnh (Context)
Trong kiến trúc microservice phân tán với Database-per-Service, luồng đặt hàng liên quan tới nhiều service (Order, Inventory, Payment). Không thể sử dụng giao dịch phân tán kiểu 2-Phase Commit (2PC) do không khả thi trên quy mô lớn và không được hỗ trợ tự nhiên giữa PostgreSQL và Apache Kafka.

## Các phương án cân nhắc (Options)
1. **Saga Orchestration:** Có một service điều phối tập trung (Orchestrator). Nhược điểm: Tạo điểm nghẽn đơn (Single Point of Failure), tăng mức độ phụ thuộc và khối lượng code quản lý trạng thái tập trung lớn cho một người.
2. **Saga Choreography + Transactional Outbox + Idempotent Consumer:** Các service tự phản ứng với Domain Events thông qua Apache Kafka. Mỗi service đảm bảo gửi sự kiện nguyên tử cùng với ghi dữ liệu vào CSDL thông qua bảng `outbox`. Phía nhận kiểm tra bảng `processed_events` để chống trùng lặp.

## Quyết định (Decision)
Áp dụng **Saga Choreography** kết hợp mẫu **Transactional Outbox** (đọc bản ghi bằng `SELECT ... FOR UPDATE SKIP LOCKED` và gửi qua `reactor-kafka`) và **Idempotent Consumer** (xác thực `eventId` qua bảng `processed_events` trong cùng một transaction nghiệp vụ).

## Hệ quả (Consequences)
- **Tích cực:** Các service hoàn toàn tách rời (loose coupling), không có điểm nghẽn tập trung, bảo đảm không bao giờ mất sự kiện nghiệp vụ (At-least-once delivery), xử lý an toàn trước các sự cố mạng hoặc khởi động lại container.
- **Tiêu cực (Đánh đổi):** Phức tạp trong việc theo dõi luồng giao dịch tổng thể; bắt buộc phải đầu tư thiết kế các luồng bù trừ (Compensating Transactions) khi có một mắt xích thất bại.
