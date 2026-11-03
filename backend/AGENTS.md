# ⚙️ BACKEND SERVICES CONSTITUTION (AURA BEAUTY MALL)

> **Phạm vi:** `/backend/` | Java 21 | Spring Boot 3 WebFlux Reactive

## 1. RANH GIỚI BẤT KHẢ XÂM PHẠM
- **Chỉ phụ trách:** API REST/SSE, Domain logic, Port & Adapters, R2DBC / MongoDB Reactive, Transactional Outbox Relay, Kafka Messaging.
- **CẤM TUYỆT ĐỐI:** Nhúng mã giao diện (HTML/CSS/JS/JSX); sử dụng JDBC Blocking call gây nghẽn Netty EventLoop.

## 2. CHUẨN MỰC KIẾN TRÚC & CHẤT LƯỢNG
1. **Hexagonal Architecture:** Tách biệt tuyệt đối 3 tầng `domain` $\leftarrow$ `application/port` $\leftarrow$ `adapter`. Giám sát bằng ArchUnit (`HexagonalArchitectureTest`).
2. **100% Non-Blocking:** Kiểm tra bằng BlockHound.
3. **Giữ kho nguyên tử (CAS):** Khóa lạc quan hoặc câu lệnh CAS nguyên tử `(on_hand - reserved) >= quantity`. Quản lý lô hạn dùng FEFO.
4. **Saga Choreography & Outbox Relay:** Xử lý tách đơn (Split Order), ghi sự kiện vào Outbox trong cùng transaction, đảm bảo Idempotent Consumer.
5. **Sổ cái kép (Double-Entry Ledger):** Invariant bất biến `Tổng Nợ = Tổng Có`. Hạch toán 10% hoa hồng sàn, 90% công nợ Seller.
6. **Tiền & Thời gian:** Tiền tệ dùng `DECIMAL`/`NUMERIC`, thời gian lưu UTC `TIMESTAMPTZ`.
