# 🏛️ HIẾN PHÁP DỰ ÁN — QUY CHUẨN VIBE CODING, NGHIỆP VỤ & KIẾN TRÚC HỆ THỐNG
> **MÔI TRƯỜNG**: Windows 11 | Antigravity IDE (Gemini Models) | Multi-Agent System
> **DỰ ÁN**: Sàn TMĐT Mỹ Phẩm Đa Người Bán (Aura Beauty Mall / WebBanMP)
> **MỆNH LỆNH TỐI CAO**: Mọi AI Agent BẮT BUỘC tuân thủ tuyệt đối tài liệu này.

---

## 1. KỶ LUẬT THÉP CLEAN ROOT & ÁNH XẠ THƯ MỤC SPEC KIT (ZERO-BREAKAGE)
1. **White-list tại Root**: Chỉ chấp nhận `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `pom.xml` (Maven Aggregator bắt buộc), `.gitignore`, `.antigravity/`, và thư mục ẩn `.specify/`.
2. **CẤM TUYỆT ĐỐI**: Không để file code, file chạy thử (`test.js`, `temp.py`), log, script rác hoặc `.md` lẻ tại root. `README.md` lưu tại `docs/README.md`.
3. **Cấu trúc vùng trách nhiệm**:
   - `docs/`: **Trung tâm tài liệu duy nhất** (tuyệt đối không viết code thực thi ở đây):
     - `docs/flows/`: Quy trình nghiệp vụ chuẩn (`QT-<nn>-<slug>.md`, `_phieu-yeu-cau.md`) và đặc tả SDD của Spec Kit (`spec.md`, `plan.md`, `tasks.md`). (Đồng bộ song song `.specify/specs/<slug>/`).
     - `docs/blueprints/`: Bản thiết kế bóc tách từ Open Source (`OSS-BLUEPRINT-<project>.md`).
     - `docs/architecture/`: Sơ đồ kiến trúc, DB Schema và các `ADR-00x` (`ADR-001` -> `ADR-005`).
     - `docs/modules/`: Tài liệu theo tính năng, hồ sơ sửa lỗi (`docs/modules/bugs/<slug>/`) và đánh giá ý tưởng (`docs/modules/assessments/<slug>/`).
     - `docs/evidence/`: Toàn bộ minh chứng 14 tuần (`week-1` -> `week-14`).
   - `frontend/`: Giao diện React 18 + Vite 5 (Port 3000), Tailwind CSS, Animate UI, AR Virtual Try-On (@mediapipe 478 điểm 3D + Canvas/WebGL 60 FPS), Variant Selector chuẩn Shopee Mall, Browser History Sync.
   - `backend/` (hoặc `services/`): 7 Microservices Quarkus 3.15 Mutiny Reactive (Port 8080-8086) và các thư viện dùng chung (common-web, common-events, common-outbox).
   - `infra/`: Hạ tầng Docker Compose (`infra/docker/docker-compose.yml`), DB init, script vận hành, k6 test.
   - `ai/`: Cosmetics Crawler, INCI dataset, Prompts, RAG embeddings.
   - `agents/`: Các mini-rules chuyên sâu cho từng phân hệ (`backend-hexagonal.md`, `frontend.md`, `ledger.md`, `saga-outbox.md`, `ai-rag.md`, `windows-safety.md`).

---

## 2. LUẬT AN TOÀN MÁY WINDOWS (BẮT BUỘC)
1. Chỉ thao tác trong thư mục gốc dự án. Cấm đụng `C:\Windows`, AppData, Desktop, ổ đĩa khác.
2. **CẤM CÁC LỆNH PHÁ HỦY**: `Remove-Item -Recurse/-Force`, `rm -rf`, `del /s`, `rd /s`, `git clean`, `git reset --hard`, `git push --force`, `docker system prune`, `taskkill` theo tên, sửa Registry/PATH, tắt Firewall/Defender, chạy quyền Administrator.
3. Di chuyển file chỉ bằng `git mv` (mỗi lô $\le 20$ file), commit cục bộ trên nhánh `restructure/zero-breakage`. KHÔNG push.
4. Giới hạn tài nguyên: `MAVEN_OPTS=-Xmx1g`, `mvn -T 1`, `NODE_OPTIONS=--max-old-space-size=1024`. Mọi lệnh có timeout. RAM trống phải $> 3\text{ GB}$ trước khi chạy build.
5. Không đọc/in/commit file `.env` chứa secret. Lưu ý rủi ro Windows: đường dẫn $>260$ ký tự, CRLF/LF, file lock và link `file:///d:/...`.

---

## 3. VÙNG BẤT KHẢ XÂM PHẠM (ZERO-BREAKAGE)
1. **pom.xml gốc**: Giữ nguyên danh sách `<modules>` trỏ vào `backend/`.
2. **infra/docker/docker-compose.yml**: Không sửa (hash SHA-256 trước/sau phải trùng). Bảng cổng bất biến: Gateway 8080, Account 8081, Catalog 8082, Inventory 8083, Order 8084, Payment 8085, AI 8086, Frontend 3000, Postgres 5432, Mongo 27017, Kafka 9092, Kafka-UI 8090.
3. Không đổi mã Java, cấu trúc Hexagonal Package, dependencies. Mọi refactor di chuyển file phải cập nhật đầy đủ import/alias.

---

## 4. QUY TRÌNH 5 BƯỚC CHỐNG BỊA ĐẶT & 4 NGUYÊN TẮC KỸ THUẬT CỐT LÕI
1. **Bước 1 - Học dự án âm thầm (Silent Project Learning) & Think Before Coding:**
   - Quét từ nhẹ đến nặng: `AGENTS.md`, `GEMINI.md`, `docs/README.md`, `agents/` $\rightarrow$ Data Models (Quarkus Reactive PgPool / Panache MongoDB, MongoDB Document `ProductDocument`, `VtoConfig`) $\rightarrow$ RBAC (`ROLE_ADMIN`, `STAFF_AUDITOR`, `STAFF_ACCOUNTANT`, Buyer/Seller) $\rightarrow$ API & cơ chế nền (SSE, Kafka Outbox, Saga).
   - Nắm vững: Glossary (Từ điển thuật ngữ), Roles (Bảng vai trò), và Danh sách tính năng Đã có vs Mới.
2. **Bước 2 - Gap Check (Kiểm tra lỗ hổng & Hỏi lại):**
   - Yêu cầu chỉ đủ điều kiện thực thi khi rõ: (1) Actor (Ai làm), (2) Trigger (Khi nào bắt đầu), (3) Outcome (Kết quả là gì), Quyền hạn và Luồng lỗi.
   - Nếu thiếu hoặc mập mờ: **DỪNG LẠI VÀ HỎI TỐI ĐA 5 CÂU** bằng tiếng Việt bình dân, có gợi ý phương án và đánh dấu **(Khuyến nghị)**. Chi tiết phụ chưa rõ ghi thành Giả định (`GD-xx`).
3. **Bước 3 - Spec trước, Code sau (Spec-First & Simplicity First):**
   - Không viết code khi đang phân tích. Tối giản mã nguồn, giải quyết đúng phạm vi, triệt tiêu over-engineering.
4. **Bước 4 - Thực thi phẫu thuật sạch sẽ (Surgical Changes & Clean Execution):**
   - **Clean diff tuyệt đối:** Chỉ chỉnh sửa đúng vị trí cần can thiệp, không reformat toàn file, không đổi naming/style, không xóa code không liên quan.
   - **Bảo vệ chốt chặn Backend:** Package `domain` thuần Java 21/22 100% (pass `HexagonalArchitectureTest` qua ArchUnit), 100% Non-blocking (Mutiny Reactive), giữ kho nguyên tử **CAS (`AtomicStockConcurrencyTest`)**, **Split Order**, và **Sổ cái kép (Double-Entry Ledger: Debit = Credit, 10% hoa hồng sàn / 90% Seller)**.
   - **Bảo vệ chốt chặn Frontend:** Cam kết **0% màn hình trắng (Zero Blank-Screen)** trên toàn bộ 51 Sub-menu, 9 phân hệ Seller, 9 phân hệ Admin, 15 liên kết Footer. Đủ **4 trạng thái (Loading, Empty, Error, Data)**, nút API chống double-submit (`disabled` + spinner), xóa/hủy bắt buộc có Confirm Modal.
5. **Bước 5 - Kiểm chứng & Báo cáo ngắn gọn (Goal-Driven Execution & Concise Reply):**
   - Chu trình: `[Bước thực hiện] -> Verify: [Tiêu chí kiểm chứng]`.
   - Tự kiểm tra Root sạch rác; phản hồi tiếng Việt $\le 6$ dòng kèm link file trực tiếp.

---

## 5. HỆ THỐNG LỆNH SPEC KIT TÍCH HỢP VÀO AGENT

### 1. QUY TRÌNH SPEC-DRIVEN DEVELOPMENT (SDD — XÂY DỰNG TÍNH NĂNG MỚI)
- **`/speckit-constitution [nội dung]`**: Cập nhật Hiến pháp dự án đồng bộ vào `AGENTS.md`, `GEMINI.md`, `/agents/` và `.specify/memory/constitution.md`.
- **`/speckit-specify [mô tả tính năng]`** (kết hợp `/business-flow`):
  - Chạy *Silent Project Learning* & *Gap Check* (hỏi $\le 5$ câu nếu chưa rõ Actor/Trigger/Outcome).
  - Xuất đặc tả `docs/flows/QT-<nn>-<slug>.md` (và `.specify/specs/<slug>/spec.md`) đủ 12 luật `/business-flow`: Bảng luồng chính, tối thiểu 3 luồng lỗi (E1-Không quyền, E2-Không tìm thấy, E3-Không hợp lệ), sơ đồ Mermaid (`flowchart TD`, `stateDiagram-v2` ID ASCII), tiêu chí nghiệm thu Cho/Khi/Thì, đối chiếu tính năng cũ, trích dẫn `path:line` thực tế.
- **`/speckit-plan [ràng buộc công nghệ]`**: Lập thiết kế kỹ thuật `docs/flows/<slug>-plan.md` (hoặc `.specify/specs/<slug>/plan.md`), xác định danh sách file can thiệp phẫu thuật, API, Schema PostgreSQL/MongoDB, sự kiện Kafka/SSE và trade-offs.
- **`/speckit-tasks`**: Chia nhỏ `plan.md` thành danh sách công việc tuần tự trong `tasks.md`, mỗi task kèm lệnh `Verify: [Lệnh cụ thể]`.
- **`/speckit-implement`**: Viết code tuần tự theo `tasks.md` theo nguyên tắc *Simplicity First* & *Surgical Changes*, đủ 4 trạng thái UI, giữ Clean Root.
- **`/speckit-converge`**: Chạy bộ kiểm thử tự động toàn diện đối chiếu code thực tế với `spec.md`:
  - Backend: `mvn clean test-compile`, `mvn test -pl backend/account-service,backend/catalog-service -Dtest=HexagonalArchitectureTest`, `mvn test -pl backend/inventory-service -Dtest=AtomicStockConcurrencyTest`.
  - Frontend: `npm --prefix frontend run build`.
  - Clean Root: Kiểm tra root chỉ có file trong whitelist.
  - Xuất báo cáo hội tụ: **`Converged`** (đạt 100%) hoặc chỉ rõ điểm lệch cần chạy lại `/speckit-implement`.

### 2. QUY TRÌNH BUG FIXING (CHẨN ĐOÁN & SỬA LỖI PHẪU THUẬT)
- **`/speckit-bug-assess "[triệu chứng]" slug=[tên-lỗi]`**: Khoanh vùng Root Cause Analysis với trích dẫn `path:line` chính xác trước khi sửa. Lưu tại `docs/modules/bugs/<slug>/assessment.md` (và `.specify/bugs/<slug>/`).
- **`/speckit-bug-fix slug=[tên-lỗi]`**: Sửa lỗi phẫu thuật sạch sẽ (chỉ chạm đúng dòng gây lỗi, không reformat, không hiệu ứng phụ).
- **`/speckit-bug-test slug=[tên-lỗi]`**: Chạy test xác nhận lỗi đã hết và không ảnh hưởng ArchUnit, CAS, hay Frontend build. Đánh giá: **`verified`**, **`partial`**, hoặc **`failed`**.

### 3. QUY TRÌNH IDEA ASSESSMENT & BÓC TÁCH OSS
- **Đánh giá ý tưởng (`/speckit-assess-*`)**: Tuần tự 5 lệnh:
  1. `/speckit-assess-intake "[ý tưởng]" slug=[tên-ý-tưởng]`
  2. `/speckit-assess-research slug=[tên-ý-tưởng]`
  3. `/speckit-assess-define slug=[tên-ý-tưởng]`
  4. `/speckit-assess-shape slug=[tên-ý-tưởng]`
  5. `/speckit-assess-decide slug=[tên-ý-tưởng]`
  Lưu tại `docs/modules/assessments/<slug>/` (và `.specify/assessments/<slug>/`), kết luận: **`go`**, **`needs-clarification`**, hoặc **`kill`**.
- **Bóc tách mã nguồn mở (`/oss-blueprint [link-repo]`)**:
  - Chỉ đọc tĩnh (Read-only), CẤM chạy npm/pip/make/docker trên repo lạ. Hỏi 6 câu intake.
  - License Gate: Kiểm tra license, dependencies; chốt A-Adopt, B-Fork, C-Ý tưởng+tự viết, D-Clean-room.
  - Lưu bản thiết kế đủ 17 mục chuẩn tại `docs/blueprints/OSS-BLUEPRINT-<project>.md`.

---

## 6. TIÊU CHUẨN CHẤT LƯỢNG CODE & KIẾN TRÚC
1. **Frontend UI/UX**:
   - Đủ 4 trạng thái cho mọi view có dữ liệu: Loading (Skeleton/Spinner), Empty (minh họa + CTA), Error (tiếng Việt thân thiện + nút Thử lại), Data.
   - Nút gọi API tự động `disabled` + spinner chống double-submit.
   - Thao tác phá hủy (xóa, hủy, khóa, từ chối) bắt buộc có Confirm Modal nêu rõ hậu quả.
   - Thiết kế Luxury Monochrome, responsive, không layout shift, zero blank-screen.
2. **Backend & Cơ sở dữ liệu**:
   - Bảo vệ luật bất biến 5 tầng: DB Constraints (UNIQUE/CHECK/FK) $\rightarrow$ DTO/Validator $\rightarrow$ Service $\rightarrow$ Outbox/Worker.
   - Tiền: `DECIMAL`/`NUMERIC` hoặc số nguyên đơn vị nhỏ nhất, CẤM `FLOAT`.
   - Thời gian: UTC kèm múi giờ (`TIMESTAMPTZ`).
   - Idempotency cho Kafka Consumer, Outbox Relay, Webhook.
   - 100% Non-blocking: Quarkus Reactive PgPool & MongoDB Reactive Panache Streams, chặn blocking call trên Vert.x EventLoop.
   - Sổ cái kép Double-Entry Ledger: Invariant `Tổng Nợ (Debit) = Tổng Có (Credit)`, trích 10% hoa hồng sàn, 90% công nợ Seller.
   - Inventory: Giữ kho nguyên tử CAS (`(on_hand - reserved) >= N`), quản lý lô hạn dùng FEFO.
