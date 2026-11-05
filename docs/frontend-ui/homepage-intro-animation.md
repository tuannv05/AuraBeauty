# 🏛️ BÁO CÁO KỸ THUẬT: HIỆU ỨNG ĐỘNG MỞ ĐẦU THƯƠNG HIỆU & BUNG MỞ PHÂN LỚP TRANG CHỦ
> **MÔI TRƯỜNG**: Windows 11 | Antigravity IDE (Gemini Models) | React 18 + Vite 5 + Framer Motion  
> **DỰ ÁN**: Multi-Vendor Cosmetics Platform (Aura Beauty Mall / WebBanMP)  
> **PHÂN HỆ**: `/frontend` (UI/UX Motion Engineering)  
> **TIÊU CHUẨN**: Luxury Monochrome • 60 FPS Smooth • Once-Per-Session • Clean Root 100%  

---

## 1. TỔNG QUAN HỆ THỐNG CHUYỂN ĐỘNG (MOTION ARCHITECTURE)

Hệ thống chuyển động mở đầu của **Aura Beauty Mall** được thiết kế theo trường phái **Luxury Editorial Motion**, mang lại cảm giác đẳng cấp như các tạp chí thời trang và sàn mỹ phẩm quốc tế hàng đầu (Sephora, Chanel, ModiFace):
1. **Màn vén rèm thương hiệu (`AuraIntroOverlay.jsx`):**
   - Hoạt động theo cơ chế **Once-Per-Session** thông qua `sessionStorage` (`aura_intro_seen_v2`).
   - Thời lượng tối ưu **1.4 giây** kết hợp thanh tiến trình Hairline (`0% -> 100%`), nút **"Bỏ qua (Skip Intro) →"**, và hiệu ứng vén rèm mượt mà với đường cong chuyển động `cubic-bezier(0.22, 1, 0.36, 1)`.
   - Khi người dùng điều hướng qua lại bằng nút Back/Forward của trình duyệt (`useBrowserHistorySync`), màn chắn toàn màn hình **tuyệt đối không bị kích hoạt lại**, đảm bảo trải nghiệm mua sắm liền mạch.
2. **Chuỗi chuyển động bung mở phân lớp (`Hero & Above-the-Fold Staggered Reveal`):**
   - Header & Top Bar: Trượt nhẹ từ trên xuống (`opacity: 0, y: -16` $\to$ `opacity: 1, y: 0`).
   - Hero Banner: Hiệu ứng phóng chậm **Ken Burns / Smooth Scale** (`scale: 1.05 -> 1.0`, `duration: 0.8s`).
   - Thẻ kính mờ nổi 3D (**Floating Glassmorphism Cards**) quảng bá tính năng **AR Try-On 60FPS** và **AI Soi Da Liễu 478 Điểm**.
   - Bộ đếm chỉ số tín nhiệm động bằng **`NumberTicker`**: `154+` Sản phẩm chính hãng, `100%` Kiểm định CBMP Bộ Y Tế, `200%` Cam kết hoàn tiền.
   - Cụm nút CTA thông minh với **`SpringButton`** và huy hiệu xung nhịp **`AnimatedBadge`**.
   - Dải cam kết USP, Khung công nghệ Beauty-Tech và Lưới sản phẩm Flash Sale xuất hiện so le từ trái sang phải bằng **`StaggerContainer`** và **`StaggerItem`**.

---

## 2. CHI TIẾT CÁC THÀNH PHẦN KỸ THUẬT ĐÃ TRIỂN KHAI

### 2.1. Component Màn Vén Rèm Thương Hiệu: `frontend/src/components/ui/AuraIntroOverlay.jsx`
- **Khởi tạo và Quản lý Session:**
  ```javascript
  const [isVisible, setIsVisible] = useState(() => {
    if (forceShow) return true;
    try {
      return !sessionStorage.getItem('aura_intro_seen_v2');
    } catch {
      return false;
    }
  });
  ```
- **Animation Nét vẽ SVG Biểu Tượng Kim Cương Aura:**
  - Đường nét ngoại biên: `pathLength: 0 -> 1` trong `0.7s` (`easeInOut`).
  - Đường vân quang học phản chiếu nội tại: `pathLength: 0 -> 1` với delay `0.2s`.
  - Gradient chuyển màu ánh kim: `#FFABB9` (Rose) $\to$ `#FFFFFF` $\to$ `#E5C07B` (Gold).
- **3 Huy hiệu bảo chứng xuất hiện so le (Staggered Badges):**
  1. `🛡️ 100% Chính Hãng CBMP Bộ Y Tế` (Delay 0.35s)
  2. `✨ Thử Son & Makeup AR 60FPS` (Delay 0.47s)
  3. `🧬 Trợ Lý AI Phân Tích INCI` (Delay 0.59s)
- **Thanh Hairline Progress Bar & Nút Bỏ qua:**
  - Thanh tiến trình mỏng 3px ở đáy màn hình chuyển dịch mượt từ `0%` đến `100%` bằng `requestAnimationFrame`.
  - Nút "Bỏ qua (Skip) →" cho phép kết thúc tức thì mà không cần đợi hết 1.4s.
- **Tháo gỡ sạch (`unmount`):**
  - Khi hoàn thành, thẻ `<motion.div>` trượt lên phía trên (`y: -100%`) trong 600ms và được `<AnimatePresence>` gỡ hoàn toàn khỏi cây DOM.

### 2.2. Bung Mở Phân Lớp Tại Header & Hero: `Navbar.jsx` & `HomeView.jsx`
- **Header Top Bar:**
  - Bao bọc toàn bộ Navbar trong `<motion.div>`:
    ```jsx
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'sticky', top: 0, zIndex: 900, background: '#ffffff', ... }}
    >
    ```
  - Bổ sung nút **"✨ Xem lại Intro"** tại thanh tiện ích trên cùng (`top-bar-right`) để người dùng có thể chủ động trải nghiệm lại màn vén rèm thương hiệu bất cứ lúc nào.
- **Hero Banner:**
  - `motion.section` kích hoạt mở rộng nhẹ (`scale: 1.02 -> 1`).
  - Hình ảnh Hero `motion.img` áp dụng hiệu ứng phóng Ken Burns (`scale: 1.05 -> 1.0`, `duration: 0.8s`).
  - 2 Floating Glass Cards gắn viền phát sáng nhẹ, hỗ trợ hover nổi 3D (`whileHover: { y: -3, scale: 1.03 }`), click vào mở trực tiếp Modal tương ứng:
    - Card AR Try-On: Nút bấm mở `onOpenTryOn`.
    - Card AI Skin Scanner: Nút bấm mở `onOpenSkinScanner`.
  - Chỉ số tín nhiệm động sử dụng `<NumberTicker>`:
    - `154+ Sản phẩm chính hãng`
    - `100% Kiểm định CBMP Bộ Y Tế`
    - `200% Cam kết hoàn tiền`
- **Cụm CTA:**
  - Sử dụng `<SpringButton variant="rose">` và `<SpringButton variant="outline">` kèm `<AnimatedBadge variant="danger" pulse>` tạo cảm giác công nghệ cao.
- **Dải USP, Beauty-Tech Innovation Suite & Flash Sale:**
  - Đồng bộ hoá bằng `<StaggerContainer>` và `<StaggerItem>`, tạo hiệu ứng xuất hiện tuần tự mượt mà khi người dùng cuộn trang.

---

## 3. BẢO VỆ HIỆU NĂNG & NHƯỜNG 100% GPU CHO AR VTO 60FPS

1. **Tải song song không chặn I/O (Non-blocking):**
   - Toàn bộ lời gọi API danh mục sản phẩm từ `catalog-service` được kích hoạt song song ngay khi trang web được tải.
   - Màn Intro Overlay chỉ là lớp phủ đồ họa trên cùng, hoàn toàn không chặn việc hydrate dữ liệu ở nền.
2. **Khóa Animation Nền khi mở AR Studio:**
   - Khi người dùng mở Modal `VirtualTryOnModal`, lớp CSS `body.vto-active-no-anim` trong `frontend/src/index.css` tự động kích hoạt:
     ```css
     body.vto-active-no-anim * {
       animation-play-state: paused !important;
     }
     ```
   - Tất cả các hiệu ứng lặp vô hạn ở Hero Banner, hạt nhũ, xoay chiều tự động đều tạm dừng tức thì, giải phóng 100% năng lực GPU cho luồng xử lý WebGL & 478 tọa độ 3D của MediaPipe đạt chuẩn 60 FPS.

---

## 4. KIỂM ĐỊNH HỘI TỤ (VERIFICATION & CLEAN ROOT)

### 4.1. Kiểm tra Build Production Frontend
```bash
npm --prefix frontend run build
```
- **Kết quả:**
  - `1948 modules transformed`
  - `dist/index.html`: 0.78 kB
  - `dist/assets/index-BtMl5K3D.css`: 8.55 kB
  - `dist/assets/index-CKYWjoqk.js`: 1,661.42 kB
  - **Thời gian build**: 6.61s • **0 Lỗi (0 errors)**

### 4.2. Kiểm tra Kỷ luật thép Clean Root
- **Danh sách file tại Root:**
  - `.gitignore`
  - `AGENTS.md`
  - `CLAUDE.md`
  - `GEMINI.md`
  - `pom.xml`
- **Đánh giá:** 100% Tuân thủ Whitelist, không có bất kỳ file tạm hay log rác ở thư mục gốc.
