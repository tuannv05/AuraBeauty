# SPEC-KIT PLAN: Complete Platform Upgrade
> Reference: docs/flows/complete-platform-upgrade-plan.md

1. Domain DDD & 5-Layer Security: Java 21 pure domain in Catalog, Inventory, Order, Payment.
2. Reactive Outbox/Inbox & Saga Resilience: AggregateId partition key, TransactionalInbox, Compensation.
3. AI Hybrid RAG & Skin Cycling: pgvector + lexical INCI RRF, Deterministic Conflict Engine, Multi-Stage SSE.
4. MCP Server: aura-beauty-mcp-server with 4 administrative/auditing tools.
5. Aura VTO 2.0 & 4-State UI/UX: 1€ Filter, PBR blending, Anti-Double-Submit, Confirm Modal.
