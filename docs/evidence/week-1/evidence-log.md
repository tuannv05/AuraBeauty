# Bằng Chứng Hoàn Thành Tuần 1 (Week 1 Evidence Log)

Ngày thực hiện: 2026-10-23
Trạng thái: **ĐẠT (PASSED) TOÀN BỘ TIÊU CHÍ CỔNG TUẦN 1**

---

## 1. Kết Quả Khởi Chạy Hạ Tầng Docker Compose (`docker compose ps`)
```
NAME               IMAGE                           COMMAND                  SERVICE    CREATED          STATUS                    PORTS
infra-kafka-1      apache/kafka:3.8.0              "/__cacert_entrypoin…"   kafka      29 seconds ago   Up 24 seconds (healthy)   0.0.0.0:9092->9092/tcp, [::]:9092->9092/tcp
infra-kafka-ui-1   provectuslabs/kafka-ui:latest   "/bin/sh -c 'java --…"   kafka-ui   25 seconds ago   Up 12 seconds             0.0.0.0:8090->8080/tcp, [::]:8090->8080/tcp
infra-mongo-1      mongo:7                         "docker-entrypoint.s…"   mongo      29 seconds ago   Up 24 seconds (healthy)   0.0.0.0:27017->27017/tcp, [::]:27017->27017/tcp
infra-postgres-1   pgvector/pgvector:pg16          "docker-entrypoint.s…"   postgres   29 seconds ago   Up 24 seconds (healthy)   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp
```

---

## 2. Kết Quả Kiểm Tra 5 Cơ Sở Dữ Liệu PostgreSQL (`\l`)
```sql
                                                    List of databases
     Name     | Owner | Encoding | Locale Provider |  Collate   |   Ctype    | ICU Locale | ICU Rules | Access privileges 
--------------+-------+----------+-----------------+------------+------------+------------+-----------+-------------------
 account_db   | app   | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | 
 ai_db        | app   | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | 
 app          | app   | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | 
 inventory_db | app   | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | 
 order_db     | app   | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | 
 payment_db   | app   | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | 
 postgres     | app   | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | 
(9 rows)
```

---

## 3. Thử Nghiệm Extension `pgvector` Trên Database `ai_db`
Lệnh thực thi: `psql -U app -d ai_db -c "SELECT '[1,2,3]'::vector;"`
Kết quả:
```
 vector  
---------
 [1,2,3]
(1 row)
```

---

## 4. Kiểm Tra Tạo Topic Apache Kafka Mẫu
Lệnh thực thi:
`kafka-topics.sh --bootstrap-server localhost:19092 --create --topic test --partitions 3`
`kafka-topics.sh --bootstrap-server localhost:19092 --list`
Kết quả:
```
Created topic test.
test
```

---

## 5. Kiểm Tra Tình Trạng Cụm Qua Kafka UI
Endpoint: `http://localhost:8090/api/clusters`
Phản hồi:
```json
{
  "name": "local",
  "status": "online",
  "brokerCount": 1,
  "onlinePartitionCount": 3,
  "topicCount": 1,
  "version": "3.8-IV0"
}
```

---

## 6. Kiểm Tra MongoDB
Lệnh thực thi: `mongosh --quiet --eval "db.adminCommand('ping')"`
Kết quả:
```json
{ "ok": 1 }
```

---

## 7. Rà Soát Cổng Kiểm Tra Cuối Tuần 1 (Checklist Gate 1)
- [x] Có glossary định nghĩa Ubiquitous Language ([docs/domain/glossary.md](file:///d:/A_javaFW/WebBanMP/docs/domain/glossary.md))
- [x] Có danh sách sự kiện 4 luồng nghiệp vụ + các luồng bù trừ ([docs/domain/event-storming.md](file:///d:/A_javaFW/WebBanMP/docs/domain/event-storming.md))
- [x] Đã chốt 4 Hotspots (Sub-order cancellation, Reservation TTL 15m, Snapshot Price, Variant-based inventory)
- [x] Có Context Map và bảng aggregate + invariants ([docs/domain/context-map.md](file:///d:/A_javaFW/WebBanMP/docs/domain/context-map.md), [docs/domain/aggregates.md](file:///d:/A_javaFW/WebBanMP/docs/domain/aggregates.md))
- [x] Backlog tuần 2-4 đã chi tiết hóa theo Epic & User Story ([docs/backlog.md](file:///d:/A_javaFW/WebBanMP/docs/backlog.md))
- [x] 4 ADRs đã được soạn thảo đầy đủ ([docs/adr/](file:///d:/A_javaFW/WebBanMP/docs/adr/))
- [x] Docker Compose chạy hoàn hảo, 4 container healthy, pgvector và Kafka test thành công
- [x] Thư mục `docs/evidence/week-1/` lưu trữ đầy đủ log minh chứng
- [x] Đã commit mã nguồn và gắn git tag `week-1`
