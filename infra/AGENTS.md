# 🚢 INFRASTRUCTURE CONSTITUTION (AURA BEAUTY MALL)

> **Phạm vi:** `/infra/` | Docker Compose | PostgreSQL 16 | MongoDB 7 | Kafka 3.8

## 1. RANH GIỚI BẤT KHẢ XÂM PHẠM
- **File bất biến:** `infra/docker-compose.yml` (SHA-256 baseline: `CC2B8CFFEB7F134AD6D8B6ED317785DB3DB43742E4B6A8A4D4E6A5C49EA232CD`).
- **Tập lệnh SQL khởi tạo:** `infra/postgres/init.sql` được mount trực tiếp vào container, không di chuyển làm gãy volume.
- **Bảng cổng dịch vụ:**
  - PostgreSQL pgvector: `5432` (User: `app`, DBs: `account_db`, `inventory_db`, `order_db`, `payment_db`, `ai_db`)
  - MongoDB 7: `27017` (DB: `catalog_db`)
  - Apache Kafka: `9092` (Host) / `19092` (Docker Network)
  - Kafka UI: `8090`

## 2. LỆNH KIỂM CHỨNG AN TOÀN
```bash
docker compose -f infra/docker-compose.yml config -q
Get-FileHash infra\docker-compose.yml
```
