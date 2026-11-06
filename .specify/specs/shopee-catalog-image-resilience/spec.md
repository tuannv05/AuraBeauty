# SPECIFICATION: SHOPEE CATALOG & IMAGE RESILIENCE (QT-08)

> **Mã đặc tả:** `shopee-catalog-image-resilience`  
> **Tài liệu nghiệp vụ gốc:** [QT-08-shopee-catalog-image-resilience.md](file:///d:/A_javaFW/WebBanMP/docs/flows/QT-08-shopee-catalog-image-resilience.md)  
> **Tiêu chuẩn:** Spec-Driven Development (SDD) | Zero-Breakage Clean Root

---

## 1. YÊU CẦU NGHIỆP VỤ & ĐỊNH MỨC THỰC THI
1. **Định mức bổ sung sản phẩm:** Bổ sung chính xác đúng 5 sản phẩm/danh mục ngách còn thiếu từ Shopee Mall chính hãng (Rating >= 4.8*, Đã bán >= 1.000).
2. **Tiêu chuẩn bộ ảnh 5 góc:** Packshot 1:1, Nhãn thành phần INCI, Texture/Swatch, Người mẫu sử dụng, Góc chi tiết & Mã vạch EAN-13.
3. **Cơ chế khử trùng lặp ảnh:** Pipeline 4 tầng (URL Normalization -> Binary MD5 Hash -> Perceptual Hash pHash -> WebP Compression 85%).
4. **Kiến trúc 5 tầng phòng thủ chống lỗi ảnh vĩnh viễn:**
   - Tầng 1: 100% Self-Hosted Local Asset tại `frontend/public/products/<PROD-ID>-<INDEX>.webp`.
   - Tầng 2: Component `ProductImage.jsx` với Skeleton shimmer và fallback 3 cấp (images[1] -> local packshot -> Luxury SVG Placeholder).
   - Tầng 3: Data Normalizer Guard tại Backend & Client API.
   - Tầng 4: Pre-build Health Checker kiểm tra file thực tế trên ổ đĩa.
   - Tầng 5: Header `Cache-Control: public, max-age=31536000, immutable`.

## 2. BỘ MÃ LỖI ĐẶC TẢ
- `RC-1`: `SHOPEE_CDN_HOTLINK_BLOCKED`
- `RC-2`: `EPHEMERAL_TOKEN_EXPIRED`
- `RC-3`: `ARRAY_INDEX_UNDEFINED_ACCESS`
- `RC-4`: `NO_ONERROR_RECOVERY_FALLBACK`
- `E1`: Rate limit / Chặn Bot crawler Shopee
- `E2`: Không đủ sản phẩm Shopee Mall đạt chỉ tiêu lượt bán
- `E3`: Ảnh gốc Shopee CDN bị lỗi tải (404/Timeout)
