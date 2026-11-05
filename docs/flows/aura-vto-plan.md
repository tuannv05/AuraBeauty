# 🏛️ KẾ HOẠCH THIẾT KẾ KỸ THUẬT: AURA VIRTUAL TRY-ON 2.0 (PLAN)

> **MÃ THIẾT KẾ**: `PLAN-VTO-02`  
> **ÁNH XẠ ĐẶC TẢ**: [QT-05-aura-virtual-try-on.md](file:///d:/A_javaFW\WebBanMP\docs\flows\QT-05-aura-virtual-try-on.md)  
> **NGUYÊN TẮC THIẾT KẾ**: Simplicity First • Surgical Changes • Zero-Breakage • 100% Non-blocking Backend • 60 FPS Edge WebGL/Canvas  

---

## 1. TỔNG QUAN KIẾN TRÚC & PHÂN TÁCH TRÁCH NHIỆM

Hệ thống Aura Virtual Try-On 2.0 hoạt động theo mô hình **Hybrid Edge-Cloud Architecture**:
1. **Edge AI Client (Frontend - Port 3000):**
   - 100% xử lý hình ảnh và nhận diện 478 điểm 3D chạy trên GPU máy khách thông qua MediaPipe WebAssembly/WebGL. Không truyền bất kỳ luồng video hay khung hình nào về máy chủ (Bảo đảm quyền riêng tư tuyệt đối theo GDPR/CCPA).
   - Thuật toán **One-Euro Filter** khử rung viền môi theo thời gian thực với độ trễ $< 1\text{ ms}$.
   - Đo góc sắc tố da $ITA^\circ$ (CIELAB) tại 5 điểm chuẩn và phân loại undertone trực tiếp tại client.
   - Kết xuất PBR đa lớp (Môi, Má, Nền, Mắt) trên Canvas 2D đạt chuẩn 60 FPS ($\le 16\text{ ms}$ mỗi frame).
2. **Microservices Cloud Backend (Ports 8080 - 8086):**
   - `catalog-service` (:8082): Cung cấp thông số màu quang học `VtoConfig` gắn liền với biến thể SKU qua MongoDB Reactive Streams.
   - `account-service` (:8081): Lưu trữ và cập nhật hồ sơ tông da `SkinProfile` qua PostgreSQL R2DBC.
   - `ai-advisor-service` (:8086): Nhận ngữ cảnh AR qua luồng SSE, đối chiếu vector embeddings và thành phần INCI qua pgvector.
   - `inventory-service` (:8083) & `order-service` (:8084): Kiểm tra kho nguyên tử CAS và tách đơn hàng đa shop (Split Order).

---

## 2. DANH SÁCH FILE CAN THIỆP PHẪU THUẬT (SURGICAL TARGETS)

### 2.1. Phân hệ Frontend (`frontend/src/features/vto/`)

| File mục tiêu | Loại thay đổi | Trách nhiệm kỹ thuật chi tiết |
| :--- | :---: | :--- |
| `constants/faceMeshIndices.js` | **Tạo mới** | Lưu trữ toàn bộ 478 hằng số MediaPipe: `LIP_OUTER_LOOP`, `LIP_INNER_LOOP`, `LOWER_LIP_HIGHLIGHTS`, `UPPER_LIP_HIGHLIGHTS`, `CHEEK_CENTERS`, `EYESHADOW_LEFT`, `EYESHADOW_RIGHT`, `FACE_OVAL`, `EYE_LEFT_HOLE`, `EYE_RIGHT_HOLE`, `SKIN_SAMPLE_POINTS`. |
| `engine/oneEuroFilter.js` | **Tạo mới** | Thuật toán 1€ Filter (Low-pass filter thích ứng theo vận tốc) để triệt tiêu rung giật viền môi khi khách cử động trước camera. |
| `engine/colorSpaceUtils.js` | **Tạo mới** | Chuyển đổi màu sắc thuần túy: `hexToRgba`, `rgbToHex`, `rgbToLab`, tính toán góc sắc tố da $ITA^\circ$ và phân loại Undertone (`WARM`, `COOL`, `NEUTRAL`). |
| `engine/skinToneDetector.js` | **Tạo mới** | Trích xuất pixel tại 5 điểm da chuẩn từ Canvas, tính giá trị trung bình đã lọc nhiễu bóng sáng, xác định mã màu Hex và phân loại tông da. |
| `engine/makeupPbrRenderer.js` | **Tạo mới** | Bộ kết xuất PBR 4 lớp: Môi (`evenodd` khoét lỗ răng, giữ vân môi, dải elip bắt sáng Glossy mềm mại, hỗ trợ Full môi & Ombré), Má (Radial Gaussian), Nền (Foundation mềm), Mắt (Eyeshadow). |
| `faceLandmarks.js` | **Cập nhật** | Re-export từ `constants/faceMeshIndices.js` để bảo toàn tương thích ngược 100% cho mọi import cũ. |
| `vtoEngine.js` | **Cập nhật** | Tinh gọn thành Façade Module kết nối các engine con, re-export toàn bộ hàm cũ để không làm gãy bất kỳ component nào đang sử dụng. |
| `VirtualTryOnModal.jsx` | **Cập nhật** | Bổ sung: Nút **📸 Chụp Ảnh (Snapshot PNG)**, tùy chọn **Kiểu son (Full môi / Lòng môi Ombré)**, class `vto-active-no-anim` tạm dừng animation nền giúp tiết kiệm tài nguyên GPU. |

### 2.2. Phân hệ Backend Microservices

| Service & File | Trách nhiệm & Trạng thái |
| :--- | :--- |
| `catalog-service`:<br>`.../domain/model/VtoConfig.java` | Domain Value Object thuần Java 21, chứa `MakeupCategory`, `FinishType`, `UndertoneMatch`, `VtoShade` với regex validation `#RRGGBB`. **(Đã hoàn thiện, kiểm tra ArchUnit)** |
| `account-service`:<br>`.../domain/SkinProfile.java` & `SkinProfileEntity.java` | Lưu trữ `skinToneHex`, `skinUndertone`, `itaAngle` non-blocking qua R2DBC. **(Đã hoàn thiện)** |
| `ai-advisor-service`:<br>`.../adapter/in/web/AiAdvisorController.java` | Tiếp nhận luồng SSE `/api/advisor/chat` với `vtoContext` (`vtoShadeName`, `vtoHexColor`, `detectedUndertone`). **(Đã hoàn thiện)** |

---

## 3. THIẾT KẾ CHI TIẾT THUẬT TOÁN & CÔNG NGHỆ CỐT LÕI

### 3.1. Thuật toán One-Euro Filter (`oneEuroFilter.js`)
Công thức toán học của 1€ Filter:
$$\alpha = \frac{1}{1 + \frac{\tau}{T}}, \quad \tau = \frac{1}{2\pi f_c}$$
Trong đó tần số cắt $f_c$ tự động thay đổi theo tốc độ biến thiên của tọa độ $\dot{x}$:
$$f_c = f_{c,\min} + \beta \cdot |\dot{x}|$$
- Khi khuôn mặt đứng yên: $f_c \to f_{c,\min} = 1.0\text{ Hz}$, bộ lọc làm mịn tối đa, triệt tiêu hoàn toàn rung giật viền môi (jitter).
- Khi khuôn mặt cử động nhanh: $f_c$ tăng lên nhờ tham số $\beta = 0.007$, loại bỏ hiện tượng trễ hình (lag).

### 3.2. Thuật toán Chống lem màu vào răng (Tooth Mask Clipping)
Sử dụng phương thức Canvas 2D `Path2D` với quy tắc lấp đầy `evenodd`:
```javascript
const lipPath = new Path2D();
// 1. Vẽ vòng viền môi ngoài theo chiều kim đồng hồ
tracePathToPath2D(lipPath, LIP_OUTER_LOOP, landmarks, width, height);
// 2. Vẽ vòng viền môi trong (lỗ răng)
tracePathToPath2D(lipPath, LIP_INNER_LOOP, landmarks, width, height);

ctx.save();
ctx.clip(lipPath, 'evenodd'); // Chỉ áp dụng màu vào phần diện tích nằm giữa 2 vòng
// Thực hiện pha trộn màu son PBR
ctx.restore();
```

### 3.3. Dải phản quang mềm mại loại bỏ đốm li ti (Soft Continuous Dewy Highlight)
Thay thế toàn bộ 13 điểm tròn rời rạc bằng một hình elip bắt sáng duy nhất tại tâm đệm môi dưới:
- Vị trí tâm: $X = \frac{x_{84} + x_{314}}{2} \times W$, $Y = (y_{17} \times 0.65 + y_{14} \times 0.35) \times H$.
- Bán kính: $R_x = \text{lipWidth} \times 0.55$, $R_y = \text{lipHeight} \times 0.35$.
- Chế độ hòa trộn: `globalCompositeOperation = 'soft-light'`, kết hợp bộ lọc làm mờ `filter = 'blur(3px)'`.
- Độ trong suốt: Tuyệt đối không vượt quá $0.35$ để giữ độ tự nhiên của chất son Satin và Glossy.

---

## 4. BẢO ĐẢM TÀI NGUYÊN & KHÔNG MÀN HÌNH TRẮNG (ZERO BLANK-SCREEN)
1. **GPU Budget:** Thêm class `.vto-active-no-anim` lên `document.body` khi mở Modal, tạm dừng các hiệu ứng CSS `animate-pulse`, `keyframes`, nhường 100% GPU cho MediaPipe và Canvas.
2. **Defensive Coding:** Mọi truy cập vào thuộc tính của `vtoConfig` và `activeLooks` đều có toán tử optional chaining (`?.`) và giá trị mặc định, chống 100% lỗi `TypeError: Cannot read properties of undefined`.
3. **Clean Root:** Toàn bộ file tài liệu nằm trong `docs/flows/` và `docs/architecture/`. Không có file rác tại Root.
