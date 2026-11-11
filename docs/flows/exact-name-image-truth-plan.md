# KẾ HOẠCH KỸ THUẬT: SỬA LỖI GÁN LỆCH ẢNH & ĐỒNG BỘ ẢNH THẬT CHÍNH HÃNG 100% THEO TÊN SẢN PHẨM (GRAPHIFY SPEC-KIT)
> **Mã quy trình**: QT-11 / Spec-Kit SDD  
> **Mã lỗi (Slug)**: `exact-name-image-truth`

---

## 1. MỤC TIÊU & PHẠM VI THỰC THI
1. **Khắc phục 100% tình trạng gán ảnh sai**: Xóa bỏ vĩnh viễn việc gán ảnh bodycare (muối tắm A Bonne, Cetaphil, Vaseline, CeraVe, Eulactol, Etiaxil) cho các sản phẩm Nước hoa, Dụng cụ trang điểm, Chăm sóc tóc, Thực phẩm chức năng.
2. **Thu thập ảnh thật chính hãng 1:1**:
   - Sử dụng công cụ `ai/cosmetics-crawler/src/exactNameImageGraphSync.js` với bộ lọc Graphify Semantic Gate.
   - Crawl ảnh thật từ Shopee Mall Flagship, Hasaki, Sephora, Fragrantica, Thế Giới Nước Hoa, Vua Hàng Hiệu cho toàn bộ 60 sản phẩm ngách.
   - Lưu trữ vật lý theo slug tại `frontend/public/products/<slug>-<n>.<ext>` với dung lượng $> 8\text{ KB}$, không có SVG.
3. **Thống nhất danh mục toàn diện (Single Source of Truth)**:
   - Hợp nhất 157 sản phẩm gốc + 60 sản phẩm ngách = **217 sản phẩm** đồng bộ xuyên suốt:
     - `ai/cosmetics-crawler/output/products_facets_full.json` (217 sản phẩm).
     - `backend/catalog-service/src/main/resources/products_seed.json` (217 sản phẩm) và MongoDB `catalog_db.products`.
     - `frontend/src/api.js` (`MOCK_PRODUCTS`).
     - `frontend/src/lib/submenuCatalogMapper.js` (`CURATED_NICHE_PRODUCTS`).
4. **Bộ kiểm thử tự động toàn diện**:
   - Kiểm toán hàm băm: 217 sản phẩm có 217 ảnh bìa duy nhất (`uniqueMainImageHashes === 217`), 0 duplicate.
   - Kiểm tra mọi sản phẩm có từ 1 đến 5 ảnh (`1 <= images.length <= 5`).
   - Kiểm tra toàn bộ file tồn tại trên đĩa và $> 8\text{ KB}$.
   - Backend ArchUnit & CAS Concurrency: BUILD SUCCESS.
   - Frontend Vite Production Build: Succeeded.
