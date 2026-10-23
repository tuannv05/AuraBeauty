# Báo Cáo Minh Chứng Tuần 10 - 11: AI Advisor RAG, Đánh Chỉ Mục Vector pgvector & Streaming SSE

## 1. Mục tiêu tuần 10 - 11
- Xây dựng `ai-advisor-service`:
  - Cơ sở dữ liệu: PostgreSQL + extension `pgvector` (`vector(384)`).
  - Tầng Domain & RAG:
    - Khi sản phẩm chuyển sang `PUBLISHED`, lắng nghe sự kiện `ProductPublished` từ Kafka.
    - Trích xuất thành phần INCI, nhóm công dụng, loại da phù hợp và chuyển hóa thành các Knowledge Chunks.
    - Tạo vector embedding 384 chiều (Cosine Normalized).
    - Lưu trữ vào bảng `knowledge_chunks` kèm chỉ mục tìm kiếm tương đồng vector.
- Giao diện & Luồng tư vấn Chatbot:
  - Tiếp nhận câu hỏi của người dùng và thông tin Hồ sơ da (`SkinProfile`: loại da, dị ứng, vấn đề da).
  - Truy vấn Top-K các Knowledge Chunks liên quan nhất dựa trên khoảng cách Cosine `1 - (embedding <=> :queryVector)`.
  - Kết hợp Prompt ngữ cảnh tư vấn da liễu chuyên sâu và phát trực tiếp câu trả lời dạng Server-Sent Events (`text/event-stream`).
  - Giao diện Web hiển thị phản hồi dạng gõ chữ mượt mà trong thời gian thực.

## 2. Bộ câu hỏi đánh giá thực tế (Evaluation Benchmark)
1. **Câu hỏi:** "Da dầu mụn dùng serum trà xanh này có bị bít tắc lỗ chân lông không?"
   - **Đánh giá:** RAG tìm đúng hoạt chất Camellia Sinensis & Hyaluronic Acid, giải thích comedogenic rating = 0, an toàn cho da dầu mụn.
2. **Câu hỏi:** "Tôi bị dị ứng hương liệu, sản phẩm này có an toàn không?"
   - **Đánh giá:** Hệ thống đối chiếu bảng INCI, phát hiện cờ cảnh báo nếu có Fragrance hoặc thông báo an toàn nếu không chứa chất gây dị ứng.

## 3. Kết quả kiểm chứng
- Service biên dịch hoàn chỉnh, kết nối R2DBC thuần Reactive với PostgreSQL pgvector mà không hề dùng JDBC chặn luồng.
- Luồng SSE trên Frontend hoạt động trơn tru.
