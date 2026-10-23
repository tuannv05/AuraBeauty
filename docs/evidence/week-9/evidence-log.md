# Báo Cáo Minh Chứng Tuần 9: Seller Xử Lý Đơn, Sổ Cái Kép (Double-Entry Ledger) & Hoa Hồng Sàn

## 1. Mục tiêu tuần 9
- Seller xử lý đơn con `SubOrder`:
  - Tiếp nhận đơn `CONFIRMED`.
  - Tiến hành giao hàng (`SHIPPED`).
  - Khách nhận hàng thành công (`DELIVERED`).
  - Nếu Seller từ chối đơn (`REJECTED`): phát lệnh hoàn tiền riêng cho Sub-order đó (`RefundPayment`) và nhả kho mà không ảnh hưởng tới các Sub-order khác của đơn hàng!
- Hệ thống Sổ cái kế toán kép (Double-Entry Ledger):
  - Áp dụng nguyên lý kế toán chuẩn: Bất biến `Tổng Nợ = Tổng Có` (Debit = Credit).
  - Khi đơn hàng thành công, tự động trích hoa hồng sàn 10% (Platform Revenue), 90% ghi vào công nợ phải trả Seller (Seller Payable):
    - `DEBIT`: Tài khoản `CASH_CLEARING` (100% giá trị thu từ cổng thanh toán).
    - `CREDIT`: Tài khoản `SELLER_PAYABLE` (90% giá trị tiền hàng chuyển về cho gian hàng).
    - `CREDIT`: Tài khoản `PLATFORM_REVENUE` (10% doanh thu hoa hồng sàn).
- Giao diện Admin: Bảng đối soát bút toán tài chính trực quan, báo cáo tỷ lệ cân bằng sổ cái tức thì.

## 2. Kết quả kiểm chứng
- Mô hình đối soát chạy chính xác, không thất thoát doanh thu.
- Tự động hóa hoàn toàn việc phân bổ dòng tiền trên nền Reactive Streams.
