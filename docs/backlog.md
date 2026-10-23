# Product Backlog & Sprint Planning

Bảng phân chia công việc theo chuẩn Kanban / User Stories cho các giai đoạn phát triển.

---

## EPIC-01: Tài Khoản và Phân Quyền (Account & Authentication)
- **US-101: Đăng ký tài khoản Buyer**
  - **Mô tả:** Người dùng có thể đăng ký tài khoản mới với email và mật khẩu.
  - **Acceptance Criteria (AC):**
    - Email chưa tồn tại trong hệ thống.
    - Mật khẩu tối thiểu 8 ký tự, được băm an toàn bằng BCrypt trước khi lưu DB.
    - Thành công: Trả về HTTP 201 Created kèm thông tin người dùng (không kèm mật khẩu).
    - Thất bại: Trùng email trả về HTTP 409 Conflict với error code `ACCOUNT_001`.
- **US-102: Đăng nhập hệ thống**
  - **Mô tả:** Người dùng đăng nhập bằng email và mật khẩu để lấy cặp token JWT.
  - **Acceptance Criteria (AC):**
    - Thành công: Trả về HTTP 200 OK gồm `accessToken` (thời hạn 15 phút) và `refreshToken` (thời hạn 7 ngày).
    - Thất bại: Sai email hoặc mật khẩu trả về HTTP 401 Unauthorized kèm ProblemDetail.
- **US-103: Làm mới Access Token (Token Refresh)**
  - **Mô tả:** Client dùng Refresh Token để gia hạn Access Token mới mà không cần đăng nhập lại.
  - **Acceptance Criteria (AC):**
    - Refresh token hợp lệ: Cấp Access token mới.
    - Refresh token hết hạn, bị thu hồi hoặc sai chữ ký: Trả về HTTP 401 Unauthorized.
- **US-104: Phân quyền theo vai trò (RBAC)**
  - **Mô tả:** Hệ thống bảo vệ các endpoint theo các role `ROLE_BUYER`, `ROLE_SELLER`, `ROLE_ADMIN`.
  - **Acceptance Criteria (AC):**
    - Gọi endpoint quản trị Admin bằng token Buyer: Trả về HTTP 403 Forbidden.
    - Gọi không kèm token: Trả về HTTP 401 Unauthorized.
- **US-105: Quản lý Skin Profile**
  - **Mô tả:** Buyer đọc và cập nhật hồ sơ làn da cá nhân (loại da, vấn đề, tiền sử dị ứng).
  - **Acceptance Criteria (AC):**
    - Buyer đọc/sửa được hồ sơ của chính mình.
    - Không đọc/sửa được hồ sơ của Buyer khác (trả HTTP 403 nếu cố tình truy cập ID khác).

---

## EPIC-02: Gian Hàng (Shop Onboarding)
- **US-201: Đăng ký gian hàng Seller**
  - **Mô tả:** User có thể gửi yêu cầu mở gian hàng bán mỹ phẩm.
  - **Acceptance Criteria (AC):**
    - Tạo bản ghi Shop ở trạng thái `PENDING`.
    - Phát sinh Domain Event `ShopRegistered`.
- **US-202: Admin phê duyệt/từ chối gian hàng**
  - **Mô tả:** Admin xem danh sách Shop chờ duyệt và phê duyệt hoặc từ chối.
  - **Acceptance Criteria (AC):**
    - Chuyển trạng thái sang `APPROVED` hoặc `REJECTED`.
    - Phát sinh Domain Event `ShopApproved` qua Kafka.
    - Shop chưa `APPROVED` không thể tạo sản phẩm mới để bán.

---

## EPIC-03: Danh Mục Sản Phẩm (Product Catalog)
- **US-301: Seller tạo sản phẩm nháp (Draft)**
  - **Mô tả:** Seller của Shop đã duyệt tạo sản phẩm với danh sách biến thể (Variant), giá và thành phần INCI.
  - **Acceptance Criteria (AC):**
    - Ít nhất 1 Variant với giá $> 0$.
    - Phải thuộc Shop đã được `APPROVED`.
    - Tạo thành công ở trạng thái `DRAFT`.
- **US-302: Seller gửi duyệt & Admin kiểm duyệt sản phẩm**
  - **Mô tả:** Seller gửi duyệt sản phẩm; Admin kiểm tra số tiếp nhận phiếu công bố (Registration No.).
  - **Acceptance Criteria (AC):**
    - Nếu không có hoặc sai định dạng `registrationNo`: Không thể duyệt (`REJECTED`).
    - Khi Admin duyệt hợp lệ: Sản phẩm chuyển sang `PUBLISHED`, đồng thời phát sự kiện `ProductPublished` qua Kafka.
- **US-303: Kiểm soát quyền chỉnh sửa sản phẩm**
  - **Mô tả:** Seller chỉ được phép sửa sản phẩm thuộc quyền sở hữu của gian hàng mình.
  - **Acceptance Criteria (AC):**
    - Seller A cố tình cập nhật sản phẩm của Seller B: Hệ thống chặn và trả về HTTP 403 Forbidden.
- **US-304: Buyer tìm kiếm và duyệt sản phẩm**
  - **Mô tả:** Buyer tìm kiếm theo tên, thương hiệu, loại da phù hợp, khoảng giá.
  - **Acceptance Criteria (AC):**
    - Chỉ hiển thị các sản phẩm có trạng thái `PUBLISHED`.
    - Hỗ trợ phân trang bằng luồng Reactive (`Flux`).
    - Thời gian phản hồi $< 300\text{ ms}$ trên bộ dữ liệu kiểm thử $300+$ sản phẩm.
- **US-305: Chi tiết sản phẩm**
  - **Mô tả:** Xem chi tiết sản phẩm bao gồm phân tích thành phần INCI, các tùy chọn biến thể và thông tin gian hàng.

---

## EPIC-04: Hạ Tầng và Kiến Trúc Cốt Lõi (Architecture & Infrastructure)
- **US-401: Khởi tạo toàn bộ hạ tầng bằng Docker Compose**
  - **Mô tả:** Lệnh `docker compose up -d` khởi động PostgreSQL 16 (kèm `pgvector`), MongoDB 7, Apache Kafka 3.8 và Kafka UI.
  - **Acceptance Criteria (AC):**
    - Tất cả các container đạt trạng thái `healthy`.
    - Khởi tạo tự động 5 database trong PostgreSQL.
    - Extension `vector` kích hoạt sẵn sàng trên `ai_db`.
- **US-402: Service Template chuẩn Hexagonal Architecture**
  - **Mô tả:** Khung mẫu dự án Spring Boot 3 WebFlux với các tầng `domain`, `application`, `adapter`, `config`.
  - **Acceptance Criteria (AC):**
    - Tích hợp kiểm thử kiến trúc bằng ArchUnit (tầng `domain` tuyệt đối không phụ thuộc vào framework Spring, R2DBC, MongoDB).
    - Tích hợp BlockHound để phát hiện lập tức bất kỳ lời gọi blocking nào trên luồng EventLoop.
- **US-403: CI Pipeline**
  - **Mô tả:** Tự động hóa build, lint và test mỗi khi commit/push mã nguồn.
- **US-404: Thư viện Transactional Outbox dùng chung**
  - **Mô tả:** Thiết kế pattern Outbox + Idempotent Consumer chia sẻ giữa các microservice, đảm bảo tính nhất quán cuối cùng (Eventual Consistency) mà không mất mát sự kiện.
