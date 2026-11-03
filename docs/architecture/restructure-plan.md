# KẾ HOẠCH TÁI CẤU TRÚC CHI TIẾT (ZERO-BREAKAGE RESTRUCTURE PLAN)

> **Mã giai đoạn:** G2 - AUDIT & RESTRUCTURE PLAN  
> **Kiến trúc trưởng:** Principal Enterprise Software Architect  
> **Nguyên tắc cốt lõi:** Zero-Breakage, An toàn Windows, Bảo toàn ranh giới Bounded Context  
> **Baseline Hash `infra/docker-compose.yml`:** `CC2B8CFFEB7F134AD6D8B6ED317785DB3DB43742E4B6A8A4D4E6A5C49EA232CD`

---

## 1. BẢNG KHẢO SÁT CỔNG HỆ THỐNG THỰC TẾ (VERIFIED PORT TABLE)

Đối chiếu xác thực qua cấu hình thực tế trong `application.yml` của các service và `api-gateway`:

| Dịch vụ / Phân hệ | Cổng thực tế | Cấu hình nguồn xác minh | Route định tuyến tại Gateway |
| :--- | :---: | :--- | :--- |
| **api-gateway** | `8080` | `services/api-gateway/src/main/resources/application.yml:1-2` | Cổng vào duy nhất từ Client |
| **account-service** | `8081` | `services/account-service/src/main/resources/application.yml` | `/api/auth/**`, `/api/users/**`, `/api/shops/**` |
| **catalog-service** | `8082` | `services/catalog-service/src/main/resources/application.yml` | `/api/products/**` |
| **inventory-service** | `8083` | `services/inventory-service/src/main/resources/application.yml` | `/api/inventory/**` |
| **order-service** | `8084` | `services/order-service/src/main/resources/application.yml` | `/api/cart/**`, `/api/orders/**` |
| **payment-service** | `8085` | `services/payment-service/src/main/resources/application.yml` | `/api/payments/**`, `/api/ledger/**` |
| **ai-advisor-service** | `8086` | `services/ai-advisor-service/src/main/resources/application.yml` | `/api/ai/**`, `/api/v1/ai/**` |
| **frontend** | `3000` | `frontend/vite.config.js:9` (server.port: 3000) | Giao diện React SPA |
| **PostgreSQL (pgvector)** | `5432` | `infra/docker-compose.yml:7` | Cơ sở dữ liệu quan hệ & vector |
| **MongoDB 7** | `27017` | `infra/docker-compose.yml:18` | Cơ sở dữ liệu tài liệu Catalog & INCI |
| **Apache Kafka 3.8** | `9092` | `infra/docker-compose.yml:27` | Message Broker phân tán |
| **Kafka UI** | `8090` | `infra/docker-compose.yml:48` | Giao diện quản trị Kafka Streams |

---

## 2. MA TRẬN RÀ SOÁT TỆP TIN & KẾ HOẠCH DI CHUYỂN (CURRENT -> TARGET -> ACTION)

| Đường dẫn hiện tại | Đường dẫn mục tiêu | Hành động | Lý do & Kiểm tra phụ thuộc |
| :--- | :--- | :---: | :--- |
| `AGENTS.md` (root) | `AGENTS.md` | **GIỮ** | Nằm trong Whitelist root |
| `GEMINI.md` (root) | `GEMINI.md` | **GIỮ** | Nằm trong Whitelist root |
| `pom.xml` (root) | `pom.xml` | **GIỮ** | Maven Root Aggregator bắt buộc |
| `.gitignore` (root) | `.gitignore` | **GIỮ** | Whitelist root |
| `.idea/` (root) | `.idea/` | **GIỮ** | Cấu hình IDE cá nhân |
| `README.md` (root) | `docs/README.md` | **DI CHUYỂN** | Chuyển tài liệu vào `docs/` theo Q1 |
| `DESIGN.md` (root) | `docs/DESIGN.md` | **DI CHUYỂN** | Chuyển tài liệu đặc tả thiết kế vào `docs/` |
| `docs/` | `docs/` | **GIỮ** | Trung tâm tài liệu |
| `frontend/` | `frontend/` | **GIỮ** | Thư mục giao diện chuẩn |
| `services/` | `backend/` | **ĐÃ DI CHUYỂN** | Đã gom toàn bộ 7 Microservices vào `backend/` |
| `libs/` | `backend/` | **ĐÃ DI CHUYỂN** | Đã gom toàn bộ 3 thư viện dùng chung vào `backend/` |
| `backend/` | `backend/` | **GIỮ** | Vùng Backend tập trung theo phê duyệt Cách 1 |
| `infra/` | `infra/` | **GIỮ** | Hạ tầng Docker Compose |
| `ai/` | `ai/` | **GIỮ** | AI & Cosmetics Crawler pipeline |
| `tools/` | `ai/tools/` | **ĐÃ DI CHUYỂN** | Đã chuyển vào `ai/tools/`, cập nhật tham chiếu `ai/cosmetics-crawler/src/scraper.js:85` |
| `agents/` | `agents/` | **TẠO MỚI** | Chứa mini-rules (G7) |

---

## 3. RÀ SOÁT CÁC THAM CHIẾU ĐƯỜNG DẪN DỄ GÃY (DEPENDENCY AUDIT)

1. **`pom.xml` Root Modules:**
   - Khai báo: `libs/common-web`, `libs/common-events`, `libs/common-outbox`, `services/account-service`, `services/catalog-service`, `services/inventory-service`, `services/order-service`, `services/payment-service`, `services/ai-advisor-service`, `services/api-gateway`.
   - Đánh giá: Giữ nguyên `services/` và `libs/`, không sửa `pom.xml`, an toàn 100%.
2. **`infra/docker-compose.yml` Volumes:**
   - Khai báo: `./postgres/init.sql:/docker-entrypoint-initdb.d/init.sql:ro`.
   - Đánh giá: Giữ nguyên vị trí `infra/postgres/init.sql` và `infra/docker-compose.yml`, hash không đổi.
3. **`frontend/vite.config.js` Proxy & Aliases:**
   - Proxy: `^/api/.*` trỏ về `http://localhost:8080` (API Gateway).
   - Đánh giá: Cổng Gateway 8080 giữ nguyên, proxy hoạt động bình thường.
4. **Liên kết tài liệu:**
   - `README.md` khi chuyển vào `docs/README.md` cần đổi các liên kết `docs/evidence/...` thành tương đối `evidence/...`.

---

## 4. XÁC NHẬN CÂU HỎI VÀ ĐIỀU KIỆN TIẾP TỤC
- Toàn bộ 5 câu hỏi Q1 - Q5 đã được người dùng phê chuẩn sẵn.
- Tiến hành thực thi G3: Gom tài liệu và dọn dẹp thư mục gốc.
