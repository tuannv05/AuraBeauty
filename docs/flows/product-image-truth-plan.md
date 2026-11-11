# KẾ HOẠCH KỸ THUẬT: KIỂM TOÁN & ĐỒNG BỘ 100% ẢNH SẢN PHẨM THẬT CHÍNH HÃNG (1:1 EXACT PRODUCT TRUTH VERIFICATION PLAN)
> **Mã quy trình**: QT-09 / Spec-Kit SDD
> **Tài liệu đặc tả**: `docs/flows/QT-09-kiem-toan-va-dong-bo-anh-san-pham-that.md`
> **Tiêu chuẩn Benchmark**: `PROD-DOVE-EXFOLIATING-POMEGRANATE` (5 ảnh sắc nét: Hero Packshot, Cream Texture, Arm Swatch, Back Label, Top Lid)

---

## 1. MỤC TIÊU KỸ THUẬT & PHẠM VI CAN THIỆP
- **Mục tiêu**: Xây dựng kiến trúc xử lý và đồng bộ ảnh sản phẩm chính hãng bảo toàn 100% các luật bất biến:
  1. **100% Ảnh Thật Chính Hãng (Zero Inaccuracy)**: Xóa bỏ triệt để các ảnh dính watermark cửa hàng bán lẻ ("DN COSMETICS", "Niac STORE"), ảnh chụp bàn tay tùy tiện hoặc banner quảng cáo ngoài lề.
  2. **Bộ ảnh 3 đến 5 góc chụp chân thực ($3 \le \text{images.length} \le 5$)**:
     - Ảnh 1: Hero Packshot chính diện (White/Studio Background, rõ logo & bao bì).
     - Ảnh 2: Texture / Formula Macro Shot (Chất son velvet/tint, kem dưỡng, bọt sữa rửa mặt, bột phấn mắt/má).
     - Ảnh 3: Swatch / On-Skin Application Shot (Thử màu trên môi, tay hoặc mặt).
     - Ảnh 4: Applicator / Wand / Case / Dispenser Angle (Đầu cọ, vòi pump, nắp vặn hoặc góc nghiêng).
     - Ảnh 5: Box / Outer Carton / Back Label (Vỏ hộp giấy, tem phụ tiếng Việt, thông số CBMP).
  3. **Zero Duplicate trong Gallery**: Mỗi ảnh trong gallery của một sản phẩm PHẢI có hàm băm SHA-256 khác nhau (chấm dứt tình trạng clone ảnh 1 sang ảnh 2, 3, 4, 5).
  4. **Zero Duplicate Hero Photos**: 157 sản phẩm có 157 ảnh bìa duy nhất trên toàn sàn (`uniqueMainPhotos === totalProducts = 157`).
  5. **Lưu trữ vật lý**: Toàn bộ lưu tại `frontend/public/products/` với dung lượng $> 8\text{ KB}$, định dạng JPG/PNG/WEBP, tuyệt đối cấm SVG.
  6. **Đồng bộ hóa 3 lớp**: Đồng nhất xuyên suốt Crawler Facets (`products_facets_full.json`), MongoDB Seed (`products_seed.json`), và Frontend API/Mapper (`api.js`, `submenuCatalogMapper.js`).

---

## 2. KIẾN TRÚC THỰC THI (PHẪU THUẬT 4 GIAI ĐOẠN)

### Giai đoạn 1: Thu thập và xác thực ảnh thật từ nguồn chính hãng
- Thu thập ảnh gốc HD chính hãng từ Shopee Mall Flagship (`susercontent.com`), Olive Young (`oliveyoung.com`), Hasaki (`media.hcdn.vn`), và Website Hãng (L'Oréal, Rohto, CeraVe, Cocoon, Romand, 3CE, MAC,...).
- Đảm bảo tải đủ các góc chụp và biến thể thật theo đúng cấu trúc 5 góc chụp của Dove Pomegranate.
- Kiểm tra dung lượng file trên ổ cứng $> 8\text{ KB}$ và xác nhận không có file lỗi.

### Giai đoạn 2: Lọc và kiểm định tính duy nhất SHA-256
- Đối với từng sản phẩm:
  - Kiểm tra tính độc bản của từng ảnh trong gallery (0% trùng lặp).
  - Kiểm tra ảnh bìa không trùng với bất kỳ sản phẩm nào khác trên sàn.
  - Cắt gọt trong giới hạn $3 \le \text{length} \le 5$.
  - Loại bỏ hoàn toàn các liên kết trỏ tới `macro-donor-*` hoặc file SVG.

### Giai đoạn 3: Đồng bộ dữ liệu xuyên suốt 3 chốt chặn
- **Chốt chặn 1 - Crawler**: Cập nhật `ai/cosmetics-crawler/output/products_facets_full.json` đủ 157 sản phẩm với mảng `images` chuẩn.
- **Chốt chặn 2 - Backend**: Cập nhật `backend/catalog-service/src/main/resources/products_seed.json` đồng nhất mảng `images`.
- **Chốt chặn 3 - Frontend**: Cập nhật `frontend/src/api.js` (`MOCK_PRODUCTS`) và `frontend/src/lib/submenuCatalogMapper.js`.

### Giai đoạn 4: Bộ kiểm thử tự động toàn diện & Nghiệm thu
- **Audit Script**: `ai/cosmetics-crawler/src/verifyImageAudit.js` kiểm tra:
  - `totalProducts === uniqueMainPhotos` (157 / 157).
  - `duplicateMainHashCount === 0`.
  - `duplicateGalleryCount === 0` (Mỗi gallery không có ảnh trùng).
  - `invalidImageCount === 0` (Tất cả file $> 8\text{ KB}$, không có SVG).
  - `missingFiles === 0`.
  - `macroDonorFound === 0`.
- **Backend Tests**:
  - `mvn clean test-compile`
  - `mvn test -pl backend/account-service,backend/catalog-service -Dtest=HexagonalArchitectureTest`
  - `mvn test -pl backend/inventory-service -Dtest=AtomicStockConcurrencyTest`
- **Frontend Build**:
  - `npm --prefix frontend run build`
- **Clean Root**:
  - Kiểm tra thư mục gốc sạch rác theo đúng Whitelist Hiến pháp.

---

## 3. DANH SÁCH FILE CAN THIỆP PHẪU THUẬT
1. `ai/cosmetics-crawler/src/auditGalleriesRealTruth.js`: Script phân tích và đối chiếu ảnh thật.
2. `ai/cosmetics-crawler/src/syncRealCatalogGalleries.js`: Script đồng bộ hóa dữ liệu 3 tầng.
3. `ai/cosmetics-crawler/output/products_facets_full.json`: Tệp dữ liệu facets 157 sản phẩm.
4. `backend/catalog-service/src/main/resources/products_seed.json`: Tệp seed dữ liệu hạt giống MongoDB.
5. `frontend/src/api.js`: Mảng `MOCK_PRODUCTS` cung cấp dữ liệu cho UI.
6. `frontend/src/lib/submenuCatalogMapper.js`: Cấu hình danh mục submenus và chi tiết biến thể.
7. `frontend/public/products/`: Các tệp ảnh thực tế chính hãng.

---

## 4. QUẢN TRỊ RỦI RO & BẢO TOÀN KIẾN TRÚC
- **Purity Check**: Tuyệt đối không thêm thư viện ngoài hoặc sửa cấu trúc package Java.
- **Purity Domain**: Giữ nguyên vẹn 100% tính phi phong tỏa (Non-blocking Reactive) và kiến trúc lục giác Hexagonal.
- **Zero Blank Screen**: Đảm bảo toàn bộ 51 sub-menus của frontend có đầy đủ dữ liệu ảnh hợp lệ, không gây crash hoặc màn hình trắng.
