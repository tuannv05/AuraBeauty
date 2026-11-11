# SPECIFICATION: Modern Enterprise Backend Architecture
> Reference: docs/flows/QT-07-modern-enterprise-backend-architecture.md

## Scope & Objective
Nâng cấp toàn bộ 7 Microservices Quarkus 3.15 Mutiny Reactive và thư viện chung lên chuẩn Enterprise Cloud-Native:
1. RFC 9457 ProblemDetail & Distributed Correlation Tracing (`X-Correlation-Id`).
2. 5-Layer Invariant & Strict Currency (`BigDecimal`, `NUMERIC(19,4)`) / Time (`Instant` UTC).
3. Idempotent Consumer & Transactional Inbox (No duplicate Kafka/Webhook processing).
4. Rich Domain Java 21 (Records, Sealed Interfaces), CBMP/INCI Spec, FEFO CAS, Split Order Pro-rata, Double-Entry Ledger (10%/90%).
5. Multi-tenant isolation, Server-side RBAC & Immutable Audit Log.
