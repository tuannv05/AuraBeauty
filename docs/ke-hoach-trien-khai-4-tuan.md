# KẾ HOẠCH TRIỂN KHAI VÀ BẢNG PHÂN CÔNG NHIỆM VỤ DỰ ÁN (4 TUẦN)
**Đề tài:** Xây dựng Sàn Thương Mại Điện Tử Mỹ Phẩm Đa Người Bán (Multi-Vendor Cosmetics Platform – WebBanMP / Aura Beauty Mall)  
**Kiến trúc:** Microservices Reactive Non-blocking, DDD, Hexagonal, Saga Choreography + Transactional Outbox, AR Virtual Try-On, AI Advisor RAG  
**Đơn vị:** Nhóm Đồ án Tốt nghiệp / Chuyên đề Kỹ thuật Phần mềm  

---

## I. THÀNH VIÊN VÀ PHÂN HỆ PHỤ TRÁCH

| STT | Họ và tên | Mã sinh viên | Vai trò | Phân hệ phụ trách |
| :---: | :--- | :---: | :--- | :--- |
| **1** | **Nguyễn Văn Tuấn** | **2023603018** | Nhóm trưởng, Core Backend và Infra Architect | Hạ tầng Docker Compose, Maven Root, Common Libs, `api-gateway` (8080), `account-service` (8081), `inventory-service` (8084); Backend Seller và Admin; kiểm thử ArchUnit, BlockHound, k6, Chaos Test, Observability, dựng máy sạch. |
| **2** | **Nguyễn Viết Khánh** | **2023601808** | Catalog, Saga Order, Payment và AI Data Engineer | `catalog-service` (8082), `order-service` (8083), `payment-service` (8085), `ai-advisor-service` (8086); Công cụ crawler 154+ sản phẩm; kiểm toán dữ liệu, ảnh và Sổ cái kép. |
| **3** | **Nguyễn Văn Tuấn Anh** | **2023601651** | Frontend UI/UX, AR Engine và Multi-Zone Lead | Toàn bộ `/frontend` (cổng 3000): Buyer Zone (51 sub-menu), AR Virtual Try-On, 5 công cụ Beauty-Tech, Seller Zone (9 phân hệ), Admin Zone (9 phân hệ), Footer; kiểm thử UI/UX. |

---

## II. PHẠM VI KỸ THUẬT

| Thành phần | Cổng | Cơ sở dữ liệu | Công nghệ và vai trò | Phụ trách |
| :--- | :---: | :--- | :--- | :--- |
| **api-gateway** | `8080` | Không dùng DB | Quarkus Vert.x Reverse Proxy: định tuyến, CORS, bộ lọc JWT, SSE | Nguyễn Văn Tuấn |
| **account-service** | `8081` | PostgreSQL (`account_db`) | Quarkus Reactive PgPool, Mutiny: JWT, RBAC, SkinProfile, duyệt Shop | Nguyễn Văn Tuấn |
| **catalog-service** | `8082` | MongoDB (`catalog_db`) | Quarkus Panache MongoDB: sản phẩm, INCI, CBMP, 8 nhóm Facet Search | Nguyễn Viết Khánh |
| **inventory-service** | `8083` | PostgreSQL (`inventory_db`) | Quarkus Reactive PgPool: Giữ kho nguyên tử CAS, quản lý lô và hạn dùng FEFO | Nguyễn Văn Tuấn |
| **order-service** | `8084` | PostgreSQL (`order_db`) | Quarkus Reactive PgPool, Kafka: giỏ hàng đa Shop, Split Order, Outbox Relay | Nguyễn Viết Khánh |
| **payment-service** | `8085` | PostgreSQL (`payment_db`) | Quarkus Reactive PgPool, Kafka: Saga Choreography, Escrow, Sổ cái kép 10%/90% | Nguyễn Viết Khánh |
| **ai-advisor-service**| `8086` | PostgreSQL + pgvector (`ai_db`) | Quarkus Reactive PgPool: RAG tư vấn INCI và màu son qua Server-Sent Events (SSE) | Nguyễn Viết Khánh |
| **frontend** | `3000` | Không dùng DB | React 18, Vite 5, Tailwind CSS, Framer Motion: Buyer, Seller, Admin Zone | Nguyễn Văn Tuấn Anh |

---

## III. PHÂN TÍCH THIẾT KẾ HỆ THỐNG

Giai đoạn phân tích thiết kế được thực hiện ở đầu Tuần 1, theo trình tự: khảo sát bài toán, xác định yêu cầu, mô hình hóa use case, thiết kế kiến trúc, thiết kế cơ sở dữ liệu, thiết kế API, thiết kế luồng nghiệp vụ và thiết kế giao diện.

### 1. Mô tả bài toán
Sàn thương mại điện tử mỹ phẩm đa người bán cho phép nhiều gian hàng (Seller) đăng bán mỹ phẩm có Số công bố (CBMP). Người mua (Buyer) tìm kiếm theo loại da và thành phần INCI, đặt hàng từ nhiều gian hàng trong một lần thanh toán và được trợ lý AI tư vấn thành phần. Quản trị viên (Admin) kiểm duyệt gian hàng, sản phẩm và đối soát tài chính. Hệ thống dùng kiến trúc microservices reactive để xử lý đồng thời cao, không âm kho và nhất quán dữ liệu giao dịch.

### 2. Xác định tác nhân
| Tác nhân | Mô tả | Chức năng chính |
| :--- | :--- | :--- |
| **Khách vãng lai** | Người chưa đăng nhập | Xem danh mục, tìm kiếm, lọc Facet, xem chi tiết sản phẩm, thử son AR, đăng ký và đăng nhập |
| **Buyer** | Người mua đã đăng nhập | Giỏ hàng đa Shop, đặt hàng, theo dõi đơn, cập nhật Hồ sơ da, chat với AI Advisor |
| **Seller** | Chủ gian hàng | Đăng ký Shop, đăng sản phẩm kèm CBMP, quản lý kho và lô hàng, xử lý Sub-order, xem doanh thu, rút tiền ví |
| **Admin** | Quản trị sàn | Duyệt Shop và sản phẩm, quản lý người dùng, chiến dịch, xử lý tranh chấp, kiểm toán Sổ cái, giám sát hệ thống |
| **Staff** | Nhân viên vận hành | Hỗ trợ khách hàng, xử lý khiếu nại và theo dõi hệ thống với quyền hạn chế |

### 3. Yêu cầu chức năng
| Mã | Nhóm chức năng | Mô tả | Tác nhân |
| :---: | :--- | :--- | :--- |
| **FR01** | Tài khoản | Đăng ký, đăng nhập cấp JWT, phân quyền RBAC, cập nhật Hồ sơ da | Tất cả |
| **FR02** | Gian hàng | Đăng ký Shop, Admin duyệt hoặc từ chối | Seller, Admin |
| **FR03** | Sản phẩm | Đăng, sửa, biến thể (màu, dung tích), CBMP, thành phần INCI, kiểm duyệt | Seller, Admin |
| **FR04** | Tìm kiếm và lọc | Tìm từ khóa, lọc 8 nhóm Facet chuyên sâu da liễu | Khách, Buyer |
| **FR05** | Giỏ hàng | Giỏ hàng đa Shop, snapshot giá tại thời điểm thêm | Buyer |
| **FR06** | Đặt hàng | Checkout, Split Order thành Sub-order theo Shop, theo dõi trạng thái | Buyer |
| **FR07** | Tồn kho | Quản lý lô, hạn dùng FEFO, giữ hàng nguyên tử CAS, hoàn tồn | Seller, hệ thống |
| **FR08** | Thanh toán | Thanh toán mô phỏng, Escrow, Sổ cái kép, hoa hồng sàn 10% | Buyer, Admin |
| **FR09** | Xử lý đơn | Giao hàng hoặc từ chối Sub-order | Seller |
| **FR10** | Tư vấn AI | Chat SSE, phân tích INCI, cảnh báo xung đột hoạt chất, gợi ý theo Hồ sơ da | Buyer |
| **FR11** | Beauty-Tech | AR Try-On 3D 60 FPS, AI Skin Scanner, Skin Quiz, Lịch dưỡng da 28 ngày, Beauty Pass | Buyer |
| **FR12** | Quản trị | Duyệt Mall, xử lý tranh chấp, chiến dịch, antifraud, giám sát cụm microservices | Admin, Staff |

### 4. Yêu cầu phi chức năng
| Tiêu chí | Yêu cầu kỹ thuật |
| :--- | :--- |
| **Hiệu năng** | Luồng đầu SSE phản hồi dưới 1.5 giây; AR đạt 60 FPS; chịu tải đặt hàng đồng thời, kiểm chứng bằng k6 (>1.800 RPS) |
| **Nhất quán dữ liệu** | Nhất quán cuối cùng (Eventual Consistency) bằng Saga và Outbox; không mất, không xử lý trùng sự kiện; tồn kho không âm |
| **Bảo mật** | JWT, RBAC, mã hóa mật khẩu BCrypt, CORS tập trung, giới hạn tần suất truy cập Rate Limiting |
| **Chịu lỗi & bảo trì** | Resilience4j (Circuit Breaker, Retry); mỗi service một CSDL riêng; kiến trúc Hexagonal kiểm tra tự động bằng ArchUnit |
| **Khả dụng giao diện** | Responsive, hỗ trợ VI/EN, không có màn hình trắng nhờ Error Boundary & `submenuCatalogMapper` |

### 5. Mô hình Use Case
| Mã | Use case | Tác nhân | Service xử lý |
| :---: | :--- | :--- | :--- |
| **UC01** | Đăng ký, đăng nhập; cập nhật Hồ sơ da | Khách, Buyer | `account-service` |
| **UC02** | Tìm kiếm, lọc Facet; xem chi tiết, chọn biến thể | Khách, Buyer | `catalog-service`, `inventory-service` |
| **UC03** | Quản lý giỏ hàng đa Shop; theo dõi đơn hàng | Buyer | `order-service` |
| **UC04** | Đặt hàng (Split Order) | Buyer | `order-service`, `inventory-service`, `payment-service` |
| **UC05** | Tư vấn với AI Advisor (RAG + SSE) | Buyer | `ai-advisor-service` |
| **UC06** | Thử son AR, quét tông da | Buyer | `frontend`, `account-service` |
| **UC07** | Đăng ký gian hàng; đăng sản phẩm kèm CBMP | Seller | `account-service`, `catalog-service` |
| **UC08** | Quản lý kho và lô hàng; xử lý Sub-order | Seller | `inventory-service`, `order-service` |
| **UC09** | Duyệt Shop và sản phẩm | Admin | `account-service`, `catalog-service` |
| **UC10** | Kiểm toán Sổ cái, xử lý tranh chấp | Admin | `payment-service` |
| **UC11** | Giám sát cụm microservices | Admin, Staff | `api-gateway`, SmallRye Health |

### 6. Đặc tả Use Case tiêu biểu (UC04 – Đặt hàng Split Order)
| Thuộc tính | Nội dung chi tiết |
| :--- | :--- |
| **Tác nhân** | Buyer |
| **Tiền điều kiện** | Buyer đã đăng nhập; giỏ hàng có sản phẩm từ một hoặc nhiều Shop |
| **Luồng chính** | 1. Buyer chọn Checkout.<br>2. `order-service` tạo Parent Order, tách thành Sub-order theo Shop, ghi `outbox_events` cùng giao dịch.<br>3. Outbox Relay phát sự kiện `OrderCreated` lên Kafka topic `order-events`.<br>4. `inventory-service` giữ hàng bằng câu lệnh CAS nguyên tử, phát `StockReserved`.<br>5. `payment-service` xử lý thanh toán, ghi Sổ cái kép, phát `PaymentCompleted`.<br>6. `order-service` chuyển các Sub-order sang `CONFIRMED`; Buyer nhận kết quả. |
| **Luồng thay thế** | A1. Hết hàng: phát `StockReservationFailed`, đơn bị hủy.<br>A2. Thanh toán lỗi: phát `PaymentFailed`, `inventory-service` nhả kho (bù trừ), đơn bị hủy. |
| **Hậu điều kiện** | Tồn kho không âm; Tổng Nợ bằng Tổng Có; mỗi Sub-order thuộc đúng một Shop |

### 7. Thiết kế kiến trúc
Luồng tổng thể: React SPA (cổng 3000) gọi REST và nhận SSE qua `api-gateway` (8080); gateway xác thực JWT rồi chuyển tới 6 service (Quarkus 3.15 Mutiny Reactive), mỗi service một CSDL riêng; các service giao tiếp bất đồng bộ qua Apache Kafka 3.8.
- **Hexagonal Architecture:** Phân tách rõ `Domain` (Java 21 thuần) $\leftarrow$ `Application/Port` $\leftarrow$ `Adapter` (In/Out).
- **Saga Choreography:** Điều phối phân tán sự kiện qua Kafka Broker với cơ chế bù trừ tự động.
- **Transactional Outbox:** Đảm bảo tính nhất quán tuyệt đối giữa ghi cơ sở dữ liệu và phát sự kiện Kafka.
- **Double-Entry Ledger:** Bất biến kế toán $\sum \text{Debit} = \sum \text{Credit}$, trích 10% hoa hồng sàn, 90% tạm giữ Escrow cho Seller.

### 8. Thiết kế cơ sở dữ liệu
| CSDL | Bảng / Collection | Trường chính |
| :--- | :--- | :--- |
| **account_db** | `users`, `shops`, `skin_profiles`, `addresses` | `users(id, email, password_hash, role)`; `shops(id, owner_id, name, status)`; `skin_profiles(user_id, skin_type, skin_tone_hex, skin_undertone)` |
| **catalog_db** (Mongo) | `products`, `inci_ingredients` | `products{shopId, name, brand, cbmpNo, status, variants[sku, colorHex, volume, price], inciList}`; `inci_ingredients{name, comedogenicRating, irritation}` |
| **order_db** | `carts`, `cart_items`, `orders`, `sub_orders`, `outbox_events` | `orders(id, buyer_id, total, status)`; `sub_orders(id, order_id, shop_id, amount, status)`; `outbox_events(id, type, payload, sent)` |
| **inventory_db** | `stock_items`, `stock_batches`, `stock_reservations` | `stock_items(sku_id, on_hand, reserved, version)`; `stock_batches(batch_no, mfg, exp, qty)` |
| **payment_db** | `payments`, `ledger_entries`, `wallets` | `payments(id, order_id, amount, status)`; `ledger_entries(id, tx_id, account, debit, credit)` |
| **ai_db** (pgvector) | `product_embeddings`, `inci_embeddings`, `chat_messages` | `knowledge_chunks(id, content, embedding vector(384))`; `chat_messages(id, user_id, message, created_at)` |

### 9. Thiết kế API (Truy cập qua api-gateway :8080)
- `POST /api/auth/register`, `POST /api/auth/login` (Auth)
- `POST /api/shops/register`, `PUT /api/admin/shops/{id}/approval` (Shop Mall)
- `GET /api/products` (Facet search 8 chiều), `GET /api/products/{id}` (Catalog)
- `POST /api/orders` (Checkout Split Order), `GET /api/orders/my` (Tra cứu đơn)
- `GET /api/inventory/{sku}` (Tồn kho SKU)
- `POST /api/payments` (Thanh toán Escrow), `GET /api/ledger` (Kiểm toán Sổ cái)
- `GET /api/v1/ai/chat/stream` (SSE Chat tư vấn streaming)

---

## IV. KẾ HOẠCH CHI TIẾT THEO TỪNG TUẦN

### Tuần 1: Hạ tầng, kiến trúc Hexagonal, Account, Catalog, dữ liệu 154+ sản phẩm và khung giao diện
| STT | Hạng mục công việc | Phụ trách | Đầu ra và tiêu chí kiểm chứng |
| :---: | :--- | :--- | :--- |
| 1 | – Thiết kế kiến trúc, luồng Saga, bảo mật và danh sách API (Phần III)<br>– Khởi tạo kho Git, Maven multi-module, cấu trúc Clean Root, `AGENTS.md`, `CLAUDE.md`, quy ước nhánh<br>– Docker Compose hạ tầng: PostgreSQL 16 + pgvector, MongoDB 7, Kafka 3.8, Kafka UI; script tạo 5 database; viết 4 ADR | Nguyễn Văn Tuấn | `docker compose ps` báo 4 container chạy; 4 ADR tại `/docs/architecture/adr`; `mvn clean test-compile` xanh |
| 2 | – Hexagonal Service Template và 3 thư viện dùng chung (`common-domain`, `common-web`, `common-events`); bài test ArchUnit mẫu<br>– `account-service` (8081): đăng ký, đăng nhập JWT, RBAC Buyer/Seller/Admin/Staff, SkinProfile, duyệt Shop<br>– `api-gateway` (8080): định tuyến, CORS, bộ lọc JWT | Nguyễn Văn Tuấn | `HexagonalArchitectureTest` pass 100%; gọi API qua cổng 8080, sai quyền trả 401/403 |
| 3 | – Khảo sát, phân tích yêu cầu, use case, sơ đồ tuần tự (Phần III); DDD chiến lược (6 Bounded Context), Backlog<br>– Thiết kế Document model MongoDB `catalog_db` (Product, Variant, INCI, CBMP, VtoConfig) và ERD PostgreSQL | Nguyễn Viết Khánh | Context Map, ERD, MongoDB Schema, script khởi tạo; schema bao phủ INCI, CBMP, biến thể |
| 4 | – `catalog-service` (8082): Domain Java 21, REST API sản phẩm, duyệt CBMP, Facet Search 8 nhóm, biến thể<br>– `/ai/cosmetics-crawler` (nguồn công khai, tôn trọng robots.txt): thu thập, chuẩn hóa, nạp 154+ sản phẩm, ảnh thật không trùng MD5 | Nguyễn Viết Khánh | ArchUnit catalog pass; script kiểm toán báo `duplicatePhotos = 0`, `svgCount = 0` |
| 5 | – Thiết kế wireframe 3 phân khu (Phần III)<br>– Khởi tạo `/frontend` (React 18, Vite 5, Tailwind, Framer Motion); Design System và bộ Animate UI Kit | Nguyễn Văn Tuấn Anh | `npm run build` 0 lỗi; trang hiển thị đủ component Animate UI |
| 6 | – App Shell 3 phân khu, Error Boundary, Top Bar, Header tìm kiếm, Mega Menu 7 phân hệ (51 sub-menu), Popup Auth nối API<br>– Trang danh sách sản phẩm có bộ lọc Facet, hiển thị dữ liệu thật | Nguyễn Văn Tuấn Anh | Click 51 sub-menu đúng, không trắng màn hình; đăng nhập thật thành công |
| 7 | Kiểm thử tích hợp đăng ký, duyệt Shop, đăng sản phẩm qua gateway; viết `evidence-log week-1`; họp nghiệm thu | Cả 3 thành viên | **Mốc M1:** đăng nhập, duyệt Shop, danh mục dữ liệu thật hiển thị trên giao diện |

### Tuần 2: Kho nguyên tử CAS, giỏ hàng đa biến thể, Saga Split Order và Sổ cái kép
| STT | Hạng mục công việc | Phụ trách | Đầu ra và tiêu chí kiểm chứng |
| :---: | :--- | :--- | :--- |
| 1 | `inventory-service` (8083): bảng tồn theo sku, lô (Batch No, MFG, EXP); giữ hàng nguyên tử CAS (Optimistic Locking); FEFO, cảnh báo cận date dưới 6 tháng; API hoàn tồn | Nguyễn Văn Tuấn | `AtomicStockConcurrencyTest` pass 100%, tồn không âm |
| 2 | – Kafka Topics/Partitions, Idempotent Consumer; Saga phía inventory (`StockReserved`, nhả kho khi thanh toán lỗi)<br>– BlockHound trên luồng Đặt hàng, Giữ kho, Thanh toán, Tách đơn; ArchUnit mọi service | Nguyễn Văn Tuấn | Không có lệnh blocking trên EventLoop; sự kiện gửi trùng chỉ xử lý 1 lần |
| 3 | – `order-service` (8084): giỏ hàng đa Shop, Price Snapshot từ catalog, State Machine đơn hàng<br>– Split Order: Parent Order tách thành Sub-order theo Shop, ghi `outbox_events` cùng giao dịch | Nguyễn Viết Khánh | Đơn 3 Shop sinh 1 Parent và 3 Sub-order; giá không đổi khi catalog sửa giá |
| 4 | – Outbox Relay worker đẩy Kafka bằng Reactor Kafka<br>– `payment-service` (8085): thanh toán mô phỏng, Saga Choreography Order, Inventory, Payment, bù trừ khi lỗi<br>– Sổ cái kép: bút toán Nợ/Có cân bằng, tách 10% hoa hồng sàn, 90% Escrow cho Seller | Nguyễn Viết Khánh | $\sum \text{Debit} = \sum \text{Credit}$; thanh toán lỗi tự hủy đơn và nhả kho |
| 5 | – PDP và Variant Selector (màu kèm swatch HEX, dung tích; đổi ảnh, giá, tồn theo SKU), QuickView Modal<br>– CartDrawer gom theo Shop; Checkout tách dòng theo SKU và theo Shop | Nguyễn Văn Tuấn Anh | 2 màu khác nhau tạo 2 dòng SKU; đặt thử đơn hiển thị đúng Sub-order |
| 6 | Trang Vấn đề da và Hoạt chất, Thương hiệu (Official Brand Mall), Flash Sale -50%, Bán chạy, Hàng mới về, Menu người dùng 6 submenu | Nguyễn Văn Tuấn Anh | Bộ lọc Facet chuyển trang tức thì, 0 lỗi console |
| 7 | Kiểm thử End-to-End: chọn màu, giỏ 3 Shop, Checkout, Split Order, giữ kho CAS, thanh toán, ghi sổ cái 10%/90%; test thanh toán thất bại; viết `evidence-log week-2`; họp nghiệm thu | Cả 3 thành viên | **Mốc M2:** đơn đa Shop tách đúng, kho không âm, sổ cái khớp 100% |

### Tuần 3: AI Advisor (RAG pgvector, SSE), AR Virtual Try-On, Seller Zone và Admin Zone
| STT | Hạng mục công việc | Phụ trách | Đầu ra và tiêu chí kiểm chứng |
| :---: | :--- | :--- | :--- |
| 1 | – `ai-advisor-service` (8086): kho tri thức pgvector, nhúng vector 154+ sản phẩm và từ điển INCI<br>– RAG truy vấn và API chat SSE; ngữ cảnh SkinProfile; cảnh báo xung đột hoạt chất (Retinol + BHA); gợi ý màu son theo Undertone | Nguyễn Viết Khánh | Dòng đầu SSE dưới 1.5 giây; da dầu và da khô nhận gợi ý khác nhau |
| 2 | – API duyệt GPKD/CBMP; quét chất cấm INCI (Corticoid, Thủy ngân, Hydroquinone)<br>– API tranh chấp Escrow, rút tiền ví Shop, đối soát Sổ cái cho Admin | Nguyễn Viết Khánh | Sản phẩm chứa chất cấm bị gắn cờ; Tổng Nợ vẫn bằng Tổng Có sau tranh chấp |
| 3 | – `account-service`: API lưu kết quả AI Skin Scanner; gateway hỗ trợ SSE không buffer<br>– Backend Seller (kho đa điểm Smart Routing, xử lý Sub-order) và Admin (duyệt Shop, người dùng, chiến dịch, antifraud, giám sát) | Nguyễn Văn Tuấn | Seller chỉ thấy Sub-order của Shop mình; Staff không gọi được API của Admin |
| 4 | Tích hợp API vào frontend, sửa lỗi CORS, JWT, phân quyền; chuẩn hóa mã lỗi; rate limiting và kiểm thử bảo mật cơ bản | Nguyễn Văn Tuấn | Token giả bị chặn; vượt giới hạn trả 429; test pass |
| 5 | – AR Virtual Try-On: MediaPipe FaceLandmarker 478 điểm 3D, hook `useVirtualTryOn`, PBR Blending (Matte, Velvet, Glossy, Satin), Before/After, Mix & Match, nút Mua Trọn Bộ Đang Thử<br>– Giao diện chat AI Advisor nhận SSE | Nguyễn Văn Tuấn Anh | AR đạt 60 FPS; combo đang thử vào giỏ đúng SKU |
| 6 | – AI Skin Scanner (ITA, Undertone), Skin Quiz, Lịch dưỡng da 28 ngày, Beauty Pass<br>– Seller Zone 9 phân hệ, Admin Zone 9 phân hệ, Footer 4 cột 15 trang | Nguyễn Văn Tuấn Anh | Click đủ 9 tab Seller, 9 tab Admin, 15 link Footer, 0% màn hình trắng |
| 7 | Tích hợp luồng Demo 5 bước: Seller đăng son kèm HEX và CBMP, Buyer quét da AI, thử son AR, hỏi AI Advisor qua SSE, mua Combo kích hoạt Split Order; viết `evidence-log week-3`; họp nghiệm thu | Cả 3 thành viên | **Mốc M3:** luồng Demo 5 bước chạy suốt trên trình duyệt |

### Tuần 4: Kiểm thử tải, Chaos Saga, giám sát, dựng máy sạch, đóng băng mã nguồn và bảo vệ
| STT | Hạng mục công việc | Phụ trách | Đầu ra và tiêu chí kiểm chứng |
| :---: | :--- | :--- | :--- |
| 1 | – Resilience4j (Circuit Breaker, Retry, TimeLimiter)<br>– k6 Load Test (đặt hàng đồng thời, chat SSE), ghi p95/p99<br>– Chaos Saga Test: giả lập sập Kafka hoặc payment-service, kiểm chứng Outbox Relay và Saga tự phục hồi | Nguyễn Văn Tuấn | Không mất, không lặp đơn, không lệch tồn kho; có số liệu p95/p99 |
| 2 | – Observability: Actuator, Health Probes, Metrics, Kafka UI<br>– Dựng máy sạch (Clean-Slate) trên môi trường mới, viết README hướng dẫn chạy<br>– Code Freeze, gắn tag `post-restructure`, chạy bộ lệnh kiểm định cuối | Nguyễn Văn Tuấn | Đủ 7 service ở trạng thái UP trên máy mới; bộ lệnh kiểm định pass |
| 3 | – Kiểm toán 100% sản phẩm trên 51 sub-menu (ảnh, INCI, CBMP), dữ liệu vector, đối chiếu Sổ cái sau tải<br>– Integration Test Saga bù trừ (thanh toán lỗi, hết kho, sự kiện trùng); tài liệu OpenAPI, dữ liệu mẫu | Nguyễn Viết Khánh | Báo cáo kiểm toán: 0 ảnh trùng, chênh lệch sổ cái bằng 0 |
| 4 | – Rà soát UI/UX từng cú click (51 sub-menu, Top Bar, 5 công cụ Beauty-Tech, Seller, Admin, Footer); tối ưu hiệu năng, tương thích desktop, tablet, mobile<br>– Trang Giám sát cụm Microservices trong Admin Zone | Nguyễn Văn Tuấn Anh | `npm run build` đạt chuẩn production; trang giám sát hiển thị đúng trạng thái |
| 5 | Mỗi người viết phần báo cáo mình phụ trách; tổng hợp hồ sơ Word/PDF, slide, 4 thư mục evidence (`week-1` đến `week-4`); diễn tập 3 lần Kịch bản Demo 5 bước; nộp | Cả 3 thành viên | **Mốc M4:** pass bộ lệnh kiểm định cuối; diễn tập đủ 3 lần |

---

## V. MA TRẬN PHÂN CÔNG TRÁCH NHIỆM (RACI)

*Quy ước:* **R** (Responsible - trực tiếp thực thi); **A** (Accountable - chịu trách nhiệm nghiệm thu); **C** (Consulted - tham vấn); **I** (Informed - nắm thông tin).

| STT | Hạng mục | Nguyễn Văn Tuấn | Nguyễn Viết Khánh | Nguyễn Văn Tuấn Anh |
| :---: | :--- | :---: | :---: | :---: |
| 1 | Kiến trúc tổng thể, Docker Compose, Kafka, ArchUnit, BlockHound | **R / A** | C | I |
| 2 | API Gateway, Account Service, Inventory Service (CAS, FEFO) | **R / A** | C | I |
| 3 | Catalog Service (INCI, CBMP, Facet) và crawler 154+ sản phẩm | C | **R / A** | C |
| 4 | Order Service, Payment Service (Saga, Sổ cái kép) | C | **R / A** | I |
| 5 | AI Advisor Service (RAG pgvector, SSE) | C | **R / A** | C |
| 6 | Buyer Zone, AR Virtual Try-On và 5 công cụ Beauty-Tech | I | C | **R / A** |
| 7 | Seller Zone, Admin Zone, Footer | C | C | **R / A** |
| 8 | Backend cho Seller Zone và Admin Zone | **R / A** | R | C |
| 9 | Resilience4j, k6, Chaos Test, Observability, dựng máy sạch | **R / A** | C | C |
| 10 | Kiểm toán dữ liệu, ảnh và Sổ cái; kiểm thử UI/UX | I | **R / A** | **R / A** |
| 11 | Hồ sơ báo cáo, slide, diễn tập Demo (mỗi người phần mình) | **R / A** | R | R |

---

## VI. QUY ƯỚC LÀM VIỆC VÀ RỦI RO

- **Họp đứng hằng ngày:** 15 phút mỗi ngày; mỗi đầu việc làm trên nhánh `feature/*` riêng, có Pull Request và review chéo trước khi gộp.
- **Hợp đồng API & Sự kiện:** Khóa trong `common-events` từ đầu Tuần 1; mọi thay đổi phải báo trong buổi họp.
- **Nghiệm thu tuần:** Cuối mỗi tuần họp nghiệm thu chung, viết `evidence-log` (`week-1` đến `week-4`) và cập nhật Backlog.

| STT | Rủi ro tiềm ẩn | Phương án dự phòng kiến trúc | Phụ trách |
| :---: | :--- | :--- | :--- |
| **1** | Trễ tiến độ ở hạng mục AR và RAG | Làm trước luồng cốt lõi (đặt hàng, Saga, sổ cái); AR và RAG làm bản tối thiểu rồi nâng cấp; dùng cuối Tuần 3 và Tuần 4 làm quỹ thời gian đệm | Nguyễn Văn Tuấn |
| **2** | Lỗi blocking trên EventLoop | Chạy BlockHound trong test hằng ngày; ArchUnit chặn JDBC | Nguyễn Văn Tuấn |
| **3** | Nguồn dữ liệu crawler hoặc mô hình AI không truy cập được | Lưu sẵn bộ dữ liệu 154 sản phẩm và ảnh đã tải tại `ai/cosmetics-crawler/output/`; cấu hình fallback thông minh | Nguyễn Viết Khánh |
| **4** | AR không đạt 60 FPS trên máy yếu | Giảm độ phân giải camera, tối ưu vòng render Canvas WebGL, hỗ trợ chế độ swatch màu tĩnh dự phòng | Nguyễn Văn Tuấn Anh |

---

## VII. PHÂN CÔNG TRÌNH BÀY DEMO VÀ NGHIỆM THU CUỐI

### 1. Phân công vai diễn Demo trước Hội đồng
- **Nguyễn Văn Tuấn:** Kiến trúc Microservices Reactive, Hexagonal; chứng minh `HexagonalArchitectureTest` và `AtomicStockConcurrencyTest`; bảng giám sát 7 microservice và Kafka Outbox.
- **Nguyễn Viết Khánh:** Dữ liệu 154+ sản phẩm chuẩn INCI và CBMP, Facet Search, AI Advisor (RAG, SSE), Split Order và đối soát Sổ cái kép.
- **Nguyễn Văn Tuấn Anh:** Mega Menu 51 sub-menu, chọn biến thể màu son, AI Skin Scanner, AR Virtual Try-On 60 FPS, xử lý đơn trên Seller Zone.

### 2. Tiêu chí nghiệm thu cuối cùng (Acceptance Criteria)
| STT | Tiêu chí nghiệm thu | Cách kiểm chứng tự động | Phụ trách |
| :---: | :--- | :--- | :--- |
| **1** | Kiến trúc Hexagonal đúng chuẩn; kho không âm khi đặt đồng thời | `HexagonalArchitectureTest` và `AtomicStockConcurrencyTest` pass 100% | Nguyễn Văn Tuấn |
| **2** | Split Order, Saga bù trừ, Sổ cái kép cân đối | Test thanh toán thành công và thất bại; Tổng Nợ = Tổng Có | Nguyễn Viết Khánh |
| **3** | AI Advisor phản hồi stream nhanh; dữ liệu và ảnh sạch | Dòng đầu SSE dưới 1.5 giây; `duplicatePhotos = 0`, `svgCount = 0` | Nguyễn Viết Khánh |
| **4** | Giao diện không lỗi; AR mượt | `npm run build` 0 lỗi, 0% trắng màn hình; AR đạt 60 FPS | Nguyễn Văn Tuấn Anh |
| **5** | Dựng máy sạch bằng các lệnh trong README | Docker Compose, Maven, Vite chạy đủ 7 service ở trạng thái UP | Nguyễn Văn Tuấn |
| **6** | Bộ minh chứng đầy đủ | 4 thư mục evidence, báo cáo Word/PDF, slide, kịch bản Demo | Cả 3 thành viên |
