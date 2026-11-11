# SPEC-KIT PLAN: MASTER PLATFORM UPGRADE
> Reference: `docs/flows/master-upgrade-plan.md`

- **Kiến trúc:** Hexagonal Architecture + Quarkus 3.15 Mutiny Reactive + React 18 / Vite 5
- **Trọng tâm bảo vệ:**
  1. Domain thuần Java 21/22, độc lập 100% với bất kỳ framework nào.
  2. Kho nguyên tử CAS chống overselling.
  3. Sổ cái kép Double-Entry Ledger (Debit = Credit).
  4. Frontend Zero Blank-Screen trên 51 Sub-menu, 9 phân hệ Seller, 9 phân hệ Admin.
  5. Clean Root Whitelist.
