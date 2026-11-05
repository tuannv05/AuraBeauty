# ĐẶC TẢ KỸ THUẬT: WIDE HEADER, PROMOTIONAL ADS RIBBON & MICRO-INTERACTIONS (UI/UX & MOTION)

> **MÃ ĐẶC TẢ**: `SPEC-FE-WIDE-HEADER-PROMO-MOTION`  
> **PHÂN HỆ**: `/frontend` (React 18 + Vite 5 + Tailwind CSS + Framer Motion)  
> **KIẾN TRÚC TRỌNG TÂM**: Luxury Derma-Tech E-Commerce Platform (Aura Beauty Mall)  
> **TUÂN THỦ**: Hiến pháp dự án, Zero Blank-Screen, Clean Root, 60 FPS AR VTO Protection  

---

## 1. MỤC TIÊU NGHIỆP VỤ & TRẢI NGHIỆM NGƯỜI DÙNG (UI/UX GOALS)

1. **Bố Cục Full-Bleed Rộng Mở (Wide Fluid Header & Menu):**
   - Mở rộng giới hạn hiển thị của Top Bar, Main Header (Logo, Search, Utilities) và Main Navigation từ giới hạn cứng 1280px lên dạng **Wide Fluid Container (`max-w-[1720px] w-full px-4 sm:px-8 xl:px-12`)**.
   - Tối ưu khoảng thở ở hai bên lề trên các màn hình máy tính lớn (1440p, 1080p rộng), định vị thanh tìm kiếm ở giữa trải dài tự nhiên (đạt 680-720px), cân xứng hoàn hảo với Logo bên trái và cụm tài khoản/giỏ hàng bên phải.
   - Bảng điều hướng Mega Menu "DANH MỤC SẢN PHẨM" mở rộng dạng lưới cân bằng đa cột, không bị dồn ép.

2. **Dải Băng Quảng Cáo Nhà Bán Hàng Nổi Bật (Seller Promotional Ads Ribbon):**
   - Đặt ngay dưới thanh Menu chính, hiển thị các chiến dịch trọng điểm:
     - Sản phẩm **Bán Chạy Nhất (Best Sellers)**.
     - Sản phẩm đang có **Flash Sale -50%**.
     - Sản phẩm được **Seller đăng ký trả phí quảng cáo với sàn (Sponsored Deals)** có gắn huy hiệu tinh tế `[Tài Trợ / Sponsored]` hoặc `[Mall Ưu Đãi]`.
   - Hiệu ứng trượt/mờ nhẹ nhàng (Framer Motion Slide & Fade Carousel), tự động chuyển đổi mỗi 5 giây, hỗ trợ dừng khi hover và nút điều hướng thủ công.
   - Tương tác 1-click: Nhấn "Thử màu AR 💄" để mở ngay Modal VTO Studio nếu là sản phẩm makeup; hoặc "Xem chi tiết deal →" để xem trang sản phẩm.

3. **Hoàn Thiện Hiệu Ứng Động (Micro-Interactions & Motion Transitions):**
   - Chuyển tab mượt mà bằng `AnimatedTabs` với thanh chỉ báo trượt lò xo (`layoutId="active-pill"`, spring physics `stiffness: 420, damping: 32`).
   - Thẻ sản phẩm ứng dụng `MotionCard`: Nâng nhẹ 3D khi hover (`y: -5, scale: 1.01`), phát quang viền ánh kim dịu nhẹ (`--accent-rose`), đồng thời hiện nhanh **Thanh Công Cụ Hành Động (Quick Action Bar: Thử màu AR, Xem nhanh, Thêm giỏ hàng)**.
   - Nút bấm chính áp dụng phản hồi đàn hồi xúc giác (`whileHover={{ scale: 1.02 }}`, `whileTap={{ scale: 0.97 }}`).

4. **Bảo Vệ Hiệu Năng GPU (60 FPS AR Try-On Protection):**
   - Toàn bộ hoạt họa tự động tạm dừng khi Modal AR Virtual Try-On mở ra (`document.body.classList.contains('vto-active-no-anim')`), đảm bảo webcam máy tính chạy mượt 60 FPS không drop frame.

---

## 2. KIẾN TRÚC THÀNH PHẦN & TẬP TIN CAN THIỆP

```
frontend/src/
├── components/
│   ├── Navbar.jsx                      # Nâng cấp Full-Bleed Header, Mega Menu & Tích hợp Ads Ribbon
│   ├── SellerPromotionalAdsRibbon.jsx  # [NEW] Dải băng quảng cáo Seller tài trợ & Flash Sale Carousel
│   ├── HomeView.jsx                    # Nâng cấp AnimatedTabs cho Bộ sưu tập tuyển chọn & MotionCard sản phẩm
│   ├── CatalogView.jsx                 # Nâng cấp MotionCard và quick action bar cho danh sách sản phẩm
│   └── ui/
│       ├── motion-card.jsx             # Nâng cấp hỗ trợ Quick Action Bar & border hover rose glow
│       └── index.js                    # Xuất các component UI
```

---

## 3. TIÊU CHÍ NGHIỆM THU (VERIFICATION CRITERIA)

1. `npm --prefix frontend run build` đạt kết quả 0 lỗi (Exit Code 0).
2. Kiểm tra trực quan trên trình duyệt: Header rộng mở sang 2 mép màn hình, thanh quảng cáo Seller hiển thị đẹp mắt, chuyển tab có thanh trượt lò xo.
3. Clean Root: Kiểm tra thư mục gốc chỉ chứa các file được phép trong Hiến pháp.
