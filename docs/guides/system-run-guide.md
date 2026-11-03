# HƯỚNG DẪN KHỞI CHẠY VÀ VẬN HÀNH HỆ THỐNG (SYSTEM RUN GUIDE)

> **Dự án:** Sàn Thương Mại Điện Tử Mỹ Phẩm Đa Người Bán (Aura Beauty Mall / WebBanMP)  
> **Kiến trúc:** Reactive Microservices (Spring Boot 3 WebFlux) + React 18 / Vite  

---

## 1. KHỞI CHẠY HẠ TẦNG (DOCKER COMPOSE)

Yêu cầu tiên quyết: Docker Desktop đang chạy.

```bash
# 1. Khởi chạy 4 container hạ tầng (PostgreSQL pgvector, MongoDB 7, Kafka 3.8, Kafka UI)
docker compose -f infra/docker-compose.yml up -d

# 2. Kiểm tra trạng thái các container
docker compose -f infra/docker-compose.yml ps
```

Các cổng dịch vụ hạ tầng:
- **PostgreSQL 16 (pgvector):** `localhost:5432` (User: `app`, Pass: `app_secret`)
- **MongoDB 7:** `localhost:27017`
- **Apache Kafka 3.8:** `localhost:9092`
- **Kafka UI:** `http://localhost:8090`

---

## 2. BIÊN DỊCH VÀ KHỞI CHẠY BACKEND SERVICES

```bash
# Biên dịch toàn bộ 11 modules
mvn clean test-compile

# Chạy kiểm thử kiến trúc Hexagonal (ArchUnit)
mvn test -pl services/account-service -Dtest=HexagonalArchitectureTest

# Chạy kiểm thử giữ kho nguyên tử không âm (CAS)
mvn test -pl services/inventory-service -Dtest=AtomicStockConcurrencyTest
```

Bảng cổng các microservices (được Gateway điều phối):
- **API Gateway:** `http://localhost:8080` (Entry point duy nhất)
- **Account Service:** `http://localhost:8081`
- **Catalog Service:** `http://localhost:8082`
- **Inventory Service:** `http://localhost:8083`
- **Order Service:** `http://localhost:8084`
- **Payment Service:** `http://localhost:8085`
- **AI Advisor Service:** `http://localhost:8086`

---

## 3. KHỞI CHẠY FRONTEND (REACT 18 + VITE)

```bash
cd frontend
npm install
npm run dev
```

Truy cập ứng dụng: `http://localhost:3000` (đã cấu hình proxy `/api` sang Gateway `http://localhost:8080`).
