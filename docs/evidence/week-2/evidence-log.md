# Báo Cáo Minh Chứng Tuần 2: Service Template Hexagonal, Thư Viện Dùng Chung & Account Service

## 1. Mục tiêu tuần 2
- Xây dựng chuẩn kiến trúc Hexagonal (Ports & Adapters) cho toàn bộ hệ thống microservices.
- Xây dựng 3 thư viện dùng chung:
  - `libs/common-web`: Chuẩn hóa DTO phản hồi `ApiResponse<T>`, xử lý lỗi tập trung RFC 7807 `GlobalExceptionHandler`, xử lý Security Header reactive.
  - `libs/common-events`: Cấu trúc CloudEvents chuẩn `EventEnvelope<T>`, định nghĩa Topic Kafka, các payload sự kiện (`OrderPlacedPayload`, `InventoryReservedPayload`, `PaymentSucceededPayload`, `ProductPublishedPayload`...).
  - `libs/common-outbox`: Triển khai Transactional Outbox pattern và Idempotency Consumer (`ProcessedEvent`) dùng R2DBC reactive.
- Triển khai `account-service`:
  - Đăng ký / đăng nhập với JWT (Access Token 15m, Refresh Token 7d, BCrypt băm mật khẩu).
  - Phân quyền theo 3 vai trò: BUYER, SELLER, ADMIN.
  - Quản lý hồ sơ da (Skin Profile: Skin Type, Concerns, Allergies).
  - Kiểm thử kiến trúc ArchUnit: đảm bảo Domain Model không phụ thuộc vào framework (Quarkus/Spring) hay cơ sở dữ liệu bên ngoài.

## 2. Kết quả thực hiện
- Thư viện `libs/common-web`, `libs/common-events`, `libs/common-outbox` đã hoàn thành và compile thành công.
- `services/account-service` hoàn thành với đầy đủ các tầng:
  - `domain`: `User`, `Shop`, `SkinProfile`, `Role`.
  - `application`: `AuthService`, `ShopService`.
  - `infrastructure`: R2DBC repositories, JWT reactive filter, AuthController.
- Kiểm thử ArchUnit `HexagonalArchitectureTest` vượt qua 100%.

## 3. Lệnh kiểm chứng
```bash
mvn test -pl backend/account-service -Dtest=HexagonalArchitectureTest
```
Kết quả: `Tests run: 1, Failures: 0, Errors: 0, Skipped: 0` (SUCCESS).
