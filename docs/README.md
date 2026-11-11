<div align="center">

# ✨ AURA BEAUTY MALL — MULTI-VENDOR DERMA-TECH PLATFORM
### Nền Tảng Thương Mại Điện Tử Mỹ Phẩm Đa Người Bán & Công Nghệ Thực Tế Ảo AR Virtual Try-On 3D

[![Quarkus 3.15](https://img.shields.io/badge/Quarkus-3.15.1_LTS-4695EB?style=for-the-badge&logo=quarkus&logoColor=white)](https://quarkus.io/)
[![Mutiny Reactive](https://img.shields.io/badge/Mutiny_Reactive-100%25_Non--blocking-red?style=for-the-badge&logo=quarkus&logoColor=white)](https://smallrye.io/smallrye-mutiny/)
[![Java 21/22](https://img.shields.io/badge/Java-21%2F22_Modern_JDK-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Apache Kafka](https://img.shields.io/badge/Apache_Kafka-Saga_Choreography-231F20?style=for-the-badge&logo=apachekafka&logoColor=white)](https://kafka.apache.org/)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![MediaPipe 3D](https://img.shields.io/badge/MediaPipe-478_3D_FaceMesh-007ACC?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/mediapipe)
[![Docker](https://img.shields.io/badge/Docker_Compose-Infrastructure-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

<p align="center">
  <b>Hệ sinh thái TMĐT mỹ phẩm cao cấp kết hợp Kiến trúc Microservices Reactive phân tán chịu tải cao, Giao dịch nhất quán Saga Outbox và Trải nghiệm AR Makeup Try-On 60 FPS + AI RAG Tra cứu thành phần mỹ phẩm (INCI).</b>
</p>

[🌟 Giới Thiệu](#-tổng-quan-dự-án) • [💎 Điểm Nhấn Kỹ Thuật](#-điểm-nhấn-kỹ-thuật-cốt-lõi) • [🏛️ Kiến Trúc Hệ Thống](#️-kiến-trúc-hệ-thống) • [🚀 Hướng Dẫn Cài Đặt & Chạy](#-hướng-dẫn-cài-đặt--khởi-chạy) • [🔑 Tài Khoản Thử Nghiệm](#-tài-khoản-thử-nghiệm)

---
</div>

## 🌟 TỔNG QUAN DỰ ÁN

**Aura Beauty Mall (WebBanMP)** là nền tảng thương mại điện tử chuyên biệt cho ngành làm đẹp và mỹ phẩm đa người bán (Multi-Vendor Marketplace). Hệ thống giải quyết hai bài toán cốt lõi:
1. **Trải nghiệm khách hàng vượt trội (Client Experience):** Ứng dụng công nghệ **Aura Virtual Try-On 2.0** với camera AR 60 FPS nhận diện 478 điểm 3D khuôn mặt giúp khách hàng thử trực tiếp son môi, phấn má, kem nền, phấn mắt theo thời gian thực; kết hợp cùng **Trợ lý AI Da Liễu (Cosmetic RAG)** tư vấn thành phần chuẩn quốc tế **INCI**.
2. **Kỹ thuật phần mềm chuẩn doanh nghiệp (Enterprise Architecture):** Xây dựng trên nền tảng **Microservices Reactive 100% Non-blocking**, tự động tách đơn đa người bán (**Split Order**), đồng bộ sự kiện phân tán qua **Kafka Transactional Outbox**, giữ kho nguyên tử **CAS** và kiểm soát tài chính minh bạch bằng **Sổ cái kép (Double-Entry Ledger)**.

---

## 💎 ĐIỂM NHẤN KỸ THUẬT CỐT LÕI

### 1. 💄 Edge-AI Virtual Try-On 2.0 & Chẩn Đoán Da 3D
* **Phối màu trang điểm đa lớp (Multi-Category Makeup):** Thử trực tiếp 4 vùng makeup (Son môi, Phấn má, Kem nền, Phấn mắt) với đa dạng chất son (Matte, Glossy, Velvet, Satin).
* **Canvas PBR Renderer 60 FPS:** Khử đốm sáng giả (glare artifact removal), giữ nguyên vân môi tự nhiên và hòa trộn sắc độ theo giá trị độ sáng tự nhiên (Luminance preserving).
* **AI Skincare Advisor:** Phân tích tông da (Warm / Cool / Neutral) bằng mô hình `MediaPipe FaceMesh 478 3D landmarks`, đề xuất màu sắc hài hòa nhất với làn da người dùng.
* **Chế độ so sánh Trước/Sau:** Split Slider hoặc giữ chuột để đối chiếu ảnh gốc và ảnh sau trang điểm.

### 2. ⚡ 100% Non-blocking Reactive Microservices (Quarkus 3.15 LTS)
* **Reactive Streams toàn diện:** 7 Microservices viết bằng **Quarkus 3.15 LTS + Java 21/22 + Mutiny Reactive (Uni/Multi)**, sử dụng trình điều khiển phản ứng không chặn hiệu năng cao **Quarkus Reactive PgPool** (PostgreSQL) và **MongoDB Reactive Panache**, chạy trên Vert.x EventLoop, khởi động siêu tốc trong < 2.5s và tiêu hao bộ nhớ RAM cực thấp (< 100MB mỗi service).
* **Chốt chặn an toàn luồng:** Kiểm soát nghiêm ngặt không chặn luồng Vert.x EventLoop; kiểm chứng cấu trúc kiến trúc Hexagonal (Ports & Adapters) bằng **ArchUnit**.

### 3. 🔄 Phân Tách Đơn Hàng (Split Order) & Saga Choreography
* **Giỏ hàng đa Shop:** Đặt chung sản phẩm từ nhiều Shop khác nhau trong một lần thanh toán. Hệ thống tự động phân tách thành các Sub-order độc lập cho từng người bán.
* **Đảm bảo tính nhất quán cuối cùng (Eventual Consistency):** Điều phối giao dịch phân tán qua **Apache Kafka**, quản lý trạng thái đơn hàng bằng **Transactional Outbox Pattern** và cơ chế **Idempotent Consumer** chống xử lý trùng lặp sự kiện.

### 4. ⚖️ Sổ Cái Kép Kế Toán (Double-Entry Ledger) & Giữ Kho CAS
* **Luật bất biến kế toán:** Cơ chế ghi sổ kép tự động đảm bảo `Tổng Nợ (Debit) = Tổng Có (Credit)`. Tự động khấu trừ 10% hoa hồng sàn và phân bổ 90% doanh thu vào công nợ phải trả cho từng Seller.
* **Giữ kho nguyên tử (Atomic Stock Reservation):** Sử dụng thuật toán so sánh và hoán đổi **CAS (`(on_hand - reserved) >= N`)** cùng chiến lược xuất kho ưu tiên hạn dùng **FEFO**, đảm bảo không bao giờ bị bán âm kho khi chịu tải cao.

### 5. 🤖 Trợ Lý Mỹ Phẩm RAG (Retrieval-Augmented Generation)
* Tra cứu và phân tích an toàn thành phần mỹ phẩm theo tiêu chuẩn **INCI** (International Nomenclature of Cosmetic Ingredients).
* Tìm kiếm ngữ nghĩa sản phẩm phù hợp với loại da qua vector embeddings lưu trữ tại **PostgreSQL pgvector**, truyền phát câu trả lời trực tiếp qua **Server-Sent Events (SSE)**.

---

## 🏛️ KIẾN TRÚC HỆ THỐNG

### Sơ Đồ Điều Phối Dịch Vụ

```
                              [ Khách hàng (Buyer) / Chủ shop (Seller) / Quản trị viên (Admin) ]
                                                            │
                                                            ▼ (HTTP / SSE / WebSocket)
                                          ┌────────────────────────────────────┐
                                          │   React 18 SPA + Vite 5 (Port 3000)│
                                          │   (MediaPipe AR 3D 60FPS + Tailwind)│
                                          └─────────────────┬──────────────────┘
                                                            │
                                                            ▼ (Reverse Proxy / Routing)
                                          ┌────────────────────────────────────┐
                                          │     API Gateway (Port 8080)        │
                                          │   Quarkus Vert.x Reactive Proxy    │
                                          └─────────────────┬──────────────────┘
                                                            │
                        ┌───────────────────────────────────┼──────────────────────────────────┐
                        ▼                                   ▼                                  ▼
             ┌─────────────────────┐             ┌─────────────────────┐            ┌─────────────────────┐
             │   account-service   │             │   catalog-service   │            │  inventory-service  │
             │     (Port 8081)     │             │     (Port 8082)     │            │     (Port 8083)     │
             │   PgPool (Mutiny)   │             │   MongoDB Panache   │            │   PgPool (Mutiny)   │
             └──────────┬──────────┘             └──────────┬──────────┘            └──────────┬──────────┘
                        │                                   │                                  │
                        └─────────────────────────────┐     │     ┌────────────────────────────┘
                                                      ▼     ▼     ▼
                                             ┌─────────────────────────┐
                                             │   Apache Kafka Clustered│
                                             │ (Saga Choreography Bus) │
                                             └────────┬────────┬───────┘
                                                      │        │
                        ┌─────────────────────────────┘        └──────────────────────────┐
                        ▼                                                                 ▼
             ┌─────────────────────┐             ┌─────────────────────┐            ┌─────────────────────┐
             │    order-service    │             │   payment-service   │            │  ai-advisor-service │
             │     (Port 8084)     │             │     (Port 8085)     │            │     (Port 8086)     │
             │   PgPool (Mutiny)   │             │   PgPool (Mutiny)   │            │ PgPool + pgvector   │
             └─────────────────────┘             └─────────────────────┘            └─────────────────────┘
```

### Bảng Danh Mục Dịch Vụ & Cổng Kết Nối

| STT | Dịch Vụ | Cổng | Cơ Sở Dữ Liệu | Nhiệm Vụ & Bounded Context (Quarkus 3.15 Reactive) |
| :---: | :--- | :---: | :--- | :--- |
| **1** | **`api-gateway`** | `8080` | *Không dùng DB* | Quarkus Vert.x Reverse Proxy, định tuyến động, xác thực JWT, CORS phản ứng |
| **2** | **`account-service`** | `8081` | PostgreSQL (`account_db`) | Quarkus PgPool: Quản lý người dùng, hồ sơ shop, phân quyền RBAC & Skin Profile |
| **3** | **`catalog-service`** | `8082` | MongoDB (`catalog_db`) | Quarkus Panache MongoDB: Sản phẩm, thương hiệu, INCI, cấu hình VTO AR 3D |
| **4** | **`inventory-service`**| `8083` | PostgreSQL (`inventory_db`) | Quarkus PgPool: Kiểm soát tồn kho nguyên tử CAS, quản lý hạn dùng FEFO |
| **5** | **`order-service`** | `8084` | PostgreSQL (`order_db`) | Quarkus PgPool: Giỏ hàng đa Shop, tách đơn (Split Order), Outbox Relay Worker |
| **6** | **`payment-service`** | `8085` | PostgreSQL (`payment_db`) | Quarkus PgPool: Thanh toán, Sổ cái kép Double-Entry Ledger, trích hoa hồng 10% |
| **7** | **`ai-advisor-service`**| `8086` | PostgreSQL (`ai_db` + pgvector) | Quarkus PgPool: AI RAG tư vấn mỹ phẩm theo chuẩn INCI, streaming phản hồi qua SSE |
| **8** | **`frontend`** | `3000` | *Browser Storage* | Giao diện React 18, Vite 5, Tailwind CSS, MediaPipe AR Try-On 60 FPS |

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY

### 1. Yêu Cầu Môi Trường (Prerequisites)
- **Java Development Kit (JDK):** Phiên bản **Java 21 LTS** trở lên
- **Node.js:** Phiên bản **20.x** hoặc **22.x** (kèm `npm`)
- **Docker & Docker Compose:** Đã cài đặt và đang chạy Docker Desktop
- **Apache Maven:** Phiên bản 3.9+ (hoặc dùng `mvn` có sẵn trong PATH)

---

### 2. Bước 1: Khởi Động Hạ Tầng (Docker Compose)
Khởi động cụm 4 dịch vụ hạ tầng gồm PostgreSQL (kèm `pgvector`), MongoDB, Apache Kafka và giao diện quản lý Kafka UI:

```bash
# Di chuyển vào thư mục gốc dự án và khởi động container ngầm
docker compose -f infra/docker/docker-compose.yml up -d

# Kiểm tra trạng thái toàn bộ container (tất cả phải ở trạng thái Up)
docker compose -f infra/docker/docker-compose.yml ps
```

*Địa chỉ dịch vụ hạ tầng:*
- **PostgreSQL 16 (pgvector):** `localhost:5432` *(User: `app`, Pass: `app_secret`)*
- **MongoDB 7:** `localhost:27017` *(User: `app`, Pass: `app_secret`)*
- **Apache Kafka:** `localhost:9092`
- **Kafka UI:** [http://localhost:8090](http://localhost:8090)

---

### 3. Bước 2: Biên Dịch Mã Nguồn Backend

```bash
# Biên dịch và kiểm tra dependencies của 7 Microservices
mvn clean test-compile
```

*(Tùy chọn) Chạy kiểm thử kiến trúc Hexagonal và Concurrency CAS:*
```bash
# Kiểm thử kiến trúc Hexagonal Ports & Adapters (ArchUnit)
mvn test -pl backend/account-service -Dtest=HexagonalArchitectureTest

# Kiểm thử giữ hàng nguyên tử không âm (AtomicStockConcurrencyTest)
mvn test -pl backend/inventory-service -Dtest=AtomicStockConcurrencyTest
```

---

### 4. Bước 3: Khởi Chạy Các Microservices (Quarkus 3.15 LTS)

Đóng gói các dịch vụ thành ứng dụng Quarkus siêu tốc:
```bash
mvn package -DskipTests
```

Khởi chạy từng service (mỗi service mở một cửa sổ Terminal riêng hoặc chạy nền qua `quarkus-run.jar`):

```bash
# 1. API Gateway (Port 8080)
java -jar backend/api-gateway/target/quarkus-app/quarkus-run.jar

# 2. Account Service (Port 8081)
java -jar backend/account-service/target/quarkus-app/quarkus-run.jar

# 3. Catalog Service (Port 8082)
java -jar backend/catalog-service/target/quarkus-app/quarkus-run.jar

# 4. Inventory Service (Port 8083)
java -jar backend/inventory-service/target/quarkus-app/quarkus-run.jar

# 5. Order Service (Port 8084)
java -jar backend/order-service/target/quarkus-app/quarkus-run.jar

# 6. Payment Service (Port 8085)
java -jar backend/payment-service/target/quarkus-app/quarkus-run.jar

# 7. AI Advisor Service (Port 8086)
java -jar backend/ai-advisor-service/target/quarkus-app/quarkus-run.jar
```

*(Hoặc khởi chạy ở chế độ phát triển Live Reload: `mvn -pl backend/<service-name> quarkus:dev`)*

---

### 5. Bước 4: Khởi Chạy Frontend React

Mở một cửa sổ Terminal mới và thực hiện:

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt thư viện dependencies
npm install

# Khởi chạy máy chủ phát triển Vite (Port 3000)
npm run dev
```

Truy cập ứng dụng ngay tại: **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 TÀI KHOẢN THỬ NGHIỆM (DEMO ACCOUNTS)

Hệ thống đã chuẩn bị sẵn các tài khoản tương ứng với từng phân quyền trong sàn:

| Vai Trò | Tên Đăng Nhập | Mật Khẩu | Quyền Hạn & Tính Năng Trải Nghiệm |
| :--- | :--- | :--- | :--- |
| **Buyer (Khách Mua)** | `buyer1` | `password` | Xem danh mục, thử son & makeup AR 60 FPS, chat AI RAG, đặt đơn đa Shop |
| **Seller (Chủ Shop)** | `seller1` | `password` | Đăng ký mở shop, đăng sản phẩm duyệt số CBMP, xác nhận đơn con (Sub-orders) |
| **Admin (Quản Trị)** | `admin` | `password` | Phê duyệt mở Shop, duyệt sản phẩm lên sàn, đối soát Sổ cái kép (Ledger) |

---

## 🎯 KỊCH BẢN TRẢI NGHIỆM TÍNH NĂNG TIÊU BIỂU

1. **Trải Nghiệm Thử Son & Makeup Thực Tế Ảo (Aura Virtual Try-On 2.0):**
   - Truy cập trang chủ, bấm nút **"Thử màu AR 60 FPS"** tại banner hoặc mở chi tiết sản phẩm son môi/phấn bất kỳ.
   - Chọn chế độ **Ảnh Mẫu** (3 mẫu khuôn mặt độ nét cao) hoặc bật **Webcam**.
   - Thử nghiệm các hiệu ứng: Son môi (chọn chất son Matte / Glossy / Velvet), Phấn má, Kem nền, Phấn mắt.
   - Xem AI phân tích sắc độ da (Warm/Cool/Neutral) và điều chỉnh độ bóng (Glossiness), độ đậm (Opacity).
2. **Trải Nghiệm Trợ Lý AI Tư Vấn Thành Phần (Cosmetic RAG):**
   - Bấm vào widget trò chuyện ở góc phải màn hình.
   - Đặt các câu hỏi về làn da, ví dụ: *"Da mình đang bị mụn viêm và dầu nhiều, nên dùng serum chứa Niacinamide hay BHA?"*. Trợ lý sẽ phân tích và streaming câu trả lời từ bảng thành phần INCI qua SSE.
3. **Trải Nghiệm Đặt Đơn Đa Shop & Tách Đơn (Split Order):**
   - Đăng nhập tài khoản `buyer1`, chọn 2 sản phẩm từ 2 Shop khác nhau vào giỏ hàng.
   - Bấm Thanh Toán. Hệ thống kích hoạt Saga Choreography: tạo 1 Master Order và tự động tách thành 2 Sub-order độc lập, giữ kho CAS và cập nhật trạng thái theo thời gian thực.
4. **Đối Soát Tài Chính & Hoa Hồng Sàn:**
   - Đăng nhập tài khoản `admin`, truy cập phân hệ Sổ cái kế toán để xem các bút toán ghi nợ/ghi có và trích 10% hoa hồng sàn tự động.

---

<div align="center">
  <b>Aura Beauty Mall — Đỉnh Cao Công Nghệ Thương Mại Điện Tử Mỹ Phẩm Phản Ứng</b><br>
  <i>Phát triển trên nền tảng Quarkus 3.15 LTS Mutiny Reactive, Kafka Saga Outbox & React 18 MediaPipe 3D</i>
</div>