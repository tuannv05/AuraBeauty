# 🎨 FRONTEND AGENTS CONSTITUTION (AURA BEAUTY MALL)

> **Phạm vi:** `/frontend/` | React 18 + Vite 5 + Tailwind CSS | Port: 3000

## 1. RANH GIỚI BẤT KHẢ XÂM PHẠM
- **Chỉ phụ trách:** Giao diện người dùng (UI/UX), quản lý state hiển thị, gọi API qua Gateway `http://localhost:8080`.
- **CẤM TUYỆT ĐỐI:** Truy vấn trực tiếp cơ sở dữ liệu; xử lý nghiệp vụ tiền tệ, hạch toán, hoặc quyết định quyền hạn tại client; lưu trữ khóa bí mật (`SECRET_KEY`) trong source code hoặc `.env.client`.

## 2. TIÊU CHUẨN GIAO DIỆN (UI/UX EXCELLENCE)
- Mọi màn hình/component có dữ liệu phải đủ 4 trạng thái:
  1. `Loading`: Skeleton hoặc Spinner mềm mại, không layout shift.
  2. `Empty`: Biểu tượng, thông điệp rõ ràng, nút CTA lịch sự.
  3. `Error`: Báo lỗi tiếng Việt thân thiện, không in raw stack trace, có nút "Thử lại".
  4. `Data`: Căn chỉnh padding, gap thoáng đãng, hierarchy rõ nét.
- Nút bấm gọi API (Submit, Checkout, Mua ngay) tự động `disabled` + spinner chống double-submit.
- Thao tác phá hủy (Xóa, Hủy đơn, Khóa) bắt buộc có Confirm Modal giải thích hậu quả.
- Cam kết **Zero Blank-Screen**: Sub-menus luôn có dữ liệu fallback dự phòng từ `submenuCatalogMapper`.

## 3. CẤU TRÚC THƯ MỤC
- `src/components/`: UI Components nguyên tử dùng chung & Animate UI tokens (`ui/`).
- `src/features/`: Module tính năng độc lập (`vto/`, `auth/`, `catalog/`, `cart/`, `checkout/`, `ai-advisor/`, `skin-profile/`).
- `src/pages/`: Các màn hình trung tâm đa phân khu (`BuyerZone`, `SellerZone`, `AdminZone`).
- `src/lib/`: Tiện ích chung (`utils.js`, `submenuCatalogMapper.js`).
