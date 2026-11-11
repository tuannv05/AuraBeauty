# DANH SÁCH NHIỆM VỤ THỰC THI (TASKS): ĐỒNG BỘ ẢNH THẬT KHỚP 100% TÊN SẢN PHẨM
> **Quy trình**: QT-11 | **Kế hoạch**: `docs/flows/exact-name-image-truth-plan.md` | **Slug**: `exact-name-image-truth`

---

- [x] **Task 1: Xây dựng công cụ Graphify Semantic Sync (`exactNameImageGraphSync.js`)**
  - Tích hợp 4 Luật Khóa Cứng:
    - Luật 1: Canonical keywords theo từng sản phẩm (Tên + Thương hiệu).
    - Luật 2: Cổng kiểm duyệt ngữ nghĩa Graphify (Khớp title/alt token, chặn triệt để negative keywords nhầm ngành).
    - Luật 3: Đặt tên file theo slug định danh sản phẩm.
    - Luật 4: Đồng bộ phẫu thuật xuyên suốt 3 tầng (Crawler, Backend Seed/Mongo, Frontend Mapper).
  - `Verify: node ai/cosmetics-crawler/src/exactNameImageGraphSync.js` (SUCCESS)

- [x] **Task 2: Crawl và lưu ảnh thật chính hãng cho toàn bộ 60 sản phẩm ngách**
  - Nước hoa YSL Libre, Dior Sauvage, Le Labo Santal 33, Chanel Bleu, Replica Jazz Club, Foellie, v.v.
  - Dụng cụ trang điểm (bấm mi, cọ, mút, dao cạo) và Thực phẩm chức năng (kẽm DHC, hoa anh thảo, viên cấp nước).
  - Lưu trữ 180+ file ảnh tại `frontend/public/products/<slug>-<n>.<ext>` với size $> 8\text{ KB}$.
  - Xuất manifest đối chiếu tại `ai/cosmetics-crawler/output/product_image_graph_manifest.json`.
  - `Verify: node -e "const fs = require('fs'); const files = ['ysl-libre-edp-1.jpg', 'dior-sauvage-edp-1.jpg', 'le-labo-santal-33-1.jpg']; files.forEach(f => console.log(f, fs.existsSync('frontend/public/products/' + f)));"` (SUCCESS)

- [x] **Task 3: Hợp nhất toàn diện Catalog 247 sản phẩm xuyên suốt hệ thống**
  - Cập nhật `ai/cosmetics-crawler/output/products_facets_full.json` (247 sản phẩm).
  - Cập nhật `backend/catalog-service/src/main/resources/products_seed.json` (247 sản phẩm).
  - Cập nhật MongoDB `catalog_db.products` (247 / 247 upserted).
  - Cập nhật `frontend/src/api.js` và `frontend/src/lib/submenuCatalogMapper.js`.
  - `Verify: node -e "const data = require('./ai/cosmetics-crawler/output/products_facets_full.json'); console.log('Unified products:', data.length);"` (247 sản phẩm)

- [x] **Task 4: Chạy script kiểm toán Đồ thị Tên - Nguồn ảnh (Spec-Kit Convergence Test)**
  - Chạy kịch bản kiểm tra theo Phần 3 của Mệnh Lệnh Tối Cao:
    - `totalProducts: 247`
    - `uniqueMainImageHashes: 247`
    - `missingFiles: 0`
    - `invalidOrOverLimit: 0`
  - `Verify: node ai/cosmetics-crawler/src/verifyExactNameImageTruth.js` (✅ 100% ĐẠT CHUẨN - VERIFIED CONVERGED)

- [x] **Task 5: Kiểm thử tự động Backend (Hexagonal ArchUnit & CAS Concurrency)**
  - `Verify: mvn clean test-compile` (11 modules - BUILD SUCCESS)
  - `Verify: mvn test -pl backend/account-service,backend/catalog-service -Dtest=HexagonalArchitectureTest` (BUILD SUCCESS)
  - `Verify: mvn test -pl backend/inventory-service -Dtest=AtomicStockConcurrencyTest` (BUILD SUCCESS)

- [x] **Task 6: Kiểm thử Frontend Build & Clean Root**
  - `Verify: cd frontend && npm run build` (Built in 8.26s)
  - `Verify: git status -s` (Chỉ whitelist tại root)
