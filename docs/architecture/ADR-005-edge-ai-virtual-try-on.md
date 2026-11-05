# ADR-005: Kiến Trúc Edge AI & Kết Xuất PBR Cho Tính Năng Thử Mỹ Phẩm Thực Tế Ảo (Aura Virtual Try-On 2.0)

## Bối cảnh (Context)
Trong sàn thương mại điện tử mỹ phẩm đa người bán (Aura Beauty Mall), tính năng thử son, phấn má, kem nền và phấn mắt thực tế ảo (AR Virtual Try-On) là mắt xích quan trọng giúp khách hàng hình dung sắc độ sản phẩm trên khuôn mặt thực tế trước khi đặt mua.
Hệ thống cần đáp ứng các tiêu chuẩn khắt khe:
1. **Độ trễ thời gian thực:** Tốc độ khung hình phải đạt 60 FPS ($\le 16.6\text{ ms}$ mỗi frame) ngay trên trình duyệt máy khách (máy tính hoặc điện thoại).
2. **Quyền riêng tư tuyệt đối (Privacy-First):** Không được truyền video hay ảnh chụp trực tiếp khuôn mặt người dùng lên máy chủ đám mây, tuân thủ quy định bảo vệ dữ liệu cá nhân (GDPR, Nghị định 13/2023/NĐ-CP).
3. **Chi phí hạ tầng máy chủ (Server Cost):** Với mô hình đồ án và vận hành tối ưu chi phí, không thể duy trì cụm máy chủ GPU đắt đỏ (như AWS EC2 G4dn/G5 hoặc NVIDIA T4) để xử lý AI inference cho hàng ngàn phiên AR đồng thời.
4. **Chất lượng hình ảnh vật lý (PBR):** Màu son không được lem vào răng khi nói/cười, phải giữ được vân môi tự nhiên và loại bỏ triệt để các đốm chói sáng nhân tạo.

## Các phương án cân nhắc (Options)
1. **Server-Side Video Streaming (WebRTC / Cloud GPU Rendering):**
   - Truyền luồng camera qua WebRTC lên máy chủ GPU, sử dụng mô hình Deep Learning (như BeautyGAN, MakeupTransfer) để ghép màu rồi stream ngược lại client.
   - *Ưu điểm:* Chất lượng biến đổi ảnh chân dung cực kỳ chi tiết.
   - *Nhược điểm:* Chi phí GPU máy chủ khổng lồ, độ trễ mạng cao ($150\text{ - }300\text{ ms}$), rủi ro rò rỉ dữ liệu sinh trắc học khuôn mặt người dùng.
2. **Edge AI Client-Side Rendering (MediaPipe WASM + WebGL/Canvas 2D):**
   - Tải mô hình Face Landmarker nhẹ (khoảng $3\text{ MB}$) xuống trình duyệt, chạy suy luận trực tiếp trên GPU máy khách thông qua WebAssembly (WASM) và WebGL.
   - Sử dụng đồ họa Canvas 2D / WebGL với quy tắc `evenodd` clipping và kỹ thuật pha trộn PBR (Physically-Based Rendering) giữ kết cấu da/môi.
   - *Ưu điểm:* Không tốn chi phí GPU máy chủ, độ trễ cực thấp ($\le 16\text{ ms}$, 60 FPS), bảo mật 100% dữ liệu khuôn mặt on-device.
   - *Nhược điểm:* Phụ thuộc vào năng lực phần cứng máy khách; cần tối ưu thuật toán khử rung (One-Euro Filter) để đường viền môi không bị giật lag.

## Quyết định (Decision)
Chọn phương án **Edge AI Client-Side Rendering** kết hợp **Canvas 2D PBR Multi-Layer**:
1. **Suy luận biên (Edge AI):** Sử dụng `@mediapipe/tasks-vision` nhận diện 478 điểm 3D trực tiếp trên trình duyệt.
2. **Khử rung thời gian thực:** Tích hợp thuật toán **One-Euro Filter (1€ Filter)** để ổn định tọa độ viền môi.
3. **Pha trộn màu quang học:** Tách 2 vòng đa giác khép kín (`LIP_OUTER_LOOP` và `LIP_INNER_LOOP`) bằng quy tắc `evenodd` để chống lem màu vào răng. Sử dụng dải elip bắt sáng liên tục (`soft-light`) thay thế các đốm trắng rời rạc.
4. **Phân tích da cục bộ:** Đo góc sắc tố da $ITA^\circ$ (CIELAB) tại 5 điểm chuẩn ngay trên Canvas và chỉ gửi dữ liệu số học (`skinToneHex`, `skinUndertone`, `itaAngle`) lên `account-service` khi người dùng bấm *"Lưu hồ sơ"*.
5. **Tư vấn AI qua SSE:** Sử dụng Server-Sent Events (SSE) từ `ai-advisor-service` để phân tích ngữ cảnh màu son kết hợp chỉ số kích ứng thành phần INCI (pgvector) mà không cần truyền ảnh.

## Hệ quả (Consequences)
- **Tích cực:**
  - Tiết kiệm 100% chi phí điện toán đám mây cho GPU rendering.
  - Đạt tiêu chuẩn bảo mật dữ liệu sinh trắc học cao nhất: video camera không bao giờ rời khỏi trình duyệt.
  - Trải nghiệm mượt mà 60 FPS trên đa số thiết bị có hỗ trợ WebGL.
  - Dễ dàng tích hợp với tính năng Giỏ hàng và Tách đơn hàng đa gian hàng (Split Order).
- **Tiêu cực (Đánh đổi):**
  - Trình duyệt cần tải mô hình WASM của MediaPipe trong lần khởi chạy đầu tiên ($\sim 3\text{ MB}$, cần hiển thị Skeleton loading mượt mà).
  - Cần cung cấp sẵn 3 hình ảnh chân dung chuẩn độ nét cao (Cool, Neutral, Warm) kèm file landmarks JSON để khách hàng không có webcam vẫn trải nghiệm hoàn hảo.
