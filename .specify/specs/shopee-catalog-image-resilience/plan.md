# TECHNICAL PLAN: SHOPEE CATALOG & IMAGE RESILIENCE (QT-08)

> **Mã kế hoạch:** `shopee-crawler-image-plan`  
> **Tài liệu gốc:** [shopee-crawler-image-plan.md](file:///d:/A_javaFW/WebBanMP/docs/flows/shopee-crawler-image-plan.md)  
> **Căn cứ nghiệp vụ:** [QT-08](file:///d:/A_javaFW/WebBanMP/docs/flows/QT-08-shopee-catalog-image-resilience.md)

---

## 1. MỤC TIÊU PHẪU THUẬT
- Xây dựng component `ProductImage.jsx` với Skeleton shimmer và 3 cấp fallback.
- Tích hợp `ProductImage.jsx` vào `CatalogView.jsx`, `HomeView.jsx`, `ProductDetailView.jsx`, `QuickViewModal.jsx`.
- Khắc phục triệt để ảnh `PROD-CRW-085` và `PROD-CRW-150`.
- Rà soát 51 Sub-menu, bổ sung đúng 5 sản phẩm/ngách cho các Sub-menu thiếu.
- Xây dựng script `imageHealthChecker.js`.
- Kiểm định hội tụ tự động (Build Frontend, Clean Root).
