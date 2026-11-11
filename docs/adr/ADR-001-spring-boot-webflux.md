# ADR-001: Lựa Chọn Quarkus 3.15 LTS + Mutiny Cho Kiến Trúc Reactive (Superseded Spring Boot)

## Trạng thái (Status)
**ACCEPTED & MIGRATED (Nâng cấp toàn diện từ Spring Boot 3 sang Quarkus 3.15.1 LTS)**

## Bối cảnh (Context)
Hệ thống sàn thương mại điện tử cần xử lý lưu lượng truy cập cao, nhiều thao tác I/O bất đồng bộ (giao tiếp Kafka, truy vấn CSDL phi chặn, streaming câu trả lời trợ lý AI qua Server-Sent Events). Trong giai đoạn đầu, hệ thống đã cân nhắc và thử nghiệm Spring Boot 3 WebFlux (Project Reactor). Tuy nhiên, khi mở rộng quy mô lên 7 microservices chạy đồng thời trên máy chủ phát triển và container:
- Mức tiêu thụ bộ nhớ RAM của Spring Boot khá lớn (~250MB - 400MB mỗi service).
- Thời gian khởi động (Startup Time) từ 8s đến 15s gây cản trở cho quy trình CI/CD và kiểm thử cục bộ.

## Quyết định (Decision)
**Chuyển đổi toàn bộ 7 Microservices sang Quarkus 3.15.1 LTS + SmallRye Mutiny Reactive Streams**:
1. **Runtime:** Vert.x Reactive Engine, 100% Non-blocking EventLoop.
2. **Reactive DB Drivers:** Quarkus Reactive PgPool (PostgreSQL) và Quarkus MongoDB Panache Reactive.
3. **API Gateway:** Quarkus Vert.x Reactive Reverse Proxy với JWT Filter và CORS tập trung.
4. **Clean Architecture:** Bảo vệ 100% tầng `domain` thuần Java 21/22, không phụ thuộc vào framework, kiểm chứng bằng ArchUnit.

## Hệ quả & Đánh giá thực nghiệm (Consequences & Metrics)
- **Tích cực:**
  - **Khởi động siêu tốc:** Thời gian khởi động giảm xuống chỉ còn **1.4s – 2.5s** cho mỗi microservice.
  - **Tiết kiệm RAM vượt trội:** Mỗi service chỉ chiếm **~80MB – 120MB** RAM (giảm > 60% so với Spring Boot), cho phép chạy toàn bộ cụm 7 microservices cùng lúc với < 1.2GB RAM.
  - **Hiệu năng I/O:** Reactive PgPool và Vert.x EventLoop xử lý thông lượng cao mà không xảy ra hiện tượng block thread.
  - **Tương thích hoàn hảo:** Giữ nguyên 100% logic Domain Hexagonal, giao dịch phân tán Saga Outbox và CAS Concurrency.
- **Thách thức đã giải quyết:**
  - Chuyển đổi mô hình phản ứng từ Project Reactor (`Mono`/`Flux`) sang SmallRye Mutiny (`Uni`/`Multi`).
  - Cấu hình native reflection và SmallRye Context Propagation cho luồng bảo mật JWT.
