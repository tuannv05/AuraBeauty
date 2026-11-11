# SPEC-KIT SPECIFICATION: MASTER PLATFORM UPGRADE (AURA BEAUTY MALL)
> Reference: `docs/flows/QT-07-complete-platform-master-upgrade.md`
> Status: APPROVED & CONVERGED

## 1. MỤC TIÊU & PHẠM VI (GOALS & SCOPE)
- **Hệ thống:** Aura Beauty Mall / WebBanMP — Sàn TMĐT Mỹ phẩm Đa Người Bán Chính Hãng Cao Cấp.
- **Mục tiêu:** Nâng cấp và hoàn thiện toàn diện kiến trúc Hexagonal Rich DDD, bảo toàn 100% Non-blocking Mutiny Reactive, giữ kho nguyên tử CAS, phân bổ FEFO, tách đơn Split Order, hạch toán Sổ cái kép Double-Entry Ledger (10% hoa hồng sàn / 90% Seller), Hybrid RAG AI Advisor, Gương AR VTO 60 FPS, và giao diện Luxury Monochrome cam kết 0% màn hình trắng trên 51 Sub-menu Mega Menu và 18 phân hệ quản trị.

## 2. KIẾN TRÚC & PHÂN BỔ DỊCH VỤ
- `api-gateway` (Port 8080): Quarkus Vert.x Reverse Proxy, JWT Token Validation, Rate Limiter, CORS.
- `account-service` (Port 8081): Hexagonal Domain `User`, `Shop`, `SkinProfile`, Quarkus Reactive PgPool.
- `catalog-service` (Port 8082): Quarkus Panache MongoDB Reactive, INCI Analyzer, CBMP Verification.
- `inventory-service` (Port 8083): Quarkus Reactive PgPool, CAS Reservation (`(on_hand - reserved) >= quantity`), FEFO Allocation.
- `order-service` (Port 8084): Quarkus Reactive PgPool, `Order`, `SubOrder`, `OrderLineSnapshot`, Pro-rata Discount Calculator.
- `payment-service` (Port 8085): Quarkus Reactive PgPool, Double-Entry Ledger (`PLATFORM_ESCROW`, `PLATFORM_COMMISSION`, `SELLER_PAYABLE`), Webhook Inbox Idempotency.
- `ai-advisor-service` (Port 8086): Quarkus Reactive PgPool, Hybrid Search (pgvector + INCI match + RRF), INCI Conflict Engine, Multi-Stage SSE.

## 3. TIÊU CHÍ CHỐT CHẶN BẢO VỆ (ZERO-BREAKAGE INVARIANTS)
1. **Clean Root:** Thư mục gốc chỉ giữ các file whitelist (`AGENTS.md`, `GEMINI.md`, `pom.xml`, `.gitignore`, `.antigravity/`, `.specify/`).
2. **ArchUnit:** 100% `domain` layers độc lập tuyệt đối với framework (Quarkus/Spring) và Adapters.
3. **CAS Stock:** Tồn kho không bao giờ âm khi chịu tải 100 luồng đồng thời (`AtomicStockConcurrencyTest`).
4. **Sổ cái kép:** $\sum \text{Debit} = \sum \text{Credit}$ cho mọi giao dịch thanh toán thành công.
5. **Zero Blank-Screen:** 100% các trang, tabs, modals trên Frontend hiển thị đầy đủ 4 trạng thái (Loading, Empty, Error, Data).
