# Multi-Vendor Cosmetics Platform (Sàn Thương Mại Điện Tử Mỹ Phẩm Đa Người Bán)

Dự án đồ án tốt nghiệp / chuyên đề kỹ thuật phần mềm xây dựng nền tảng sàn thương mại điện tử mỹ phẩm đa người bán theo kiến trúc **Microservices Reactive 100% Non-blocking**, áp dụng thiết kế hướng tên miền (**Domain-Driven Design - DDD**), mô hình **Hexagonal Architecture (Ports and Adapters)**, mẫu giao dịch phân tán **Saga Choreography** kết hợp **Transactional Outbox**, và trợ lý trí tuệ nhân tạo **AI Advisor (RAG)** tư vấn thành phần mỹ phẩm (INCI) qua Server-Sent Events (SSE).

---

## 1. Cấu Trúc Hệ Thống (6 Services + 1 Gateway)

| STT | Service | Bounded Context | Công Nghệ Chính | Cơ Sở Dữ Liệu |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **account-service** | Identity & Shop | Spring Boot 3 WebFlux, Spring Security, R2DBC | PostgreSQL (`account_db`) |
| 2 | **catalog-service** | Product & INCI | Spring Boot 3 WebFlux, Spring Data MongoDB Reactive | MongoDB (`catalog_db`) |
| 3 | **order-service** | Cart, Split Order, Outbox | Spring Boot 3 WebFlux, R2DBC, Reactor Kafka | PostgreSQL (`order_db`) |
| 4 | **inventory-service**| Stock & Atomic Reservation | Spring Boot 3 WebFlux, R2DBC, Reactor Kafka | PostgreSQL (`inventory_db`) |
| 5 | **payment-service**  | Mock Payment, Ledger & Commission | Spring Boot 3 WebFlux, R2DBC, Reactor Kafka | PostgreSQL (`payment_db`) |
| 6 | **ai-advisor-service**| Cosmetic RAG & SSE Chat | Spring Boot 3 WebFlux, LangChain4j, R2DBC | PostgreSQL + pgvector (`ai_db`) |
| 7 | **api-gateway**      | Routing & JWT Validation | Spring Cloud Gateway Reactive | Không lưu trữ DB |

**Giao diện:** Ứng dụng Single-Page Application (SPA) phát triển bằng React + Vite, hỗ trợ 3 khu vực chức năng: Buyer, Seller và Admin.

---

## 2. Điểm Nhấn Kỹ Thuật Cốt Lõi

1. **Saga Choreography + Transactional Outbox:**
   - Đặt hàng đa người bán (Split Order) tự động phân tách giỏ hàng thành các Sub-order độc lập cho từng Shop.
   - Quản lý giao dịch phân tán qua Apache Kafka, đảm bảo tính nhất quán cuối cùng (Eventual Consistency), chống mất sự kiện bằng Outbox Pattern và chống lặp bằng Idempotent Consumer.
2. **100% Non-blocking Reactive Streams:**
   - Không sử dụng JDBC blocking; toàn bộ kết nối cơ sở dữ liệu qua R2DBC và MongoDB Reactive Streams.
   - Giám sát luồng EventLoop bằng **BlockHound** để phát hiện và ngăn chặn mọi thao tác chặn luồng.
3. **Trợ Lý Mỹ Phẩm RAG (Retrieval-Augmented Generation):**
   - Phân tích thành phần mỹ phẩm theo chuẩn quốc tế INCI và cá nhân hóa gợi ý sản phẩm dựa trên Skin Profile của Buyer.
   - Tìm kiếm ngữ nghĩa qua `pgvector` và phản hồi streaming theo thời gian thực qua Server-Sent Events (SSE).
4. **Kiến Trúc Hexagonal & Kiểm Soát Bằng ArchUnit:**
   - Tách biệt tuyệt đối giữa Tầng Miền (Domain), Tầng Ứng Dụng (Application) và Tầng Tương Thích (Adapters).

---

## 3. Khởi Chạy Hạ Tầng (Infrastructure Setup)

### Yêu cầu tiên quyết
- **Docker** & **Docker Compose**
- **Java 21+** (Khuyến nghị OpenJDK 21)
- **Node.js 20+**

### Các bước khởi động hạ tầng bằng Docker Compose
```bash
# 1. Di chuyển vào thư mục hạ tầng
cd infra

# 2. Khởi động các container trong nền
docker compose up -d

# 3. Kiểm tra trạng thái sức khỏe các service
docker compose ps
```

Các dịch vụ hạ tầng được ánh xạ cổng:
- **PostgreSQL 16 (kèm pgvector):** `localhost:5432` (User: `app`, Pass: `app_secret`)
- **MongoDB 7:** `localhost:27017`
- **Apache Kafka 3.8:** `localhost:9092` (Host) / `kafka:19092` (Docker Network)
- **Kafka UI:** [http://localhost:8090](http://localhost:8090)

---

## 4. Tài Liệu Thiết Kế (Documentation)
- **Ngôn ngữ chung:** [docs/domain/glossary.md](file:///d:/A_javaFW/WebBanMP/docs/domain/glossary.md)
- **Event Storming & Luồng nghiệp vụ:** [docs/domain/event-storming.md](file:///d:/A_javaFW/WebBanMP/docs/domain/event-storming.md)
- **Sơ đồ Context Map & Bounded Contexts:** [docs/domain/context-map.md](file:///d:/A_javaFW/WebBanMP/docs/domain/context-map.md)
- **Đặc tả Aggregates & Invariants:** [docs/domain/aggregates.md](file:///d:/A_javaFW/WebBanMP/docs/domain/aggregates.md)
- **Danh sách Backlog & User Stories:** [docs/backlog.md](file:///d:/A_javaFW/WebBanMP/docs/backlog.md)
- **Các quyết định kiến trúc (ADR):**
  - [ADR-001: Lựa chọn Spring Boot 3 WebFlux](file:///d:/A_javaFW/WebBanMP/docs/adr/ADR-001-spring-boot-webflux.md)
  - [ADR-002: Saga Choreography & Outbox](file:///d:/A_javaFW/WebBanMP/docs/adr/ADR-002-saga-choreography-outbox-idempotent-consumer.md)
  - [ADR-003: Database-per-Service](file:///d:/A_javaFW/WebBanMP/docs/adr/ADR-003-database-per-service.md)
  - [ADR-004: Thu hẹp phạm vi cho một người phát triển](file:///d:/A_javaFW/WebBanMP/docs/adr/ADR-004-scope-reduction-single-developer.md)
