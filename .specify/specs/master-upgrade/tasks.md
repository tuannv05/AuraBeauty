# SPEC-KIT TASKS: MASTER PLATFORM UPGRADE
> Reference: `docs/flows/master-upgrade-plan.md`

- [x] **Task 1: Rich DDD, Hexagonal Architecture & ArchUnit Validation**
  - Verify: `$env:JAVA_HOME="C:\Program Files\Java\jdk-22"; mvn test -pl backend/account-service,backend/catalog-service,backend/order-service,backend/payment-service "-Dtest=*ArchitectureTest"`

- [x] **Task 2: Atomic Stock Reservation (CAS) & FEFO Lot Management**
  - Verify: `$env:JAVA_HOME="C:\Program Files\Java\jdk-22"; mvn test -pl backend/inventory-service "-Dtest=AtomicStockConcurrencyTest,FefoAllocationPolicyTest"`

- [x] **Task 3: Double-Entry Ledger Invariant (Debit = Credit) & Pro-Rata Split Order**
  - Verify: `$env:JAVA_HOME="C:\Program Files\Java\jdk-22"; mvn test -pl backend/payment-service "-Dtest=DoubleEntryLedgerTest"`

- [x] **Task 4: AI Advisor Hybrid RAG & Multi-Stage SSE Service**
  - Verify: `$env:JAVA_HOME="C:\Program Files\Java\jdk-22"; mvn test-compile -pl backend/ai-advisor-service`

- [x] **Task 5: Frontend Luxury UI/UX, 51 Sub-menus Mega Menu & Zero Blank-Screen**
  - Verify: `npm --prefix frontend run build`

- [x] **Task 6: Clean Root & Full System Convergence Verification**
  - Verify: `git status --short` (Root whitelist) && `mvn clean test-compile`
