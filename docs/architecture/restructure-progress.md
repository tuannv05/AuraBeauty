# NHẬT KÝ TIẾN ĐỘ TÁI CẤU TRÚC DỰ ÁN (ZERO-BREAKAGE RESTRUCTURE PROGRESS)

> **Nhánh thực thi:** `restructure/zero-breakage`  
> **Tag xuất phát:** `pre-restructure`  
> **Tag đề xuất kết thúc:** `post-restructure`  
> **Cương vị:** Principal Enterprise Software Architect  
> **Quy chuẩn tuân thủ:** [AGENTS.md](file:///d:/A_javaFW/WebBanMP/AGENTS.md)

---

## BẢNG TỔNG HỢP CÁC QUYẾT ĐỊNH CỦA NGƯỜI DÙNG (USER DECISIONS)

| Mã câu hỏi | Nội dung câu hỏi | Quyết định đã chốt | Ghi chú kỹ thuật |
| :---: | :--- | :--- | :--- |
| **G0** | Nhánh & Tag khởi tạo | Đồng ý tạo nhánh `restructure/zero-breakage` và tag `pre-restructure` | Đã tạo và checkout |
| **Q1** | Vị trí lưu trữ `README.md` | Di chuyển vào `docs/README.md` | Đã cập nhật link tương đối |
| **Q2** | Tên thư mục backend | Giữ nguyên `services/` | Đã ghi nhận trong `AGENTS.md`, bảo toàn `pom.xml` |
| **Q3** | Xử lý file lạ ở root | Di chuyển vào `docs/` (`DESIGN.md`, `README.md`) | Đã dọn dẹp sạch sẽ |
| **Q4** | Xử lý `mvnw` / `.mvn` | Giữ nguyên nếu có | Không can thiệp |
| **Q5** | Quyền chạy lệnh kiểm thử | Cho phép: `mvn validate`, `mvn clean test-compile`, `HexagonalArchitectureTest`, `npm run build` | Đã chạy và kiểm chứng 100% BUILD SUCCESS |

---

## TIẾN ĐỘ THỰC HIỆN TOÀN DIỆN (G0 -> G10)

- [x] **G0 - PRE-FLIGHT:** Khảo sát môi trường, xác nhận working tree sạch, gắn tag `pre-restructure`, tạo nhánh `restructure/zero-breakage`.
- [x] **G1 - TẠO LUẬT:** Tạo `AGENTS.md` (77 dòng tiếng Việt) và `GEMINI.md` đồng bộ ở thư mục gốc.
- [x] **G2 - AUDIT + KẾ HOẠCH:** Rà soát cây thư mục, lập bảng hiện tại -> đích, kiểm tra tham chiếu, ghi baseline hash `docker-compose.yml`, tạo `docs/architecture/restructure-plan.md`.
- [x] **G3 - GOM TÀI LIỆU + DỌN ROOT:** Dọn dẹp root, chuyển `README.md` -> `docs/README.md`, `DESIGN.md` -> `docs/DESIGN.md`, dọn root sạch đúng whitelist.
- [x] **G4 - FRONTEND:** Chuẩn hóa cấu trúc thư mục `frontend/src/` theo `components/`, `features/`, `pages/`, tạo `frontend/AGENTS.md`, build test sạch 0 lỗi.
- [x] **G5 - BACKEND/MAVEN:** Đối chiếu `<modules>`, dọn file rác, chạy test-compile, test `HexagonalArchitectureTest` và `AtomicStockConcurrencyTest` pass, tạo `services/AGENTS.md`.
- [x] **G6 - INFRA/AI/AGENTS/MCP:** Kiểm tra hash compose trùng khớp 100%, tạo `infra/AGENTS.md`, `ai/AGENTS.md`, các stub `mcp/`, `mobile/`, `desktop/`.
- [x] **G7 - LUẬT CỤC BỘ:** Tạo `agents/AGENTS.md` và 6 mini-rules trong `agents/` (`frontend.md`, `backend-hexagonal.md`, `saga-outbox.md`, `ledger.md`, `ai-rag.md`, `windows-safety.md`).
- [x] **G8 - ĐẶC TẢ NGHIỆP VỤ:** Tạo 5 file quy trình chuẩn `QT-01..05` trong `docs/flows/` (dịch ngược từ code, không sửa mã nguồn, commit sau mỗi file).
- [x] **G9 - KIỂM ĐỊNH CHẤT LƯỢNG:** Đánh giá code theo 5.5 & 5.6, xuất `docs/architecture/quality-audit.md` kèm bảng ưu tiên.
- [x] **G10 - NGHIỆM THU:** Tổng kiểm tra 8 tiêu chí nghiệm thu, xuất `docs/architecture/restructure-report.md`, đề xuất tag `post-restructure`.
