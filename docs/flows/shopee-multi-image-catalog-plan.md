# KẾ HOẠCH KỸ THUẬT: NÂNG CẤP BỘ ĐA ẢNH SẢN PHẨM CRAWL TỪ SHOPEE
> **Mã quy trình**: `QT-10` | **Trạng thái**: READY FOR IMPLEMENTATION

---

## 1. THIẾT KẾ KỸ THUẬT & KIẾN TRÚC THU THẬP
- **Thư mục công cụ**: `ai/cosmetics-crawler/src/`
- **File thực thi chính**: `ai/cosmetics-crawler/src/crawlShopeeCatalogGalleries.js`
- **Nguyên lý hoạt động**:
  1. Đọc danh sách sản phẩm từ `frontend/src/api.js` (`MOCK_PRODUCTS`).
  2. Với mỗi sản phẩm chưa đủ $\ge 3$ ảnh:
     - Tạo truy vấn tìm kiếm bằng tên sản phẩm chuẩn hóa (loại bỏ ký tự rác, giữ tên sản phẩm + thương hiệu).
     - Gửi request đến Shopee Search API hoặc trích xuất từ Shopee Official Stores với User-Agent Chrome 122 x64, Referer Shopee.
     - Thu thập 3 đến 5 Image Hash của Shopee (định dạng `vn-11134207-...` hoặc `id-11134207-...`).
     - Tải tệp ảnh trực tiếp từ CDN `https://down-vn.img.susercontent.com/file/<hash>` về `frontend/public/products/<product-id>-gallery-<index>.jpg`.
  3. Cơ chế chịu lỗi & chống nghẽn (Fault-Tolerance & Anti-Throttling):
     - Xử lý theo từng đợt (batch) 5 sản phẩm/lần, nghỉ 1.5 giây giữa mỗi batch để bảo vệ kết nối mạng và tài nguyên máy Windows.
     - Nếu một ảnh tải về thất bại hoặc bị lỗi 403, tự động kích hoạt CDN dự phòng (`down-id`, `down-th`, `down-sg`) hoặc bộ phôi mỹ phẩm cao cấp `niche-*`.
  4. Đồng bộ dữ liệu (Data Synchronization):
     - Ghi nhận đường dẫn ảnh tương đối (ví dụ: `"/products/PROD-CRW-001-gallery-1.jpg"`) vào trường `images` của từng sản phẩm trong `frontend/src/api.js`.
     - Tự động kiểm tra tính hợp lệ bằng script `imageHealthChecker.js`.

---

## 2. PHÂN BỔ CÁC GÓC ẢNH CHUẨN MỰC
Mỗi sản phẩm sẽ có bộ ảnh phân bổ theo cấu trúc 5 góc chụp:
- **Ảnh 1 (Main Hero)**: Bao bì chính diện trên nền sạch.
- **Ảnh 2 (Texture / Swatch)**: Cận cảnh giọt tinh chất/chất kem/màu son swatch trên da.
- **Ảnh 3 (Back Label / Specs)**: Nhãn phụ, mã vạch, thành phần INCI, dung tích.
- **Ảnh 4 (Open Cap / Applicator)**: Đầu cọ chuốt, đầu bơm pump, nắp mở, góc nghiêng 45 độ.
- **Ảnh 5 (Packaging Box / Lifestyle)**: Vỏ hộp giấy bên ngoài hoặc người mẫu cầm thực tế.

---

## 3. FILE CAN THIỆP PHẪU THUẬT (SURGICAL CHANGES)
1. `ai/cosmetics-crawler/src/crawlShopeeCatalogGalleries.js`: Script crawler & downloader tự động hóa.
2. `frontend/src/api.js`: Cập nhật trường `images` cho 152 sản phẩm trong `MOCK_PRODUCTS`.
3. `frontend/public/products/`: Lưu trữ các tệp ảnh thực tế được tải về.
4. `frontend/src/components/ProductDetailView.jsx`: Tối ưu hóa mượt mà cho thanh Thumbnails (đã có sẵn cơ chế click đổi ảnh và zoom lens).
