# Multi-Vendor Cosmetics Platform (Sàn Thương Mại Điện Tử Mỹ Phẩm Đa Người Bán)

Dự án đồ án tốt nghiệp / chuyên đề kỹ thuật phần mềm xây dựng nền tảng sàn thương mại điện tử mỹ phẩm đa người bán theo kiến trúc **Microservices Reactive 100% Non-blocking**, áp dụng thiết kế hướng tên miền (**Domain-Driven Design - DDD**), mô hình **Hexagonal Architecture (Ports and Adapters)**, mẫu giao dịch phân tán **Saga Choreography** kết hợp **Transactional Outbox**, và trợ lý trí tuệ nhân tạo **AI Advisor (RAG)** tư vấn thành phần mỹ phẩm (INCI) qua Server-Sent Events (SSE).

---

## 1. Cấu Trúc Hệ Thống (6 Services + 1 Gateway + React Frontend)

| STT | Service | Bounded Context | Công Nghệ Chính | Cơ Sở Dữ Liệu | Cổng Mặc Định |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **account-service** | Identity, Shop & Skin Profile | Spring Boot 3 WebFlux, Spring Security, R2DBC | PostgreSQL (`account_db`) | `8081` |
| 2 | **catalog-service** | Product, INCI & Search | Spring Boot 3 WebFlux, Spring Data MongoDB Reactive | MongoDB (`catalog_db`) | `8082` |
| 3 | **order-service** | Cart, Split Order & Outbox Relay | Spring Boot 3 WebFlux, R2DBC, Reactor Kafka | PostgreSQL (`order_db`) | `8083` |
| 4 | **inventory-service**| Stock & Atomic Reservation (CAS) | Spring Boot 3 WebFlux, R2DBC, Reactor Kafka | PostgreSQL (`inventory_db`) | `8084` |
| 5 | **payment-service**  | Mock Payment, Ledger & Commission | Spring Boot 3 WebFlux, R2DBC, Reactor Kafka | PostgreSQL (`payment_db`) | `8085` |
| 6 | **ai-advisor-service**| Cosmetic RAG, pgvector & SSE Chat | Spring Boot 3 WebFlux, pgvector R2DBC | PostgreSQL + pgvector (`ai_db`) | `8086` |
| 7 | **api-gateway**      | Routing, CORS & JWT Validation Filter | Spring Cloud Gateway Reactive | Không dùng DB | `8080` |
| 8 | **frontend**         | SPA Buyer, Seller & Admin Zones | React 18, Vite, Lucide Icons, SSE Stream | — | `3000` |

---

## 2. Điểm Nhấn Kỹ Thuật Cốt Lõi

1. **Saga Choreography + Transactional Outbox:**
   - Đặt hàng đa người bán (**Split Order**) tự động phân tách giỏ hàng thành các Sub-order độc lập cho từng Shop.
   - Quản lý giao dịch phân tán qua Apache Kafka, đảm bảo tính nhất quán cuối cùng (Eventual Consistency), chống mất sự kiện bằng Outbox Pattern và chống lặp bằng Idempotent Consumer.
2. **100% Non-blocking Reactive Streams:**
   - Không sử dụng JDBC blocking; toàn bộ kết nối cơ sở dữ liệu qua R2DBC và MongoDB Reactive Streams.
   - Giám sát luồng EventLoop bằng **BlockHound** và kiểm tra kiến trúc bằng **ArchUnit**.
3. **Trợ Lý Mỹ Phẩm RAG (Retrieval-Augmented Generation):**
   - Phân tích thành phần mỹ phẩm theo chuẩn quốc tế INCI và cá nhân hóa gợi ý sản phẩm dựa trên Skin Profile của Buyer.
   - Tìm kiếm ngữ nghĩa qua `pgvector` và phản hồi streaming theo thời gian thực qua Server-Sent Events (SSE).
4. **Sổ Cái Kép Đối Soát (Double-Entry Ledger):**
   - Invariant kế toán bất biến: `Tổng Nợ (Debit) = Tổng Có (Credit)`.
   - Trích hoa hồng sàn 10% tự động, 90% phân bổ vào công nợ phải trả Seller.

---

## 3. Khởi Chạy Hạ Tầng (Docker Compose)

### Yêu cầu tiên quyết
- **Docker** & **Docker Compose**
- **Java 21+**
- **Node.js 20+** & **npm**

### Khởi động hạ tầng:
```bash
# 1. Khởi động 4 container hạ tầng (PostgreSQL pgvector, MongoDB, Kafka, Kafka-UI)
docker compose -f infra/docker/docker-compose.yml up -d

# 2. Kiểm tra container
docker compose -f infra/docker/docker-compose.yml ps
```

Các cổng dịch vụ hạ tầng:
- **PostgreSQL 16 (kèm pgvector):** `localhost:5432` (User: `app`, Pass: `app_secret`)
- **MongoDB 7:** `localhost:27017`
- **Apache Kafka 3.8:** `localhost:9092` (Host) / `kafka:19092` (Docker Network)
- **Kafka UI:** [http://localhost:8090](http://localhost:8090)

---

## 4. Biên Dịch & Chạy Ứng Dụng

### Biên dịch toàn bộ Backend:
```bash
mvn clean test-compile
```

### Chạy Unit & Integration Tests:
```bash
# Kiểm thử kiến trúc Hexagonal (ArchUnit)
mvn test -pl services/account-service -Dtest=HexagonalArchitectureTest

# Kiểm thử giữ hàng nguyên tử không âm (CAS Concurrency Test)
mvn test -pl services/inventory-service -Dtest=AtomicStockConcurrencyTest
```

### Khởi chạy Frontend React (Cổng 3000):
```bash
cd frontend
npm install
npm run dev
```
Truy cập ứng dụng: [http://localhost:3000](http://localhost:3000)

---

## 5. Lộ Trình 14 Tuần & Minh Chứng (Evidence Logs)

| Tuần | Nội dung | Thư mục minh chứng |
| :--- | :--- | :--- |
| **Tuần 1** | Phân tích, thiết kế DDD, Backlog, 4 ADR, Docker Compose hạ tầng | [docs/evidence/week-1/evidence-log.md](file:///d:/A_javaFW/WebBanMP/docs/evidence/week-1/evidence-log.md) |
| **Tuần 2** | Service template Hexagonal, 3 common libs, account-service (JWT, ArchUnit) | [docs/evidence/week-2/evidence-log.md](file:///d:/A_javaFW/WebBanMP/docs/evidence/week-2/evidence-log.md) |
| **Tuần 3** | catalog-service, INCI, MongoDB Reactive, Seed 120+ sản phẩm mỹ phẩm | [docs/evidence/week-3/evidence-log.md](file:///d:/A_javaFW/WebBanMP/docs/evidence/week-3/evidence-log.md) |
| **Tuần 4** | Đăng ký/duyệt Shop, đăng hàng kèm Số công bố mỹ phẩm (CBMP), UI Buyer duyệt | [docs/evidence/week-4/evidence-log.md](file:///d:/A_javaFW/WebBanMP/docs/evidence/week-4/evidence-log.md) |
| **Tuần 5** | inventory-service, giữ hàng nguyên tử (CAS), test đồng thời tồn không âm | [docs/evidence/week-5/evidence-log.md](file:///d:/A_javaFW/WebBanMP/docs/evidence/week-5/evidence-log.md) |
| **Tuần 6** | order-service: Giỏ hàng đa Shop, snapshot giá từ catalog | [docs/evidence/week-6/evidence-log.md](file:///d:/A_javaFW/WebBanMP/docs/evidence/week-6/evidence-log.md) |
| **Tuần 7** | Tách đơn (Split Order), State Machine, Outbox Relay worker | [docs/evidence/week-7/evidence-log.md](file:///d:/A_javaFW/WebBanMP/docs/evidence/week-7/evidence-log.md) |
| **Tuần 8** | payment-service mock + Saga Choreography hoàn chỉnh + bù trừ | [docs/evidence/week-8/evidence-log.md](file:///d:/A_javaFW/WebBanMP/docs/evidence/week-8/evidence-log.md) |
| **Tuần 9** | Seller xử lý Sub-order, Sổ cái kép (Double-Entry Ledger) & Hoa hồng 10% | [docs/evidence/week-9/evidence-log.md](file:///d:/A_javaFW/WebBanMP/docs/evidence/week-9/evidence-log.md) |
| **Tuần 10-11** | ai-advisor RAG với pgvector, đánh chỉ mục INCI, chat SSE streaming | [docs/evidence/week-10-11/evidence-log.md](file:///d:/A_javaFW/WebBanMP/docs/evidence/week-10-11/evidence-log.md) |
| **Tuần 12** | Test Chaos Saga, Test tải k6, Resilience4j Circuit Breaker | [docs/evidence/week-12/evidence-log.md](file:///d:/A_javaFW/WebBanMP/docs/evidence/week-12/evidence-log.md) |
| **Tuần 13** | Observability (Actuator, Kafka UI), Dựng máy sạch (Clean-Slate) | [docs/evidence/week-13/evidence-log.md](file:///d:/A_javaFW/WebBanMP/docs/evidence/week-13/evidence-log.md) |
| **Tuần 14** | Đóng băng mã nguồn, kịch bản demo bảo vệ đồ án trước Hội đồng | [docs/evidence/week-14/evidence-log.md](file:///d:/A_javaFW/WebBanMP/docs/evidence/week-14/evidence-log.md) |

---

## 6. Kịch Bản Demo (Demonstration Script)

- **Khu vực Khách Mua (Buyer Zone):**
  - Xem danh mục sản phẩm, lọc theo loại da và thành phần INCI (Comedogenic Rating, Irritation).
  - Trò chuyện với **AI Cosmetic Advisor** nhận phản hồi tư vấn streaming qua Server-Sent Events.
  - Cập nhật **Hồ Sơ Da (Skin Profile)** cá nhân.
  - Chọn sản phẩm từ nhiều Shop, xem giỏ hàng và đặt hàng kích hoạt **Split Order**.
- **Khu vực Người Bán (Seller Zone):**
  - Quản lý gian hàng đã được phê duyệt.
  - Đăng sản phẩm mới có kiểm định Số công bố mỹ phẩm (CBMP).
  - Xem và cập nhật trạng thái đơn con (**Sub-orders**) của gian hàng mình (Giao hàng / Từ chối).
- **Khu vực Quản Trị Viên (Admin Zone):**
  - Phê duyệt gian hàng mới đăng ký.
  - Thẩm định và duyệt sản phẩm công bố lên sàn.
  - Kiểm toán **Sổ cái kép (Double-Entry Ledger)** và hoa hồng sàn 10%.
