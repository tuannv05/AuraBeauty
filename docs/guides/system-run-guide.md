# HƯỚNG DẪN KHỞI CHẠY VÀ VẬN HÀNH HỆ THỐNG (SYSTEM RUN GUIDE)

> **Dự án:** Sàn Thương Mại Điện Tử Mỹ Phẩm Đa Người Bán (Aura Beauty Mall / WebBanMP)  
> **Kiến trúc:** Reactive Microservices (Quarkus 3.15 LTS Mutiny Reactive) + React 18 / Vite 5  

---

## 1. KHỞI CHẠY HẠ TẦNG (DOCKER COMPOSE)

Yêu cầu tiên quyết: Docker Desktop đang chạy.

```bash
# 1. Khởi chạy 4 container hạ tầng (PostgreSQL pgvector, MongoDB 7, Kafka 3.8, Kafka UI)
docker compose -f infra/docker/docker-compose.yml up -d

# 2. Kiểm tra trạng thái các container
docker compose -f infra/docker/docker-compose.yml ps
```

Các cổng dịch vụ hạ tầng:
- **PostgreSQL 16 (pgvector):** `localhost:5432` (User: `app`, Pass: `app_secret`)
- **MongoDB 7:** `localhost:27017`
- **Apache Kafka 3.8:** `localhost:9092`
- **Kafka UI:** `http://localhost:8090`

---

## 2. BIÊN DỊCH VÀ KHỞI CHẠY BACKEND SERVICES (QUARKUS 3.15 LTS)

```bash
# 1. Biên dịch toàn bộ modules
mvn clean test-compile

# 2. Chạy kiểm thử kiến trúc Hexagonal (ArchUnit)
mvn test -pl backend/account-service,backend/catalog-service -Dtest=HexagonalArchitectureTest

# 3. Chạy kiểm thử giữ kho nguyên tử không âm (CAS Concurrency)
mvn test -pl backend/inventory-service -Dtest=AtomicStockConcurrencyTest

# 4. Đóng gói ứng dụng Quarkus
mvn package -DskipTests
```

Khởi chạy từng service (mỗi service chạy nền hoặc qua terminal riêng với `quarkus-run.jar`):
```bash
# Gateway (Port 8080 - Entry point duy nhất)
java -jar backend/api-gateway/target/quarkus-app/quarkus-run.jar

# 6 Microservices nghiệp vụ:
java -jar backend/account-service/target/quarkus-app/quarkus-run.jar      # Port 8081
java -jar backend/catalog-service/target/quarkus-app/quarkus-run.jar      # Port 8082
java -jar backend/inventory-service/target/quarkus-app/quarkus-run.jar    # Port 8083
java -jar backend/order-service/target/quarkus-app/quarkus-run.jar        # Port 8084
java -jar backend/payment-service/target/quarkus-app/quarkus-run.jar      # Port 8085
java -jar backend/ai-advisor-service/target/quarkus-app/quarkus-run.jar   # Port 8086
```

*(Mẹo: Khi phát triển, có thể dùng `mvn -pl backend/<service> quarkus:dev` để bật chế độ Live Reload siêu tốc)*

---

## 3. KHỞI CHẠY FRONTEND (REACT 18 + VITE)

```bash
cd frontend
npm install
npm run dev
```

Truy cập ứng dụng: `http://localhost:3000` (đã cấu hình proxy `/api` sang Gateway `http://localhost:8080`).
