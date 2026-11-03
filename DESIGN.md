---
version: 2.0.0
name: CosmePoly - Cosmetics E-Commerce & Skincare AI Design System
description: Thiết kế giao diện chuẩn mực cho sàn thương mại điện tử mỹ phẩm đa người bán (Multi-Vendor Cosmetics Platform) tích hợp cố vấn da liễu AI. Ngôn ngữ thiết kế Gallery-Monochrome hiện đại kết hợp thẩm mỹ tối giản sang trọng (Clean Luxury Minimalist), nền trắng phòng tranh làm nổi bật bao bì sản phẩm, hệ thống điều khiển stadium-pill mềm mại, hình học squircle 24px/16px, typography phân cấp tương phản cao theo Saans/Inter, và điểm nhấn thương mại electric blue / rose gold tinh tế.

colors:
  primary: "#141414"
  on-primary: "#ffffff"
  ink: "#141414"
  ink-soft: "#262626"
  text-muted: "#707070"
  text-faint: "#9ca3af"
  canvas: "#ffffff"
  canvas-soft: "#f8f9fa"
  field: "#f3f4f6"
  hairline-soft: "#f0f1f3"
  hairline: "#e5e7eb"
  accent: "#0066ff"
  accent-rose: "#f43f5e"
  accent-gold: "#d97706"
  success: "#10b981"
  warning: "#f59e0b"
  danger: "#ef4444"

typography:
  display:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.02em
  heading-1:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.015em
  heading-2:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: 28px
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: -0.01em
  heading-3:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: 20px
    fontWeight: 650
    lineHeight: 1.3
  title:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: 14px
    fontWeight: 450
    lineHeight: 1.5
  body-sm:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: 13px
    fontWeight: 450
    lineHeight: 1.45
  caption:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4

rounded:
  none: 0px
  xs: 8px
  sm: 14px
  md: 20px
  lg: 28px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 64px
  section-lg: 96px

components:
  announcement-bar:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    height: "38px"
    fontSize: "{typography.caption.fontSize}"
  
  header-sticky:
    backgroundColor: "rgba(255, 255, 255, 0.95)"
    backdropFilter: "blur(12px)"
    borderColor: "{colors.hairline}"
    heightDesktop: "76px"
    heightCollapsed: "56px"
  
  nav-pill:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "6px {spacing.md}"
  
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    padding: "10px {spacing.lg}"
    fontWeight: 600
  
  button-outline:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.full}"
    padding: "10px {spacing.lg}"
  
  product-card:
    backgroundColor: "{colors.canvas}"
    borderColor: "{colors.hairline-soft}"
    rounded: "{rounded.md}"
    aspectRatio: "1:1"
  
  badge-pill:
    rounded: "{rounded.full}"
    fontSize: "11px"
    fontWeight: 600
    padding: "3px 10px"
---

# ĐẶC TẢ CHI TIẾT GIAO DIỆN HỆ THỐNG SÀN MỸ PHẨM COSMEPOLY
**Hệ thống Sàn Mỹ Phẩm Đa Người Bán & Trợ Lý Da Liễu AI (Multi-Vendor E-Commerce & RAG Derm-Advisor)**

---

## 0. Quy ước chung và Nguyên tắc thiết kế (Design Conventions)

### 0.1 Triết lý thẩm mỹ (Aesthetics Philosophy)
- **Gallery-White Minimalism**: Không gian giao diện tinh giản, tôn vinh hình ảnh sản phẩm mỹ phẩm rực rỡ và sắc nét. Nền màu trung tính cao cấp (`#ffffff`, `#f8f9fa`) thay thế cho các màu nền gắt.
- **Stadium-Pill Controls**: Tất cả các thành phần hành động (nút bấm CTA, ô tìm kiếm, tag danh mục, bộ lọc chip, badge) sử dụng hình thái viên thuốc cong mượt mà (`rounded-full` 9999px).
- **Squircle Cards (20–28px)**: Khung thẻ sản phẩm, banner và container bo góc mềm mại, kết hợp viền mờ hairline siêu mảnh 1px (`#e5e7eb`) thay vì đổ bóng đậm, tạo cảm giác sang trọng, thoáng đãng.
- **Typography tương phản cao**: Phông chữ không chân hiện đại (Inter / Saans), kết hợp độ đậm 650–700 cho tiêu đề và 400–450 cho nội dung chạy.
- **Micro-animations**: Thời gian chuyển động tiêu chuẩn 150–200ms cho tương tác cơ bản, 250–300ms cho drawer/modal trượt, toast thông báo tự đóng sau 3.5 giây.

### 0.2 Quy ước đọc tài liệu
- Mỗi giao diện được mô tả theo thứ tự: **Mục đích → Điều kiện truy cập → Bố cục các vùng → Thành phần chi tiết → Luồng chính → Luồng ngoại lệ → Responsive**.
- **Trạng thái của thành phần**:
  1. *Mặc định (default)*: Hiển thị ban đầu.
  2. *Rê chuột (hover)*: Nâng nhẹ hoặc đổi nền (chỉ desktop).
  3. *Được chọn/nhấn (active)*: Đang thao tác hoặc được kích hoạt.
  4. *Được chú ý bàn phím (focus)*: Viền đen ink rõ ràng, hỗ trợ accessibility WCAG 2.1 AA.
  5. *Vô hiệu (disabled)*: Nền nhạt, độ mờ 50%, con trỏ `not-allowed`.
  6. *Đang tải (loading)*: Vòng xoay spinner hoặc khung xám nhấp nháy skeleton.
  7. *Lỗi (error)*: Viền đỏ `#ef4444`, thông báo phụ giải thích nguyên nhân.
  8. *Rỗng (empty)*: Minh họa hình vẽ kèm lời gợi ý hành động.
- **Thiết bị**:
  - Mobile: `< 768px` (ưu tiên thao tác 1 tay, thanh bottom bar cố định).
  - Tablet: `768px – 1024px` (lưới linh hoạt 3 cột).
  - Desktop: `> 1024px` (lưới 4–5 cột, mega menu hover, zoom ảnh kính lúp).
- **Phân quyền người dùng**:
  - *Khách vãng lai (Guest)*: Chưa đăng nhập, giỏ hàng lưu localStorage, khi thanh toán có thể mua nhanh hoặc đăng nhập.
  - *Thành viên (Member)*: Đã đăng nhập, hồ sơ da cá nhân, sổ địa chỉ, tích điểm, đánh giá mua hàng.
  - *Người bán (Seller)*: Quản lý gian hàng, kho hàng, đơn hàng con (sub-orders).
  - *Quản trị viên (Admin)*: Kiểm duyệt sản phẩm, tra cứu giao dịch, quản lý sàn.

---

## 1. Các thành phần dùng chung (Global Components)

### 1.1 Thanh thông báo trên cùng (Announcement Bar)
- **Vị trí & kích thước**: Trên cùng mọi trang, cao 38px, nền `{colors.canvas-soft}`, chữ đậm `{colors.ink}`.
- **Nội dung luân phiên**: 3 thông điệp tự động chuyển đổi mỗi 4 giây:
  1. 🚚 "Miễn phí vận chuyển toàn quốc cho đơn hàng từ 299.000đ"
  2. 🛡️ "Cam kết chính hãng 100% – Hoàn tiền 200% nếu phát hiện hàng giả"
  3. 🎁 "Nhập mã **NEW10** để nhận ưu đãi giảm 10% cho đơn hàng đầu tiên"
- **Tương tác**:
  - Bấm vào thông điệp: Điều hướng đến trang khuyến mãi tương ứng.
  - Rê chuột (hover): Tạm dừng hiệu ứng chuyển động.
  - Nút X (Đóng): Đóng thanh thông báo và ghi nhớ trong phiên (không hiện lại trong 24 giờ).
  - Mobile: Vuốt ngang (swipe) để đổi thông điệp.

### 1.2 Header chính (Sticky Main Header)
- **Cấu trúc Desktop (từ trái qua phải)**:
  1. **Logo**: Biểu tượng thương hiệu "CosmePoly", cao 36px. Bấm chuyển về Trang chủ; nếu đang ở Trang chủ thì bấm sẽ cuộn mượt lên đầu trang.
  2. **Nút Danh mục & Mega Menu**: Nút dạng pill kèm biểu tượng lưới 4 ô vuông. Bấm hoặc rê chuột mở Mega Menu đa tầng.
  3. **Thanh tìm kiếm trung tâm (rộng nhất)**:
     - Placeholder: *"Tìm son, serum, kem chống nắng, BHA, Niacinamide..."*
     - Biểu tượng kính lúp bên trái, nút xóa nhanh (X) khi có nội dung gõ.
     - Tích hợp biểu tượng tìm kiếm bằng giọng nói và camera/mã vạch.
     - Khi bấm vào: Mở dropdown gợi ý (Tìm kiếm gần đây + Từ khóa xu hướng + Gợi ý tự động).
  4. **Yêu thích (Wishlist)**: Biểu tượng trái tim kèm badge số lượng sản phẩm. Bấm mở danh sách yêu thích; khách chưa đăng nhập mở popup đăng nhập.
  5. **Tài khoản**: Biểu tượng avatar / người dùng. Khách: bấm mở modal Đăng nhập/Đăng ký. Thành viên: rê/bấm mở dropdown (Hồ sơ cá nhân, Hồ sơ da liễu, Đơn hàng của tôi, Kho Voucher, Đăng xuất).
  6. **Giỏ hàng (Cart)**: Biểu tượng túi xách cao cấp kèm badge số lượng nảy nhẹ khi thêm hàng. Bấm mở Mini-cart Drawer từ mép phải.
- **Cơ chế Sticky Header**: Khi cuộn xuống > 80px, header thu gọn xuống 56px, dính cố định đỉnh màn hình với hiệu ứng kính mờ `backdrop-filter: blur(12px)`.
- **Mobile Header**:
  - Dòng trên: Nút Hamburger (mở menu drawer) + Logo + Kính lúp (bấm mở tìm kiếm toàn màn hình) + Giỏ hàng.
  - Dải thanh điều hướng dưới cố định (Bottom Navigation Bar, cao 60px): 5 mục gồm **Trang chủ**, **Danh mục**, **AI Da Liễu (Nút nổi bật chính giữa)**, **Yêu thích**, **Tài khoản**.

### 1.3 Mega Menu Danh mục (Desktop & Mobile Drawer)
- **Desktop**: Rê chuột (độ trễ 150ms chống kích hoạt nhầm) hoặc bấm mở bảng điều hướng 3 vùng:
  - *Cột trái (Danh mục cấp 1)*: Chăm sóc da (Skincare), Trang điểm (Makeup), Chăm sóc tóc, Chăm sóc cơ thể, Nước hoa, TPCN làm đẹp, Dụng cụ làm đẹp, Thương hiệu chính hãng, Khuyến mãi Hot.
  - *Vùng giữa (Danh mục cấp 2 & 3 chia 3-4 cột)*:
    - Làm sạch: Nước tẩy trang, Dầu tẩy trang, Sữa rửa mặt tạo bọt, Tẩy tế bào chết vật lý/hóa học.
    - Dưỡng da chuyên sâu: Toner / Nước hoa hồng, Tinh chất Serum / Ampoule, Kem dưỡng ẩm ban đêm, Mặt nạ ngủ.
    - Chống nắng: Kem chống nắng vật lý, Chống nắng hóa học, Xịt chống nắng.
    - Trị liệu da: Trị mụn ngừa thâm, Phục hồi B5, Chống lão hóa Retinol.
  - *Vùng phải (Banner quảng bá)*: 1 ảnh chiến dịch xu hướng mới + nút CTA "Khám phá ngay".
- **Mobile Drawer**: Trượt êm từ cạnh trái (chiếm 85% chiều rộng), hỗ trợ chuyển cấp dạng trượt ngang mượt mà, có nút "Quay lại" và hiển thị tiêu đề danh mục cha.

### 1.4 Chân trang (Footer)
- **Khối 1 – Giới thiệu**: Logo thương hiệu, slogan, giấy phép hoạt động, mạng xã hội.
- **Khối 2 – Hỗ trợ khách hàng**: Hướng dẫn mua hàng, Chính sách đổi trả 7 ngày, Chính sách vận chuyển, Tra cứu đơn hàng, Câu hỏi thường gặp (FAQ).
- **Khối 3 – Về CosmePoly**: Về chúng tôi, Hệ thống gian hàng, Cam kết 100% chính hãng, Tuyển dụng, Liên hệ.
- **Khối 4 – Đăng ký nhận tin & Voucher 10%**: Ô nhập email + nút "Đăng ký". Kiểm tra định dạng; hợp lệ xuất toast chúc mừng kèm mã giảm giá; đã tồn tại thông báo thân thiện.
- **Khối 5 – Chứng nhận & Thanh toán**: Logo Visa, MasterCard, MoMo, VNPay, ZaloPay; Đơn vị vận chuyển GHTK, GHN, ViettelPost; Dấu chứng nhận Bộ Công Thương.
- **Mobile**: Khối 2 & 3 tự động chuyển thành Accordion bấm mở gọn gàng.

### 1.5 Mini-cart Drawer (Giỏ hàng trượt nhanh)
- **Kích hoạt**: Bấm biểu tượng giỏ hàng hoặc tự động mở khi bấm "Thêm vào giỏ" thành công.
- **Hiệu ứng**: Trượt từ mép phải (300ms) kèm lớp nền mờ 50% backdrop.
- **Cấu trúc**:
  1. Tiêu đề "Giỏ hàng của bạn (N sản phẩm)".
  2. **Thanh tiến độ Miễn phí vận chuyển**: "Mua thêm 120.000đ để được miễn phí vận chuyển" kèm thanh tiến độ %; khi đủ điều kiện chuyển sang màu xanh lá `#10b981` cùng thông điệp "🎉 Bạn đã được Miễn phí vận chuyển!".
  3. **Danh sách sản phẩm**: Ảnh vuông 64px bo góc, tên sản phẩm (cắt 2 dòng), phân loại (dung tích/màu), giá bán, bộ tăng giảm số lượng (− 1 +), nút xóa (thùng rác).
  4. **Kiểm tra tồn kho**: Bấm `+` vượt quá tồn kho thực tế sẽ rung nhẹ ô số lượng và báo dòng đỏ "Chỉ còn N sản phẩm trong kho".
  5. **Xác nhận xóa**: Bấm `−` khi số lượng = 1 hiển thị xác nhận nhanh "Xóa sản phẩm này?". Xóa có hiệu ứng mờ dần (200ms) kèm toast "Đã xóa sản phẩm" và nút **Hoàn tác** trong 5 giây.
  6. **Khối "Thường mua cùng" (Upsell)**: 2 gợi ý sản phẩm nhỏ kèm nút `+` thêm nhanh 1 chạm.
  7. **Chân drawer cố định**: Tạm tính, nút "Xem giỏ hàng đầy đủ" (outline) và nút "Thanh toán ngay" (solid black pill).
  8. **Trạng thái rỗng**: Hình minh họa túi mua sắm rỗng, nút "Khám phá sản phẩm ngay" và gợi ý 4 sản phẩm bán chạy nhất.

### 1.6 Popup Chọn Loại Da Lần Đầu (Skin Type Onboarding)
- **Điều kiện hiển thị**: Khách truy cập lần đầu sau 15 giây hoặc khi cuộn qua 50% Trang chủ; lưu trạng thái 30 ngày.
- **Nội dung**: "Làn da của bạn thuộc loại nào?" với 5 thẻ minh họa trực quan:
  - 💧 *Da Dầu (Oily)*: Tiết nhiều dầu, lỗ chân lông to, dễ lên mụn.
  - 🏜️ *Da Khô (Dry)*: Thiếu ẩm, sần sùi, dễ bong tróc và căng rát.
  - ⚖️ *Da Hỗn Hợp (Combination)*: Dầu vùng chữ T, khô hoặc bình thường ở 2 bên má.
  - 🌸 *Da Nhạy Cảm (Sensitive)*: Dễ ửng đỏ, châm chích khi đổi thời tiết/mỹ phẩm.
  - ✨ *Da Thường (Normal)*: Cân bằng ẩm dầu tốt, mịn màng, ít khuyết điểm.
- **Tương tác**: Bấm chọn 1 thẻ → Viền đậm, lưu ngay vào hồ sơ/trình duyệt, đóng popup, hiển thị toast xác nhận và Trang chủ tự động ưu tiên các sản phẩm tương thích.

### 1.7 Cookie Banner
- Thanh cố định mép dưới: *"Chúng tôi sử dụng cookie nhằm tối ưu hóa trải nghiệm mua sắm và đề xuất mỹ phẩm phù hợp."*
- Nút "Đồng ý tất cả", nút "Tùy chỉnh cookie", liên kết "Chính sách bảo mật".

### 1.8 Bong bóng Chat & Trợ lý Da Liễu AI (Floating Support Chat)
- Nút tròn 56px góc phải dưới với chấm xanh online.
- Bấm mở khung chat kích thước chuẩn 360×520px (toàn màn hình trên mobile).
- Tích hợp 4 nút trả lời nhanh: *Theo dõi đơn hàng*, *Tư vấn da với AI*, *Chính sách đổi trả*, *Gặp tư vấn viên*.
- Kết nối trực tiếp công nghệ RAG phân tích hoạt chất INCI theo bảng thành phần khoa học.

### 1.9 Toast, Modal & Skeleton Loading
- **Toast**: Góc trên bên phải (desktop) / giữa dưới (mobile), gồm 3 loại: Thành công (xanh), Cảnh báo (vàng), Lỗi (đỏ). Tự tắt sau 3.5 giây, xếp chồng tối đa 3 toast.
- **Modal**: Nền mờ `rgba(0,0,0,0.5)`, đóng bằng phím `Esc`, bấm ngoài hoặc nút X.
- **Skeleton**: Khối màu xám trung tính nhấp nháy ánh sáng (shimmer animation) mô phỏng chính xác khung thẻ sản phẩm, tiêu đề, nút bấm trong lúc tải API.

---

## 2. Trang chủ (Home Page)

- **Mục đích**: Khẳng định vị thế sàn mỹ phẩm chính hãng, truyền cảm hứng làm đẹp, cá nhân hóa danh mục theo loại da, đưa khách hàng tới sản phẩm mong muốn trong tối đa 2 lần bấm.
- **Điều kiện truy cập**: Mọi người dùng.
- **Các vùng giao diện theo thứ tự từ trên xuống**:
  1. **Vùng A – Banner chính (Hero Slider)**:
     - 3–5 slide chuyển đổi tự động mỗi 5 giây, tỷ lệ 16:6 (desktop), hỗ trợ ảnh 1:1 trên mobile.
     - Tiêu đề lớn, lời mô tả tinh tế, nút kêu gọi hành động dạng pill ("Mua ngay", "Khám phá bộ sưu tập").
     - Hỗ trợ tạm dừng khi hover, nút điều hướng mũi tên và chấm phân trang tròn.
  2. **Vùng B – Dải cam kết thương hiệu (USP Bar)**:
     - 4 thẻ ngang với biểu tượng: *100% Chính Hãng* · *Giao Siêu Tốc 2 Giờ* · *Đổi Trả 7 Ngày* · *Dược Sĩ Tư Vấn 8h–22h*. Bấm vào mở chi tiết chính sách.
  3. **Vùng C – Danh mục nổi bật**:
     - 8–10 khối tròn squircle kèm hình ảnh minh họa danh mục (Serum, Son môi, Chống nắng, Nước hoa...). Mobile hỗ trợ cuộn ngang snap.
  4. **Vùng D – Flash Sale Giờ Vàng**:
     - Tiêu đề "Flash Sale Giờ Vàng" + Đồng hồ đếm ngược thời gian thực (Giờ : Phút : Giây), nhãn khung giờ (12:00 – 14:00), liên kết "Xem tất cả".
     - Hàng thẻ sản phẩm có thanh tiến độ "Đã bán 36/50" và nhãn giảm giá `-35%`.
     - Tự động khóa mua và đổi nhãn "Đã hết hàng" khi tiến độ đạt 100%.
  5. **Vùng E – Sản phẩm theo Tab (Cá nhân hóa)**:
     - 3 tab: *Mới Về* · *Bán Chạy Nhất* · *Dành Riêng Cho Da Bạn (Personalized)*.
     - Lưới 4×2 (desktop) hoặc 2×4 (mobile) kèm nút "Xem thêm sản phẩm".
  6. **Vùng F – Marquee Thương hiệu Chính Hãng**:
     - Dải logo đối tác chính hãng (Innisfree, La Roche-Posay, Cosrx, CeraVe, Kiehl's, Laneige...) trượt ngang liên tục không gián đoạn, tạm dừng khi rê chuột.
  7. **Vùng G – Banner Routine Quiz**:
     - Khối thông điệp nổi bật: *"Tìm Routine chuẩn khoa học cho làn da của bạn chỉ trong 1 phút"* + Nút "Làm bài trắc nghiệm ngay".
  8. **Vùng H – Bộ sưu tập & Combo tiết kiệm**:
     - Thẻ combo thông minh (ví dụ: Bộ 4 bước sạch sâu trị mụn) với mức tiết kiệm rõ ràng ("Tiết kiệm 20% so với mua lẻ").
  9. **Vùng I – Cẩm nang làm đẹp & Kiến thức Skincare**:
     - 3 bài viết chuyên gia với hình ảnh, chuyên mục, thời gian đọc và ngày đăng.
  10. **Vùng J – Feed Khách hàng & Ảnh thật Feedback**:
      - Carousel ảnh đánh giá thực tế từ người dùng, kèm số sao và trích dẫn cảm nhận. Bấm mở modal xem lớn kèm nút "Xem sản phẩm trong ảnh".
  11. **Vùng K – Khối Đăng ký nhận bản tin & Ưu đãi thành viên**.

---

## 3. Danh mục & Danh sách sản phẩm (Catalog & Category Page)

- **Mục đích**: Hỗ trợ khách lọc nhanh từ hàng nghìn mã mỹ phẩm xuống sản phẩm phù hợp nhất với loại da, ngân sách và nhu cầu.
- **Bố cục**:
  1. **Breadcrumb**: `Trang chủ > Chăm sóc da > Serum & Tinh chất`.
  2. **Banner danh mục**: Ảnh đại diện + Tiêu đề H1 + Đoạn giới thiệu chuẩn SEO có nút "Xem thêm / Thu gọn".
  3. **Hàng chip danh mục con**: Cuộn ngang các danh mục con (Toner, Serum, Kem dưỡng, Dầu dưỡng).
  4. **Thanh công cụ Toolbar**:
     - Bên trái: Số lượng sản phẩm hiển thị (*Hiển thị 1–24 trên 312 sản phẩm*).
     - Bên phải: Dropdown sắp xếp (Phổ biến nhất, Mới nhất, Bán chạy, Giá tăng dần, Giá giảm dần, Đánh giá cao nhất) + Bộ chuyển đổi hiển thị (Lưới 4 cột / 3 cột / Danh sách ngang).
     - Mobile: Hai nút "Bộ Lọc" và "Sắp Xếp" dính cố định khi cuộn.
  5. **Thanh Sidebar lọc chi tiết (Desktop rộng 260px) & Bottom Sheet (Mobile 90% chiều cao)**:
     - *Thương hiệu*: Checkbox nhiều lựa chọn + ô tìm nhanh thương hiệu.
     - *Khoảng giá*: Thanh trượt kéo 2 đầu + 2 ô nhập số tiền + nút chọn nhanh (< 200k, 200k–500k, 500k–1tr, > 1tr).
     - *Loại da phù hợp*: Da dầu, Da khô, Da hỗn hợp, Da nhạy cảm, Da thường.
     - *Vấn đề da / Công dụng (Chips)*: Mụn, Thâm nám, Lão hóa, Lỗ chân lông to, Phục hồi, Dưỡng trắng, Chống nắng.
     - *Dung tích*: Mini size (< 30ml), Full size (30–100ml), Jumbo (> 100ml).
     - *Đánh giá sao*: Radio từ 4 sao trở lên, từ 3 sao trở lên.
     - *Xuất xứ*: Hàn Quốc, Nhật Bản, Pháp, Mỹ, Việt Nam.
     - *Trạng thái kho*: Công tắc "Chỉ hiện sản phẩm còn hàng", "Đang có khuyến mãi".
  6. **Dòng chip bộ lọc đang áp dụng**:
     - Hiển thị danh sách tag đã chọn (ví dụ: `Da dầu ✕`, `Dưới 500k ✕`, `Innisfree ✕`) kèm nút "Xóa tất cả".
  7. **Thẻ sản phẩm chuẩn mực (Product Card)**:
     - Ảnh tỷ lệ 1:1, hover đổi sang ảnh thứ 2 (desktop).
     - Badge góc trái: `-30%`, `Mới`, `Bán chạy`, `Chính hãng`.
     - Nút trái tim Yêu thích góc phải trên (có hiệu ứng nhịp tim khi bấm).
     - Tên thương hiệu in hoa nhỏ phía trên tên sản phẩm.
     - Tên sản phẩm tối đa 2 dòng, cắt đuôi `...` nếu quá dài.
     - Giá bán đậm, giá niêm yết gạch ngang, hiển thị "Từ ... đ" nếu nhiều phân loại.
     - Đánh giá sao vàng (4.8 ★) + số lượt nhận xét + số lượng "Đã bán 2.4k".
     - **Hover Actions (Desktop)**: Hiện 2 nút mờ trượt lên gồm "Xem nhanh" (Quick view modal) và "Thêm vào giỏ".
     - **Mobile**: Nút tròn `+` cố định góc dưới ảnh để thao tác nhanh.
     - **Hết hàng**: Ảnh phủ mờ xám, nhãn "Hết hàng", nút đổi thành "Báo khi có hàng".

---

## 4. Tìm kiếm & Gợi ý thông minh (Search & Autocomplete)

### 4.1 Ô tìm kiếm & Dropdown gợi ý
- Khi bấm vào ô tìm kiếm (chưa gõ chữ):
  - Nhóm **Tìm kiếm gần đây**: Tối đa 5 từ khóa đã tìm, có nút xóa từng mục và "Xóa lịch sử".
  - Nhóm **Xu hướng làm đẹp hot**: 6–8 từ khóa được tìm nhiều nhất (Son dưỡng có màu, Kem chống nắng kiềm dầu, Niacinamide 10%, Serum B5...).
- Khi gõ từ 2 ký tự trở lên (độ trễ gõ 250ms):
  - *Từ khóa đề xuất*: In đậm phần ký tự trùng khớp.
  - *Sản phẩm khớp nhanh*: 3–5 sản phẩm có ảnh nhỏ 40px, tên và giá bán.
  - *Thương hiệu & Danh mục gợi ý*: Dạng chip chọn nhanh.
  - Hỗ trợ gõ không dấu (*"kem chong nang"* tự hiểu *"kem chống nắng"*), sửa lỗi chính tả nhẹ.

### 4.2 Trang kết quả tìm kiếm (Search Results Page)
- Thanh tiêu đề: *"Kết quả tìm kiếm cho: '[từ khóa]' – Tìm thấy 48 sản phẩm"*.
- Tab phân loại kết quả: **Sản phẩm (48)** · **Bài viết làm đẹp (5)** · **Thương hiệu (2)**.
- Khi không có kết quả: Hiển thị minh họa kính lúp, câu gợi ý kiểm tra chính tả/dùng từ khóa ngắn hơn, danh mục phổ biến và danh sách sản phẩm bán chạy nhất sàn.

---

## 5. Chi tiết sản phẩm (Product Detail Page - PDP)

- **Mục đích**: Trang quyết định mua hàng cốt lõi; giải đáp trọn vẹn 5 câu hỏi của khách hàng: *Đây là gì? Hợp với da tôi không? Có chính hãng không? Giá và giao hàng thế nào? Người dùng khác nhận xét ra sao?*
- **Bố cục Desktop**: 2 cột chính (Cột trái 55% Gallery ảnh/video; Cột phải 45% Khối mua hàng dính cố định khi cuộn qua các tab nội dung dài).
- **Thành phần chi tiết**:
  1. **Gallery ảnh đa năng**:
     - Ảnh lớn tỉ lệ 1:1 độ phân giải cao; rê chuột hiển thị vùng phóng đại kính lúp (Zoom Lens 2×).
     - Bấm vào ảnh mở Lightbox toàn màn hình duyệt ảnh chất lượng gốc với phím mũi tên và Esc.
     - Dải thumbnail bên dưới có hỗ trợ video giới thiệu và swatch màu.
  2. **Khối thông tin mua hàng**:
     - Thương hiệu (link đến trang hãng) kèm huy hiệu khiên bảo vệ **Chính hãng 100%**.
     - Tiêu đề sản phẩm H1.
     - Đánh giá sao tổng quan (4.8 ★ · 214 đánh giá · Đã bán 3.2k). Bấm vào tự cuộn mượt xuống khối Đánh giá.
     - Khối giá: Giá bán nổi bật, giá gốc gạch ngang, badge giảm giá, thông báo số tiền tiết kiệm.
     - Flash sale box (nếu đang diễn ra): Nền nổi bật, đồng hồ đếm ngược, thanh tiến độ bán lẻ.
     - Mô tả tóm tắt 3–5 công dụng vượt trội.
     - **Chọn phân loại**:
       - Bảng màu: Ô tròn swatch màu 32px chuẩn sắc, viền đậm và tích chọn khi active, hiển thị tên mã màu. Phân loại hết hàng gạch chéo mờ.
       - Dung tích: Nút pill (30ml, 50ml, 100ml...).
       - Liên kết "Hướng dẫn chọn màu / Routine da".
     - **Bộ chọn số lượng**: `−` Ô nhập `+`, tự động khống chế tối đa theo tồn kho thực tế.
     - **Tình trạng kho**: "Còn hàng" (xanh), "Sắp hết: còn 3 sản phẩm" (cam), "Hết hàng" (đỏ).
     - **Hành động mua**:
       - Nút "Thêm vào giỏ" (outline pill): Hiệu ứng ảnh bay vào giỏ + tự động bật Mini-cart.
       - Nút "Mua ngay" (solid black pill): Chuyển thẳng trang Thanh toán với giỏ hàng tức thời.
       - Nút Yêu thích (tim) và nút So sánh sản phẩm.
     - **Ước tính giao hàng & Phí ship**: Chọn nhanh Tỉnh/Thành phố để xem ngày giao dự kiến và phí vận chuyển.
     - **Ưu đãi Voucher**: Thẻ voucher áp dụng cho sản phẩm kèm nút "Lưu mã".
     - **Cam kết vàng**: Chính hãng 100% · Đổi trả 7 ngày · Hoàn tiền 200% nếu giả · Kiểm tra hàng trước khi nhận.
  3. **Thanh Tab dính bên dưới**:
     - *Mô tả sản phẩm*: Bài viết chi tiết, hình ảnh minh họa thực tế, nút "Xem thêm / Thu gọn".
     - *Thông số kỹ thuật*: Bảng 2 cột (Thương hiệu, Xuất xứ, Dung tích, Loại da phù hợp, Hạn sử dụng, Số công bố mỹ phẩm CBMP, Nhà sản xuất).
     - *Thành phần chi tiết (INCI)*: Danh sách thành phần chuẩn quốc tế. **Điểm nhấn vượt trội**: Các hoạt chất vàng (Niacinamide, BHA, Hyaluronic Acid, Centella...) được làm nổi bật dạng chip; bấm vào hiển thị Popover giải thích công dụng khoa học, mức độ kích ứng và bít tắc lỗ chân lông (Comedogenic Rating 0–5).
     - *Hướng dẫn sử dụng & Routine*: Các bước thực hiện theo chu trình sáng/tối kèm lưu ý test da dị ứng.
     - *Chính sách giao hàng & đổi trả*.
     - *Khối Đánh giá người dùng*:
       - Điểm trung bình (4.8/5), 5 thanh phân bố sao, tỉ lệ hài lòng 96%.
       - Bộ lọc nhận xét: Có hình ảnh, Đã mua hàng, Lọc theo loại da người dùng (ví dụ: chỉ xem đánh giá từ người có da dầu mụn).
       - Thẻ đánh giá hiển thị tên ẩn danh, loại da, số sao, ngày mua, ảnh/video thật, nút "Hữu ích (n)" và phản hồi chính thức từ gian hàng.
     - *Khối Hỏi đáp (Q&A)*: Nơi khách hỏi và chuyên viên/gian hàng giải đáp trực tiếp.
     - *Khối "Thường được mua cùng" (Combo)*: Tích hợp 2–3 món bổ trợ nhau với nút "Thêm cả bộ vào giỏ".
     - *Khối "Sản phẩm liên quan" và "Đã xem gần đây"*.
  4. **Thanh hành động cố định Mobile (Bottom Sticky Bar)**:
     - Gồm 4 nút: Yêu thích | Chat tư vấn | Thêm giỏ | Mua ngay.
     - Bấm Thêm giỏ / Mua ngay khi chưa chọn phân loại sẽ trượt Bottom sheet chọn màu/dung tích nhanh.

---

## 6. Xem nhanh sản phẩm (Quick View Modal)

- **Kích hoạt**: Bấm nút "Xem nhanh" trên thẻ sản phẩm ở Trang chủ, Danh mục, Tìm kiếm hoặc Yêu thích.
- **Kích thước**: Modal giữa màn hình rộng 880px (Mobile chuyển thành Bottom sheet 90%).
- **Nội dung**: Gallery ảnh rút gọn, tên, thương hiệu, giá bán, chọn phân loại, bộ chọn số lượng, nút "Thêm vào giỏ hàng" và liên kết "Xem chi tiết đầy đủ".
- **Tiện ích**: Nút mũi tên chuyển nhanh sang sản phẩm kế tiếp/trước đó trong danh sách mà không cần đóng modal.

---

## 7. So sánh sản phẩm (Product Comparison)

- **Cơ chế**: Bấm nút "So sánh" trên thẻ sản phẩm hoặc trang chi tiết (tối đa 4 sản phẩm).
- **Thanh so sánh cố định đáy màn hình**: Xuất hiện khi có ≥ 1 sản phẩm; hiển thị ảnh đại diện thu nhỏ, số lượng đã chọn, nút "So sánh ngay" và "Xóa tất cả".
- **Trang / Modal Bảng so sánh chi tiết**:
  - Hàng tiêu đề cố định: Ảnh sản phẩm, tên, giá bán và nút "Thêm vào giỏ".
  - Các hàng tiêu chí đối chiếu: Thương hiệu, Xuất xứ, Dung tích, Loại da khuyên dùng, Vấn đề da khắc phục, Hoạt chất chính (INCI), Chỉ số bít tắc lỗ chân lông, Hạn sử dụng.
  - Công tắc **"Chỉ hiển thị điểm khác nhau"**: Tự động ẩn các thuộc tính giống nhau để khách dễ ra quyết định.

---

## 8. Đã xem gần đây (Recently Viewed)

- Băng chuyền carousel hiển thị tối đa 10 sản phẩm người dùng vừa truy cập.
- Tự động đồng bộ vào tài khoản khi đăng nhập, có nút "Xóa lịch sử xem".

---

## 9. Bộ sưu tập & Combo sản phẩm (Bundles / Combos)

- **Danh sách Combo**: Hiển thị các gói giải pháp theo liệu trình (ví dụ: *Routine 4 bước phục hồi da treatment*).
- **Tùy biến Combo**: Cho phép khách chọn phân loại (dung tích, màu son) cho từng món trong bộ; tổng giá và mức tiết kiệm cập nhật theo thời gian thực.
- **Thao tác 1 chạm**: Nút "Thêm cả bộ vào giỏ" thêm đồng thời tất cả các sản phẩm và áp dụng chiết khấu combo tự động.

---

## 10. Giỏ hàng đầy đủ (Full Cart Page)

- **Mục đích**: Rà soát đơn hàng, áp dụng voucher mã giảm giá, kiểm tra phí ship và tiến hành thanh toán.
- **Bố cục Desktop**:
  - **Cột trái (65%) – Danh sách sản phẩm**:
    - Checkbox "Chọn tất cả" và checkbox từng sản phẩm (chỉ những dòng được tích mới tính tiền).
    - Mỗi dòng: Ảnh, tên sản phẩm, liên kết đổi phân loại nhanh, đơn giá (kèm giá gốc gạch ngang), bộ tăng giảm số lượng, thành tiền, nút Xóa, nút "Lưu vào danh sách Yêu thích".
    - Xóa có thông báo hoàn tác trong 5 giây.
    - Cảnh báo rõ ràng nếu có sản phẩm đổi giá hoặc hết hàng trong kho.
  - **Cột phải (35%) – Tóm tắt đơn hàng (Dính cố định khi cuộn)**:
    - Bảng chi tiết: Tạm tính, Tiền giảm từ khuyến mãi, Giảm giá voucher, Ước tính phí vận chuyển, **Tổng thanh toán (Đã bao gồm VAT)**.
    - Khối tích điểm thưởng: *"Bạn sẽ nhận được 350 điểm thưởng sau đơn hàng này"*.
    - Ô nhập mã Voucher + nút "Áp dụng", kèm liên kết mở **Drawer danh sách Voucher**:
      - Phân tách rõ ràng: *Voucher đủ điều kiện dùng ngay* và *Voucher chưa đủ điều kiện* (nêu rõ lý do: *"Hãy mua thêm 50.000đ để áp dụng"*).
    - Thanh tiến độ Miễn phí vận chuyển.
    - Ô ghi chú đơn hàng gửi cho người bán (tối đa 200 ký tự).
    - Nút lớn "Tiến hành Thanh toán" (khóa nếu chưa tích chọn sản phẩm nào).

---

## 11. Quy trình Thanh toán (3-Step Checkout Flow)

- **Mục đích**: Tối ưu chuyển đổi, hạn chế tối đa xao nhãng (Header rút gọn không mega menu, chỉ có logo, số hotline và biểu tượng thanh toán an toàn 100% SSL).
- **Thanh tiến trình 3 bước trực quan**:
  `① Thông tin giao hàng` → `② Vận chuyển & Thanh toán` → `③ Xác nhận đơn hàng`

### 11.1 Bước 1 – Thông tin giao hàng
- Khách vãng lai: Tùy chọn "Mua hàng không cần đăng ký" hoặc "Đăng nhập nhanh".
- Thành viên: Danh sách sổ địa chỉ đã lưu (chọn bằng radio), nút "Thêm địa chỉ mới".
- Form nhập địa chỉ với cơ chế kiểm tra lỗi thời gian thực (Real-time Validation):
  - Họ và tên: Bắt buộc, không chứa số.
  - Số điện thoại: Đúng 10 số chuẩn Việt Nam (đầu 03, 05, 07, 08, 09).
  - Tỉnh/Thành phố, Quận/Huyện, Phường/Xã: Danh mục chọn chuẩn hành chính 3 cấp.
  - Địa chỉ chi tiết: Số nhà, tên đường, tòa nhà.
  - Loại địa chỉ: Nhà riêng / Văn phòng.
  - Tùy chọn **Xuất hóa đơn VAT cho doanh nghiệp**: Mở form nhập Tên công ty, Mã số thuế (10 hoặc 13 số), Địa chỉ và Email nhận hóa đơn điện tử.

### 11.2 Bước 2 – Phương thức vận chuyển & Thanh toán
- **Phương thức vận chuyển**:
  - Giao Hàng Tiêu Chuẩn (2–4 ngày, cước tiêu chuẩn).
  - Giao Hàng Nhanh (1–2 ngày).
  - Giao Siêu Tốc 2 Giờ (Nội thành Hà Nội & TP. HCM).
  - Nhận hàng tại cửa hàng (Click & Collect).
- **Phương thức thanh toán**:
  - 💵 *Thanh toán khi nhận hàng (COD)*: Kiểm tra hàng trước khi thanh toán.
  - 📱 *Chuyển khoản Ngân hàng qua mã VietQR tự động*: Tạo mã QR thanh toán tức thời, nội dung chuyển tiền duy nhất, đồng hồ giữ đơn 30 phút.
  - 💳 *Thẻ ATM nội địa / Thẻ quốc tế Visa, Master*: Cổng thanh toán bảo mật PCI-DSS.
  - 👛 *Ví điện tử MoMo, VNPay, ZaloPay*.
  - 🎁 *Sử dụng Điểm thưởng thành viên*: Trừ trực tiếp vào đơn hàng.

### 11.3 Bước 3 – Xác nhận & Đặt hàng
- Xem lại tóm tắt thông tin người nhận, đơn vị vận chuyển, phương thức thanh toán (mỗi mục đều có nút "Sửa" quay lại nhanh).
- Bảng tổng tiền chi tiết minh bạch.
- Hộp kiểm bắt buộc: *"Tôi đã đọc và đồng ý với Điều khoản dịch vụ và Chính sách bảo vệ dữ liệu"*.
- Nút "Xác nhận Đặt hàng": Chống nhấn đúp (double-click protection), hiển thị spinner xoay và khóa nút trong thời gian xử lý giao dịch.

---

## 12. Kết quả Đặt hàng (Order Result)

- **Trường hợp thành công**:
  - Biểu tượng tích xanh động ăn mừng, tiêu đề *"Đặt hàng thành công!"*.
  - Mã đơn hàng nổi bật kèm nút sao chép 1 chạm.
  - Thông báo email xác nhận đã được gửi đến hòm thư khách hàng.
  - **Với đơn thanh toán VietQR**: Hiển thị hình ảnh mã QR động, Tên ngân hàng, Số tài khoản thụ hưởng, Tên chủ tài khoản, Số tiền chính xác và Nội dung chuyển khoản chuẩn hóa. Kèm đồng hồ đếm ngược 30 phút giữ hàng.
  - Nút "Theo dõi đơn hàng" và nút "Tiếp tục mua sắm".
  - Thẻ mời đăng ký tài khoản nhanh cho khách vãng lai (chỉ cần nhập mật khẩu, tự động lưu thông tin vừa mua).
- **Trường hợp thất bại**: Thông báo lỗi cụ thể (thẻ bị từ chối, hết thời gian thanh toán...) kèm nút "Thử thanh toán lại" hoặc "Đổi phương thức thanh toán".

---

## 13. Tra cứu đơn hàng không cần đăng nhập (Order Tracking)

- **Giao diện tra cứu công khai**:
  - Form nhập gồm 2 trường: **Mã đơn hàng** (ví dụ: `ORD-982341`) và **Số điện thoại đặt hàng**.
  - Nút "Tra cứu đơn hàng". Cơ chế chống brute-force giới hạn 5 lần thử/10 phút.
- **Kết quả hiển thị**:
  - **Dòng thời gian dọc trực quan (Vertical Status Timeline)** gồm 6 mốc:
    `Đặt hàng thành công` → `Gian hàng xác nhận` → `Đang đóng gói` → `Đã bàn giao vận chuyển` → `Đang giao hàng` → `Đã giao thành công`.
  - Mốc hiện tại được phát sáng nhấp nháy nhẹ.
  - Mã vận đơn chuyển phát kèm liên kết kiểm tra trên website nhà vận chuyển.
  - Danh sách sản phẩm trong đơn, địa chỉ nhận hàng (đã ẩn bớt số điện thoại vì lý do bảo mật).
  - Nút "Hủy đơn hàng" (chỉ khả dụng khi đơn chưa chuyển sang trạng thái bàn giao vận chuyển).
  - Nút "Liên hệ hỗ trợ" mở nhanh hộp chat kèm mã đơn tự động điền sẵn.

---

## 14. Kiến trúc thực thi Kỹ thuật & Responsive (Technical Architecture)

- **Công nghệ**: React 18, Vite 5, Vanilla CSS Design System Tokens, Lucide Icons, Fetch API với chế độ Fallback Mock thông minh.
- **Mã nguồn sạch & Module hóa**:
  - `Navbar.jsx`: Header đa năng, Announcement bar, Sticky state, Mega menu, Search dropdown.
  - `HomeView.jsx`: Trang chủ chuẩn 11 vùng A–K.
  - `CatalogView.jsx`: Danh mục, Bộ lọc sidebar đa năng, Thẻ sản phẩm.
  - `ProductDetailView.jsx`: Chi tiết sản phẩm, Zoom lens, Phân loại, INCI popover, Đánh giá, FAQ.
  - `MiniCartDrawer.jsx`: Drawer giỏ hàng trượt, Free ship progress, Upsell.
  - `CartView.jsx`: Trang giỏ hàng đầy đủ, Voucher drawer.
  - `CheckoutView.jsx`: 3-step checkout, Validation, QR banking.
  - `OrderResultView.jsx` & `OrderTrackingView.jsx`: Kết quả và tra cứu đơn hàng.
  - `QuickViewModal.jsx` & `CompareDrawerAndModal.jsx`: Xem nhanh và So sánh.
  - `SkinTypePopup.jsx` & `CookieBanner.jsx`: Onboarding da liễu và quyền riêng tư.
  - `SupportChat.jsx`: Hộp chat CSKH kết hợp RAG AI Advisor da liễu.
