# DANH SÁCH CÔNG VIỆC THỰC THI (TASKS): LUMELLE WHOLESALE DASHBOARD

- [ ] **Task 1: Tạo Component `WholesaleDashboard.jsx` chuẩn phong cách Lumelle**
  - Kính mờ iPhone (Frosted Glass), đổ bóng, viền mờ `backdrop-blur-xl`.
  - Channel Switcher trượt với `framer-motion`.
  - 4 Thẻ KPI kính mờ cao cấp.
  - Interactive Pipeline Board 5 chặng (Inquiry -> Approved -> Fulfillment -> Invoiced -> Delivered).
  - Bảng Giá Sỉ Bậc Thang (Tier Matrix) & Danh bạ Đại lý B2B.
  - Modal tạo đơn hàng sỉ mới.
  - Verify: Component export đầy đủ, không syntax error.

- [ ] **Task 2: Tích hợp `WholesaleDashboard` vào `SellerZone.jsx`**
  - Thêm tab `wholesale` vào sidebar và thêm Channel Switcher Lumelle ở top bar.
  - Verify: Click chuyển tab hoạt động mượt mà, chuyển đổi giữa B2C và Wholesale tức thì.

- [ ] **Task 3: Cập nhật `useBrowserHistorySync.js` hỗ trợ direct hash / route**
  - Xử lý hash `#/channels/wholesale` và URL param `tab=wholesale`.
  - Verify: Truy cập `#/channels/wholesale` kích hoạt đúng tab Wholesale.

- [ ] **Task 4: Kiểm thử hội tụ và xây dựng Frontend (`npm run build`)**
  - Chạy `npm --prefix frontend run build` kiểm tra 0 lỗi biên dịch.
  - Verify: Build thành công 100%.

- [ ] **Task 5: Khởi động Dev Server & Kiểm tra Clean Root**
  - Khởi chạy Vite dev server trên port 3000.
  - Xác nhận Root sạch sẽ, không có file rác.
