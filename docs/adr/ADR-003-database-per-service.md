# ADR-003: Áp Dụng Chiến Lược Database-per-Service, Không Join Chéo Database

## Bối cảnh (Context)
Các microservice cần độc lập về chu kỳ phát triển, kiểm thử, thay đổi lược đồ dữ liệu (schema migration) và khả năng mở rộng (scaling). Nếu dùng chung một database và join bảng chéo giữa các service, ranh giới domain sẽ bị phá vỡ và gây thắt nút cổ chai nghiêm trọng.

## Các phương án cân nhắc (Options)
1. **Shared Database:** Nhiều service cùng kết nối vào một database duy nhất và thực hiện SQL JOIN giữa các bảng. Ưu điểm: Dễ viết truy vấn ban đầu. Nhược điểm: Phá vỡ tính tự chủ của microservices, xung đột schema migration, vi phạm nguyên lý DDD.
2. **Database-per-Service:** Mỗi service sở hữu riêng một cơ sở dữ liệu logic hoặc vật lý độc lập (`account_db`, `catalog_db`, `order_db`, `inventory_db`, `payment_db`, `ai_db`).

## Quyết định (Decision)
Quyết định áp dụng nghiêm ngặt nguyên tắc **Database-per-Service**. Tuyệt đối không có bất kỳ câu lệnh SQL/NoSQL nào được phép truy cập hoặc join chéo sang cơ sở dữ liệu của service khác. Trao đổi dữ liệu thực hiện qua REST API (phi chặn), gRPC hoặc Domain Events (Kafka).

## Hệ quả (Consequences)
- **Tích cực:** Mỗi service tự do lựa chọn công nghệ CSDL phù hợp nhất (Polyglot Persistence: MongoDB cho danh mục sản phẩm động, PostgreSQL cho giao dịch ACID và sổ cái kế toán, PostgreSQL + pgvector cho embedding AI). Độc lập triển khai mà không sợ ảnh hưởng đến các service khác.
- **Tiêu cực (Đánh đổi):** Phải chấp nhận dữ liệu dư thừa dưới dạng Snapshot (như lưu snapshot giá, tên sản phẩm trong `OrderLine`) và tính nhất quán cuối cùng (Eventual Consistency) thay vì tính nhất quán tức thời (Strong Consistency).
