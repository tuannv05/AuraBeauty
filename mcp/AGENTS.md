# 🤖 MÁY CHỦ MCP: AURA BEAUTY MALL MODEL CONTEXT PROTOCOL SERVER

> **Vị trí:** `/mcp/aura-beauty-mcp-server/`  
> **Giao thức:** JSON-RPC 2.0 qua Standard I/O (stdio)  
> **Mục đích:** Cung cấp Tools tra cứu nghiệp vụ an toàn cho AI Agent (Antigravity, Claude, Gemini, Cursor)

---

## 1. BỘ CÔNG CỤ (MCP TOOLS) CUNG CẤP

| Tên Tool | Tham số đầu vào | Mô tả chức năng & Nghiệp vụ |
| :--- | :--- | :--- |
| `check_inci_conflict` | `ingredients: string[]`, `skinType?: string` | Quét phát hiện chất cấm (Corticoid, Thủy ngân, Hydroquinone) và cảnh báo xung đột hoạt chất (Retinoids + Acid/BHA). |
| `get_fefo_stock_status` | `skuCode: string` | Kiểm tra số lượng tồn kho khả dụng CAS và danh sách các lô hàng FEFO (tự động khóa lô cận date < 6 tháng). |
| `audit_double_entry_ledger` | `orderId: string`, `grossAmount: number` | Kiểm toán tính bất biến $\sum \text{Debit} = \sum \text{Credit}$, trích 10% hoa hồng sàn và 90% công nợ Shop. |
| `inspect_split_order_saga` | `masterOrderId: string` | Truy vết đơn hàng đa shop (MasterOrder -> SubOrders) và trạng thái Outbox Kafka. |

---

## 2. HƯỚNG DẪN CẤU HÌNH CHO AI AGENT

Trong file cấu hình client (VD: `antigravity_mcp_config.json` hoặc Claude Desktop Config):

```json
{
  "mcpServers": {
    "aura-beauty": {
      "command": "node",
      "args": ["d:/A_javaFW/WebBanMP/mcp/aura-beauty-mcp-server/index.js"]
    }
  }
}
```
