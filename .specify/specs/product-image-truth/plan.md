# PLAN: KIỂM TOÁN & ĐỒNG BỘ 100% ẢNH SẢN PHẨM THẬT CHÍNH HÃNG (1:1 EXACT PRODUCT TRUTH VERIFICATION)
> **Mã quy trình**: QT-09 | **Phiên bản**: 2.0.0
> **Đặc tả đồng bộ**: `docs/flows/product-image-truth-plan.md`

## 1. Mục tiêu kỹ thuật
- Đồng bộ 100% ảnh sản phẩm thật chính hãng cho 157 sản phẩm sàn Aura Beauty Mall.
- Đảm bảo tính duy nhất tuyệt đối của ảnh bìa (Zero duplicate hash).
- Cắt gọt và giới hạn mảng ảnh trong khoảng $1 \le N \le 5$.
- Xóa sạch mọi ảnh generic `macro-donor-*`.
- Kiểm tra dung lượng file vật lý $> 8\text{ KB}$.
- Đồng bộ xuyên suốt 3 tầng: Crawler, Backend Seed, Frontend.
