# Báo Cáo Minh Chứng Tuần 6: Order Service - Giỏ Hàng & Snapshot Giá Từ Catalog

## 1. Mục tiêu tuần 6
- Triển khai `order-service`:
  - Quản lý giỏ hàng `Cart` và `CartItem`.
  - Hỗ trợ thêm sản phẩm từ nhiều Seller/Shop khác nhau vào cùng một giỏ hàng.
  - Cơ chế Snapshot dữ liệu từ Catalog: tại thời điểm đặt hàng, giá tiền, tên sản phẩm và tên phân loại được chốt cố định vào `OrderItem` để bảo vệ người mua và người bán trước các biến động giá sau này.
- Mô hình Domain Hexagonal cho Order Service:
  - Aggregate Root: `Order` (chứa danh sách `SubOrder` và `OrderItem`).
  - State Machine chuyển trạng thái đơn hàng.

## 2. Kết quả kiểm chứng
- Mô hình Domain được thiết kế cô lập, thuần túy POJO.
- Cơ chế tính toán tổng tiền khớp 100% với tổng các dòng sản phẩm.
- Test compile và cấu trúc thư viện khớp chuẩn thiết kế.
