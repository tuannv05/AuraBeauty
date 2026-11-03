# BÁO CÁO KIỂM ĐỊNH CHẤT LƯỢNG MÃ NGUỒN (QUALITY AUDIT REPORT)

> **Mã giai đoạn:** G9 - QUALITY AUDIT (READ-ONLY & SPEC COMPLIANCE)  
> **Kiến trúc trưởng:** Principal Enterprise Software Architect  
> **Phạm vi kiểm định:** Đối chiếu mã nguồn thực tế với Tiêu chuẩn 5.5 (Frontend UI/UX) và Tiêu chuẩn 5.6 (Backend & DB)  
> **Nguyên tắc:** Chỉ báo cáo và lập danh mục đề xuất, tuyệt đối KHÔNG tự ý sửa đổi mã nguồn.

---

## 1. MA TRẬN PHÁT HIỆN KIỂM ĐỊNH CHẤT LƯỢNG (QUALITY AUDIT MATRIX)

| Mã | Hạng mục / Tiêu chuẩn | Phát hiện thực tế trong mã nguồn | Vị trí (`file:line`) | Mức độ | Đề xuất khắc phục |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **QA-FE-01** | 5.5 - UI Double-Submit | Tại `CheckoutView.jsx`, nút xác nhận đặt hàng đã có cờ `isSubmitting` vô hiệu hóa nút, nhưng chưa có timeout fallback nếu mạng bị treo lâu. | `frontend/src/components/CheckoutView.jsx:145` | Thấp | Bổ sung `timeout` tự động mở khóa nút sau 15 giây nếu không nhận phản hồi. |
| **QA-FE-02** | 5.5 - 4 Trạng thái Component | `CatalogView.jsx` đã có Skeleton loading và Empty state khi không tìm thấy kết quả, nhưng thông báo lỗi Error State vẫn dùng alert đơn giản. | `frontend/src/components/CatalogView.jsx:210` | Thấp | Thay thế alert bằng khung thông báo lỗi có nút "Thử lại" thân thiện. |
| **QA-FE-03** | 5.5 - Confirm Modal | `SellerZone.jsx` thao tác hủy đơn hoặc từ chối đơn hàng đã có Modal xác nhận nhưng nội dung cảnh báo còn chung chung. | `frontend/src/components/SellerZone.jsx:320` | Thấp | Nêu rõ lý do từ chối và cảnh báo ảnh hưởng tới điểm uy tín của gian hàng. |
| **QA-BE-01** | 5.6 - Kiểu dữ liệu tiền tệ | `services/order-service` và `services/payment-service` dùng `BigDecimal` cho trường `amount` và `price`, đảm bảo không mất độ chính xác. | `services/order-service/src/main/java/com/cosmetics/order/domain/model/Money.java:12` | Đạt | Duy trì `BigDecimal` và `DECIMAL(19, 2)` trong database schema. |
| **QA-BE-02** | 5.6 - Thời gian chuẩn UTC | `OrderEntity` và `StockItemEntity` sử dụng `Instant` và `LocalDateTime` ánh xạ `TIMESTAMP WITH TIME ZONE`. | `services/order-service/src/main/java/com/cosmetics/order/adapter/out/persistence/OrderEntity.java:35` | Đạt | Duy trì quy chuẩn lưu trữ UTC. |
| **QA-BE-03** | 5.6 - Non-blocking Streams | Kiểm tra toàn bộ mã nguồn Java: 100% sử dụng R2DBC Reactive và Reactive MongoDB, không tìm thấy thư viện JDBC blocking. | Toàn bộ `services/*/pom.xml` | Đạt | Bảo toàn bởi kiểm thử kiến trúc `BlockHound` và `ArchUnit`. |
| **QA-BE-04** | 5.6 - Idempotency Consumer | `common-outbox` đã có bảng `processed_messages` lưu trữ `message_id`, tuy nhiên cần bảo đảm cơ chế dọn dẹp (cleanup job) cho message quá 30 ngày. | `libs/common-outbox/src/main/resources/schema.sql:1` | Trung bình | Xây dựng scheduled job xóa bản ghi message đã xử lý quá 30 ngày để giảm dung lượng DB. |
| **QA-BE-05** | 5.6 - Invariant Sổ cái kép | `payment-service` kiểm tra nghiêm ngặt `totalDebit.compareTo(totalCredit) == 0`. Bút toán lệch bị ném `IllegalStateException`. | `services/payment-service/src/main/java/com/cosmetics/payment/domain/LedgerEntry.java:45` | Đạt | Duy trì bài test bất biến kiểm toán tự động. |

---

## 2. BẢNG XẾP THỨ TỰ ƯU TIÊN SỬA ĐỔI (PRIORITIZED REMEDIATION BACKLOG)

Dưới đây là thứ tự ưu tiên đề xuất để người dùng phê duyệt trước khi thực hiện ở các sprint tiếp theo:

1. **Ưu tiên 1 (P1 - Độ tin cậy hạ tầng):** Triển khai cronjob dọn dẹp các message cũ trong bảng `processed_messages` của `libs/common-outbox` để chống phình to dữ liệu (Mã `QA-BE-04`).
2. **Ưu tiên 2 (P2 - Trải nghiệm thanh toán):** Bổ sung cơ chế timeout 15s tự động mở khóa nút đặt hàng tại `CheckoutView.jsx` nếu Gateway mất kết nối (Mã `QA-FE-01`).
3. **Ưu tiên 3 (P3 - Tinh chỉnh giao diện):** Nâng cấp Error State của `CatalogView.jsx` sang component `ErrorRecoveryCard` có nút Thử lại chuyên nghiệp (Mã `QA-FE-02`).
4. **Ưu tiên 4 (P4 - Nghiệp vụ Người bán):** Cải thiện chi tiết lý do từ chối đơn hàng tại Confirm Modal của `SellerZone.jsx` (Mã `QA-FE-03`).

*Ghi chú: Toàn bộ các hạng mục trên không làm gãy mã nguồn hiện tại và sẽ chỉ được can thiệp khi có chỉ thị trực tiếp từ người dùng.*
