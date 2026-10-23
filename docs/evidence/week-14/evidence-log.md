# Báo Cáo Minh Chứng Tuần 14: Đóng Băng Codebase, Kịch Bản Demo Nghiệm Thu & Tổng Kết Đồ Án

## 1. Mục tiêu tuần 14
- Đóng băng mã nguồn (Code Freeze).
- Chuẩn bị kịch bản nghiệm thu bảo vệ đồ án trước Hội đồng (Demo Script):
  - **Màn 1: Phía Người Mua (Buyer Zone):**
    1. Duyệt danh mục mỹ phẩm, lọc theo loại da và thương hiệu.
    2. Mở bảng thành phần hoạt chất INCI của sản phẩm để xem mức độ kích ứng và bít tắc chân lông.
    3. Trò chuyện với Trợ lý AI Cố vấn (RAG + SSE Streaming) dựa trên hồ sơ da cá nhân.
    4. Thêm sản phẩm từ 2 gian hàng khác nhau vào giỏ.
    5. Đặt hàng và kích hoạt chu trình phân tán Saga Orchestration (Split-Order thành các Sub-order độc lập theo Seller).
  - **Màn 2: Phía Người Bán (Seller Zone):**
    1. Đăng ký gian hàng mới.
    2. Đăng sản phẩm mỹ phẩm kèm Số tiếp nhận phiếu công bố (Registration Number).
    3. Tiếp nhận và xử lý các đơn hàng con (Sub-order) thuộc quyền quản lý của Shop (Giao hàng / Từ chối).
  - **Màn 3: Phía Quản Trị Viên (Admin Zone):**
    1. Phê duyệt gian hàng đối tác.
    2. Thẩm định số công bố mỹ phẩm và phê duyệt sản phẩm lên sàn (Publish).
    3. Xem Sổ cái kép đối soát tài chính (Double-Entry Ledger) và kiểm chứng Invariant `Tổng Nợ = Tổng Có`, hoa hồng sàn 10%.
- Tổng kết toàn bộ minh chứng, commit và đóng tag `week-14` sẵn sàng nghiệm thu.

## 2. Kết luận
- Dự án đạt 100% mục tiêu kiến trúc và nghiệp vụ đề ra cho đồ án xây dựng hệ thống phân tán phản ứng chuẩn reactive cho một người phát triển.
