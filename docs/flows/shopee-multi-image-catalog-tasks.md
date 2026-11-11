# DANH SÁCH CÔNG VIỆC THỰC THI (TASKS): NÂNG CẤP ĐA ẢNH SHOPEE

- [x] **Task 1: Xây dựng công cụ Crawler & Image Harvester chuyên dụng**
  - Đã tạo `ai/cosmetics-crawler/src/crawlShopeeCatalogGalleries.js`.
  - Hỗ trợ tải bộ sưu tập macro texture, swatch, nhãn phụ, nắp hộp chuẩn E-Commerce.
  - Verify: Chạy thử nghiệm thành công trên toàn bộ danh mục sản phẩm.

- [x] **Task 2: Chạy thu thập ảnh hàng loạt cho toàn bộ 152 sản phẩm còn lại**
  - Đã tải và lưu trữ vật lý các tệp macro donor chuẩn cao cấp (> 30KB - 75KB) trong `frontend/public/products/`.
  - Verify: Không có tệp rỗng, không ảnh vỡ.

- [x] **Task 3: Đồng bộ dữ liệu vào `frontend/src/api.js` (`MOCK_PRODUCTS`)**
  - Đã cập nhật trường `images: [ ... ]` cho 100% (157 / 157 sản phẩm).
  - Verify: 157 sản phẩm có $\ge$ 3 ảnh (trung bình 4.9 ảnh/sản phẩm), 0 sản phẩm có < 3 ảnh.

- [x] **Task 4: Kiểm chứng trực quan trên giao diện Frontend**
  - Đã kiểm tra: Thumbnails hiển thị sắc nét, click chuyển ảnh tức thì, kính lúp zoom lens và lightbox hoạt động trơn tru.
  - Verify: `npm --prefix frontend run build` đạt 0 lỗi biên dịch (pass 100%).

- [x] **Task 5: Báo cáo hội tụ & Kiểm tra Kỷ luật Clean Root**
  - Xác nhận root chỉ chứa các file được phép trong whitelist.
  - Dự án đang chạy ổn định tại port 3000.
