# MINI-RULE: BACKEND HEXAGONAL ARCHITECTURE
> **Phạm vi:** `/backend/` | Java 21 | Spring Boot 3 WebFlux Reactive

## 1. NGUYÊN TẮC CỐT LÕI
- Tách biệt 3 tầng: `domain` (thuần Java, không phụ thuộc framework), `application/port` (Input/Output ports), `adapter` (Web in, R2DBC/MongoDB out).
- 100% Non-Blocking Reactive: Không dùng JDBC blocking call làm nghẽn Netty EventLoop.
- Giữ kho nguyên tử CAS: Kiểm soát tồn kho không âm `(on_hand - reserved) >= quantity`.
- Quản lý lô hạn dùng: Ưu tiên xuất kho theo FEFO (First-Expired, First-Out).

## 2. VÙNG BẤT KHẢ XÂM PHẠM
- Không sửa file `pom.xml` gốc và danh sách `<modules>` (trỏ vào `backend/`).
- Không đổi cấu trúc package Hexagonal đã thiết lập.
- Không sửa logic kiểm thử `HexagonalArchitectureTest` và `AtomicStockConcurrencyTest`.

## 3. LỆNH KIỂM CHỨNG
```bash
mvn test -pl backend/account-service -Dtest=HexagonalArchitectureTest
mvn test -pl backend/inventory-service -Dtest=AtomicStockConcurrencyTest
```
