# 📋 KẾ HOẠCH NÂNG CẤP BACKEND MICROSERVICES REACTIVE ENTERPRISE

> **Mã kế hoạch:** `modern-backend-upgrade-plan`  
> **Căn cứ nghiệp vụ:** [QT-07: Kiến Trúc Backend Microservices Enterprise](file:///d:/A_javaFW/WebBanMP/docs/flows/QT-07-modern-enterprise-backend-architecture.md)

---

## 6 TASK KỸ THUẬT CỐT LÕI

### Task 1: Chuẩn hóa `common-web` & `common-outbox` (Cross-Cutting Enterprise Core)
- `backend/common-web`:
  - `ErrorCode.java`: Định nghĩa bộ mã lỗi chuẩn `E1`–`E5` (`FORBIDDEN_ACCESS`, `RESOURCE_NOT_FOUND`, `DOMAIN_INVARIANT_VIOLATION`, `CONCURRENCY_OR_STOCK_CONFLICT`, `DUPLICATE_IDEMPOTENT_REQUEST`).
  - `ReactiveCorrelationFilter.java`: WebFilter tự động trích xuất/sinh `X-Correlation-Id`, đưa vào Reactor Context và gán vào HTTP Response Header.
  - Cập nhật `GlobalExceptionHandler.java`: Bổ sung correlationId vào RFC 9457 `ProblemDetail`.
  - Cập nhật `SecurityHeaderUtils.java`: Bổ sung hằng số `X-Correlation-Id` và `X-Shop-Id`.
- `backend/common-outbox`:
  - `TransactionalInbox.java`: Củng cố phương thức chống lặp sự kiện Idempotency.

### Task 2: Nâng cấp `api-gateway` & `account-service`
- `backend/api-gateway`:
  - Đảm bảo `JwtAuthGatewayFilter` truyền suốt `X-Correlation-Id`, `X-User-Id`, `X-User-Roles`, không buffer luồng SSE.
- `backend/account-service`:
  - Bổ sung `com.cosmetics.account.domain.AuditLogRecord` (Java 21 Record) để ghi nhận nhật ký kiểm toán cho các thao tác nhạy cảm của Admin và Seller.

### Task 3: Nâng cấp `catalog-service`
- `backend/catalog-service`:
  - Củng cố `CosmeticSafetySpecification`, `InciIngredient`, `Product` (CBMP format, chất cấm, `comedogenicRating`, `irritationRating`).
  - Đảm bảo các API quản lý sản phẩm của Seller tôn trọng cô lập `shopId`.

### Task 4: Nâng cấp `inventory-service`
- `backend/inventory-service`:
  - Thuật toán FEFO (`FefoAllocationPolicy`, `InventoryLot`), CAS atomic reserve (`StockItem.version`).
  - Bảo vệ Consumer bằng kiểm tra trùng lặp sự kiện.

### Task 5: Nâng cấp `order-service` & `payment-service`
- `backend/order-service`:
  - Tách đơn `Split Order`, `OrderLineSnapshot` (ACL), phân bổ giảm giá `ProRataDiscountCalculator` (`BigDecimal` `HALF_UP`), Java 21 `sealed interface OrderStatus`.
- `backend/payment-service`:
  - Khóa chặt `DoubleEntryLedger` bất biến $\sum \text{Debit} = \sum \text{Credit}$, quản lý `PLATFORM_ESCROW`, hạch toán 10% Sàn / 90% Shop.

### Task 6: Nâng cấp `ai-advisor-service`
- `backend/ai-advisor-service`:
  - Hybrid RAG (pgvector + lexical INCI + RRF qua `ReciprocalRankFusion`).
  - `DeterministicInciConflictEngine`, `SkinCyclingRoutineEngine`, Multi-Stage SSE stream (`/api/advisor/multi-stage-stream`).
