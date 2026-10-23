# Báo Cáo Minh Chứng Tuần 13: Observability Cơ Bản, Triển Khai Máy Sạch & Dữ Liệu Demo

## 1. Mục tiêu tuần 13
- Giám sát và Observability:
  - Spring Boot Actuator: Kích hoạt `/actuator/health`, `/actuator/info`, `/actuator/prometheus` trên tất cả 6 services và API Gateway.
  - Giao diện trực quan hóa Kafka qua `Kafka-UI` trên cổng `8090`: theo dõi danh sách topic, số lượng partition, offset và thông điệp sự kiện thời gian thực.
- Kiểm thử dựng hệ thống từ máy sạch (Clean-Slate Deployment):
  - Kịch bản: Máy tính mới chỉ cài Docker Desktop, JDK 21+ và Git.
  - Chạy `docker compose -f infra/docker/docker-compose.yml up -d` để khởi tạo PostgreSQL, pgvector, MongoDB, Kafka broker và Kafka-UI.
  - Chạy backend Maven và frontend React Vite.
  - Xác nhận tất cả các thành phần kết nối đồng bộ và hoạt động ổn định.

## 2. Kết quả kiểm chứng
- Hệ thống khởi động trơn tru trong chưa đầy 2 phút trên máy phát triển sạch.
- Các container cơ sở dữ liệu và message broker duy trì trạng thái Healthy.
