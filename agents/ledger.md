# MINI-RULE: DOUBLE-ENTRY LEDGER & COMMISSION
> **Phạm vi:** `backend/payment-service` (Port 8085) | Quarkus Reactive PgPool PostgreSQL

## 1. NGUYÊN TẮC CỐT LÕI
- **Quy tắc kế toán bất biến:** $\sum \text{Debit (Nợ)} = \sum \text{Credit (Có)}$. Bút toán không cân bằng phải bị từ chối tuyệt đối.
- **Phân bổ dòng tiền thanh toán:**
  - 10% Tổng giá trị đơn $\rightarrow$ Ghi có Tài khoản Doanh thu Sàn (Platform Revenue).
  - 90% Còn lại $\rightarrow$ Ghi có Tài khoản Công nợ tạm giữ của Shop (Seller Escrow Payable).
- **Tiền tệ:** Sử dụng kiểu `DECIMAL(19, 2)` hoặc số nguyên đơn vị nhỏ nhất (VND), CẤM dùng `FLOAT`.
- **Bất biến lịch sử:** Bảng `ledger_entries` chỉ ghi thêm (append-only), không cho phép UPDATE hay DELETE.

## 2. VÙNG BẤT KHẢ XÂM PHẠM
- Entity `LedgerEntry` và ràng buộc kiểm toán tài chính.
- Bảng tài khoản mặc định của hệ thống: Escrow, Platform Fee, Seller Balance.

## 3. LỆNH KIỂM CHỨNG
```bash
mvn test -pl backend/payment-service
```
