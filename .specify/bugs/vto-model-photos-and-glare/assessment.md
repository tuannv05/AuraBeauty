# 🔍 BÁO CÁO CHẨN ĐOÁN NGUYÊN NHÂN GỐC RỄ (ROOT CAUSE ANALYSIS)
## TÍNH NĂNG: AURA VIRTUAL TRY-ON (VTO)
**Mã lỗi (Slug)**: `vto-model-photos-and-glare`  
**Ngày lập**: 05/11/2026 | **Trạng thái**: Đã khoanh vùng nguyên nhân (Diagnosed)  
**Tiêu chuẩn thực thi**: Spec Kit Bug Assessment Protocol & Think Before Coding  

---

## 1. MÔ TẢ TRIỆU CHỨNG & BỐI CẢNH
Người dùng phản ánh 3 vấn đề thị giác nghiêm trọng khi trải nghiệm thử trang điểm ảo trên modal `Aura Virtual Try-On`:
1. **Mẫu ảnh 2 và 3 quá nhỏ, không cận mặt**: Khuôn mặt của Mẫu 2 (Fair) và Mẫu 3 (Medium) bị thụt lùi ra xa, không cận cảnh so với Mẫu 1 (Warm), khiến vùng môi quá nhỏ và khó quan sát.
2. **Chất lượng hiển thị ảnh kém, nhòe mờ màu son**: Khi chọn Mẫu 2, 3 hoặc khi phóng to cận môi (Macro View), hình ảnh bị vỡ hạt (pixelated) và mờ, làm sai lệch sắc độ của sản phẩm son thật.
3. **Các đốm sáng trắng loang lổ trên môi**: Khi thử son (đặc biệt các dòng Satin, Glossy, hoặc Velvet), trên bề mặt môi xuất hiện hàng loạt đốm/chấm tròn màu trắng nhân tạo làm mất màu son gốc.

---

## 2. ĐỊNH VỊ NGUỒN GỐC LỖI TRONG MÃ NGUỒN (CODE CITATIONS)

| STT | Thành phần lỗi | Tệp tin | Vị trí dòng | Trách nhiệm mã nguồn |
| :---: | :--- | :--- | :--- | :--- |
| **1** | Mẫu ảnh 2 & 3 chụp góc quá xa | `frontend/public/models/model2_fair.jpg`<br>`frontend/public/models/model3_medium.jpg` | File nhị phân | Ảnh gốc 500x500px nhưng khuôn mặt chỉ chiếm 26.6% diện tích, vùng môi chỉ vỏn vẹn 44px. |
| **2** | Tỉ lệ Landmark mẫu 2 & 3 lệch xa | `frontend/src/features/vto/presetLandmarks.json` | Key: `model2_fair.jpg`<br>Key: `model3_medium.jpg` | Tọa độ chuẩn hóa `x, y` của 478 mốc khuôn mặt bị co cụm ở trung tâm ảnh. |
| **3** | Cấu hình Preset Models | `frontend/src/features/vto/VirtualTryOnModal.jsx` | [L26-L57](file:///d:/A_javaFW/WebBanMP/frontend/src/features/vto/VirtualTryOnModal.jsx#L26-L57) | Cấu hình 3 model mẫu nhưng không chuẩn hóa cự ly chụp cận mặt đồng nhất. |
| **4** | Vẽ 13 đốm sáng tròn trắng tinh | `frontend/src/features/vto/vtoEngine.js` | [L324-L372](file:///d:/A_javaFW/WebBanMP/frontend/src/features/vto/vtoEngine.js#L324-L372) | Dùng vòng lặp `forEach` vẽ 13 hình tròn gradient trắng `rgba(255,255,255,0.95)` đè lên môi. |
| **5** | Danh sách điểm bắt sáng rời rạc | `frontend/src/features/vto/faceLandmarks.js` | [L15-L19](file:///d:/A_javaFW/WebBanMP/frontend/src/features/vto/faceLandmarks.js#L15-L19) | `UPPER_LIP_HIGHLIGHTS` (8 điểm) và `LOWER_LIP_HIGHLIGHTS` (5 điểm) gồm cả điểm trong lòng môi. |
| **6** | Hạt nhũ Shimmer trắng nhân tạo | `frontend/src/features/vto/vtoEngine.js` | [L375-L405](file:///d:/A_javaFW/WebBanMP/frontend/src/features/vto/vtoEngine.js#L375-L405) | Tiếp tục vẽ các chấm tròn hạt nhũ đè lên 13 điểm trên với màu trắng/vàng. |

---

## 3. PHÂN TÍCH NGUYÊN NHÂN GỐC RỄ CHI TIẾT (ROOT CAUSE ANALYSIS)

### 📌 Nguyên nhân 1: Tỉ lệ khuôn mặt giữa các ảnh mẫu bị lệch pha nghiêm trọng
Đo đạc thực tế từ tập dữ liệu `presetLandmarks.json` và kích thước ảnh 500x500px:

| Mẫu ảnh | Độ phủ khuôn mặt (W x H) | Tọa độ Bounding Box | Kích thước môi thực tế | Đánh giá trực quan |
| :--- | :---: | :---: | :---: | :--- |
| **`model1_warm.jpg`** | **49.2% × 58.7%** | `[24.8%, 22.6%]` $\rightarrow$ `[74.1%, 81.3%]` | **86.6px × 39.7px** | Cận cảnh (Close-up Portrait), môi rõ nét. |
| **`model2_fair.jpg`** | **26.6% × 30.3%** | `[32.2%, 35.6%]` $\rightarrow$ `[58.8%, 65.8%]` | **44.8px × 22.1px** | **Quá xa (Bust shot)**: Môi chỉ bằng **51%** so với Mẫu 1. |
| **`model3_medium.jpg`** | **36.7% × 43.6%** | `[37.1%, 31.6%]` $\rightarrow$ `[73.8%, 75.2%]` | **63.0px × 30.1px** | **Trung bình**: Môi chỉ bằng **72%** so with Mẫu 1. |

- **Hệ quả**: Mẫu 2 và Mẫu 3 có khoảng trống thừa ở ngực, cổ và nền xung quanh quá lớn. Khi hiển thị toàn mặt, người dùng thấy mặt mẫu bị thu nhỏ lại ở giữa màn hình.

### 📌 Nguyên nhân 2: Hiện tượng vỡ hạt khi nội suy pixel môi quá nhỏ
- Trên canvas kích thước $500 \times 500$, môi Mẫu 2 chỉ có chiều rộng $44.8$ pixels.
- Khi người dùng bấm nút **"Cận Môi" (Macro View)**, hàm `computeMacroTransform` cắt một vùng chỉ khoảng $100 \times 100$ pixels từ ảnh gốc rồi kéo giãn (stretch) ra toàn bộ canvas $500 \times 500$ (phóng đại 5 lần).
- Do ảnh gốc bị nén JPEG dung lượng thấp (25KB), việc nội suy phóng đại 500% gây ra hiện tượng khối vuông (blocking artifacts) và nhòe màu son, mất hoàn toàn ranh giới vân môi tự nhiên.

### 📌 Nguyên nhân 3: Thuật toán Specular Highlights vẽ đốm tròn trắng thô thiển
Quan sát khối lệnh tại `vtoEngine.js:324-370`:
```javascript
// Đoạn mã hiện tại gây lỗi đốm trắng:
LOWER_LIP_HIGHLIGHTS.forEach((ptIdx, idx) => {
  ...
  hGrad.addColorStop(0, `rgba(255, 255, 255, ${Math.min(0.9, intensity * 0.95)})`); // ĐỐM TRẮNG ĐỘ ĐẬM 90%
  ...
  ctx.arc(hx, hy, hr, 0, Math.PI * 2); // VẼ HÌNH TRÒN CỐ ĐỊNH
  ctx.fill();
});
```
- Thuật toán hiện tại sử dụng **13 hình tròn độc lập** được tô gradient tâm màu **trắng tinh khôi 90% opacity (`#ffffff`)** với chế độ hòa trộn `ctx.globalCompositeOperation = 'screen'`.
- Chế độ `screen` với màu trắng sẽ ép pixel đích biến thành màu trắng sáng chói, tẩy trắng hoàn toàn lớp son (`source-over` & `multiply`) vừa vẽ ở tầng dưới.
- Trên một đôi môi nhỏ (như Mẫu 2 với 44px), 13 đốm trắng có bán kính `hr = 5px - 8px` chồng lấn lên nhau tạo thành các vệt đốm trắng lấm tấm như bị mốc son hoặc bóng sáng giả tạo, phá hỏng màu son thực tế.

---

## 4. CHIẾN LƯỢC KHẮC PHỤC PHẪU THUẬT (SURGICAL FIX PROPOSAL)

Để giải quyết triệt để mà không phá vỡ cấu trúc của hệ thống VTO, chiến lược xử lý gồm 3 mũi nhọn:

### 🎯 Mũi 1: Chuẩn hóa ảnh Mẫu 2 & 3 cận mặt đồng bộ tỉ lệ $\ge 48\%$
- Cắt cúp (crop) và tái căn chỉnh trung tâm khuôn mặt của `model2_fair.jpg` và `model3_medium.jpg` sao cho kích thước khuôn mặt chiếm $\approx 50\%$ khung hình (tương đương chuẩn mực của `model1_warm.jpg`).
- Tái tính toán và đồng bộ 478 tọa độ mốc MediaPipe tương ứng trong `presetLandmarks.json`.
- Nâng cao độ phân giải hoặc nén chất lượng cao (High Quality JPEG / WebP) để vùng môi đạt tối thiểu $80-100\text{px}$, chống vỡ hạt khi bật chế độ Macro.

### 🎯 Mũi 2: Tái thiết kế thuật toán Bắt Sáng Môi (Natural Specular Reflection)
- **Loại bỏ việc vẽ 13 đốm tròn trắng cô lập**: Thay vì vẽ hình tròn rời rạc bằng `ctx.arc()` tại từng điểm mốc, tạo **dải phản quang elip mềm (Smooth Elliptical Glare Band)** chạy nhẹ nhàng theo phương ngang của cung môi dưới (nơi tiếp xúc ánh sáng thực tế).
- **Đồng bộ màu bắt sáng với màu thỏi son**:
  - Không dùng màu trắng thuần (`#ffffff`).
  - Dùng màu son pha loãng với sắc trắng kem ấm (`rgba(255, 245, 248, alpha)`) và giảm opacity cực đại từ `0.90` xuống mức tự nhiên $\le 0.32$.
- **Đổi chế độ hòa trộn**: Chuyển từ `screen` thô bạo sang `soft-light` hoặc dùng gradient tuyến tính mềm với Gaussian Blur cao để bắt sáng bóng mịn tự nhiên (chuẩn hiệu ứng son bóng Hàn Quốc).
- **Chỉ kích hoạt khi thực sự cần thiết**: Chỉ hiển thị dải bóng khi chất son là `GLOSSY` hoặc `SATIN`; dòng `MATTE` và `VELVET` chỉ giữ độ lì mịn không chèn đốm trắng.

### 🎯 Mũi 3: Tối ưu chất lượng vẽ trên Canvas
- Thiết lập `ctx.imageSmoothingEnabled = true` và `ctx.imageSmoothingQuality = 'high'` trước khi vẽ ảnh gốc và lớp makeup.
- Điều chỉnh bán kính feather blur của môi theo tỉ lệ kích thước môi (`lipSpan`), không cố định số pixel cứng để tránh làm mờ nhòe khuôn mặt nhỏ.

---

## 5. KẾ HOẠCH BƯỚC TIẾP THEO
- [ ] Chạy lệnh `/speckit-bug-fix slug=vto-model-photos-and-glare` để tiến hành can thiệp phẫu thuật mã nguồn vào `vtoEngine.js`, `faceLandmarks.js`, `presetLandmarks.json` và bộ ảnh mẫu `/public/models/`.
- [ ] Chạy lệnh `/speckit-bug-test slug=vto-model-photos-and-glare` để kiểm chứng trực quan bằng headless browser và chụp ảnh so sánh Trước / Sau.
