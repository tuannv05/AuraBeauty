# ADR-004: Thu Hẹp Phạm Vi Dự Án Cho Một Người Phát Triển (Scope Reduction)

## Bối cảnh (Context)
Dự án được xây dựng và triển khai bởi một kỹ sư duy nhất trong thời gian giới hạn 14 tuần (~18 giờ/tuần, khoảng 250 giờ làm việc thực tế). Việc ôm đồm toàn bộ các tính năng thương mại điện tử thực tế sẽ dẫn tới nguy cơ trễ hạn hoặc làm việc nửa vời không thể demo chạy thực tế.

## Các phương án cân nhắc (Options)
1. **Phát triển dàn trải:** Làm đầy đủ voucher, khuyến mãi flash sale, đánh giá sao, bình luận, tích điểm thưởng, cổng thanh toán ngân hàng thật (VNPay/Momo), giao vận bưu điện thật và triển khai cụm Kubernetes (K8s). Rủi ro: Không hoàn thiện kịp các kỹ thuật khó nhất (Saga, Reactive, RAG), giao diện dở dang, code lỗi.
2. **Thu hẹp có chủ đích (Focused Vertical Slices):** Cắt gọn kiến trúc xuống 6 services + 1 API gateway, tập trung cao độ vào 2 điểm sáng kỹ thuật mang lại giá trị bảo vệ đồ án cao nhất: (1) Saga Choreography đặt hàng đa người bán kèm Outbox, và (2) RAG tư vấn mỹ phẩm streaming SSE dựa trên thành phần INCI và Skin Profile.

## Quyết định (Decision)
1. **Gộp các domain liên quan thành 6 service độc lập:**
   - `account-service`: Quản lý User (Buyer/Seller/Admin), Shop, Skin Profile và phát hành JWT.
   - `catalog-service`: Quản lý danh mục sản phẩm, biến thể (Variant), thành phần INCI (MongoDB).
   - `order-service`: Giỏ hàng, tạo đơn hàng, tách Sub-order theo Shop, tích hợp Outbox.
   - `inventory-service`: Quản lý số lượng tồn kho và giữ hàng nguyên tử.
   - `payment-service`: Cổng thanh toán giả lập (Mock Gateway / COD), sổ cái kế toán kép (Double-entry Ledger), hạch toán hoa hồng sàn.
   - `ai-advisor-service`: Pipeline RAG tư vấn mỹ phẩm, vector store pgvector, streaming SSE.
   - `api-gateway`: Định tuyến phi chặn và xác thực kiểm tra JWT tập trung.
2. **Đưa các tính năng phụ vào mục "Hướng phát triển tương lai (Won't have)":**
   - Không làm voucher/mã giảm giá, không làm hệ thống đánh giá/review, không làm chat trực tiếp Buyer-Seller, không làm flash sale, không làm điểm thưởng.
   - Thanh toán và giao vận sử dụng Mock Gateway có xác nhận/hoàn tiền giả lập thay vì tích hợp cổng bên thứ ba phức tạp.
   - Triển khai toàn bộ bằng Docker Compose thay vì Kubernetes.

## Hệ quả (Consequences)
- **Tích cực:** Tập trung 100% nỗ lực vào các thành phần kiến trúc phức tạp và có chiều sâu kỹ thuật nhất (Saga, Reactive non-blocking, R2DBC, Outbox pattern, RAG vector search). Đảm bảo sản phẩm hoàn chỉnh end-to-end, demo mượt mà từ giao diện web React đến CSDL.
- **Tiêu cực (Đánh đổi):** Một số tính năng phổ thông của sàn thương mại điện tử sẽ vắng mặt trong bản demo (đã được ghi chú rõ ràng trong đề cương và báo cáo đồ án).
