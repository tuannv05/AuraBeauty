# Chi Tiết Thiết Kế Aggregates & Invariants

Tài liệu này đặc tả chi tiết các Aggregate Root, Entities con, Value Objects và các Business Invariants cho từng Service.

---

## 1. Account Context (`account-service`)

### 1.1 Aggregate Root: `User`
- **Fields:**
  - `id`: UUID (Primary Key)
  - `email`: String (Unique, Indexed)
  - `passwordHash`: String (BCrypt)
  - `fullName`: String
  - `phone`: String
  - `roles`: Set<Role> (`ROLE_BUYER`, `ROLE_SELLER`, `ROLE_ADMIN`)
  - `status`: UserStatus (`ACTIVE`, `SUSPENDED`)
  - `createdAt`, `updatedAt`: Instant
- **Invariants:**
  - Email phải có định dạng hợp lệ và là duy nhất trong toàn hệ thống.
  - Mật khẩu khi lưu vào DB bắt buộc phải qua hàm băm an toàn (BCrypt).
  - Không thể tự ý gán quyền `ROLE_ADMIN` qua API công khai.

### 1.2 Entity: `SkinProfile` (gắn với `User`)
- **Fields:**
  - `userId`: UUID (Khóa ngoại trỏ đến `User`)
  - `skinType`: SkinType (`OILY`, `DRY`, `COMBINATION`, `SENSITIVE`, `NORMAL`)
  - `concerns`: List<String> (e.g., `["acne", "aging", "dark_spots"]`)
  - `allergies`: List<String> (Danh sách thành phần INCI mà Buyer dị ứng)
- **Invariants:**
  - Mỗi Buyer chỉ có 1 Skin Profile duy nhất. Chỉ chính chủ sở hữu mới có quyền đọc và chỉnh sửa (`userId == principal.id`).

### 1.3 Aggregate Root: `Shop`
- **Fields:**
  - `id`: UUID
  - `ownerId`: UUID (Trỏ tới `User` có `ROLE_SELLER`)
  - `shopName`: String (Unique)
  - `description`: String
  - `status`: ShopStatus (`PENDING`, `APPROVED`, `REJECTED`)
  - `businessRegistrationNo`: String
  - `createdAt`, `updatedAt`: Instant
- **Invariants:**
  - Mỗi Seller ban đầu chỉ được tạo 1 Shop ở trạng thái `PENDING`.
  - Chỉ khi Admin duyệt chuyển sang `APPROVED`, Shop mới có quyền đăng sản phẩm và bán hàng.

---

## 2. Catalog Context (`catalog-service`)

### 2.1 Aggregate Root: `Product`
- **Fields:**
  - `id`: String (Mongo ObjectId)
  - `shopId`: UUID (ID của Shop sở hữu)
  - `name`: String
  - `brand`: String
  - `description`: String
  - `category`: String
  - `registrationNo`: String (Số tiếp nhận phiếu công bố mỹ phẩm)
  - `suitableSkinTypes`: List<SkinType>
  - `ingredients`: List<Ingredient> (Chứa tên INCI, chức năng)
  - `variants`: List<Variant> (Các biến thể kích thước, màu sắc, SKU)
  - `status`: ProductStatus (`DRAFT`, `SUBMITTED`, `PUBLISHED`, `REJECTED`, `DEACTIVATED`)
  - `images`: List<String> (URLs)
- **Entities & Value Objects:**
  - `Variant`: `skuCode` (Unique), `name`, `price`, `originalPrice`, `attributes` (Map<String, String>)
  - `Ingredient`: `inciName`, `function`, `isPotentialIrritant`
- **Invariants:**
  - Sản phẩm phải có ít nhất 1 Variant hợp lệ với `price > 0`.
  - Phải có `registrationNo` không rỗng mới được chuyển từ `SUBMITTED` sang `PUBLISHED`.
  - Chỉ Seller sở hữu Shop tạo ra sản phẩm mới có quyền sửa đổi sản phẩm đó.
  - Khi tìm kiếm công khai, chỉ trả về các sản phẩm có `status == PUBLISHED`.

---

## 3. Order Context (`order-service`)

### 3.1 Aggregate Root: `Cart`
- **Fields:**
  - `userId`: UUID (Khóa phân vùng Cart)
  - `items`: List<CartItem> (`skuCode`, `productId`, `shopId`, `productName`, `unitPrice`, `quantity`)
  - `updatedAt`: Instant
- **Invariants:**
  - Thêm cùng 1 `skuCode` thì cộng dồn số lượng. `quantity` luôn $> 0$.

### 3.2 Aggregate Root: `Order`
- **Fields:**
  - `id`: UUID
  - `buyerId`: UUID
  - `status`: OrderStatus (`CREATED`, `PENDING_PAYMENT`, `PAID`, `CANCELLED`, `COMPLETED`)
  - `totalAmount`: BigDecimal
  - `shippingAddress`: ShippingAddress (Họ tên, SĐT, Địa chỉ chi tiết)
  - `subOrders`: List<SubOrder>
  - `createdAt`, `updatedAt`: Instant
- **Entities:**
  - `SubOrder`:
    - `id`: UUID
    - `shopId`: UUID
    - `status`: SubOrderStatus (`PENDING`, `READY_FOR_PROCESSING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `REJECTED`, `REFUNDED`)
    - `subTotal`: BigDecimal
    - `lines`: List<OrderLine> (`skuCode`, `productName`, `quantity`, `unitPrice`, `lineTotal`)
- **Invariants:**
  - `totalAmount` của Order bắt buộc phải bằng tổng `subTotal` của tất cả các `SubOrder`.
  - `subTotal` của từng `SubOrder` bắt buộc bằng tổng `lineTotal` của các `OrderLine` thuộc SubOrder đó.
  - Các dòng sản phẩm của cùng một Shop bắt buộc phải gom vào đúng một `SubOrder`.

---

## 4. Inventory Context (`inventory-service`)

### 4.1 Aggregate Root: `StockItem`
- **Fields:**
  - `skuCode`: String (Primary Key)
  - `productId`: String
  - `shopId`: UUID
  - `onHand`: Integer (Số lượng tồn kho thực tế trong kho)
  - `reserved`: Integer (Số lượng đang được giữ tạm thời cho các đơn chờ thanh toán)
  - `version`: Long (Optimistic Locking)
- **Invariants:**
  - Ràng buộc DB: `CHECK (reserved >= 0 AND reserved <= on_hand)`.
  - Tồn kho khả dụng (Available) $= \text{onHand} - \text{reserved} \ge 0$.
  - Mọi thao tác giữ hàng phải qua câu lệnh UPDATE nguyên tử:
    ```sql
    UPDATE stock_items 
    SET reserved = reserved + :qty 
    WHERE sku_code = :skuCode AND (on_hand - reserved) >= :qty;
    ```

### 4.2 Entity: `Reservation`
- **Fields:**
  - `id`: UUID
  - `orderId`: UUID
  - `skuCode`: String
  - `quantity`: Integer
  - `expiresAt`: Instant (TTL 15 phút)
  - `status`: ReservationStatus (`ACTIVE`, `CONFIRMED`, `RELEASED`)

---

## 5. Payment Context (`payment-service`)

### 5.1 Aggregate Root: `Payment`
- **Fields:**
  - `id`: UUID
  - `orderId`: UUID
  - `buyerId`: UUID
  - `amount`: BigDecimal
  - `paymentMethod`: PaymentMethod (`MOCK_GATEWAY`, `COD`)
  - `status`: PaymentStatus (`PENDING`, `SUCCESS`, `FAILED`, `REFUNDED`)
  - `createdAt`: Instant

### 5.2 Aggregate Root: `LedgerEntry` (Double-entry Bookkeeping)
- **Fields:**
  - `id`: UUID
  - `transactionId`: UUID (Trỏ đến PaymentId hoặc SubOrderId)
  - `accountDebit`: AccountType (`ESCROW_HOLDING`, `SELLER_PAYABLE`, `PLATFORM_REVENUE`, `BUYER_REFUND`)
  - `accountCredit`: AccountType
  - `amount`: BigDecimal
  - `entryType`: EntryType (`ORDER_PAYMENT`, `COMMISSION_FEE`, `SELLER_PAYOUT`, `REFUND`)
  - `recordedAt`: Instant
- **Invariants:**
  - Bất biến kế toán: Tổng số tiền ghi Nợ luôn luôn bằng Tổng số tiền ghi Có trong cùng giao dịch.
  - Không bao giờ ghi hoàn tiền vượt quá số tiền ban đầu đã hạch toán vào `ESCROW_HOLDING`.

---

## 6. AI Advisor Context (`ai-advisor-service`)

### 6.1 Aggregate Root: `KnowledgeChunk`
- **Fields:**
  - `id`: UUID
  - `productId`: String
  - `shopId`: UUID
  - `title`: String
  - `chunkText`: String (Nội dung trích đoạn: tên, thành phần INCI, loại da, mô tả)
  - `metadata`: JSONB (Lưu danh sách INCI, thích hợp da gì, thương hiệu)
  - `embedding`: Vector(N) (Chỉ mục HNSW cosine similarity)
- **Invariants:**
  - Mỗi chunk trích xuất luôn có liên kết rõ ràng đến một `productId`.
  - Khi sản phẩm bị xóa hoặc chuyển trạng thái `DEACTIVATED`, toàn bộ chunk của `productId` đó phải bị xóa khỏi hệ thống.

### 6.2 Aggregate Root: `Conversation`
- **Fields:**
  - `id`: UUID
  - `userId`: UUID (hoặc Anonymous Session ID)
  - `messages`: List<Message> (`role`, `content`, `citations`, `createdAt`)
- **Invariants:**
  - Lịch sử đối thoại lưu theo thứ tự thời gian. Mỗi phản hồi từ trợ lý ghi nhận danh sách ID các `KnowledgeChunk` làm bằng chứng trích dẫn nguồn.
