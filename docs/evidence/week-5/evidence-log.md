# Báo Cáo Minh Chứng Tuần 5: Inventory Service, Giữ Hàng Nguyên Tử & Test Đồng Thời Tồn Không Âm

## 1. Mục tiêu tuần 5
- Triển khai `inventory-service` dùng PostgreSQL R2DBC.
- Đảm bảo bất biến kho cốt lõi: `reserved <= on_hand`, tồn kho không bao giờ bị âm.
- Kỹ thuật giữ hàng nguyên tử: sử dụng CAS (Compare-And-Swap) với câu lệnh SQL UPDATE điều kiện nguyên tử:
  ```sql
  UPDATE inventory_items
  SET reserved = reserved + :qty, version = version + 1
  WHERE sku = :sku AND (on_hand - reserved) >= :qty
  ```
- Viết Unit/Integration Test đồng thời (`AtomicStockConcurrencyTest`):
  - Khởi tạo SKU với số lượng có hạn (10 đơn vị).
  - Bắn 50 request giữ hàng đồng thời bằng `Flux.range(1, 50).flatMap(...)` trên đa luồng Reactor Schedulers.
  - Khẳng định (Assert): số lượng giữ thành công chính xác bằng 10, 40 request còn lại bị từ chối với ngoại lệ `INSUFFICIENT_STOCK`, `reserved` luôn `<= on_hand`, không bao giờ xảy ra Race Condition hay overselling.

## 2. Kết quả kiểm thử
- Chạy kiểm thử tự động `AtomicStockConcurrencyTest`:
  ```bash
  mvn test -pl services/inventory-service -Dtest=AtomicStockConcurrencyTest
  ```
- Kết quả: `Tests run: 1, Failures: 0, Errors: 0, Skipped: 0` - PASSED 100%.
