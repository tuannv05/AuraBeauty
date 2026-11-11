# MINI-RULE: AI ADVISOR RAG & SSE STREAMING
> **Phạm vi:** `backend/ai-advisor-service` (Port 8086) & `/ai/`

## 1. NGUYÊN TẮC CỐT LÕI
- **Mô hình RAG da liễu:** Kết hợp truy vấn ngữ nghĩa vector INCI trên PostgreSQL `pgvector` và thông tin `SkinProfile` của khách hàng.
- **Không gian vector:** Vector đặc trưng 384 chiều với chỉ mục HNSW (Hierarchical Navigable Small World) theo khoảng cách Cosine Similarity.
- **Server-Sent Events (SSE):** Trả về phản hồi dạng streaming từng từ `text/event-stream` thời gian thực; không chặn luồng Vert.x EventLoop.
- **Đề xuất sản phẩm:** Tự động đính kèm danh sách thẻ sản phẩm thực tế phù hợp với phác đồ điều trị da liễu.

## 2. VÙNG BẤT KHẢ XÂM PHẠM
- Extension `pgvector` trong container PostgreSQL và cấu hình Quarkus PgPool vector mapper.
- Dataset 154 sản phẩm và 45 hoạt chất INCI chuẩn y khoa.

## 3. LỆNH KIỂM CHỨNG
```bash
mvn test -pl backend/ai-advisor-service
```
