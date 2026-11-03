# MINI-RULE: FRONTEND UI/UX EXCELLENCE
> **Phạm vi:** `/frontend/` | React 18, Vite 5, Tailwind CSS | Port: 3000

## 1. NGUYÊN TẮC CỐT LÕI
- 4 trạng thái bắt buộc: `Loading` (Skeleton/Spinner), `Empty` (CTA), `Error` (tiếng Việt + Thử lại), `Data`.
- Chống double-submit: Nút bấm gọi API tự động `disabled` + spinner.
- Thao tác phá hủy (Xóa, Hủy đơn): Bắt buộc có Confirm Modal giải thích hậu quả.
- Cam kết **Zero Blank-Screen**: Mega Menu 51 sub-menus luôn có dữ liệu fallback từ `submenuCatalogMapper`.

## 2. VÙNG BẤT KHẢ XÂM PHẠM
- Cổng `server.port: 3000` và cấu hình proxy `/api` trỏ về Gateway `8080` trong `vite.config.js`.
- Cấu hình alias `@` trỏ vào `./src` trong `vite.config.js` và `jsconfig.json`.
- Không gọi trực tiếp database từ client; không lưu trữ secret keys.

## 3. LỆNH KIỂM CHỨNG
```bash
cd frontend
npm run build
```
