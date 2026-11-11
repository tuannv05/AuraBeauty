# DANH SÁCH NHIỆM VỤ THỰC THI (TASKS): ĐỒNG BỘ ẢNH SẢN PHẨM THẬT CHÍNH HÃNG 100%
> **Quy trình**: QT-09 | **Kế hoạch**: `docs/flows/product-image-truth-plan.md`
> **Tiêu chuẩn Benchmark**: `PROD-DOVE-EXFOLIATING-POMEGRANATE` (5 ảnh sắc nét, 0 trùng lặp)

---

- [x] **Task 1: Xây dựng bộ thu thập & kiểm toán ảnh chính hãng tự động (`auditAndHarvestAuthenticGalleries.js`)**
  - Quét 157 sản phẩm, phát hiện 129 sản phẩm đang bị trùng lặp ảnh trong gallery hoặc dính watermark/ảnh rác.
  - Thu thập từ CDN chính hãng Shopee Mall, Hasaki, Olive Young, Official Brand các ảnh: Hero Packshot, Texture/Formula, Swatch, Detail/Wand, Packaging Box.
  - Lưu trữ vật lý tại `frontend/public/products/<id>-<angle>.<ext>` với dung lượng $> 8\text{ KB}$.
  - `Verify: node ai/cosmetics-crawler/src/auditAndHarvestAuthenticGalleries.js`

- [x] **Task 2: Loại bỏ hoàn toàn ảnh rác, watermark và ảnh clone trong gallery**
  - Đảm bảo mỗi sản phẩm có từ 3 đến 5 ảnh khác biệt hoàn toàn (`3 <= images.length <= 5`).
  - Kiểm tra hàm băm SHA-256 từng ảnh trong mỗi gallery để khẳng định 0% trùng lặp.
  - `Verify: node ai/cosmetics-crawler/src/verifyImageAudit.js`

- [x] **Task 3: Đồng bộ dữ liệu xuyên suốt 3 tầng (Crawler, Backend Seed, Frontend Mock & Mapper)**
  - Cập nhật `ai/cosmetics-crawler/output/products_facets_full.json`.
  - Cập nhật `backend/catalog-service/src/main/resources/products_seed.json`.
  - Cập nhật `frontend/src/api.js` (`MOCK_PRODUCTS`) và `frontend/src/lib/submenuCatalogMapper.js`.
  - Đồng bộ cập nhật collection MongoDB `catalog_db.products`.

- [x] **Task 4: Chạy kiểm toán toàn diện bằng `verifyImageAudit.js`**
  - Nghiệm thu:
    1. `totalProducts === 157`
    2. `uniqueMainPhotos === 157`
    3. `duplicateMainHashCount === 0`
    4. `duplicateGalleryCount === 0`
    5. `allGalleriesBetween3And5 === true`
    6. `missingFiles === 0`
    7. `invalidImageCount === 0`
  - `Verify: node ai/cosmetics-crawler/src/verifyImageAudit.js`

- [x] **Task 5: Kiểm thử tự động Backend (Hexagonal ArchUnit & CAS Concurrency)**
  - `Verify: mvn test -pl backend/account-service,backend/catalog-service -Dtest=HexagonalArchitectureTest` (BUILD SUCCESS)
  - `Verify: mvn test -pl backend/inventory-service -Dtest=AtomicStockConcurrencyTest` (BUILD SUCCESS)

- [x] **Task 6: Kiểm thử Frontend Build & Xác nhận Clean Root**
  - `Verify: npm --prefix frontend run build` (built in 7.02s)
  - `Verify: git status -s` (Chỉ whitelist ở thư mục gốc)
