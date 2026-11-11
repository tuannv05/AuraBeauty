# SPEC: KIỂM TOÁN & ĐỒNG BỘ 100% ẢNH SẢN PHẨM THẬT CHÍNH HÃNG (1:1 EXACT PRODUCT TRUTH VERIFICATION)
> **Mã quy trình**: QT-09 | **Phiên bản**: 2.0.0
> **Đặc tả đồng bộ**: `docs/flows/QT-09-kiem-toan-va-dong-bo-anh-san-pham-that.md`

## 1. Yêu cầu nghiệp vụ
- Khắc phục triệt để tình trạng ảnh sai lệch, ảnh generic không liên quan.
- Đảm bảo 100% sản phẩm có ảnh chụp chính hãng từ Shopee Mall Flagship, Olive Young, Hasaki, Watsons hoặc Brand Official.
- Giới hạn nghiêm ngặt $1 \le \text{images.length} \le 5$.
- Hash ảnh bìa (`images[0]`) là duy nhất trên toàn sàn (`uniqueMainPhotos === totalProducts = 157`).
- Loại bỏ 100% phôi ảnh `macro-donor-*`.
- Toàn bộ ảnh vật lý lưu tại `frontend/public/products/` với kích thước $> 8\text{ KB}$.
- Đồng bộ 3 chốt chặn: Crawler (`products_facets_full.json`), Backend (`products_seed.json`), và Frontend (`api.js`, `submenuCatalogMapper.js`).
