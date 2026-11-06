# SPECIFICATION: Complete Platform Upgrade (Aura Beauty Mall)
> Synced from docs/flows/QT-06-complete-ddd-reactive-hybrid-rag-vto-mcp.md

## Scope & Objective
Nâng cấp toàn diện nền tảng Aura Beauty Mall trên 5 hạng mục kỹ thuật cốt lõi:
1. Rich DDD & Hexagonal Architecture (Pure Java 21 Domain, CBMP/INCI Spec, FEFO CAS, OrderLineSnapshot ACL, Split Order, Double-Entry Ledger 10%/90%).
2. Reactive Microservices & Saga Resilience (Transactional Outbox/Inbox Idempotency, Compensation).
3. Hybrid RAG (pgvector + lexical INCI + RRF) + Deterministic Conflict Engine + Multi-Stage SSE.
4. Model Context Protocol (MCP) Server (`aura-beauty-mcp-server`) with 4 administrative & data tools.
5. Aura VTO 2.0 (1€ Filter, PBR Blending) & Zero Blank-Screen UI/UX with 4 states across all views.
