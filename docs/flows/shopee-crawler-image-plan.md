# 📋 THIẾT KẾ KỸ THUẬT: SHOPEE CATALOG & IMAGE RESILIENCE ARCHITECTURE

> **Mã kế hoạch:** `shopee-crawler-image-plan`  
> **Căn cứ đặc tả:** [QT-08: Quy Trình Thu Thập Dữ Liệu Shopee Mall & Chống Lỗi Ảnh](file:///d:/A_javaFW/WebBanMP/docs/flows/QT-08-shopee-catalog-image-resilience.md)  
> **Tiêu chuẩn:** Spec-Driven Development (SDD) | Clean Root 100%

---

## 1. MỤC TIÊU THIẾT KẾ KỸ THUẬT
1. **Component `ProductImage.jsx`:**
   - Thay thế thẻ `<img>` thô sơ, bao bọc trạng thái `isLoading`, `hasError`, `currentSrcIndex`.
   - Hiệu ứng Skeleton shimmer trong quá trình tải.
   - Fallback 3 cấp tự động: `images[0]` $\rightarrow$ `images[1]` $\rightarrow$ Studio Packshot $\rightarrow$ Luxury SVG Placeholder (Không bao giờ văng icon vỡ ảnh, không bao giờ lộ chữ alt tràn khung).
2. **Khắc phục triệt để lỗi ảnh hiện tại (Ảnh user đính kèm):**
   - Đảm bảo `PROD-CRW-085` (Cosrx Gel Cleanser) và `PROD-CRW-150` (Cosrx Snail Essence) hiển thị ảnh hoàn hảo trên cả `CatalogView`, `HomeView`, `ProductDetailView`, và `QuickViewModal`.
3. **Bổ sung sản phẩm cho các Sub-menu ngách (Đúng 5 SP/ngách):**
   - Rà soát 51 Sub-menu, xác định các danh mục có $< 5$ sản phẩm (ví dụ: Tẩy tế bào chết da đầu, Dầu dưỡng tóc, Lăn khử mùi, Phấn nước Cushion, Bông tẩy trang).
   - Bổ sung đúng 5 sản phẩm Shopee Mall chính hãng chuẩn hoá đầy đủ thông tin, CBMP, INCI, giá và ảnh WebP lưu nội bộ.
4. **Pre-build Image Health Checker:**
   - Script tự động quét toàn bộ bản ghi sản phẩm đối chiếu sự tồn tại thực tế của file ảnh trên ổ cứng, bảo đảm không có file ảnh 404 nào lọt qua khâu build.

---

## 2. DANH SÁCH FILE CAN THIỆP PHẪU THUẬT (SURGICAL FILE LIST)

### 2.1. Phân hệ Frontend (`/frontend`):
- `frontend/src/components/ui/ProductImage.jsx` *(MỚI)*: Component hiển thị ảnh thông minh chống lỗi.
- `frontend/src/components/ui/index.js` *(CẬP NHẬT)*: Export `ProductImage`.
- `frontend/src/components/CatalogView.jsx` *(CẬP NHẬT)*: Tích hợp `ProductImage` thay thế thẻ `<img>` cũ.
- `frontend/src/components/HomeView.jsx` *(CẬP NHẬT)*: Tích hợp `ProductImage` cho Flash Sale và Catalog Grid.
- `frontend/src/components/ProductDetailView.jsx` *(CẬP NHẬT)*: Tích hợp `ProductImage` cho ảnh chính và gallery thumbnail.
- `frontend/src/components/QuickViewModal.jsx` *(CẬP NHẬT)*: Tích hợp `ProductImage`.
- `frontend/src/lib/submenuCatalogMapper.js` *(CẬP NHẬT)*: Bổ sung đúng 5 sản phẩm/ngách cho các danh mục còn thiếu và đảm bảo đường dẫn ảnh chuẩn hóa.
- `frontend/src/api.js` *(CẬP NHẬT)*: Đồng bộ ảnh chuẩn hóa cho `PROD-CRW-085` và `PROD-CRW-150`.

### 2.2. Phân hệ AI & Tools (`/ai`):
- `ai/cosmetics-crawler/src/imageHealthChecker.js` *(MỚI)*: Script kiểm toán 100% hình ảnh trên đĩa cứng trước khi build.

---

## 3. THIẾT KẾ COMPONENT `ProductImage.jsx`

```javascript
// Cấu trúc Props & State cốt lõi của ProductImage
export function ProductImage({
  src,
  images = [],
  alt = '',
  className = '',
  style = {},
  aspectRatio = '1 / 1',
  onClick,
  brand = '',
  ...props
}) {
  // 1. Chuẩn hóa danh sách URL ảnh dự phòng
  // 2. State: currentSrc, imgState ('loading' | 'loaded' | 'error'), fallbackLevel (0, 1, 2)
  // 3. Render Skeleton shimmer khi loading
  // 4. onError: Tự động chuyển fallbackLevel:
  //    Level 0 -> images[1]
  //    Level 1 -> /products/packshot-default.webp
  //    Level 2 -> Luxury SVG Placeholder với logo Aura + tên thương hiệu
}
```

---

## 4. CHIẾN LƯỢC KIỂM THỬ HỘI TỤ (SPEC-KIT CONVERGENCE)
1. **Health Check:** `node ai/cosmetics-crawler/src/imageHealthChecker.js` $\rightarrow$ Pass 100% ảnh tồn tại thực tế.
2. **Frontend Build:** `npm --prefix frontend run build` $\rightarrow$ Build thành công không lỗi syntax/type.
3. **Backend Regression:** `mvn test-compile` và ArchUnit tests pass 100%.
4. **Clean Root:** Kiểm tra thư mục gốc sạch rác theo đúng Hiến pháp.
