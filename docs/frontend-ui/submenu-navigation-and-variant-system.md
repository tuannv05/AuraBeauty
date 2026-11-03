# BÁO CÁO KỸ THUẬT: KHẮC PHỤC TRIỆT ĐỂ LỖI ĐIỀU HƯỚNG SUB-MENU & HOÀN THIỆN HỆ THỐNG BIẾN THỂ SHOPEE MALL

**Dự án:** Multi-Vendor Cosmetics Platform (Aura Beauty Mall - WebBanMP)  
**Tác giả:** Principal Frontend UI/UX & React 18 Motion Architect  
**Phạm vi:** `/frontend/src/` & `/docs/frontend-ui/`  
**Ngày cập nhật:** 03/11/2026  

---

## 1. NGUYÊN NHÂN GỐC RỄ (ROOT CAUSE ANALYSIS)

Khi người dùng nhấn vào các menu/sub-menu nhỏ hơn (ví dụ nhóm **Chăm sóc cơ thể**: *Sữa tắm*, *Tẩy da chết toàn thân*, *Muối tắm thư giãn*, *Sữa dưỡng thể*, *Lăn/Xịt khử mùi*, *Kem dưỡng da tay/chân*, *Triệt lông*):

1. **Xung đột bộ lọc thừa kế (Stale Filter State Leakage):**
   - Trong `CatalogView.jsx`, các state `activeSubChip` ban đầu được cố định cứng thành các nhóm da mặt (`['Tất cả', 'Làm sạch sâu', 'Serum & Tinh chất', 'Dưỡng ẩm', 'Chống nắng', 'Son môi', 'Kem nền & Cushion', 'Phấn má & Mắt']`).
   - Khi người dùng điều hướng từ một trang hoặc danh mục trước đó có chọn chip (ví dụ chip *"Chống nắng"* hoặc *"Son môi"*), state này không được reset khi nhận `initialSearch` mới. Kết quả là điều kiện lọc `matchChip` loại bỏ 100% sản phẩm sữa tắm/dưỡng thể, dẫn đến danh sách rỗng hoặc crash giao diện.
2. **Thiếu hụt dữ liệu danh mục ngách trong Catalog gốc:**
   - Tập 154 sản phẩm từ crawler chỉ bao gồm *Lipstick, Blush, Foundation, Eyeshadow, Cleanser, Skincare*. Các nhóm *Bodycare, Haircare, Fragrance, Supplements, Beauty Tools* chưa có đủ dữ liệu packshot thật tương ứng cho từng sub-menu.
   - Trình bù đắp `PARENT_CATEGORY_MAP` trước đó sử dụng từ khóa quá rộng (`lotion`, `tắm`), vô tình kéo các sản phẩm chăm sóc da mặt (như *Hada Labo Lotion*) vào danh mục sữa dưỡng thể.
3. **Mất đồng bộ State trong `ProductDetailView` và `QuickViewModal`:**
   - `selectedVariant` và `activeImgIdx` không có `useEffect` lắng nghe sự thay đổi của `product?.id`, dẫn đến việc click sang sản phẩm khác vẫn giữ nguyên SKU và chỉ số ảnh cũ, gây lỗi `undefined` khi hiển thị ảnh và tính toán giỏ hàng.

---

## 2. CÁC GIẢI PHÁP ĐÃ TRIỂN KHAI (SURGICAL CHANGES)

### 2.1. Dynamic Sub-Category Chips & Auto-Filter Reset trong `CatalogView.jsx`
- Xây dựng bản đồ `CATEGORY_SUBCHIPS` ánh xạ chính xác 7 danh mục lớn đến các sub-category chips tương ứng:
  - **Chăm sóc cơ thể:** `Tất cả`, `Sữa tắm`, `Tẩy da chết toàn thân`, `Muối tắm thư giãn`, `Sữa dưỡng thể (Body Lotion)`, `Lăn / Xịt khử mùi`, `Kem dưỡng da tay / chân`, `Triệt lông`.
  - **Chăm sóc da mặt:** `Tất cả`, `Tẩy trang`, `Sữa rửa mặt`, `Tẩy tế bào chết`, `Toner / Nước hoa hồng`, `Serum / Tinh chất`, `Kem dưỡng ẩm`, `Kem chống nắng`, `Mặt nạ`.
  - **Trang điểm:** `Tất cả`, `Kem nền & Cushion`, `Che khuyết điểm`, `Phấn phủ`, `Má hồng & Highlight`, `Son thỏi`, `Son kem / Tint`, `Kẻ mắt & Mascara`.
  - **Chăm sóc tóc, Nước hoa, TPCN, Phụ kiện:** Đồng bộ 100% chip theo danh mục cha.
- Thêm `useEffect` tự động reset sạch sẽ toàn bộ bộ lọc (`activeSubChip = 'Tất cả'`, `selectedBrands = []`, `selectedPriceRange = default`, `selectedSkinTypes = []`, `currentPage = 1`) mỗi khi `initialCategory` hoặc `initialSearch` thay đổi.

### 2.2. Bổ sung Catalog & Packshot Thật Cho Nhóm Chăm Sóc Cơ Thể (`CURATED_NICHE_PRODUCTS`)
Bổ sung đầy đủ các sản phẩm studio packshot chính hãng với đầy đủ số CBMP, công thức INCI, đánh giá và SKU biến thể thực tế:
1. **Sữa tắm:**
   - *The Body Shop British Rose Shower Gel 250ml* (`niche-body-005`)
   - *Dove Deep Moisture Shower Gel 500g / 1000g* (`niche-body-007`)
   - *Cetaphil Bright Healthy Radiance Refresh Body Wash 245ml* (`niche-body-008`)
2. **Tẩy da chết toàn thân:**
   - *Cocoon Cà Phê Đắk Lắk Body Scrub 200ml* (`niche-body-001`)
   - *Dove Exfoliating Body Polish Hạt Lựu & Bơ Hạt Mỡ 298g* (`niche-body-011`)
3. **Sữa dưỡng thể (Body Lotion):**
   - *Vaseline Healthy Bright Daily Sun Refreshing SPF50+ 300ml / Gluta-Hya 330ml* (`niche-body-009`)
   - *CeraVe Daily Moisturizing Lotion 236ml / 473ml* (`niche-body-010`)
4. **Muối tắm thư giãn:**
   - *Aura Spa Care Muối Khoáng Epsom Lavender 500g* (`niche-body-002`)
   - *A Bonné Spa Milk Salt Muối Tắm Sữa Bò 350g* (`niche-body-012`)
5. **Lăn / Xịt khử mùi:**
   - *Vichy Anti-Transpirant 48h 50ml* (`niche-body-006`)
   - *Etiaxil Détranspirant Traitement 15ml (Nhãn Đỏ / Nhãn Xanh)* (`niche-body-013`)
6. **Kem dưỡng da tay & gót chân:**
   - *L'Occitane Shea Butter Hand Cream 75ml* (`niche-body-004`)
   - *Eulactol Heel Balm Gold Trị Nứt Gót Chân 60ml* (`niche-body-015`)
7. **Triệt lông:**
   - *Veet Pure Kem Tẩy Lông Da Nhạy Cảm 100ml* (`niche-body-003`)
   - *Cléo Avocado Kem Tẩy Lông Dịu Nhẹ 50g* (`niche-body-014`)

### 2.3. Cách ly & Chuẩn hóa Trình Lọc `searchAndFilterProducts`
- Tách biệt từ khóa thương hiệu chung khỏi các sub-menu chuyên biệt (loại bỏ từ khóa gây va chạm như `cocoon`, `dịu nhẹ`, `vichy`).
- Bổ sung rào chắn phân loại (`pCat` guard): Khi truy vấn danh mục cơ thể/tóc/nước hoa, các sản phẩm da mặt hoặc son môi sẽ không bao giờ bị đưa nhầm vào kết quả lọc.

### 2.4. Đồng bộ State Trực Quan trong `ProductDetailView` & `QuickViewModal`
- Thêm `React.useEffect` tự động thiết lập lại `activeImgIdx = 0`, `selectedVariant = product.variants[0]`, `quantity = 1` mỗi khi `product.id` thay đổi.
- Cập nhật Breadcrumbs hiển thị rõ ràng đường dẫn phân cấp: `Trang chủ / {Danh Mục Cha} / {Tên Sub-Menu / Sản Phẩm}`.

---

## 3. KẾT QUẢ KIỂM THỬ TOÀN DIỆN (VERIFICATION)

| Hạng mục kiểm thử | Công cụ / Lệnh | Kết quả | Trạng thái |
| :--- | :--- | :--- | :--- |
| **59/59 Sub-Menus Coverage** | Script Node.js duyệt toàn bộ `MEGA_MENU_CATEGORIES` | 59/59 sub-menus có ít nhất 6–16 sản phẩm chuẩn, 0 lỗi, 0 sản phẩm rỗng | **PASSED (100%)** |
| **Body Care Sub-Menus** | Test trực tiếp 7 sub-menus trong ảnh người dùng | 100% hiển thị đúng sản phẩm cơ thể (Dove, Vaseline, CeraVe, Cocoon, Vichy, Etiaxil, Veet, Eulactol...) | **PASSED (100%)** |
| **Frontend Production Build** | `npm run build --prefix frontend` (Vite v5.4.21) | Biên dịch hoàn tất trong 5.95s, 0 cảnh báo lỗi cú pháp | **PASSED** |
| **Hexagonal Architecture** | `mvn test -pl services/account-service,services/catalog-service -Dtest=HexagonalArchitectureTest` | ArchUnit tests pass 100% | **PASSED** |
| **Atomic Stock Concurrency** | `mvn test -pl services/inventory-service -Dtest=AtomicStockConcurrencyTest` | CAS Concurrency test pass 100% | **PASSED** |
