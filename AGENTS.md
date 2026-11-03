# 🏛️ HIẾN PHÁP DỰ ÁN — QUY CHUẨN VIBE CODING, NGHIỆP VỤ & KIẾN TRÚC HỆ THỐNG
> **MÔI TRƯỜNG**: Windows 11 | Antigravity IDE / VS Code | Multi-Agent System
> **DỰ ÁN**: Sàn TMĐT Mỹ Phẩm Đa Người Bán (Aura Beauty Mall / WebBanMP)
> **MỆNH LỆNH TỐI CAO**: Mọi AI Agent BẮT BUỘC tuân thủ tuyệt đối tài liệu này.

---

## 1. KỶ LUẬT THÉP TẠI THƯ MỤC GỐC & VÙNG TRÁCH NHIỆM
1. **White-list tại Root**: Chỉ chấp nhận `AGENTS.md`, `GEMINI.md`, `pom.xml` (Maven Aggregator bắt buộc), `.gitignore`, `.antigravity/` (và `.mvn/` nếu có).
2. **CẤM TUYỆT ĐỐI**: Không để file code, file thử (`temp.*`), log, script rác hoặc `.md` lẻ tại root. `README.md` lưu tại `docs/README.md`.
3. **Cấu trúc vùng trách nhiệm**:
   - `docs/`: Trung tâm tài liệu (`flows/`, `blueprints/`, `architecture/`, `evidence/`, `guides/`).
   - `frontend/`: Giao diện React 18 + Vite (Port 3000), Animate UI, AR Virtual Try-On.
   - `backend/`: Vùng Backend gồm 7 Microservices Spring Boot 3 WebFlux Reactive (Port 8080-8086) và các thư viện dùng chung (common-web, common-events, common-outbox).
   - `infra/`: Hạ tầng Docker Compose (`docker-compose.yml`), DB init, script vận hành, k6 test.
   - `ai/`: Cosmetics Crawler, INCI dataset, Prompts, RAG embeddings.
   - `agents/`: Các mini-rules chuyên sâu cho từng phân hệ.

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
2. **infra/docker/docker-compose.yml**: Không sửa (hash SHA-256 trước/sau phải trùng). Bảng cổng bất biến: Gateway 8080, Account 8081, Catalog 8082, Order 8083, Inventory 8084, Payment 8085, AI 8086, Frontend 3000, Postgres 5432, Mongo 27017, Kafka 9092, Kafka-UI 8090.
3. Không đổi mã Java, cấu trúc Hexagonal Package, dependencies. Mọi refactor di chuyển file phải cập nhật đầy đủ import/alias.

---

## 4. QUY CHUẨN NGHIỆP VỤ & PHÂN CHIA RANH GIỚI
1. **Ranh giới công nghệ**:
   - `frontend/`: Chỉ viết UI/UX, state hiển thị, gọi API. CẤM gọi DB trực tiếp, CẤM xử lý tiền/quyền nhạy cảm, CẤM lưu secret key.
   - `backend/`: Viết API, Business logic, RBAC, R2DBC/MongoDB Reactive, Outbox/Kafka worker. CẤM nhúng code UI.
   - Khi nhận lệnh nghiệp vụ: Tự tách vào 3 nơi: Đặc tả $\rightarrow$ `docs/flows/QT-xx-...md`, API/Logic $\rightarrow$ `backend/<service>`, Màn hình $\rightarrow$ `frontend/src/features/<tên>/`.
2. **Quy trình 5 bước**:
   - B1 - Học dự án âm thầm (nhẹ đến nặng: AGENTS/docs $\rightarrow$ data models $\rightarrow$ RBAC $\rightarrow$ API/Kafka/SSE/Outbox $\rightarrow$ Glossary, Đã có vs Mới).
   - B2 - Gap Check (yêu cầu phải rõ Actor, Trigger, Outcome, Quyền, Lỗi; thiếu thì hỏi tối đa 5 câu).
   - B3 - Spec trước, code sau.
   - B4 - Thực thi sạch (đúng thư mục trách nhiệm, giữ Ubiquitous Language, clean diff).
   - B5 - Tự kiểm tra root sạch rác; phản hồi tiếng Việt $\le 6$ dòng kèm link file.

---

## 5. CHUẨN ĐẶC TẢ NGHIỆP VỤ (`/business-flow`) & BÓC TÁCH OSS (`/oss-blueprint`)
1. **Đặc tả quy trình (`docs/flows/QT-<nn>-<slug>.md`)**:
   - Chế độ: `form` (xuất `_phieu-yeu-cau.md`), văn bản tự do, hoặc `existing <tính năng>` (dịch ngược từ code, lệch/rủi ro đánh ⚠).
   - Khung 15 mục: Thông tin chung, 1. Tóm tắt, 2. Tác nhân & quyền, 3. Điều kiện trước, 4. Luồng chính (mỗi bước 1 dòng), 5. Sơ đồ Mermaid (`flowchart TD`), 6. Luồng phụ & lỗi (tối thiểu E1-Không quyền, E2-Không tìm thấy, E3-Không hợp lệ), 7. Trạng thái (`stateDiagram-v2`), 8. Quy tắc `BR-xx`, 9. Thông báo/SSE/Audit log, 10. Dữ liệu, 11. Màn hình liên quan, 12. Tiêu chí nghiệm thu `AC-xx` (Cho/Khi/Thì), 13. Ảnh hưởng phần có sẵn, 14. Giả định `GD-xx` & Câu hỏi mở `Q-xx`, 15. Ghi chú kỹ thuật (`file:line`) + Lịch sử thay đổi.
   - 12 luật cốt lõi: Không bịa; dùng đúng vai trò/thực thể; quyền do server quyết định; Mermaid node ASCII không dấu.
2. **Bóc tách mã nguồn mở (`docs/blueprints/OSS-BLUEPRINT-<project>.md`)**:
   - Chỉ đọc tĩnh (Read-only), CẤM chạy npm/pip/make/docker trên repo lạ. Hỏi 6 câu intake.
   - License Gate: Kiểm tra license, dependencies, thư mục pro/ee; chốt A-Adopt, B-Fork, C-Lấy ý tưởng+tự viết, D-Clean-room.
   - 6 nguồn sự thật: Migrations/Schema $\rightarrow$ Tests $\rightarrow$ Service/Domain $\rightarrow$ API/Workers/Cron $\rightarrow$ i18n $\rightarrow$ CHANGELOG/ADR. Đánh nhãn LẤY/THAY/BỎ/HOÃN. Đủ 17 mục chuẩn.

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
   - 100% Non-blocking: R2DBC & MongoDB Reactive Streams, chặn blocking call bằng BlockHound.
   - Sổ cái kép Double-Entry Ledger: Invariant `Tổng Nợ (Debit) = Tổng Có (Credit)`, trích 10% hoa hồng sàn, 90% công nợ Seller.
   - Inventory: Giữ kho nguyên tử CAS (`(on_hand - reserved) >= N`), quản lý lô hạn dùng FEFO.
