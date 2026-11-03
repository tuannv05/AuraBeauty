# MINI-RULE: WINDOWS POWERSHELL SAFETY DISCIPLINE
> **Phạm vi:** Toàn bộ môi trường thực thi Windows 11 & Antigravity IDE

## 1. NGUYÊN TẮC CỐT LÕI
- **Chỉ thao tác trong Root dự án:** Tuyệt đối không can thiệp các thư mục hệ thống `C:\Windows`, AppData, Desktop hay ổ đĩa khác.
- **LỆNH CẤM BẤT DI BẤT DỊCH:**
  - CẤM: `Remove-Item -Recurse/-Force`, `rm -rf`, `del /s`, `rd /s`, `git clean`, `git reset --hard`, `git push --force`.
  - CẤM: `docker system prune`, `docker compose down -v`, `taskkill` theo tên tiến trình.
  - CẤM: Thay đổi Registry (`reg/regedit`), `Set-ExecutionPolicy`, sửa biến PATH hệ thống, chạy quyền Admin.
- **Di chuyển file an toàn:** Chỉ dùng `git mv`, tối đa 20 file mỗi lô, commit cục bộ trên nhánh `restructure/zero-breakage`. KHÔNG push.
- **Kiểm soát tài nguyên:** `MAVEN_OPTS=-Xmx1g`, `mvn -T 1`, `NODE_OPTIONS=--max-old-space-size=1024`. RAM trống phải $> 3\text{ GB}$ trước khi chạy build/test.
- **Rủi ro môi trường:** Chú ý đường dẫn $>260$ ký tự (MAX_PATH), xung đột xuống dòng CRLF/LF, và file bị tiến trình Java/Node khóa.

## 2. LỆNH KIỂM CHỨNG
```powershell
Get-CimInstance Win32_OperatingSystem | Select-Object FreePhysicalMemory
git status --short
```
