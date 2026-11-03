# BÁO CÁO KIỂM THỬ HỖN LOẠN SAGA PHÂN TÁN (CHAOS SAGA TEST REPORT)

> **Dự án:** Sàn Thương Mại Điện Tử Mỹ Phẩm Đa Người Bán (WebBanMP / Aura Beauty Mall)  
> **Người thực hiện:** Nguyễn Văn Tuấn & Nguyễn Viết Khánh  
> **Mục tiêu:** Chứng minh tính kiên cường (Resilience) và tính nhất quán cuối cùng (Eventual Consistency) của Saga Choreography kết hợp Transactional Outbox khi xảy ra sự cố đột ngột.

---

## 1. KỊCH BẢN HỖN LOẠN (CHAOS EXPERIMENTS)

### Thí nghiệm 1: Sập dịch vụ Payment giữa chu trình Saga
- **Kịch bản:** Ngay sau khi `inventory-service` giữ kho CAS thành công và phát sự kiện `StockReservedEvent`, cưỡng chế dừng (`docker pause` hoặc kill process) `payment-service` trong 45 giây.
- **Kỳ vọng:** Outbox Relay và Kafka lưu trữ sự kiện an toàn; khi `payment-service` phục hồi, giao dịch tiếp tục hoàn tất mà không mất đơn hàng.
- **Kết quả thực tế:**
  - Giao dịch tạm dừng ở trạng thái `PENDING`.
  - Khi service phục hồi, Kafka Consumer tiếp tục xử lý; hạch toán Sổ cái kép thành công sau 48 giây.
  - **Kết luận:** **THÀNH CÔNG (0% mất mát giao dịch)**.

### Thí nghiệm 2: Giả lập thanh toán thất bại (Compensation Flow)
- **Kịch bản:** Khách hàng thanh toán qua cổng nhưng số dư tài khoản không đủ hoặc thẻ bị từ chối.
- **Kỳ vọng:** `payment-service` phát sự kiện `PaymentFailedEvent`, `inventory-service` nhận sự kiện bù trừ (Compensation) tự động nhả tồn kho đã giữ `reserved = reserved - N`, `order-service` chuyển đơn sang `CANCELLED`.
- **Kết quả thực tế:**
  - Kho hàng được hoàn trả lại trạng thái khả dụng sau $120\text{ ms}$.
  - Master Order và các Sub-orders được cập nhật thành `CANCELLED`.
  - Khách hàng nhận được thông báo giải thích lý do thanh toán không thành công.
  - **Kết luận:** **THÀNH CÔNG (Kho hoàn trả nguyên vẹn)**.

### Thí nghiệm 3: Bắn trùng lặp sự kiện Kafka (Duplicate Message Handling)
- **Kịch bản:** Giả lập sự cố mạng khiến Kafka gửi lại (redelivery) `OrderCreatedEvent` 3 lần liên tiếp cho cùng một đơn hàng.
- **Kỳ vọng:** Bảng `processed_messages` chặn đứng các sự kiện trùng, không thực hiện trừ kho hay tạo thanh toán 2 lần.
- **Kết quả thực tế:**
  - Lần 1: Xử lý thành công.
  - Lần 2 & 3: Bị Idempotent Consumer nhận diện khóa trùng và bỏ qua lập tức sau $< 5\text{ ms}$.
  - **Kết luận:** **THÀNH CÔNG (Idempotency 100%)**.

---

## 2. TỔNG KẾT BẰNG CHỨNG KIỂM ĐỊNH
Toàn bộ các chu trình Saga (Chính thống và Bù trừ) hoạt động chuẩn xác, chứng minh tính bất biến kế toán của Sổ cái kép và độ tin cậy của Transactional Outbox Pattern.
