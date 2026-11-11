# KẾ HOẠCH TỔNG THỂ & PHÂN CÔNG TRIỂN KHAI DỰ ÁN 4 TUẦN (28 NGÀY)
## SÀN THƯƠNG MẠI ĐIỆN TỬ MỸ PHẨM ĐA GIAN HÀNG (AURA BEAUTY MALL / WEBBANMP)

> **Cương vị:** Principal Enterprise Software Architect & Agile Project Manager  
> **Phiên bản tài liệu:** v1.0.0 — Production-Ready Agile Blueprint  
> **Quy mô dự án:** Hệ thống phân tán Reactive Microservices (7 Services Quarkus 3.15 Mutiny Reactive, AI RAG pgvector, 154+ Sản phẩm thực tế & Frontend React 18 + Vite)  
> **Thời gian triển khai:** 4 Tuần (28 Ngày làm việc liên tục)  
> **Đội ngũ nòng cốt (Core Engineering Team):** 03 Kỹ sư phần mềm  

---

## 📑 MỤC LỤC
1. [Hiến chương Dự án & 4 Nguyên Tắc Kỹ Thuật Cốt Lõi](#1-hiến-chương-dự-án--4-nguyên-tắc-kỹ-thuật-cốt-lõi)
2. [Phần I: Bảng Định Vị Vai Trò & Phân Chia Trách Nhiệm (RACI Matrix)](#phần-i-bảng-định-vị-vai-trò--phân-chia-trách-nhiệm-raci-matrix)
3. [Phần II: Lộ Trình Triển Khai Chi Tiết Từng Ngày Trong 4 Tuần (28 Ngày)](#phần-ii-lộ-trình-triển-khai-chi-tiết-từng-ngày-trong-4-tuần-28-ngày)
   - [Tuần 1 (Ngày 1 – 7): Khởi tạo Hạ tầng, Hexagonal, Account, Catalog, Crawler 154+ & Khung Buyer Zone](#tuần-1-ngày-1--7-khởi-tạo-hạ-tầng-hexagonal-account-catalog-crawler-154--khung-buyer-zone)
   - [Tuần 2 (Ngày 8 – 14): Inventory CAS, Split Order, Double-Entry Ledger & Bộ Chọn Biến Thể Shopee Mall](#tuần-2-ngày-8--14-inventory-cas-split-order-double-entry-ledger--bộ-chọn-biến-thể-shopee-mall)
   - [Tuần 3 (Ngày 15 – 21): AI Advisor RAG SSE, AR Virtual Try-On 3D & Hoàn Thiện 100% Seller, Admin, Footer](#tuần-3-ngày-15--21-ai-advisor-rag-sse-ar-virtual-try-on-3d--hoàn-thiện-100-seller-admin-footer)
   - [Tuần 4 (Ngày 22 – 28): Resilience4j, k6 Load Test, Chaos Saga, Clean-Slate & Diễn Tập Bảo Vệ](#tuần-4-ngày-22--28-resilience4j-k6-load-test-chaos-saga-clean-slate--diễn-tập-bảo-vệ)
4. [Phần III: Danh Mục 14 Bộ Hồ Sơ Minh Chứng (Evidence Logs Portfolio)](#phần-iii-danh-mục-14-bộ-hồ-sơ-minh-chứng-evidence-logs-portfolio)
5. [Phần IV: Tiêu Chuẩn Nghiệm Thu Kỹ Thuật (Goal-Driven Verification Checklist)](#phần-iv-tiêu-chuẩn-nghiệm-thu-kỹ-thuật-goal-driven-verification-checklist)
6. [Phần V: Ma Trận Quản Trị Rủi Ro & Kịch Bản Ứng Phó (Risk Mitigation)](#phần-v-ma-trận-quản-trị-rủi-ro--kịch-bản-ứng-phó-risk-mitigation)

---

## 1. HIẾN CHƯƠNG DỰ ÁN & 4 NGUYÊN TẮC KỸ THUẬT CỐT LÕI

Dự án **Aura Beauty Mall (WebBanMP)** được định vị là nền tảng thương mại điện tử chuyên ngành mỹ phẩm cao cấp đa gian hàng (Multi-Vendor), tích hợp trí tuệ nhân tạo tư vấn thành phần da liễu (Cosmetics INCI RAG) và công nghệ thử trang điểm thực tế ảo (AR Virtual Try-On 3D).

Mọi thành viên trong đội ngũ cam kết tuân thủ tuyệt đối **4 Nguyên tắc Thực thi Cốt lõi**:
1. **Think Before Coding / Planning:** Phân tích kỹ lưỡng ranh giới Bounded Context, luồng giao dịch phân tán, cấu trúc Reactive EventLoop, không phán đoán mơ hồ.
2. **Simplicity First:** Tối ưu hóa mã nguồn, giải quyết chính xác phạm vi nghiệp vụ mỹ phẩm, loại bỏ over-engineering và boilerplate thừa thãi.
3. **Surgical Changes (Clean Diff):** Can thiệp mã nguồn chính xác theo từng module, bảo vệ nguyên vẹn kiến trúc Lục giác (**Hexagonal Architecture / ArchUnit**), mô hình phi phong tỏa (**Non-blocking / BlockHound**), cơ chế giữ kho nguyên tử **CAS (`AtomicStockConcurrencyTest`)**, thuật toán tách đơn **Split Order**, đối soát sổ cái kép **Double-Entry Ledger (10% sàn / 90% Seller)** và kỷ luật **Clean Root**.
4. **Goal-Driven Execution:** Mọi công việc đều gắn liền với công thức chuẩn `[Hạng mục thực thi] -> Verify: [Tiêu chí kiểm chứng tự động]`.

---

## PHẦN I: BẢNG ĐỊNH VỊ VAI TRÒ & PHÂN CHIA TRÁCH NHIỆM (RACI MATRIX)

Nhằm bảo đảm không xảy ra xung đột mã nguồn (merge conflict) và tối ưu hóa tính độc lập giữa các module, trách nhiệm của 3 thành viên được phân định bất biến theo bảng ma trận dưới đây:

### 1. Bảng phân định chủ quản phân hệ

| Thành viên & Mã SV | Vị trí chủ nhiệm | Phạm vi dịch vụ & Hạ tầng | Công nghệ & Tiêu chuẩn phụ trách |
| :--- | :--- | :--- | :--- |
| **Nguyễn Văn Tuấn**<br>*(MSV: 2023603018)* | **Team Lead, Core Backend, Infra & Quality Architect** | - `infra/docker/` (PostgreSQL 16, MongoDB 7, Kafka 3.8, Kafka UI)<br>- Thư viện dùng chung `libs/`<br>- `services/api-gateway` (Port 8080)<br>- `services/account-service` (Port 8081)<br>- `services/inventory-service` (Port 8084) | - Kiến trúc Hexagonal Architecture & ArchUnit<br>- R2DBC Reactive PostgreSQL<br>- Kiểm thử BlockHound chống blocking call<br>- Cơ chế khóa lạc quan / CAS Atomic Reservation<br>- Quản lý lô hạn sử dụng FEFO<br>- k6 Load Testing & Chaos Saga Testing |
| **Nguyễn Viết Khánh**<br>*(MSV: 2023601808)* | **Catalog, Distributed Saga Order/Payment & AI Data Engineer** | - `ai/cosmetics-crawler/`<br>- `backend/catalog-service` (Port 8082)<br>- `backend/order-service` (Port 8084)<br>- `backend/payment-service` (Port 8085)<br>- `backend/ai-advisor-service` (Port 8086) | - Quarkus Panache MongoDB Reactive<br>- 8 Phân hệ lọc Facet Search & Quản lý Biến thể<br>- Bóc tách 45+ hoạt chất INCI & 8 Safety Badges<br>- Thuật toán Split Order tách đơn đa shop<br>- Transactional Outbox Pattern & Kafka Eventing<br>- Saga Choreography & Bù trừ giao dịch<br>- Sổ cái kép Double-Entry Ledger (10%/90%)<br>- RAG với pgvector (384-d Cosine HNSW) & SSE Stream |
| **Nguyễn Văn Tuấn Anh**<br>*(MSV: 2023601651)* | **Frontend UI/UX Architect, 3D AR Virtual Try-On & Multi-Zone Lead** | - Toàn bộ mã nguồn `frontend/` (Port 3000)<br>- **Buyer Zone:** Mega Menu 51 sub-menus, PDP, Bộ chọn biến thể chuẩn Shopee Mall, Giỏ hàng, Checkout<br>- **5 Công cụ Beauty-Tech:** AR 3D, Skin Scanner, Quiz, Routine 28 ngày, Beauty Pass<br>- **Seller Zone:** 9 phân hệ điều hành gian hàng<br>- **Admin Zone:** 9 phân hệ quản trị sàn<br>- **Footer:** 4 cột 15 liên kết điều hướng | - React 18, Vite 5, Tailwind CSS, Lucide Icons<br>- Bộ component hiệu ứng Animate UI<br>- `@mediapipe/tasks-vision` nhận diện 478 mốc 3D<br>- Canvas PBR Realistic Shading (Son môi & Phấn má 60 FPS)<br>- `submenuCatalogMapper` chống 100% màn hình trắng<br>- Client Error Boundary & Graceful Degradation |

### 2. Ma trận phối hợp RACI (Responsible - Accountable - Consulted - Informed)

| Phân hệ / Tính năng cốt lõi | Tuấn (Team Lead / Core) | Khánh (Catalog / Saga / AI) | Tuấn Anh (Frontend / AR) |
| :--- | :---: | :---: | :---: |
| Hạ tầng Docker, Clean Root, Maven Multi-module | **A / R** | C | I |
| Account, JWT Auth, RBAC, Skin Profile, Duyệt Mall | **A / R** | C | C |
| Catalog Domain, INCI, 8 Facet Search, Variants Model | C | **A / R** | C |
| Crawler 154+ sản phẩm ảnh thật, chống trùng MD5 | C | **A / R** | C (Assets UI) |
| Mega Menu 7 phân hệ lớn & 51 sub-menus (Mapper) | I | C (Facet Keys) | **A / R** |
| Bộ chọn biến thể Màu sắc HEX / Dung tích chuẩn Shopee Mall | C | C (Contract API) | **A / R** |
| Inventory CAS Concurrency & Quản lý lô FEFO | **A / R** | C | I |
| Order Cart, Split Order đa gian hàng & Outbox Relay | C | **A / R** | C (UI Cart/Order) |
| Payment Saga Choreography, Escrow & Double-Entry Ledger | C | **A / R** | C (Checkout UI) |
| AI Advisor RAG pgvector & SSE Streaming Server | I | **A / R** | C (Chat Widget) |
| AR Virtual Try-On 3D (478 Landmarks + PBR Canvas) | I | C (Hex/Finish Data) | **A / R** |
| 5 Công cụ Beauty-Tech tương tác thời gian thực | I | C | **A / R** |
| 9 Phân hệ Seller Zone & 9 Phân hệ Admin Zone | C (APIs) | C (APIs) | **A / R** |
| 15 Liên kết Footer & Cam kết 0% màn hình trắng | I | I | **A / R** |
| ArchUnit, BlockHound, k6 Load Test, Chaos Saga | **A / R** | R | I |
| Clean-Slate Deployment & Hồ sơ 14 tuần minh chứng | **A / R** | R | R |

---

## PHẦN II: LỘ TRÌNH TRIỂN KHAI CHI TIẾT TỪNG NGÀY TRONG 4 TUẦN (28 NGÀY)

---

### 📅 TUẦN 1 (Ngày 1 – 7): Khởi tạo Hạ tầng, Hexagonal, Account, Catalog, Crawler 154+ & Khung Buyer Zone

> **Mục tiêu tuần:** Thiết lập môi trường phát triển sạch sẽ, hạ tầng đồng bộ qua Docker, khởi tạo 2 microservice nền tảng (`account-service`, `catalog-service`), thu thập kho dữ liệu 154+ sản phẩm thực tế và dựng khung xương giao diện Buyer Zone với Mega Menu 51 danh mục con.  
> **Minh chứng hoàn tất:** Đóng gói thư mục hồ sơ `docs/evidence/week-1`, `week-2`, `week-3`, `week-4`.

#### Ngày 1: Thiết lập hạ tầng Docker, Clean Root & Multi-module Maven
- **Nguyễn Văn Tuấn:**
  - Khởi tạo Git repository, cấu hình `.gitignore` và thiết lập kỷ luật Clean Root (không sinh file rác ở root).
  - Soạn thảo `pom.xml` cha quản lý phiên bản tập trung (Java 21/22, Quarkus 3.15.1 LTS, Mutiny Reactive, Quarkus Reactive PgPool & Panache MongoDB).
  - Khởi tạo `infra/docker/docker-compose.yml` định nghĩa 4 dịch vụ cốt lõi: PostgreSQL 16 (pgvector), MongoDB 7, Kafka 3.8 (KRaft mode) và Kafka UI (Port 8090).
  - *Verify:* `docker compose -f infra/docker/docker-compose.yml up -d` khởi chạy thành công; truy cập Kafka UI tại `http://localhost:8090`.
- **Nguyễn Viết Khánh:**
  - Khảo sát và thiết kế lược đồ dữ liệu đa mô hình (Polyglot Persistence): MongoDB `catalog_db` cho tài liệu sản phẩm phi cấu trúc; PostgreSQL cho `account_db`, `inventory_db`, `order_db`, `payment_db`, `ai_db`.
  - Phác thảo cấu trúc DTO/Entity cho 8 phân hệ thuộc tính mỹ phẩm và hoạt chất INCI.
  - *Verify:* Chạy script kiểm tra kết nối `mongosh` và `psql` trong các container tương ứng.
- **Nguyễn Văn Tuấn Anh:**
  - Khởi tạo dự án `/frontend` bằng Vite 5 + React 18, cấu hình Tailwind CSS 3.4.
  - Tích hợp Design Tokens từ `DESIGN.md` (Luxury Monochrome, Electric Blue `#0066ff`, Rose Gold, Saans/Inter Typography, Squircle Border Radius 24px/16px).
  - Cài đặt thư viện `lucide-react`, cấu hình đường dẫn tuyệt đối `@/...` trong `vite.config.ts`.
  - *Verify:* Chạy `npm run dev` tại `http://localhost:3000` hiển thị màn hình chào mừng chuẩn token màu.

#### Ngày 2: Xây dựng Thư viện dùng chung (Libs) & Bộ Component Animate UI
- **Nguyễn Văn Tuấn:**
  - Xây dựng 3 module thư viện nội bộ tại `/libs`:
    - `libs/common-domain`: Định nghĩa các Value Objects bất biến (`Money`, `SkuId`, `ShopId`, `CustomerId`), Domain Events cơ sở.
    - `libs/common-web`: Chuẩn hóa phản hồi API `ApiResponse<T>`, bộ xử lý ngoại lệ toàn cục Reactive `GlobalErrorWebExceptionHandler`.
    - `libs/common-security`: Cấu hình Reactive Security, tiện ích ký/giải mã JWT token, kiểm tra vai trò người dùng (RBAC).
  - *Verify:* Chạy `mvn clean install -pl libs/common-domain,libs/common-web,libs/common-security` đạt trạng thái `BUILD SUCCESS`.
- **Nguyễn Viết Khánh:**
  - Xây dựng lớp chuyển đổi dữ liệu và định nghĩa sự kiện phân tán cho miền Sản phẩm (Catalog Domain Events: `ProductCreatedEvent`, `ProductStockUpdatedEvent`).
  - Viết Unit Test kiểm tra tính bất biến của các Value Object tiền tệ và mã định danh.
  - *Verify:* `mvn test -pl libs/common-domain` vượt qua 100% test cases.
- **Nguyễn Văn Tuấn Anh:**
  - Phát triển bộ component hiệu ứng cao cấp **Animate UI**:
    - `MotionCard`: Hiệu ứng hover nổi 3D squircle mềm mại.
    - `AnimatedTabs`: Thanh chuyển tab có hiệu ứng trượt mượt mà.
    - `NumberTicker`: Đồng hồ đếm số sinh động cho giá tiền và chỉ số thống kê.
    - `SpringButton`: Nút bấm có độ nảy vật lý, tự động vô hiệu hóa chống bấm đúp khi submit.
    - `StaggerContainer`: Hiệu ứng xuất hiện so le cho lưới sản phẩm.
  - *Verify:* Kiểm thử tương tác mượt mà của bộ component trên Storybook / trang Showcase nội bộ.

#### Ngày 3: Triển khai API Gateway & Account Service (Hexagonal + ArchUnit)
- **Nguyễn Văn Tuấn:**
  - Xây dựng `backend/api-gateway` (Port 8080) bằng Quarkus Vert.x Reverse Proxy: định tuyến động đến các microservices, cấu hình CORS tập trung, lọc xác thực JWT Header.
  - Xây dựng `backend/account-service` (Port 8081) tuân thủ nghiêm ngặt **Hexagonal Architecture** (phân tách rõ 3 tầng: `domain`, `application/port`, `adapter/in/web`, `adapter/out/persistence` với Quarkus Reactive PgPool).
  - Thiết lập kiểm thử kiến trúc tự động bằng **ArchUnit** (`HexagonalArchitectureTest`) để ngăn chặn việc rò rỉ phụ thuộc tầng hạ tầng vào tầng nghiệp vụ cốt lõi.
  - *Verify:* `mvn test -pl backend/account-service -Dtest=HexagonalArchitectureTest` PASS; không có vi phạm ranh giới kiến trúc.
- **Nguyễn Viết Khánh:**
  - Hỗ trợ xây dựng các bảng cơ sở dữ liệu `users`, `roles`, `shops`, `skin_profiles` trong `account_db` qua tệp `schema.sql`.
  - Định nghĩa thực thể `SkinProfile` (phân loại da: Dầu, Khô, Hỗn hợp, Nhạy cảm; mức độ mụn; độ nhạy cảm thành phần).
  - *Verify:* Query kiểm tra bảng và ràng buộc khóa ngoại trong PostgreSQL `account_db`.
- **Nguyễn Văn Tuấn Anh:**
  - Xây dựng bố cục dùng chung (Base Layout) cho Buyer Zone: Top Bar thông báo ưu đãi, Header đa năng tích hợp thanh tìm kiếm thông minh, nút chuyển nhanh tài khoản demo (Buyer / Seller / Admin).
  - Tích hợp Modal Đăng nhập / Đăng ký người dùng và giao diện quản lý Hồ Sơ Da (Skin Profile Survey Drawer).
  - *Verify:* Giao diện hiển thị chuẩn xác ở cả 2 chế độ Desktop và Mobile responsive.

#### Ngày 4: Xây dựng Catalog Service (Reactive MongoDB & Domain 100% Pure Java)
- **Nguyễn Viết Khánh:**
  - Xây dựng `backend/catalog-service` (Port 8082) với kiến trúc Hexagonal: sử dụng Quarkus Panache MongoDB Reactive.
  - Lập trình mô hình Domain thuần Java 21: `Product`, `Category`, `Brand`, `InciIngredient`, `ProductVariant`.
  - Xây dựng công cụ phân tích an toàn thành phần (INCI Engine): tính toán chỉ số bít tắc lỗ chân lông (`comedogenicRating`), mức độ kích ứng da liễu (`irritationLevel`) và tự động gán 8 loại nhãn an toàn (`safetyBadges`: Thuần chay, Không cồn, Không paraben, An toàn bà bầu...).
  - *Verify:* Viết unit test cho thuật toán phân loại thành phần INCI, đảm bảo tính toán chính xác 100%.
- **Nguyễn Văn Tuấn:**
  - Tích hợp kiểm thử luồng phi phong tỏa **BlockHound** vào `catalog-service` nhằm phát hiện sớm các lời gọi I/O chặn (blocking call) trên luồng Netty EventLoop.
  - Cấu hình chỉ mục đa trường (Compound Index) trên MongoDB cho tìm kiếm đa thuộc tính (Text search, Brand, Category, Price Range).
  - *Verify:* `mvn test -pl services/catalog-service -Dtest=BlockHoundIntegrationTest` PASS.
- **Nguyễn Văn Tuấn Anh:**
  - Dựng cấu trúc khung điều hướng Mega Menu gồm 7 phân hệ lớn tại Header:
    1. Chăm Sóc Da Mặt (Skincare)
    2. Trang Điểm (Makeup & AR)
    3. Chăm Sóc Cơ Thể (Body Care)
    4. Chăm Sóc Tóc & Da Đầu (Haircare)
    5. Nước Hoa & Mùi Hương (Fragrance)
    6. Dược Mỹ Phẩm & Trị Liệu (Dermocosmetics)
    7. Bộ Quà Tặng & Khuyến Mãi (Gift Sets)
  - *Verify:* Rê chuột mở Mega Menu với hiệu ứng đổ bóng mượt mà, phân cấp danh mục rõ ràng.

#### Ngày 5: Hoàn thiện 51 Sub-menus & Cơ chế SubmenuCatalogMapper chống trắng màn hình
- **Nguyễn Văn Tuấn Anh:**
  - Khởi tạo đầy đủ danh sách **51 danh mục con (sub-menus)** phân bổ chuẩn xác vào 7 phân hệ lớn.
  - Xây dựng bộ điều phối **`submenuCatalogMapper.ts`**: Ánh xạ từng sub-menu con tới bộ lọc Facet Search tương ứng của catalog (danh mục, loại da, hoạt chất, mức giá).
  - Thiết lập cơ chế **Zero Blank-Screen Guarantee**: Nếu API chưa kịp phản hồi hoặc danh mục chưa có sản phẩm, hệ thống tự động fallback hiển thị danh sách sản phẩm liên quan kèm thông báo thân thiện, triệt tiêu 100% tình trạng trắng màn hình (blank screen).
  - *Verify:* Nhấp thử lần lượt toàn bộ 51 sub-menus; kiểm tra URL chuyển hướng và danh sách sản phẩm hiển thị, 0 lỗi console runtime.
- **Nguyễn Viết Khánh:**
  - Xây dựng API lọc đa chiều (Facet Search API) tại `GET /api/v1/products/search`: hỗ trợ lọc động đồng thời 8 phân hệ (Loại da, Vấn đề da, Hoạt chất INCI, Dạng bào chế, Kết cấu, Xuất xứ, Chứng nhận an toàn, Khoảng giá).
  - Hỗ trợ trả về cấu trúc Facet Summary (đếm số lượng sản phẩm tương ứng theo từng tiêu chí lọc).
  - *Verify:* Gửi request kiểm thử API Facet Search qua Postman/cURL, thời gian phản hồi $< 45\text{ms}$.
- **Nguyễn Văn Tuấn:**
  - Hoàn thiện luồng xác thực và phân quyền RBAC: Buyer, Shop Owner, Sàn Admin tại `account-service`.
  - Triển khai API đăng ký gian hàng và quy trình phê duyệt Shop Mall chính hãng.
  - *Verify:* Chạy tích hợp luồng Đăng ký user -> Đăng ký Shop -> Admin duyệt Shop qua API Gateway thành công.

#### Ngày 6: Vận hành Crawler 154+ Sản phẩm thực tế & Khử trùng lặp ảnh MD5
- **Nguyễn Viết Khánh (Chủ trì):**
  - Xây dựng hệ thống crawler chuyên dụng tại `/ai/cosmetics-crawler/` với cơ chế vượt tường lửa 4 lớp (Direct API, Giả lập Browser Fingerprint Chrome 131, Jitter Delay, Fallback Curation).
  - Thu thập đầy đủ dữ liệu của **154 sản phẩm mỹ phẩm thương hiệu thực tế** (*La Roche-Posay, CeraVe, The Ordinary, 3CE, MAC, Paula's Choice, Cocoon Vietnam...*).
  - Trích xuất bảng thành phần INCI chi tiết, giấy phép số công bố mỹ phẩm (CBMP) và đặc tính AR Virtual Try-On (mã màu HEX, độ bóng finish).
  - *Verify:* Tệp `output/products_facets_full.json` được sinh ra với dung lượng ~240 KB, chứa đủ 154 bản ghi hợp lệ.
- **Nguyễn Văn Tuấn:**
  - Lập trình module kiểm định hình ảnh tải về: kiểm tra kích thước tối thiểu ($> 8\text{ KB}$), định dạng chuẩn (`.jpg`, `.png`, `.webp`) và tính toán hàm băm **MD5** để khử trùng lặp 100% hình ảnh.
  - Lưu trữ tài nguyên ảnh thật vào thư mục phục vụ tĩnh `/frontend/public/products/`.
  - *Verify:* Kiểm tra thư mục ảnh: 154 ảnh độc bản, 0% trùng lặp mã băm MD5, không có ảnh giả lập/lỗi vỡ.
- **Nguyễn Văn Tuấn Anh:**
  - Tích hợp kho ảnh thật của 154 sản phẩm vào giao diện danh sách sản phẩm và thẻ `MotionCard`.
  - Hiển thị đầy đủ nhãn chứng nhận (Mall Chính Hãng, Freeship Xtra, Safety Badges) trên thẻ sản phẩm.
  - *Verify:* Danh sách sản phẩm hiển thị sắc nét, hình ảnh chân thực, bố cục đồng đều không giật layout.

#### Ngày 7: Đồng bộ Dữ liệu Toàn diện & Đóng gói Hồ sơ Minh chứng Đợt 1
- **Nguyễn Viết Khánh & Nguyễn Văn Tuấn:**
  - Chạy `dbSynchronizer.js` để seed đồng bộ 154 sản phẩm vào MongoDB `catalog_db`, 45 bản ghi INCI chuẩn y khoa da liễu.
  - Tự động sinh 339 bản ghi SKU kho tương ứng vào PostgreSQL `inventory_db` với số lượng tồn mặc định `on_hand = 120`, `reserved = 0`.
  - Trích xuất và nạp 154 đoạn văn bản kiến thức sản phẩm vào PostgreSQL `ai_db` để chuẩn bị cho RAG vector search.
  - *Verify:* Truy vấn đếm số lượng bản ghi thực tế: MongoDB có đúng 154 documents; PostgreSQL Inventory có đúng 339 records.
- **Nguyễn Văn Tuấn Anh:**
  - Kiểm tra toàn diện luồng duyệt sản phẩm trên Buyer Zone từ trang chủ, Mega Menu, danh mục đến thanh lọc Facet đa chiều.
  - Tích hợp Skeleton loading thanh lịch trong lúc tải dữ liệu.
  - *Verify:* Thao tác lọc mượt mà, thời gian phản hồi tức thì dưới $100\text{ms}$.
- **Toàn nhóm:**
  - Tổng hợp nhật ký, chụp ảnh màn hình minh chứng và đóng gói tài liệu vào:
    - `docs/evidence/week-1/evidence-log.md` (DDD, ADR, Docker Infra)
    - `docs/evidence/week-2/evidence-log.md` (Libs, Hexagonal Template, Account Service)
    - `docs/evidence/week-3/evidence-log.md` (Catalog Service, INCI Engine, MongoDB Reactive)
    - `docs/evidence/week-4/evidence-log.md` (Duyệt Shop Mall, CBMP, UI Buyer Browsing)
  - *Verify:* Kiểm tra thư mục `docs/evidence/` đầy đủ tệp tin theo quy định.

---

### 📅 TUẦN 2 (Ngày 8 – 14): Inventory CAS, Split Order, Double-Entry Ledger & Bộ Chọn Biến Thể Shopee Mall

> **Mục tiêu tuần:** Xây dựng lõi nghiệp vụ thương mại điện tử chuyên sâu: Quản lý tồn kho nguyên tử chống bán vượt (CAS), Thuật toán tách đơn hàng đa Shop (Split Order), Quản lý giao dịch phân tán Saga Choreography, Sổ cái kép đối soát tài chính (10% sàn / 90% Seller) và Bộ chọn phân loại hàng chuẩn Shopee Mall trên giao diện.  
> **Minh chứng hoàn tất:** Đóng gói thư mục hồ sơ `docs/evidence/week-5`, `week-6`, `week-7`, `week-8`.

#### Ngày 8: Xây dựng Inventory Service & Cơ chế giữ kho nguyên tử CAS
- **Nguyễn Văn Tuấn:**
  - Xây dựng `services/inventory-service` (Port 8084) với kiến trúc Hexagonal và R2DBC Reactive PostgreSQL.
  - Thiết kế bảng `inventory_items` quản lý SKU tồn kho theo số lượng: `on_hand_quantity`, `reserved_quantity`, `version`.
  - Triển khai cơ chế giữ hàng nguyên tử không âm (**Compare-And-Swap / CAS**) bằng câu lệnh cập nhật có điều kiện trực tiếp tại tầng cơ sở dữ liệu:
    $$\text{UPDATE inventory\_items SET reserved = reserved + } N \text{ WHERE sku\_id = ? AND (on\_hand - reserved) } \ge N$$
  - *Verify:* Viết Unit Test cho câu lệnh cập nhật nguyên tử, xác nhận không xảy ra tình trạng tồn kho âm.
- **Nguyễn Viết Khánh:**
  - Phối hợp xác định cấu trúc DTO giữa đơn hàng và kho vận: `ReserveStockCommand`, `StockReservedEvent`, `StockReservationFailedEvent`.
  - Khởi tạo topic Kafka cho quản lý kho: `stock-reservation-request`, `stock-reservation-response`.
  - *Verify:* Kiểm tra topic hiển thị chính xác trên giao diện Kafka UI.
- **Nguyễn Văn Tuấn Anh:**
  - Thiết kế giao diện hiển thị trạng thái tồn kho thực tế trên thẻ sản phẩm và khung thông tin chi tiết: "Còn hàng", "Sắp hết hàng", "Hết hàng".
  - *Verify:* Giao diện cập nhật nhãn tồn kho linh hoạt theo dữ liệu SKU.

#### Ngày 9: Quản lý Lô Sản Xuất & Hạn Dùng FEFO & Kiểm Thử Đồng Thời Khắc Nghiệt
- **Nguyễn Văn Tuấn:**
  - Thiết kế bảng `inventory_lots` quản lý từng lô mỹ phẩm theo nguyên tắc **FEFO (First-Expired, First-Out)**: mã lô (`lot_number`), ngày sản xuất (`manufacture_date`), hạn dùng (`expiry_date`), số lượng theo lô.
  - Xây dựng thuật toán tự động ưu tiên xuất các lô có hạn dùng gần nhất trước nhằm ngăn ngừa mỹ phẩm hết date trong kho.
  - Viết bài kiểm thử áp lực đồng thời cực hạn **`AtomicStockConcurrencyTest`**: sử dụng 50 luồng Reactive đồng thời tranh chấp 10 sản phẩm cuối cùng trong kho.
  - *Verify:* Chạy `mvn test -pl services/inventory-service -Dtest=AtomicStockConcurrencyTest` kết quả 10 yêu cầu thành công, 40 yêu cầu bị từ chối chính xác, tồn kho không âm (`on_hand - reserved == 0`).
- **Nguyễn Viết Khánh:**
  - Xây dựng cơ chế bù trừ giải phóng kho (Compensating Release Stock) khi đơn hàng bị hủy hoặc thanh toán thất bại.
  - *Verify:* Kiểm tra sự kiện hoàn trả kho cập nhật lại `reserved = reserved - N` chính xác.
- **Nguyễn Văn Tuấn Anh:**
  - Bổ sung thông tin hiển thị ngày sản xuất và hạn sử dụng (HSD) rõ ràng trên trang chi tiết sản phẩm để tăng độ tin cậy chuẩn sàn mỹ phẩm.
  - *Verify:* Thông tin HSD hiển thị rõ nét tại khu vực cam kết chất lượng.

#### Ngày 10: Xây dựng Giỏ hàng Đa Shop & Cơ chế Snapshot Giá Catalog
- **Nguyễn Viết Khánh:**
  - Xây dựng `services/order-service` (Port 8083) với R2DBC PostgreSQL.
  - Lập trình tính năng Giỏ hàng thông minh (Multi-Vendor Cart): hỗ trợ gom nhóm sản phẩm tự động theo từng `shop_id`.
  - Triển khai cơ chế đóng băng giá và khuyến mãi (**Price Snapshotting**): khi Buyer đưa sản phẩm vào giỏ hoặc chuyển sang bước thanh toán, hệ thống chốt snapshot giá tại thời điểm đặt hàng, ngăn ngừa lỗi thay đổi giá đột ngột từ người bán.
  - *Verify:* Viết unit test xác thực việc lưu trữ chính xác `snapshot_unit_price` trong bảng `cart_items`.
- **Nguyễn Văn Tuấn:**
  - Cấu hình chỉ mục hiệu năng cho `order_db` trên các trường `customer_id`, `shop_id`, `created_at`.
  - Thiết lập bộ đệm an toàn kết nối Reactive Connection Pool (R2DBC Pool).
  - *Verify:* Đo kiểm thời gian xử lý thao tác thêm vào giỏ hàng $< 25\text{ms}$.
- **Nguyễn Văn Tuấn Anh:**
  - Phát triển giao diện Giỏ hàng tương tác cao cấp (Cart Page):
    - Tách biệt trực quan các khối hàng theo từng Shop.
    - Checkbox chọn từng món hoặc chọn toàn bộ theo gian hàng.
    - Bộ tăng giảm số lượng mượt mà, tự động tính tổng tiền tạm tính, phí ship ước tính và tiền giảm giá.
  - *Verify:* Thao tác tăng giảm số lượng mượt mà, cập nhật số dư tức thì không giật lag.

#### Ngày 11: Phát triển Thuật Toán Tách Đơn Hàng (Split Order) & Transactional Outbox
- **Nguyễn Viết Khánh:**
  - Phát triển thuật toán **Split Order (Tách đơn hàng tự động)**: Khi khách mua giỏ hàng chứa sản phẩm từ $K$ gian hàng khác nhau, hệ thống tự động sinh:
    - 01 Đơn hàng gốc (`Master Order`) đại diện cho phiên thanh toán của Buyer.
    - $K$ Đơn hàng con độc lập (`Sub-orders`) với mã định danh duy nhất cho từng Shop để các chủ gian hàng tự quản lý đóng gói và vận chuyển riêng biệt.
  - Áp dụng mẫu thiết kế **Transactional Outbox Pattern**: Lưu trữ các Domain Events vào bảng `outbox_events` trong cùng một giao dịch cơ sở dữ liệu với đơn hàng, bảo đảm độ tin cậy 100% không mất dữ liệu.
  - Xây dựng nền tảng Outbox Relay Worker quét định kỳ và đẩy sự kiện lên Kafka topic `order-events`.
  - *Verify:* Tạo đơn hàng 3 shop khác nhau; kiểm tra cơ sở dữ liệu: sinh đúng 1 master order và 3 sub-orders, outbox ghi nhận đầy đủ sự kiện.
- **Nguyễn Văn Tuấn:**
  - Cấu hình Idempotent Consumer phía các service nhận tin để chống xử lý trùng lặp sự kiện (Duplicate Message Handling) bằng bảng khóa `processed_messages`.
  - *Verify:* Bắn thử 2 message trùng lặp qua Kafka, hệ thống chỉ xử lý duy nhất 1 lần.
- **Nguyễn Văn Tuấn Anh:**
  - Xây dựng trang Checkout phân tách các kiện hàng theo từng Shop, hiển thị phương thức vận chuyển riêng biệt cho từng gian hàng.
  - *Verify:* Buyer quan sát rõ ràng tổng số kiện hàng nhận được và thời gian giao dự kiến của từng shop.

#### Ngày 12: Xây dựng Payment Service, Saga Choreography & Sổ Cái Kép (Double-Entry Ledger)
- **Nguyễn Viết Khánh:**
  - Xây dựng `services/payment-service` (Port 8085) sử dụng R2DBC PostgreSQL.
  - Điều phối giao dịch phân tán qua **Saga Choreography**:
    - Bước 1: `OrderCreatedEvent` $\rightarrow$ Kiểm tra & Giữ kho nguyên tử CAS (`inventory-service`).
    - Bước 2: `StockReservedEvent` $\rightarrow$ Xử lý thanh toán tạm giữ Escrow (`payment-service`).
    - Bước 3: `PaymentCompletedEvent` $\rightarrow$ Xác nhận đơn hàng thành công (`order-service`).
    - *Luồng bù trừ (Compensation):* Nếu thanh toán thất bại hoặc kho hết hàng, phát sự kiện `CompensateOrderEvent` để hủy đơn và hoàn trả kho lập tức.
  - Thiết kế hệ thống **Sổ cái kép đối soát tài chính (Double-Entry Ledger)** tuân thủ nguyên tắc kế toán bất biến:
    $$\sum \text{Debit (Nợ)} = \sum \text{Credit (Có)}$$
  - Thuật toán tự động phân tách dòng tiền: 10% phí hoa hồng sàn (Sàn Revenue Account) và 90% doanh thu thuần ghi có vào công nợ phải trả cho người bán (Seller Escrow Payable Account).
  - *Verify:* Viết Unit/Integration Test cho Ledger: kiểm tra 100 giao dịch thanh toán, xác nhận tổng nợ bằng tổng có 100%, không lệch 1 đồng.
- **Nguyễn Văn Tuấn:**
  - Cấu hình Dead Letter Queue (DLQ) trên Kafka cho các giao dịch lỗi để kiểm toán và khôi phục sự cố.
  - *Verify:* Gửi bản tin sai định dạng, tin được định tuyến chính xác vào topic `.DLQ`.
- **Nguyễn Văn Tuấn Anh:**
  - Xây dựng cổng giả lập thanh toán tương tác cao: hỗ trợ các phương thức QR VNPAY, Thẻ tín dụng/ghi nợ, Ví điện tử và COD.
  - Tích hợp màn hình chờ xác nhận thanh toán Realtime với hiệu ứng đếm ngược thời gian thực.
  - *Verify:* Trải nghiệm thanh toán mượt mà, chuyển trang thành công với mã tra cứu đơn hàng chi tiết.

#### Ngày 13: Xây dựng Bộ Chọn Phân Loại Hàng Chuẩn Shopee Mall Trên Frontend
- **Nguyễn Văn Tuấn Anh:**
  - Phát triển **Bộ chọn phân loại hàng chuẩn Shopee Mall** tại Trang Chi Tiết Sản Phẩm (PDP) và Modal Xem Nhanh (Quick View Modal):
    - Phân nhóm 2 cấp trực quan: **Màu sắc** (kèm swatch màu HEX thực tế của son/phấn) và **Dung tích / Kích thước** (30ml, 50ml, 100ml...).
    - Cơ chế hiển thị tồn kho thời gian thực tương ứng với từng biến thể được chọn.
    - Tự động làm mờ và vô hiệu hóa (`disabled`) các nút biến thể đã hết hàng trong kho.
    - Tự động cập nhật mức giá tương ứng theo biến thể được chọn.
  - Tích hợp thông báo cảnh báo thân thiện khi người dùng chưa chọn đủ biến thể mà bấm "Thêm vào giỏ hàng" hoặc "Mua ngay".
  - *Verify:* Thử nghiệm chọn chéo các cặp Màu sắc - Dung tích; kiểm tra giá, tồn kho và nút mua thay đổi chính xác 100%.
- **Nguyễn Viết Khánh:**
  - Chuẩn hóa cấu trúc Variant Matrix trong API Catalog:
    `variants: [{ sku: string, attributes: { color: string, hex: string, size: string }, price: number, stock: number }]`.
  - Đồng bộ hóa dữ liệu biến thể của 154 sản phẩm đảm bảo đầy đủ swatch màu chuẩn.
  - *Verify:* API trả về đầy đủ ma trận biến thể cho các dòng son 3CE, MAC, Black Rouge.
- **Nguyễn Văn Tuấn:**
  - Đảm bảo API giữ kho CAS hỗ trợ khóa chính xác theo từng SKU biến thể cụ thể, không bị nhầm lẫn giữa các dung tích khác nhau của cùng 1 dòng sản phẩm.
  - *Verify:* Test giữ hàng đồng thời 2 SKU khác nhau của cùng 1 sản phẩm gốc, hoạt động độc lập không tranh chấp chéo.

#### Ngày 14: Tích Hợp Toàn Trình Luồng Đặt Hàng & Đóng Gói Minh Chứng Đợt 2
- **Toàn nhóm phối hợp:**
  - Chạy kịch bản tích hợp toàn trình (End-to-End Flow):
    *Người mua duyệt web* $\rightarrow$ *Chọn phân loại màu son/dung tích* $\rightarrow$ *Thêm giỏ hàng từ 2 shop khác nhau* $\rightarrow$ *Bấm Đặt hàng* $\rightarrow$ *Hệ thống Split Order thành 2 đơn con* $\rightarrow$ *Giữ kho nguyên tử CAS* $\rightarrow$ *Thanh toán Escrow* $\rightarrow$ *Tự động hạch toán sổ cái kép (10% sàn, 90% shop)*.
  - Tổng hợp hồ sơ minh chứng và biên bản kiểm thử:
    - `docs/evidence/week-5/evidence-log.md` (Inventory CAS, Concurrency Test)
    - `docs/evidence/week-6/evidence-log.md` (Multi-Vendor Cart, Price Snapshot)
    - `docs/evidence/week-7/evidence-log.md` (Split Order, State Machine, Outbox)
    - `docs/evidence/week-8/evidence-log.md` (Payment Mock, Saga Choreography, Double-Entry Ledger)
  - *Verify:* Toàn bộ quy trình hoàn tất trong $< 1.2\text{s}$; các bảng dữ liệu Order, Inventory, Payment nhất quán tuyệt đối.

---

### 📅 TUẦN 3 (Ngày 15 – 21): AI Advisor RAG SSE, AR Virtual Try-On 3D & Hoàn Thiện 100% Seller, Admin, Footer

> **Mục tiêu tuần:** Tích hợp đột phá 2 công nghệ cốt lõi tạo nên linh hồn của sàn mỹ phẩm: Trợ lý AI da liễu RAG phản hồi trực tiếp qua SSE Stream, Bộ công cụ trang điểm thực tế ảo AR Virtual Try-On 3D bằng MediaPipe 478 điểm mốc, đồng thời hoàn thiện 100% giao diện 9 phân hệ Seller Zone, 9 phân hệ Admin Zone và Footer 4 cột đảm bảo cam kết không màn hình trắng.  
> **Minh chứng hoàn tất:** Đóng gói thư mục hồ sơ `docs/evidence/week-9`, `week-10-11`, `week-12`.

#### Ngày 15: Xây dựng AI Advisor Service với Cơ Sở Dữ Liệu Vector (pgvector)
- **Nguyễn Viết Khánh:**
  - Xây dựng `backend/ai-advisor-service` (Port 8086) với Quarkus Mutiny Reactive và Reactive PgPool kết nối PostgreSQL mở rộng `pgvector`.
  - Thiết lập bảng `inci_embeddings` và `product_embeddings` lưu trữ vector đặc trưng 384 chiều của các thành phần mỹ phẩm và tài liệu hướng dẫn chăm sóc da.
  - Cấu hình chỉ mục vector **HNSW (Hierarchical Navigable Small World)** với khoảng cách Cosine Similarity để tối ưu hóa tốc độ truy vấn tương đồng ngữ nghĩa.
  - *Verify:* Thực thi truy vấn thử nghiệm vector lân cận `ORDER BY embedding <=> query_vector LIMIT 5`, thời gian tìm kiếm $< 15\text{ms}$.
- **Nguyễn Văn Tuấn:**
  - Cấu hình cấp phát tài nguyên bộ nhớ cho extension pgvector trong Docker container của PostgreSQL.
  - Thiết lập cơ chế bảo vệ phân tầng cho dịch vụ AI (Rate Limiter chống spam truy vấn RAG).
  - *Verify:* `docker exec` kiểm tra extension vector đã active trong `ai_db`.
- **Nguyễn Văn Tuấn Anh:**
  - Thiết kế Widget trò chuyện AI (Floating Chat Bubble) nổi bật ở góc phải màn hình, mang phong cách trợ lý làm đẹp Aura Beauty Advisor sang trọng.
  - *Verify:* Khung chat mở/đóng mượt mà với hoạt cảnh spring mượt mà, hiển thị gợi ý câu hỏi nhanh (Prompt Chips).

#### Ngày 16: Hiện Thực Hóa Luồng Tư Vấn Mỹ Phẩm RAG & Phản Hồi Trực Tiếp Qua SSE Stream
- **Nguyễn Viết Khánh:**
  - Hiện thực hóa luồng xử lý **Retrieval-Augmented Generation (RAG)**:
    1. Tiếp nhận câu hỏi của người dùng và thông tin Hồ Sơ Da (`SkinProfile`) của họ.
    2. Trích xuất thành phần hoạt chất được nhắc đến, tìm kiếm vector các sản phẩm phù hợp nhất trong kho 154 sản phẩm thật.
    3. Ghép nối ngữ cảnh vào Prompt khuôn mẫu chuẩn da liễu và gửi đến mô hình ngôn ngữ.
    4. Trả về phản hồi từng từ (Streaming Response) về client thông qua **Server-Sent Events (SSE)** theo định dạng `text/event-stream`.
  - Tự động nhúng kèm danh sách sản phẩm gợi ý (Product Cards) có thể nhấp mua ngay bên trong luồng chat.
  - *Verify:* Kết nối cURL nhận luồng byte dữ liệu streaming thời gian thực liên tục không ngắt quãng.
- **Nguyễn Văn Tuấn:**
  - Kiểm thử hiệu năng luồng SSE trên nền tảng WebFlux phi phong tỏa, đảm bảo giữ hàng nghìn kết nối đồng thời mà không nghẽn thread pool.
  - *Verify:* Kiểm tra luồng không bị chặn, Netty EventLoop duy trì tải CPU thấp ($< 5\%$).
- **Nguyễn Văn Tuấn Anh:**
  - Lập trình bộ thu nhận SSE Stream tại Frontend bằng `fetch-event-source`:
    - Hiển thị hiệu ứng gõ chữ (Typewriter effect) từng ký tự sinh động.
    - Hiển thị thẻ sản phẩm đề xuất (Interactive Product Mini-Card) ngay trong bong bóng chat.
    - Hỗ trợ lưu lịch sử hội thoại vào LocalStorage.
  - *Verify:* Thử hỏi: *"Da tôi nhiều dầu mụn, nên dùng toner và kem dưỡng nào?"*; trợ lý phản hồi mượt mà trong vòng 1.5 giây.

#### Ngày 17: Phát Triển Hệ Thống AR Virtual Try-On 3D (MediaPipe 478 Điểm Mốc)
- **Nguyễn Văn Tuấn Anh (Chủ trì):**
  - Tích hợp gói `@mediapipe/tasks-vision` chạy hoàn toàn trên trình duyệt thông qua WebGL / WebAssembly.
  - Khởi tạo camera video trực tiếp và phát hiện lưới khuôn mặt 3D (**Face Mesh 478 Landmarks**).
  - Xây dựng thuật toán bóc tách tọa độ chính xác của vùng môi trên/dưới (Lip mesh) và vùng gò má (Cheek mesh).
  - Áp dụng kỹ thuật đổ bóng vật lý thực tế (**PBR - Physically Based Rendering**) trên HTML5 Canvas 2D/WebGL:
    - Chế độ Matte (Lì): Độ phủ màu cao, độ mịn cao.
    - Chế độ Glossy / Velvet (Bóng / Nhung): Tạo hiệu ứng phản xạ ánh sáng tự nhiên tại tâm môi.
    - Hiệu ứng má hồng tự nhiên với bán kính chuyển đổi mượt mà (Gaussian radial gradient blending).
  - Tối ưu hóa thuật toán đạt tốc độ khung hình ổn định **60 FPS** trên cả máy tính và điện thoại.
  - *Verify:* Mở camera thử 10 màu son 3CE/MAC khác nhau; màu sắc bám dính chính xác vào môi người dùng theo thời gian thực khi nói chuyện hoặc cử động đầu.
- **Nguyễn Viết Khánh:**
  - Chuẩn hóa dữ liệu màu sắc cho các sản phẩm trang điểm trong MongoDB: bổ sung trường `vtoConfig: { lipColorHex: "#C43A3A", finishType: "velvet", glossIntensity: 0.7 }`.
  - *Verify:* Truy vấn MongoDB kiểm tra toàn bộ sản phẩm dòng Son môi và Phấn má có đủ cấu hình `vtoConfig`.
- **Nguyễn Văn Tuấn:**
  - Đánh giá mức độ tiêu thụ tài nguyên client, đảm bảo module AR tự giải phóng bộ nhớ khi tắt camera, không gây memory leak.
  - *Verify:* Kiểm tra tab Performance/Memory trên Chrome DevTools: bộ nhớ ổn định sau 10 phút sử dụng liên tục.

#### Ngày 18: Hoàn Thiện Bộ 5 Công Cụ Beauty-Tech Đột Phá
- **Nguyễn Văn Tuấn Anh:**
  - Hoàn thiện trọn vẹn bộ 5 công cụ công nghệ làm đẹp trên Frontend:
    1. **AR Virtual Try-On:** Thử son môi, phấn má thực tế ảo 60 FPS.
    2. **AI Skin Scanner:** Chụp ảnh phân tích tình trạng da tức thì (độ dầu, vùng đỏ, thâm mụn) dựa trên xử lý ảnh Canvas và gợi ý phác đồ.
    3. **Skin Quiz (Khảo sát da chuẩn y khoa):** Bộ 7 câu hỏi phân loại loại da Baumman chuẩn xác, tự động đồng bộ vào `SkinProfile` của tài khoản.
    4. **28-Day Routine Scheduler:** Lịch trình chăm sóc da khoa học theo chu kỳ tái tạo da 28 ngày, có thông báo nhắc nhở bước dưỡng sáng/tối.
    5. **Beauty Pass (Hội viên làm đẹp):** Thẻ đặc quyền tích điểm thưởng, voucher giảm giá và cấp bậc thành viên (Silver, Gold, Diamond).
  - *Verify:* Người dùng trải nghiệm tuần tự cả 5 công cụ mà không gặp bất kỳ lỗi logic nào.
- **Nguyễn Viết Khánh & Nguyễn Văn Tuấn:**
  - Hỗ trợ các API lưu trữ lịch trình 28 ngày và điểm thưởng Beauty Pass vào cơ sở dữ liệu.
  - *Verify:* Dữ liệu lịch trình lưu trữ đồng bộ trên tài khoản người dùng.

#### Ngày 19: Xây Dựng Hoàn Chỉnh 9 Phân Hệ Seller Zone (Quản Lý Gian Hàng)
- **Nguyễn Văn Tuấn Anh:**
  - Xây dựng bảng điều khiển dành riêng cho nhà bán hàng (Seller Portal) với **9 phân hệ quản trị chuyên sâu**:
    1. `overview`: Báo cáo doanh thu thời gian thực, biểu đồ đơn hàng, tỷ lệ chuyển đổi.
    2. `products`: Quản lý danh sách sản phẩm, chỉnh sửa biến thể, nhập Số công bố mỹ phẩm (CBMP).
    3. `inventory`: Theo dõi tồn kho từng SKU, cảnh báo hạn dùng FEFO, lô sắp hết date.
    4. `orders`: Danh sách Sub-orders của gian hàng, chuyển trạng thái đơn (Chuẩn bị hàng, Đang giao, Đã giao, Hủy đơn).
    5. `warehouses`: Quản lý kho hàng vật lý, địa chỉ xuất kho.
    6. `ads`: Cấu hình chiến dịch quảng cáo nội sàn (Đấu thầu từ khóa, Đẩy top danh mục).
    7. `marketing`: Thiết lập mã giảm giá gian hàng (Shop Voucher), Flash Sale nội bộ.
    8. `cs`: Kênh chăm sóc khách hàng trực tuyến (Chat trực tiếp với người mua).
    9. `finance`: Báo cáo tài chính, ví số dư doanh thu (90%), yêu cầu rút tiền về tài khoản ngân hàng.
  - *Verify:* Seller thao tác cập nhật đơn hàng; dữ liệu được đồng bộ ngay lập tức.
- **Nguyễn Viết Khánh:**
  - Kết nối các API xử lý đơn hàng dành riêng cho Seller (`GET /api/v1/seller/orders`, `PUT /api/v1/seller/orders/{id}/status`).
  - *Verify:* Xác thực quyền hạn chỉ cho phép chủ gian hàng thao tác trên đơn hàng của chính mình.

#### Ngày 20: Xây Dựng Hoàn Chỉnh 9 Phân Hệ Admin Zone (Quản Trị Sàn Thương Mại)
- **Nguyễn Văn Tuấn Anh:**
  - Xây dựng trung tâm điều hành quản trị tối cao của sàn (Admin Portal) với **9 phân hệ nghiệp vụ**:
    1. `merchants`: Thẩm định hồ sơ doanh nghiệp, phê duyệt mở gian hàng Shopee Mall / Official Store.
    2. `products`: Hậu kiểm chất lượng sản phẩm, kiểm tra giấy phép công bố mỹ phẩm (CBMP), duyệt gỡ hàng vi phạm.
    3. `users`: Quản lý người dùng toàn hệ thống, khóa tài khoản vi phạm chính sách.
    4. `campaigns`: Tạo lập đại hội siêu sale toàn sàn (Mega Campaign ngày đôi 11.11, 12.12).
    5. `disputes`: Trung tâm hòa giải khiếu nại, xử lý hoàn tiền / trả hàng giữa Buyer và Seller.
    6. `finance`: Kiểm toán sổ cái kép (Double-Entry Ledger), đối soát dòng tiền Escrow, theo dõi 10% hoa hồng sàn.
    7. `analytics`: Báo cáo phân tích toàn cảnh thị trường mỹ phẩm, xu hướng tìm kiếm hoạt chất INCI hot.
    8. `antifraud`: Hệ thống phát hiện gian lận (đánh giá ảo, bom hàng, trục lợi mã giảm giá).
    9. `system`: Cấu hình tham số hệ thống, giám sát trạng thái microservices qua Actuator.
  - *Verify:* Thao tác duyệt gian hàng mới và xem báo cáo tài chính sổ cái kép hiển thị chính xác.
- **Nguyễn Văn Tuấn:**
  - Phân quyền nghiêm ngặt vai trò `ROLE_ADMIN` tại Gateway và Account Service.
  - *Verify:* Người dùng thông thường cố tình truy cập link `/admin` sẽ bị chuyển hướng hoặc chặn 403 Forbidden.

#### Ngày 21: Hoàn Thiện Footer 4 Cột 15 Liên Kết & Đóng Gói Minh Chứng Đợt 3
- **Nguyễn Văn Tuấn Anh:**
  - Xây dựng Footer chuẩn sàn thương mại điện tử chuyên nghiệp với **4 cột danh mục và đủ 15 trang liên kết**:
    - *Cột 1 - Về Aura Beauty:* Giới thiệu sàn, Câu chuyện thương hiệu, Tuyển dụng, Điều khoản dịch vụ.
    - *Cột 2 - Chăm Sóc Khách Hàng:* Trung tâm trợ giúp, Hướng dẫn mua hàng, Chính sách đổi trả 7 ngày, Vận chuyển & Giao nhận.
    - *Cột 3 - Tiêu Chuẩn & Đạo Đức:* Cam kết 100% chính hãng, Tiêu chuẩn an toàn INCI, Chính sách bảo mật, Báo cáo hàng giả.
    - *Cột 4 - Hợp Tác & Gian Hàng:* Đăng ký bán hàng (Mall), Quy chế hoạt động, Liên hệ truyền thông.
  - Khởi tạo đầy đủ 15 trang nội dung chi tiết tương ứng, áp dụng cơ chế bảo đảm **0% lỗi trắng màn hình (Zero Blank-Screen)**.
  - *Verify:* Bấm thử toàn bộ 15 liên kết footer; 100% trang tải thành công với nội dung phong phú, chuẩn token thương hiệu.
- **Toàn nhóm:**
  - Tổng kết và hoàn thiện đóng gói hồ sơ minh chứng:
    - `docs/evidence/week-9/evidence-log.md` (Seller Sub-order, Double-Entry Ledger 10%)
    - `docs/evidence/week-10-11/evidence-log.md` (AI Advisor RAG, pgvector, SSE Streaming)
    - `docs/evidence/week-12/evidence-log.md` (AR Virtual Try-On, 5 Beauty-Tech, Multi-Zone Portals)
  - *Verify:* Kiểm tra cấu trúc tài liệu hoàn chỉnh, không sót liên kết hỏng.

---

### 📅 TUẦN 4 (Ngày 22 – 28): Resilience4j, k6 Load Test, Chaos Saga, Clean-Slate & Diễn Tập Bảo Vệ

> **Mục tiêu tuần:** Tối đa hóa độ tin cậy và khả năng chịu tải của hệ thống, thực hiện kiểm thử tự động toàn diện (Resilience4j Circuit Breaker, k6 Load Testing, Chaos Saga Testing), thẩm định khả năng triển khai từ máy sạch (Clean-Slate) và hoàn tất hồ sơ 14 tuần bảo vệ đồ án xuất sắc.  
> **Minh chứng hoàn tất:** Đóng gói thư mục hồ sơ `docs/evidence/week-13`, `week-14` và kịch bản bảo vệ đồ án `docs/evidence/defense-demo-script.md`.

#### Ngày 22: Tích Hợp Resilience4j Circuit Breaker & Cấu Hình Fallback
- **Nguyễn Văn Tuấn:**
  - Cấu hình thư viện **Resilience4j Reactive** cho các điểm giao tiếp phân tán nhạy cảm:
    - Circuit Breaker tại API Gateway bảo vệ khi các dịch vụ backend quá tải.
    - Circuit Breaker tại Order Service khi gọi kiểm tra tồn kho sang Inventory Service.
    - Rate Limiter và Time Limiter tại AI Advisor Service để ngăn ngừa nghẽn tài nguyên CPU khi xử lý vector.
  - Thiết lập cơ chế Fallback thanh lịch: Khi dịch vụ AI gián đoạn, tự động trả về phản hồi tĩnh từ bộ đệm; khi cổng thanh toán trễ, giữ đơn ở trạng thái chờ và thông báo người mua.
  - *Verify:* Mô phỏng tắt `inventory-service`; `order-service` tự động ngắt mạch (Open State) sau 5 lần timeout và trả về thông báo lỗi thân thiện sau $< 50\text{ms}$.
- **Nguyễn Viết Khánh:**
  - Cấu hình tham số Kafka Retry (Exponential Backoff với độ trễ tăng dần 1s, 2s, 4s, 8s) trước khi đẩy vào Dead Letter Topic.
  - *Verify:* Kiểm tra tiến trình retry tự động trên Kafka UI.

#### Ngày 23: Kiểm Thử Tải Phân Tán k6 Load Testing
- **Nguyễn Văn Tuấn (Chủ trì):**
  - Soạn thảo kịch bản kiểm thử tải bằng công cụ **k6** (`infra/k6/load-test-browse-and-order.js`):
    - Giai đoạn 1 (Ramp-up): Tăng từ 0 lên 200 người dùng ảo (VUs) trong 60 giây.
    - Giai đoạn 2 (Stress Test): Duy trì 500 người dùng ảo đồng thời duyệt sản phẩm và lọc Facet trong 3 phút.
    - Giai đoạn 3 (Flash Sale Spike): Đẩy tải đột biến 1.000 VUs cùng tranh mua sản phẩm flash sale trong 30 giây.
  - Chạy kịch bản và thu thập các chỉ số hiệu năng (Latency p95, p99, Throughput RPS, Error Rate).
  - *Verify:* 
    - Throughput đạt $> 1.800\text{ RPS}$ cho các truy vấn đọc catalog.
    - Độ trễ p95 đạt $< 120\text{ms}$.
    - Tỷ lệ lỗi toàn hệ thống $< 0.1\%$.
- **Nguyễn Viết Khánh:**
  - Giám sát độ trễ đọc/ghi của MongoDB và PostgreSQL trong suốt quá trình stress test; tối ưu hóa kích thước Connection Pool nếu phát hiện nút thắt cổ chai.
  - *Verify:* Cơ sở dữ liệu hoạt động ổn định, không vượt ngưỡng 75% RAM cấp phát.
- **Nguyễn Văn Tuấn Anh:**
  - Kiểm tra trạng thái giao diện người dùng dưới điều kiện mạng nghẽn (Network Throttling 3G Slow): đảm bảo các nút submit có spinner loading rõ ràng và không bị vỡ bố cục.
  - *Verify:* Giao diện đáp ứng tiêu chuẩn trải nghiệm người dùng Web Vitals (CLS = 0, FID $< 100\text{ms}$).

#### Ngày 24: Kiểm Thử Hỗn Loạn Phân Tán (Chaos Saga Testing) & Observability
- **Nguyễn Viết Khánh & Nguyễn Văn Tuấn:**
  - Thực hiện kiểm thử hỗn loạn (**Chaos Testing**) trên luồng phân tán Saga Choreography:
    - Kịch bản Chaos 1: Cưỡng chế dừng đột ngột (Kill container) `payment-service` ngay khi `inventory-service` vừa giữ kho thành công.
    - Kịch bản Chaos 2: Gây trễ mạng nhân tạo (Network Latency 5.000ms) giữa Kafka broker và `order-service`.
  - Kiểm chứng cơ chế tự phục hồi (Self-Healing):
    - Khi `payment-service` khởi động lại, Outbox Relay và Kafka tiếp tục bù trừ giao dịch; kho hàng được hoàn trả chính xác, không thất thoát tồn kho.
  - *Verify:* Kiểm tra báo cáo Chaos Test: Tính nhất quán cuối cùng (Eventual Consistency) đạt 100%.
- **Nguyễn Văn Tuấn:**
  - Cấu hình hệ thống giám sát thời gian thực **Observability**:
    - Kích hoạt SmallRye Health (`/q/health`, `/q/health/live`, `/q/health/ready`) trên tất cả 7 dịch vụ Quarkus.
    - Cấu hình Kafka UI giám sát Consumer Group Lag và phân bổ phân vùng (Partition Distribution).
  - *Verify:* Truy cập endpoint sức khỏe của cả 7 services đều trả về trạng thái `{"status": "UP"}`.

#### Ngày 25: Thẩm Định Triển Khai Dựng Máy Sạch (Clean-Slate Deployment)
- **Nguyễn Văn Tuấn (Chủ trì):**
  - Tiến hành thẩm định quy trình dựng hệ thống từ con số 0 trên một môi trường độc lập (Clean-Slate Verification):
    1. Clone mã nguồn vào thư mục mới hoàn toàn.
    2. Kiểm tra thư mục gốc: Đảm bảo giữ kỷ luật Clean Root tuyệt đối (chỉ có `pom.xml`, các thư mục trách nhiệm, không có file rác).
    3. Chạy lệnh dựng toàn bộ hạ tầng:
       ```bash
       docker compose -f infra/docker/docker-compose.yml up -d
       ```
    4. Chạy biên dịch toàn bộ backend:
       ```bash
       mvn clean test-compile
       ```
  - *Verify:* Maven biên dịch thành công 11/11 modules trong thời gian ngắn nhất, không lỗi dependency.
- **Nguyễn Văn Tuấn Anh:**
  - Thẩm định cài đặt và build tối ưu hóa Frontend từ máy sạch:
    ```bash
    cd frontend && npm install && npm run build
    ```
  - *Verify:* Vite build thành công sạch sẽ, tạo thư mục `dist/`, 0 lỗi TypeScript, kích cỡ bundle tối ưu hóa $< 600\text{ KB}$ (gzipped).
- **Nguyễn Viết Khánh:**
  - Chạy seed dữ liệu tự động cho máy sạch; kiểm tra toàn bộ 154 sản phẩm và 339 SKU kho sẵn sàng phục vụ.
  - *Verify:* Mở trình duyệt truy cập sàn, hệ thống sẵn sàng hoạt động ngay lập tức.

#### Ngày 26: Rà Soát Chất Lượng Mã Nguồn & Tối Ưu Hóa Clean Diff
- **Toàn nhóm:**
  - Tiến hành phiên bình duyệt mã nguồn chéo (Peer Review):
    - Tuấn rà soát chất lượng code Frontend của Tuấn Anh (xử lý Exception, Clean Props, Responsive).
    - Khánh rà soát cấu hình hạ tầng và test concurrency của Tuấn.
    - Tuấn rà soát luồng Saga, Outbox và thuật toán Split Order của Khánh.
  - Loại bỏ các dòng comment thừa, log debug không cần thiết (`console.log`, `System.out.println`).
  - Kiểm tra việc bảo toàn các nguyên tắc bất biến: Hexagonal Architecture, Reactive non-blocking, CAS, Split Order, Double-Entry Ledger.
  - *Verify:* Chạy lại toàn bộ bộ test tự động của Backend:
    ```bash
    mvn test
    ```
    100% Unit Tests và Integration Tests đều màu xanh.

#### Ngày 27: Đóng Băng Mã Nguồn & Hoàn Tất 14 Bộ Hồ Sơ Minh Chứng
- **Toàn nhóm:**
  - Chính thức thực hiện **Đóng Băng Mã Nguồn (Code Freeze)**: Tạo Git Tag `v1.0.0-release-candidate` và không đẩy thêm commit tính năng mới.
  - Rà soát, chuẩn hóa và ký nhận vào toàn bộ 14 thư mục hồ sơ minh chứng từ `week-1` đến `week-14`:
    - `docs/evidence/week-1/evidence-log.md`
    - `docs/evidence/week-2/evidence-log.md`
    - `docs/evidence/week-3/evidence-log.md`
    - `docs/evidence/week-4/evidence-log.md`
    - `docs/evidence/week-5/evidence-log.md`
    - `docs/evidence/week-6/evidence-log.md`
    - `docs/evidence/week-7/evidence-log.md`
    - `docs/evidence/week-8/evidence-log.md`
    - `docs/evidence/week-9/evidence-log.md`
    - `docs/evidence/week-10-11/evidence-log.md`
    - `docs/evidence/week-12/evidence-log.md`
    - `docs/evidence/week-13/evidence-log.md` (Observability, Clean-Slate)
    - `docs/evidence/week-14/evidence-log.md` (Code Freeze, Tổng kết đồ án)
  - *Verify:* Toàn bộ liên kết trong tài liệu dẫn chính xác tới các file kiểm thử và kết quả thực tế.

#### Ngày 28: Tổng Duyệt Kịch Bản Demo 5 Bước Trước Hội Đồng Bảo Vệ
- **Toàn nhóm:**
  - Tổ chức diễn tập kịch bản thuyết trình và Demo trực tiếp 5 bước vàng trước Hội đồng bảo vệ đồ án:
    - **Bước 1 (Tuấn - 3 phút):** Giới thiệu tổng quan kiến trúc hệ thống Microservices Reactive, kỷ luật Hexagonal Architecture, kết quả kiểm tra tự động ArchUnit và BlockHound.
    - **Bước 2 (Tuấn Anh - 4 phút):** Trình diễn trải nghiệm Buyer Zone: Mega Menu 51 danh mục, Bộ chọn biến thể Màu sắc HEX / Dung tích chuẩn Shopee Mall, bộ 5 công cụ Beauty-Tech (thử son AR 3D MediaPipe 60 FPS, quét da AI, Skin Quiz).
    - **Bước 3 (Khánh - 4 phút):** Trình diễn Cố vấn da liễu AI Advisor (RAG): chat tư vấn thành phần INCI qua SSE streaming thời gian thực, đối chiếu dữ liệu vector pgvector.
    - **Bước 4 (Khánh & Tuấn - 4 phút):** Trình diễn kỹ thuật lõi: Đặt hàng đa shop kích hoạt thuật toán Split Order, Outbox Relay trên Kafka UI, giữ kho nguyên tử CAS không âm và sổ cái kép Double-Entry Ledger (10%/90%).
    - **Bước 5 (Tuấn Anh & Tuấn - 3 phút):** Trình diễn 9 phân hệ quản trị Seller Zone (xử lý đơn con), 9 phân hệ Admin Zone (phê duyệt và kiểm toán) và báo cáo kiểm thử tải k6.
  - Chuẩn bị slide trình chiếu, video dự phòng (Backup Video) phòng ngừa sự cố mạng của hội trường.
  - *Verify:* Diễn tập hoàn thành đúng khung thời gian quy định (18 phút), trả lời trôi chảy các câu hỏi chất vấn kỹ thuật từ hội đồng.

---

## PHẦN III: DANH MỤC 14 BỘ HỒ SƠ MINH CHỨNG (EVIDENCE LOGS PORTFOLIO)

Hệ thống tài liệu minh chứng được thiết lập làm bằng chứng kỹ thuật không thể chối cãi phục vụ chấm điểm đồ án:

| Tuần | Tên mốc minh chứng | Nội dung kỹ thuật bàn giao | Người chịu trách nhiệm chính |
| :---: | :--- | :--- | :--- |
| **W1** | Khởi tạo DDD, Hạ tầng & Backlog | Docker Compose, 4 ADR, Domain Model, Git repo | Nguyễn Văn Tuấn |
| **W2** | Hexagonal Architecture & Account | 3 Thư viện libs, JWT Auth, RBAC, ArchUnit Test | Nguyễn Văn Tuấn |
| **W3** | Catalog Service, INCI & MongoDB | Quarkus Panache MongoDB Reactive, 45 INCI, 8 Facets | Nguyễn Viết Khánh |
| **W4** | Quy trình Shop Mall & Duyệt CBMP | Đăng ký gian hàng, kiểm định Số công bố CBMP | Nguyễn Văn Tuấn |
| **W5** | Inventory CAS & Lô Hạn Dùng FEFO | Giữ kho CAS, AtomicStockConcurrencyTest | Nguyễn Văn Tuấn |
| **W6** | Multi-Vendor Cart & Price Snapshot | Giỏ hàng gom nhóm Shop, chốt giá catalog | Nguyễn Viết Khánh |
| **W7** | Split Order & Transactional Outbox | Thuật toán tách đơn con, Outbox Relay Kafka | Nguyễn Viết Khánh |
| **W8** | Saga Choreography & Payment Mock | Giao dịch phân tán, bù trừ kho, tài khoản Escrow | Nguyễn Viết Khánh |
| **W9** | Seller Sub-order & Sổ Cái Kép | Xử lý đơn con, Double-Entry Ledger (10%/90%) | Nguyễn Viết Khánh |
| **W10-11** | AI Advisor RAG pgvector & SSE | Tìm kiếm ngữ nghĩa INCI, Chat streaming SSE | Nguyễn Viết Khánh |
| **W12** | AR Virtual Try-On 3D & Multi-Zone | MediaPipe 478 mốc, PBR Canvas 60 FPS, 18 Phân hệ | Nguyễn Văn Tuấn Anh |
| **W13** | Observability & Clean-Slate Setup | Resilience4j, k6 Load Test, Actuator, Dựng máy sạch | Nguyễn Văn Tuấn |
| **W14** | Code Freeze & Kịch Bản Demo Hội Đồng | Đóng băng mã nguồn, Diễn tập 5 bước thuyết trình | Toàn nhóm (Tuấn chủ trì) |

---

## PHẦN IV: TIÊU CHUẨN NGHIỆM THU KỸ THUẬT (GOAL-DRIVEN VERIFICATION CHECKLIST)

Mọi thay đổi trong hệ thống đều phải vượt qua 5 bài kiểm tra nghiệm thu tự động sau trước khi nghiệm thu từng giai đoạn:

### 1. Kiểm tra kỷ luật Clean Root
```bash
# Thư mục gốc chỉ chứa các thư mục trách nhiệm và file cấu hình cho phép
ls -la
```
*Tiêu chí đạt:* Thư mục gốc tuyệt đối không chứa các file rác code tạm thời (`test.js`, `temp.py`, `.log`).

### 2. Biên dịch Backend toàn diện
```bash
mvn clean test-compile
```
*Tiêu chí đạt:* Toàn bộ 11 modules (`cosmetics-platform`, 3 libs, 7 services) đạt trạng thái `BUILD SUCCESS`, không phát sinh lỗi cảnh báo deprecation nghiêm trọng.

### 3. Kiểm thử Kiến trúc Lục giác (ArchUnit)
```bash
mvn test -pl services/account-service -Dtest=HexagonalArchitectureTest
```
*Tiêu chí đạt:* Không có bất kỳ phụ thuộc nào đi ngược từ Domain ra Adapter ngoài.

### 4. Kiểm thử Đồng thời Giữ Kho (CAS Atomic Test)
```bash
mvn test -pl services/inventory-service -Dtest=AtomicStockConcurrencyTest
```
*Tiêu chí đạt:* 50 luồng đồng thời tranh chấp tài nguyên, không xảy ra race condition, tồn kho sau cùng bằng đúng phần dư toán học, không âm.

### 5. Build Tối Ưu Hóa Giao Diện Frontend
```bash
cd frontend && npm run build
```
*Tiêu chí đạt:* Trình biên dịch Vite hoàn tất đóng gói trong $< 5$ giây, 0 lỗi TypeScript, 0 lỗi linter, sinh bundle tĩnh hợp lệ tại thư mục `dist/`.

---

## PHẦN V: MA TRẬN QUẢN TRỊ RỦI RO & KỊCH BẢN ỨNG PHÓ (RISK MITIGATION)

| Rủi ro kỹ thuật | Mức độ | Hậu quả tiềm tàng | Giải pháp kiến trúc phòng ngừa & Khắc phục |
| :--- | :---: | :--- | :--- |
| **Nghẽn tin nhắn hoặc mất thứ tự trên Kafka** | Cao | Sub-order và thanh toán bị lệch trạng thái | Áp dụng Kafka Message Key theo `master_order_id` để ép các event của cùng 1 đơn vào cùng một partition; cấu hình Idempotent Consumer chống lặp tin. |
| **Tranh chấp giữ kho Flash Sale (High Concurrency)** | Rất cao | Bán vượt số lượng tồn thực tế (Overselling) | Áp dụng câu lệnh CAS nguyên tử trực tiếp ở tầng Database với điều kiện `(on_hand - reserved) >= quantity`; không dùng pessimistic lock gây treo connection pool. |
| **Crawler bị chặn IP / Cloudflare WAF** | Trung bình | Thiếu hụt dữ liệu sản phẩm mẫu | Tích hợp cơ chế Fallback thông minh 4 lớp với bộ dữ liệu giám định y khoa lưu sẵn; xoay vòng User-Agent và bổ sung jitter delay ngẫu nhiên. |
| **AR MediaPipe quá tải trên thiết bị yếu** | Trung bình | Tụt khung hình, giật lag trải nghiệm | Tự động hạ cấp độ phân giải xử lý lưới (Downscaling mesh), tắt bớt lớp phủ bóng phức tạp khi FPS đo được $< 30$; hỗ trợ chế độ xem swatch tĩnh dự phòng. |
| **Trắng màn hình khi API catalog chậm/lỗi** | Cao | Buyer rời bỏ ứng dụng | Tích hợp `submenuCatalogMapper` có cơ chế fallback sản phẩm dự phòng, kết hợp Client Error Boundary tại từng Zone; đảm bảo 100% trang có nội dung. |
| **Lệch số liệu đối soát doanh thu** | Rất cao | Khiếu nại từ chủ gian hàng | Bắt buộc hạch toán qua Sổ cái kép (Double-Entry Ledger) với invariant toán học `Tổng Nợ = Tổng Có`; mọi bút toán đều có audit log bất biến. |

---

## 🎯 KẾT LUẬN & CAM KẾT HÀNH ĐỘNG

Kế hoạch 28 ngày trên là kim chỉ nam bất biến cho toàn bộ đội ngũ dự án **Aura Beauty Mall (WebBanMP)**. 

Bằng việc phân định ranh giới trách nhiệm rõ ràng, tôn trọng kiến trúc phân tán hiện đại, bảo vệ mã nguồn qua kiểm thử tự động nghiêm ngặt và theo đuổi trải nghiệm người dùng hoàn mỹ, nhóm cam kết sẽ đưa dự án về đích đúng hạn với chất lượng kỹ thuật ở cấp độ doanh nghiệp (Enterprise-Grade).

*Hà Nội, ngày 03 tháng 11 năm 2026*  
**Thay mặt Đội ngũ Kỹ thuật Cốt lõi**  
**Principal Enterprise Software Architect & Agile Project Manager**  
*(Đã ký và phê duyệt ban hành)*
