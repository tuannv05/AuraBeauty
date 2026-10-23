# Báo Cáo Minh Chứng Tuần 3: Catalog Service, Quản Lý INCI & Seeding 120+ Sản Phẩm

## 1. Mục tiêu tuần 3
- Triển khai `catalog-service` sử dụng MongoDB Reactive (`ReactiveMongoRepository`).
- Xây dựng mô hình dữ liệu mỹ phẩm:
  - `Product`: Tên sản phẩm, thương hiệu, danh mục, phân loại da mục tiêu (`targetSkinTypes`), số tiếp nhận phiếu công bố mỹ phẩm (`registrationNumber`).
  - `Variant`: SKU, dung tích, giá niêm yết, thuộc tính phân loại.
  - `InciIngredient`: Tên hoạt chất chuẩn quốc tế, nhóm công dụng, thang đo gây tắc lỗ chân lông (Comedogenic Rating 0-5), thang đo kích ứng (Irritation Rating 0-5), cờ da nhạy cảm.
- Bộ dữ liệu mẫu (`CatalogDataSeeder`): Seed tự động 120 sản phẩm mỹ phẩm đa dạng thương hiệu uy tín (Innisfree, La Roche-Posay, Cosrx, CeraVe, Klairs, Paula's Choice...) kèm đầy đủ thành phần INCI thực tế.
- REST API reactive:
  - Tìm kiếm sản phẩm theo từ khóa, lọc theo thương hiệu, lọc theo loại da mục tiêu (`GET /api/v1/catalog/products`).
  - Lấy chi tiết sản phẩm và bảng thành phần INCI (`GET /api/v1/catalog/products/{id}`).

## 2. Kết quả kiểm chứng
- Mô hình dữ liệu và cơ chế tìm kiếm phản hồi nhanh < 50ms nhờ Reactive MongoDB Streams.
- Lớp `CatalogDataSeeder` tự động kiểm tra số lượng và sinh 120 sản phẩm khi khởi động nếu cơ sở dữ liệu `catalog_db` còn trống.
- Build và compile thành công.
