# Báo Cáo Minh Chứng Tuần 4: Luồng Đăng Ký Shop, Đăng Hàng Có Số Công Bố & Giao Diện Buyer Duyệt Hàng

## 1. Mục tiêu tuần 4
- Hoàn thiện luồng kiểm soát đối tác bán hàng (Multi-Vendor Governance):
  - Seller đăng ký gian hàng (`Shop`) ở trạng thái `PENDING`.
  - Admin duyệt gian hàng (`ShopApproved`) trước khi Seller được phép bán.
  - Seller tạo sản phẩm nháp (`ProductDrafted`), bắt buộc phải có Số tiếp nhận phiếu công bố mỹ phẩm (`registrationNumber`).
  - Admin kiểm duyệt hồ sơ công bố mỹ phẩm trước khi chuyển trạng thái sang `PUBLISHED`.
- Phát triển giao diện React cho luồng Buyer:
  - Xem danh mục sản phẩm theo thẻ card trực quan.
  - Lọc theo loại da (Oily, Dry, Sensitive, Combination, Normal).
  - Modal tra cứu danh mục hoạt chất INCI chi tiết (chỉ số bít tắc mụn & kích ứng).
  - Chọn phân loại (Variants) và tính toán tổng tiền.

## 2. Kết quả kiểm chứng
- Giao diện `BuyerZone` và `SellerZone` hoạt động trơn tru.
- Quy tắc kiểm tra bắt buộc Số công bố mỹ phẩm đã được cài đặt cả ở Backend Model Validation lẫn giao diện Seller.
- Báo cáo và giao diện đáp ứng đầy đủ yêu cầu nghiệp vụ.
