# MINI-RULE: DISTRIBUTED SAGA & TRANSACTIONAL OUTBOX
> **Phạm vi:** `inventory-service` (8083), `order-service` (8084), `payment-service` (8085)

## 1. NGUYÊN TẮC CỐT LÕI
- **Split Order:** Tự động tách đơn hàng đa gian hàng thành 1 Master Order và $K$ Sub-orders độc lập cho từng Shop.
- **Transactional Outbox:** Ghi Domain Events vào bảng `outbox_events` cùng giao dịch DB với đơn hàng; Outbox Relay quét định kỳ đẩy sang Kafka topic.
- **Saga Choreography:** 
  1. `OrderCreatedEvent` $\rightarrow$ Giữ kho CAS (`inventory-service`).
  2. `StockReservedEvent` $\rightarrow$ Xử lý thanh toán Escrow (`payment-service`).
  3. `PaymentCompletedEvent` $\rightarrow$ Xác nhận hoàn tất đơn (`order-service`).
  4. Lỗi $\rightarrow$ Bắn bù trừ (`CompensateOrderEvent`) để giải phóng kho tồn.
- **Idempotency:** Bảng khóa `processed_messages` ngăn chặn xử lý trùng lặp sự kiện Kafka.

## 2. VÙNG BẤT KHẢ XÂM PHẠM
- Cấu hình partition key theo `master_order_id` để bảo toàn thứ tự sự kiện.
- Topic names và message payloads kế thừa từ `backend/common-events`.

## 3. LỆNH KIỂM CHỨNG
```bash
mvn test -pl backend/common-events,backend/common-outbox
```
