# 📐 ĐẶC TẢ KỸ THUẬT & BẢN THIẾT KẾ: LOGO THƯƠNG HIỆU, INTRO 5 CẢNH SVG MASK & MICRO-INTERACTIONS
> **TÀI LIỆU**: `docs/frontend-ui/spec-logo-intro-motion.md`
> **PHÂN HỆ**: `/frontend` (React 18 + Vite 5 + Tailwind CSS + Framer Motion)
> **DỰ ÁN**: Sàn TMĐT Mỹ Phẩm Đa Người Bán (Aura Beauty Mall / WebBanMP)
> **NGUYÊN TẮC**: Zero-Breakage, Clean Root, 60 FPS GPU-protected AR VTO.

---

## 1. MỤC TIÊU & BỐI CẢNH (EXECUTIVE SPECIFICATION)

Nhằm nâng tầm trải nghiệm thị giác của sàn TMĐT mỹ phẩm Aura Beauty Mall lên chuẩn **Luxury Derma-Tech & High Fashion**, phân hệ Frontend triển khai đồng bộ 3 hạng mục chuyển động và nhận diện thương hiệu:
1. **Hệ Thống Logo Vector Đẳng Cấp (`AuraBrandLogo.jsx`):** Cấu trúc hình học Isotype khối kim cương bo góc (`#iso` rhombus) kết hợp mặt nạ cắt 3 quỹ đạo elip và 3 hạt nhân (`<mask id="aura-mask">`) cùng cụm chữ Wordmark AURA BEAUTY MALL sắc nét.
2. **Màn Vén Rèm Thương Hiệu 5 Cảnh (`AuraIntroOverlay.jsx`):** Chuyển đổi trọn vẹn kịch bản 5 cảnh (5-Scene Master Timeline) từ nguyên mẫu `intro_logo` sang React 18 + Framer Motion thuần (không dùng jQuery/GSAP legacy), đạt thời lượng ~1.8s, hỗ trợ Skip, lưu `sessionStorage` và tự động tạm dừng khi mở AR VTO Modal.
3. **Nâng Cấp Hệ Thống Tương Tác & Chuyển Tab (`AnimatedTabs`, `MotionCard`, `SpringButton`):**
   - Sliding pill `layoutId` mềm mại, khử chớp màn hình khi chuyển giữa 51 sub-menus, 9 Seller tabs, 9 Admin tabs.
   - Thẻ sản phẩm với hiệu ứng **Radial Spotlight Glow** tương tác theo tọa độ chuột.
   - Phản hồi xúc giác lò xo `spring` cho toàn bộ nút bấm chính và bộ chọn biến thể son môi / dung tích Shopee Mall.

---

## 2. BẢN THIẾT KẾ KỸ THUẬT CHI TIẾT (TECHNICAL ARCHITECTURE)

### 2.1. Cấu Trúc Vector `AuraBrandLogo.jsx`
```
┌──────────────────────────────────────────────┐
│  AuraBrandLogo (viewBox: "0 0 420 100")       │
│                                              │
│  ┌────────────┐   ┌────────────────────────┐ │
│  │   ISOTYPE  │   │        WORDMARK        │ │
│  │  Rhombus   │   │  A  U  R  A            │ │
│  │  93 x 93   │   │  BEAUTY MALL           │ │
│  │  rot -45°  │   │  ● OFFICIAL CBMP       │ │
│  │  + 3 Elips │   └────────────────────────┘ │
│  │  + 3 Dots  │       (class="word" stagg)   │
│  └────────────┘                              │
└──────────────────────────────────────────────┘
```
- **Mask Geometry (`<mask id="aura-mask">`):**
  - Khối nền trắng `#alpha` (`rect` `93.237 x 93.237`, `rx="15"`).
  - 3 đường cắt elip đen (`ellipse.logo-ellipse`, `stroke="#000"`, `strokeWidth="2"`).
  - 3 chấm tròn cắt đen (`circle.logo-circle`, `fill="#000"`).
- **Biến thể (`variant`):**
  - `'light'`: Nền tối / Intro (Màu vàng kim `--accent-gold` `#F59E0B` + hồng ngọc trai `--accent-rose` `#FFABB9`).
  - `'dark'`: Header sáng / Navbar (Màu đen `--ink` `#0F172A` + điểm xuyết `--accent-rose`).
  - `'compact'`: Chỉ Isotype dùng cho Mobile và Favicon.

### 2.2. Biên Đạo 5 Cảnh Hoạt Họa Nối Tiếp (`AuraIntroOverlay.jsx`)
| Cảnh (Scene) | Hàm / Cơ chế | Thời gian | Chuyển động chi tiết |
| :--- | :--- | :---: | :--- |
| **Scene 1 & 2** | `rhombusRotation()` | `0.0s – 1.0s` | `#iso` bung từ tròn (`rx: 50`) sang thoi (`rx: 15`), xoay `90° -> -45°`, scale `0 -> 1`. |
| **Scene 3** | `ellipsesAnimation()` | `0.5s – 1.1s` (gối đầu) | 3 elip thu nét `60px -> 2px`, dịch tâm `cx/cy` cắt xuyên khối thoi. |
| **Scene 4** | `circleIntersection()`| `0.8s – 1.3s` (gối đầu) | 3 chấm tròn nảy so le `stagger: 0.1s` tại các giao điểm năng lượng. |
| **Scene 5** | `textAnimation()` | `1.0s – 1.6s` (gối đầu) | Từng ký tự `.word` nảy đàn hồi lò xo (`stiffness: 260, damping: 14`) từ trái sang phải. |
| **Curtain Exit**| Vén màn lên trên | `1.6s – 1.9s` | Tấm màn trượt lên (`y: -100%`, `ease: [0.22, 1, 0.36, 1]`), unmount hoàn toàn. |

### 2.3. Micro-Interactions Toàn Web
- **Radial Spotlight Hover:** Bắt sự kiện `onMouseMove` trên thẻ `MotionCard`, tính toán `(x, y)` theo phần trăm, chiếu dải sáng gradient chuyển dịch mượt mà.
- **Sliding Pill Tab:** Tích hợp `layoutId` độc lập cho từng cụm tab (Buyer, Seller, Admin) với lò xo `stiffness: 420, damping: 32`.

---

## 3. DANH SÁCH FILE CAN THIỆP PHẪU THUẬT
1. `frontend/src/components/ui/AuraBrandLogo.jsx` *(Mới — Component Logo chuẩn SVG Vector)*
2. `frontend/src/components/ui/AuraIntroOverlay.jsx` *(Viết lại — Hoạt họa 5 cảnh SVG Mask)*
3. `frontend/src/components/ui/motion-card.jsx` *(Cập nhật — Thêm Radial Spotlight Cursor Glow)*
4. `frontend/src/components/ui/spring-button.jsx` *(Cập nhật — Thêm Shimmer Sweep effect)*
5. `frontend/src/components/ui/animated-tabs.jsx` *(Cập nhật — Tối ưu hóa Tab transition physics)*
6. `frontend/src/components/ui/index.js` *(Export AuraBrandLogo)*
7. `frontend/src/components/Navbar.jsx` *(Tích hợp AuraBrandLogo & Nút xem lại Intro)*
8. `frontend/src/components/SellerZone.jsx` *(Tích hợp AuraBrandLogo variant compact/dark)*
9. `frontend/src/components/AdminZone.jsx` *(Tích hợp AuraBrandLogo variant compact/dark)*
10. `frontend/src/components/Footer.jsx` *(Tích hợp AuraBrandLogo variant light)*

---

## 4. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA)
- [x] Không dùng jQuery hoặc GSAP; 100% React 18 + Framer Motion.
- [x] Logo hiển thị sắc nét trên cả nền sáng (Header) và nền tối (Intro/Footer).
- [x] Màn Intro chạy mượt mà 5 cảnh liên hoàn, tự động kết thúc hoặc bấm Skip tức thì.
- [x] Build production `npm run build` thành công 100% với 0 lỗi cảnh báo.
- [x] Giữ sạch Root 100% (chỉ lưu tài liệu vào `docs/frontend-ui/`).
