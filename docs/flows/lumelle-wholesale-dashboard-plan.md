# KẾ HOẠCH THIẾT KẾ KỸ THUẬT: LUMELLE WHOLESALE CHANNEL DASHBOARD
> **Mã quy trình**: `QT-09` | **Trạng thái**: READY FOR IMPLEMENTATION

---

## 1. KIẾN TRÚC & CÔNG NGHỆ ÁP DỤNG
- **Frontend Framework**: React 18 + Vite 5 + Tailwind CSS v3.
- **Animation Engine**: `framer-motion` (Spring transitions, layout animations cho Channel Switcher & Pipeline Board).
- **Icons**: `lucide-react` (Building2, ShoppingCart, DollarSign, ArrowRightLeft, FileSpreadsheet, CheckCircle2, Clock, Sparkles).
- **Styling Architecture**: Luxury Glassmorphism
  - Lớp kính: `backdrop-blur-xl bg-white/75 dark:bg-slate-900/80 border border-white/40 shadow-xl shadow-slate-900/[0.03]`
  - Hiệu ứng phát quang mờ: Radial gradient ánh kim nhẹ đằng sau container chính.
  - Phím bấm đàn hồi (Spring button micro-interactions).

---

## 2. DANH SÁCH FILE CAN THIỆP PHẪU THUẬT (SURGICAL CHANGES)
1. **`frontend/src/components/WholesaleDashboard.jsx` (FILE MỚI)**:
   - Toàn bộ linh hồn của Lumelle Wholesale Dashboard.
   - Chứa Channel Switcher [Online | Retail | Wholesale].
   - 4 Thẻ KPI kính mờ cao cấp với micro-charts và so sánh chu kỳ.
   - Wholesale Pipeline Board (Kanban 5 cột) tương tác mượt mà kéo thả / click chuyển trạng thái.
   - Wholesale Catalog Matrix: Bảng giá sỉ bậc thang (Tier 1/2/3) kèm MOQ.
   - B2B Partner Directory & Credit Terms (Quản lý đại lý, hạn mức công nợ).
   - Modal tạo đơn hàng sỉ mới với bộ tính toán chiết khấu tự động.
   - Đủ 4 trạng thái: Loading Skeleton, Empty State, Error Fallback, Data View.
2. **`frontend/src/components/SellerZone.jsx`**:
   - Thêm tab `wholesale` vào danh sách điều hướng.
   - Bổ sung thanh Channel Switcher phong cách Lumelle ở đầu trang Seller.
   - Render `WholesaleDashboard` khi `activeTab === 'wholesale'` hoặc khi chọn kênh Wholesale.
3. **`frontend/src/hooks/useBrowserHistorySync.js`**:
   - Hỗ trợ bắt URL hash `#/channels/wholesale` hoặc param `?tab=wholesale` để nhảy thẳng vào kênh Wholesale.
4. **`frontend/src/App.jsx`**:
   - Đảm bảo quyền truy cập và đồng bộ route.
