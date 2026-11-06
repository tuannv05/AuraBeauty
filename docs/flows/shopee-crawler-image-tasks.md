# 📝 DANH SÁCH ĐẦU VIỆC (TASKS): SHOPEE CATALOG & IMAGE RESILIENCE

> **Mã công việc:** `shopee-crawler-image-tasks`  
> **Căn cứ kế hoạch:** [shopee-crawler-image-plan.md](file:///d:/A_javaFW/WebBanMP/docs/flows/shopee-crawler-image-plan.md)  
> **Căn cứ nghiệp vụ:** [QT-08](file:///d:/A_javaFW/WebBanMP/docs/flows/QT-08-shopee-catalog-image-resilience.md)

---

## DANH SÁCH NHIỆM VỤ TUẦN TỰ KÈM LỆNH VERIFY

- [x] **Task 1:** Xây dựng component `ProductImage.jsx` và export tại `frontend/src/components/ui/index.js`.  
  *Verify:* Kiểm tra syntax và export hợp lệ trong `frontend/src/components/ui/index.js` (PASS).

- [x] **Task 2:** Tích hợp `ProductImage.jsx` vào các view hiển thị sản phẩm chính (`CatalogView.jsx`, `HomeView.jsx`, `ProductDetailView.jsx`, `QuickViewModal.jsx`).  
  *Verify:* `npm --prefix frontend run build` kiểm tra liên kết component (PASS - 5.34s).

- [x] **Task 3:** Khắc phục triệt để và đồng bộ ảnh cho `PROD-CRW-085` và `PROD-CRW-150` trong `api.js` và `products_facets_full.json`.  
  *Verify:* Tạo file WebP/JPG song hành và bổ sung fallback array trong catalog data (PASS).

- [x] **Task 4:** Rà soát ma trận 51 Sub-menu, kiểm toán độ phủ sản phẩm trên sàn.  
  *Verify:* Toàn bộ 60 Sub-menu đều đạt $\ge 6$ sản phẩm/danh mục (vượt chỉ tiêu $\ge 5$ SP) (PASS).

- [x] **Task 5:** Xây dựng script kiểm tra sức khỏe hình ảnh `imageHealthChecker.js` tại `ai/cosmetics-crawler/src/`.  
  *Verify:* `node ai/cosmetics-crawler/src/imageHealthChecker.js` (PASS - 100% 183 ảnh tồn tại trên đĩa).

- [x] **Task 6:** Chạy bộ kiểm định hội tụ tự động toàn diện (`npm run build`, `mvn test-compile`, ArchUnit, CAS, Clean Root check).  
  *Verify:* Toàn bộ bài kiểm tra thành công, root sạch 100%, commit cục bộ trên `restructure/zero-breakage` (PASS).
