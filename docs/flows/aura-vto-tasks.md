# 🏛️ DANH SÁCH CÔNG VIỆC THỰC THI: AURA VIRTUAL TRY-ON 2.0 (TASKS)

> **MÃ DANH SÁCH**: `TASKS-VTO-02`  
> **ÁNH XẠ ĐẶC TẢ & THIẾT KẾ**: [QT-05-aura-virtual-try-on.md](file:///d:/A_javaFW\WebBanMP\docs\flows\QT-05-aura-virtual-try-on.md) • [aura-vto-plan.md](file:///d:/A_javaFW\WebBanMP\docs\flows\aura-vto-plan.md)  
> **QUY TẮC THỰC HIỆN**: Tuần tự từng Task • Có lệnh `Verify:` cụ thể • Clean Diff phẫu thuật • Zero-Breakage  

---

## DANH SÁCH TASKS NGUYÊN TỬ

- [x] **Task 1: Backend Domain Model & Architecture Compliance**
  - **Mô tả:** Đảm bảo `VtoConfig.java` tại `catalog-service` là Java 21 Record thuần túy, không vi phạm quy tắc Hexagonal. Đảm bảo `SkinProfile` tại `account-service` hỗ trợ lưu `skinToneHex`, `skinUndertone`, `itaAngle` hoàn toàn phi chặn.
  - **Files:** `backend/catalog-service/src/main/java/com/cosmetics/catalog/domain/model/VtoConfig.java`, `backend/account-service/src/main/java/com/cosmetics/account/domain/SkinProfile.java`
  - **Verify:** `mvn test -pl backend/account-service,backend/catalog-service -Dtest=HexagonalArchitectureTest` $\rightarrow$ **PASS (SUCCESS)**

- [x] **Task 2: AI Advisor VTO SSE Stream Integration**
  - **Mô tả:** Đảm bảo `AiAdvisorController` và `AiAdvisorService` nhận ngữ cảnh thử màu `{vtoShadeName, vtoHexColor, vtoFinishType, detectedUndertone, productId, productName}` và stream câu trả lời tư vấn thời gian thực qua Server-Sent Events (SSE).
  - **Files:** `backend/ai-advisor-service/src/main/java/com/cosmetics/ai/adapter/in/web/AiAdvisorController.java`, `backend/ai-advisor-service/src/main/java/com/cosmetics/ai/application/AiAdvisorService.java`
  - **Verify:** `mvn test-compile -pl backend/ai-advisor-service` $\rightarrow$ **PASS (SUCCESS)**

- [x] **Task 3: Core Computer Vision & Modular PBR Engine**
  - **Mô tả:** Xây dựng cấu trúc module mới cho phân hệ VTO:
    1. `constants/faceMeshIndices.js`: Danh sách đầy đủ 478 điểm MediaPipe cho môi ngoài, môi trong, má, mắt, nền, và 5 điểm đo sắc tố da.
    2. `engine/oneEuroFilter.js`: Bộ lọc chống rung tọa độ 3D thích ứng thời gian thực (1€ Filter).
    3. `engine/colorSpaceUtils.js`: Hàm chuyển đổi `sRGB <-> CIELAB`, tính toán góc sắc tố da $ITA^\circ$ và phân loại undertone (`WARM`, `COOL`, `NEUTRAL`).
    4. `engine/skinToneDetector.js`: Lấy mẫu pixel da tại 5 vị trí chuẩn, tính trung bình khử bóng sáng.
    5. `engine/makeupPbrRenderer.js`: Bộ kết xuất PBR 4 lớp (Môi `evenodd` chống lem răng + đệm elip bắt sáng mượt mà + kiểu Full/Ombré, Má tỏa tròn, Nền phủ mịn, Mắt tán màu).
    6. Cập nhật `vtoEngine.js` và `faceLandmarks.js` re-export đầy đủ để bảo toàn tương thích ngược 100%.
  - **Files:** `frontend/src/features/vto/constants/faceMeshIndices.js`, `frontend/src/features/vto/engine/oneEuroFilter.js`, `frontend/src/features/vto/engine/colorSpaceUtils.js`, `frontend/src/features/vto/engine/skinToneDetector.js`, `frontend/src/features/vto/engine/makeupPbrRenderer.js`, `frontend/src/features/vto/vtoEngine.js`, `frontend/src/features/vto/faceLandmarks.js`
  - **Verify:** Script toán học và logic kết xuất $\rightarrow$ **PASS (SUCCESS)**

- [x] **Task 4: UI Studio Modal, Variant Picker Sync & GPU Optimization**
  - **Mô tả:** Hoàn thiện giao diện `<VirtualTryOnModal />`:
    1. Bổ sung nút **📸 Chụp Ảnh (Snapshot)** cho phép xuất và tải ảnh PNG kèm logo Aura.
    2. Bổ sung bộ chọn **Kiểu thoa son (Full môi quyến rũ / Lòng môi Ombré)**.
    3. Tự động thêm class `vto-active-no-anim` khi mở modal để tạm dừng animation nền, nhường 100% GPU cho MediaPipe Canvas.
    4. Bảo đảm 0% màn hình trắng (Zero Blank-Screen Guarantee) với defensive optional chaining.
  - **Files:** `frontend/src/features/vto/VirtualTryOnModal.jsx`, `frontend/src/index.css`
  - **Verify:** `npm --prefix frontend run build` $\rightarrow$ **PASS (Built in 5.49s, 0 errors)**

- [x] **Task 5: Multi-Shop Mix & Match Split Order & CAS Concurrency**
  - **Mô tả:** Kết nối nút *"Mua Trọn Bộ Đang Thử"* vào giỏ hàng đa gian hàng, kiểm tra giữ kho nguyên tử CAS không bị âm kho khi nhiều khách cùng mua combo.
  - **Files:** `backend/inventory-service/.../InventoryService.java`
  - **Verify:** `mvn test -pl backend/inventory-service -Dtest=AtomicStockConcurrencyTest` $\rightarrow$ **PASS (SUCCESS)**
