# BÁO CÁO CHẨN ĐOÁN LỖI: SẢN PHẨM HIỂN THỊ SAI ẢNH 100% SO VỚI TÊN THỰC TẾ (INDEX-SHIFTED / BLIND IMAGE ASSIGNMENT)
> **Mã lỗi (Slug)**: `exact-name-image-truth`  
> **Mức độ nghiêm trọng**: CRITICAL (Ảnh hưởng trực tiếp tới trải nghiệm người dùng và tính toàn vẹn danh mục)  
> **Tác nhân phát hiện**: Principal E-Commerce Auditor & UX Researcher  
> **Chuẩn tuân thủ**: Spec-Kit Bug Assess & Hiến Pháp Dự Án (`AGENTS.md`)

---

## 1. TRIỆU CHỨNG LỖI (SYMPTOMS)
Khi khách hàng truy cập website (Port 3000) và điều hướng qua 51 sub-menus của Aura Beauty Mall:
- Sản phẩm **"Nước Hoa Chiết Nữ YSL Libre Eau de Parfum 10ml"** (`PROD-CRW-NHT-05`) lại hiển thị hình ảnh túi **Muối tắm sữa bò A Bonné Spa Milk Salt** màu hồng!
- Sản phẩm **"Nước Hoa Chiết Nam Dior Sauvage Eau de Parfum 10ml"** (`PROD-CRW-NHT-04`) lại hiển thị chai **Sữa tắm Cetaphil Bright Healthy Radiance Refresh Body Wash**!
- Sản phẩm **"Nước Hoa Chiết Le Labo Santal 33 EDP 10ml"** (`PROD-CRW-NHT-01`) lại hiển thị chai **Sữa dưỡng thể chống nắng Vaseline Healthy Bright SPF50+**!
- Sản phẩm **"Nước Hoa Chiết Maison Margiela Replica Jazz Club EDT 10ml"** (`PROD-CRW-NHT-02`) lại hiển thị chai **Sữa dưỡng thể CeraVe Daily Moisturizing Lotion**!
- Sản phẩm **"Nước Hoa Chiết Nam Chanel Bleu de Chanel Eau de Parfum 10ml"** (`PROD-CRW-NHT-03`) lại hiển thị tuýp **Kem gót chân Eulactol Heel Balm Gold**!
- Sản phẩm **"Nước Hoa Vùng Kín Foellie Eau de Bijou 5ml"** (`PROD-CRW-VKN-01`) lại hiển thị chai **Lăn khử mùi Etiaxil Détranspirant Traitement**!
- Hàng loạt sản phẩm dụng cụ trang điểm (bấm mi Shiseido, cọ trang điểm Vacosi, mút Real Techniques, dao cạo Kai) và thực phẩm chức năng (viên kẽm DHC, hoa anh thảo Blackmores, viên cấp nước Innerb) bị gán ảnh vòng lặp của các chai sữa tắm/sữa dưỡng thể bodycare.

---

## 2. NGUYÊN NHÂN GỐC RỄ (ROOT CAUSE ANALYSIS - RCA)

### Chốt chặn 1: Dữ liệu phân mảnh giữa Backend và Frontend Mapper
- Trong `backend/catalog-service/src/main/resources/products_seed.json` và `ai/cosmetics-crawler/output/products_facets_full.json`, hệ thống chỉ quản lý 157 sản phẩm (tập trung vào Son, Má hồng, Kem nền, Phấn mắt, Sữa rửa mặt, Serum/Kem dưỡng).
- Tuy nhiên, tại `frontend/src/lib/submenuCatalogMapper.js` (dòng 6500-7100), hàm `getEnrichedCatalog()` đã tự động kết hợp 157 sản phẩm chính với 92 sản phẩm trong mảng `CURATED_NICHE_PRODUCTS`.

### Chốt chặn 2: Hiện tượng "Index-Shifted / Blind Image Copying"
- Khi 60 sản phẩm bổ sung được khởi tạo trong `CURATED_NICHE_PRODUCTS` (với các tiền tố `PROD-CRW-NHT-*`, `PROD-CRW-VKN-*`, `PROD-CRW-BCT-*`, `PROD-CRW-KGN-*`, `PROD-CRW-KPM-*`, `PROD-CRW-MTN-*`, `PROD-CRW-DCM-*`, `PROD-CRW-XMT-*`, `PROD-CRW-TNT-*`, `PROD-CRW-DXA-*`, `PROD-CRW-VMN-*`, `PROD-CRW-VCN-*`):
- Người sinh dữ liệu đã không thu thập ảnh thật của từng sản phẩm tương ứng mà dùng vòng lặp copy đè các tệp ảnh từ nhóm `niche-body-001.jpg` đến `niche-body-015.jpg`:
  - `niche-body-012.jpg` (A Bonné Pink Milk Salt) $\rightarrow$ copy thành `PROD-CRW-NHT-05.jpg` (YSL Libre).
  - `niche-body-008.jpg` (Cetaphil Body Wash) $\rightarrow$ copy thành `PROD-CRW-NHT-04.jpg` (Dior Sauvage).
  - `niche-body-009.jpg` (Vaseline Lotion) $\rightarrow$ copy thành `PROD-CRW-NHT-01.jpg` (Le Labo Santal 33).
  - `niche-body-010.jpg` (CeraVe Lotion) $\rightarrow$ copy thành `PROD-CRW-NHT-02.jpg` (Replica Jazz Club).
  - `niche-body-015.jpg` (Eulactol Heel Balm) $\rightarrow$ copy thành `PROD-CRW-NHT-03.jpg` (Bleu de Chanel).
  - `niche-body-013.jpg` (Etiaxil Deodorant) $\rightarrow$ copy thành `PROD-CRW-VKN-01.jpg` (Foellie Eau de Bijou).

### Trích dẫn mã nguồn gây lỗi (Code Citation):
- **Tệp**: `frontend/src/lib/submenuCatalogMapper.js` dòng 6500–7100:
  Các đối tượng JSON được định nghĩa với `images: ["/products/PROD-CRW-NHT-01.jpg"]`, nhưng tệp vật lý tương ứng trên đĩa tại `frontend/public/products/PROD-CRW-NHT-01.jpg` có cùng mã SHA-256 hash với `niche-body-009.jpg` (Vaseline).

---

## 3. PHẠM VI ẢNH HƯỞNG (IMPACTED SCOPE)
1. **60 sản phẩm ngách trong `CURATED_NICHE_PRODUCTS`**:
   - 5 SKU Nước hoa chiết cao cấp (Le Labo, Maison Margiela, Chanel, Dior, YSL).
   - 5 SKU Nước hoa vùng kín (Foellie, Dionel, Cenota, De Memoria).
   - 5 SKU Viên uống trị mụn/kẽm (DHC, Swisse, Blackmores, Puritan's Pride, Acnes).
   - 5 SKU Kẹp bấm mi (Shiseido, Shu Uemura, Vacosi, DHC, Kai).
   - 5 SKU Mút tán nền (Real Techniques, Beautyblender, Focallure, Vacosi, Bealy).
   - 5 SKU Dao cạo chân mày (Kai, Kềm Nghĩa, Innisfree, Feather, Vacosi).
   - 5 SKU Bộ cọ trang điểm (Vacosi, Real Techniques, Focallure, Maange, Bealy).
   - 5 SKU Tinh dầu dưỡng mọc tóc (Cocoon, Milaganics, Thorakao, A'Pieu, Vijully).
   - 5 SKU Bọt nhuộm tóc (Liese, Hello Bubble, Bigen, Thái Dương, Beautylabo).
   - 5 SKU Dầu xả tóc (Tsubaki, Cocoon, Pantene, Tresemme, L'Oreal).
   - 5 SKU Tinh dầu hoa anh thảo & rau củ (Blackmores, DHC, Pair A Lion, Nat&Form).
   - 5 SKU Viên cấp nước & collagen (Innerb, DHC HA, Huons, Astalift, Shiseido).
2. **Các màn hình hiển thị**:
   - Trang chi tiết sản phẩm (`ProductDetailView.jsx`).
   - Danh mục 51 sub-menus (`CatalogView.jsx`).
   - Bộ gợi ý Đồ thị Tri thức (`CosmeticKnowledgeGraphModal.jsx`, `AdminGraphifyExplorer.jsx`).

---

## 4. CHIẾN LƯỢC SỬA LỖI PHẪU THUẬT (SURGICAL RESOLUTION PLAN)

### Bước 1: Hợp nhất Catalog vào Nguồn Chân Lý Duy Nhất (Single Source of Truth)
- Hợp nhất toàn bộ 60 sản phẩm này vào `backend/catalog-service/src/main/resources/products_seed.json` và `ai/cosmetics-crawler/output/products_facets_full.json` để nâng tổng số sản phẩm được quản lý chính thức lên **217 sản phẩm** (hoặc tích hợp toàn diện 217+ sản phẩm).
- Xóa bỏ việc lưu các mảng duplicate copy trong `submenuCatalogMapper.js`.

### Bước 2: Xây dựng công cụ kiểm duyệt ngữ nghĩa Đồ thị `exactNameImageGraphSync.js`
- Thu thập ảnh thật chính hãng từ các nguồn uy tín: Shopee Mall, Hasaki, Guardian, Watsons, Sephora, Fragrantica, Thế Giới Nước Hoa, Vua Hàng Hiệu.
- Áp dụng 4 Luật Khóa Cứng:
  - **Luật 1 (Canonical Name & Brand)**: Tìm kiếm đúng `canonicalBrand` + `canonicalModelKeywords`.
  - **Luật 2 (Graphify Semantic Edge Gate)**: Bắt buộc tiêu đề ảnh chứa tên thương hiệu và model; từ chối 100% từ khóa nhầm ngành (ví dụ: nước hoa không được chứa `body wash`, `muối tắm`, `lotion`).
  - **Luật 3 (Slug-based Unique Naming)**: Đặt tên file theo slug sản phẩm (`ysl-libre-edp-1.jpg`, `dior-sauvage-edp-1.jpg`...).
  - **Luật 4 (Multi-tier Sync)**: Đồng bộ cả 3 chốt chặn: Crawler Facets, Backend Seed / MongoDB, Frontend Mapper / Mock.

### Bước 3: Nghiệm thu hội tụ (Spec-Kit Convergence Test)
- Chạy script kiểm toán kiểm tra: 100% ảnh khớp tên, dung lượng $> 8\text{ KB}$, $1 \le \text{images.length} \le 5$, 0% trùng hash giữa 2 sản phẩm khác nhau.
- Chạy `HexagonalArchitectureTest`, `AtomicStockConcurrencyTest`, `npm run build`.
