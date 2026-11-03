# 🤖 AI & DATA PIPELINE CONSTITUTION (AURA BEAUTY MALL)

> **Phạm vi:** `/ai/` | Cosmetics Crawler | INCI Knowledge Engine | RAG pgvector

## 1. RANH GIỚI BẤT KHẢ XÂM PHẠM
- **Mã nguồn Crawler:** Nằm độc quyền tại `/ai/cosmetics-crawler/`.
- **Dữ liệu chuẩn hóa:** `output/products_facets_full.json` (154 sản phẩm thật, 45 INCI, 8 Facets).
- **Vùng cấm:** Không tự ý chạy crawler cào lại dữ liệu khi chưa được người dùng phê chuẩn (tránh bị chặn IP WAF).
- **Trợ lý da liễu RAG:** Tích hợp với `services/ai-advisor-service` (Port 8086) qua PostgreSQL `pgvector` HNSW 384-d Cosine similarity và SSE Stream.

## 2. LỆNH KIỂM CHỨNG
```bash
# Kiểm tra sự tồn tại của dataset 154 sản phẩm
Test-Path ai/cosmetics-crawler/output/products_facets_full.json
```
