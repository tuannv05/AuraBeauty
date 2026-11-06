# 📝 DANH SÁCH ĐẦU VIỆC (TASKS): MODERN BACKEND UPGRADE

> **Mã kế hoạch:** `modern-backend-upgrade-tasks`  
> **Căn cứ kế hoạch:** [modern-backend-upgrade-plan.md](file:///d:/A_javaFW/WebBanMP/docs/flows/modern-backend-upgrade-plan.md)

---

## DANH SÁCH NHIỆM VỤ TUẦN TỰ KÈM LỆNH VERIFY

- [x] **Task 1:** Chuẩn hóa `backend/common-web` (`ErrorCode.java`, `ReactiveCorrelationFilter.java`, RFC 9457 correlationId trong `GlobalExceptionHandler.java`).  
  *Verify:* `mvn test-compile -pl backend/common-web`

- [x] **Task 2:** Củng cố `backend/api-gateway` và bổ sung `AuditLogRecord` vào `backend/account-service`.  
  *Verify:* `mvn test -pl backend/account-service -Dtest=HexagonalArchitectureTest`

- [x] **Task 3:** Củng cố `backend/catalog-service` (kiểm duyệt CBMP, chất cấm, phân loại INCI, cô lập `shopId`).  
  *Verify:* `mvn test -pl backend/catalog-service -Dtest=HexagonalArchitectureTest`

- [x] **Task 4:** Củng cố `backend/inventory-service` (FEFO lot allocation, CAS concurrency).  
  *Verify:* `mvn test -pl backend/inventory-service -Dtest=AtomicStockConcurrencyTest`

- [x] **Task 5:** Củng cố `backend/order-service` & `backend/payment-service` (Split Order Pro-rata, Sổ cái kép 10%/90%).  
  *Verify:* `mvn test -pl backend/order-service,backend/payment-service`

- [x] **Task 6:** Củng cố `backend/ai-advisor-service` (Hybrid RAG RRF, INCI Conflict, Multi-Stage SSE).  
  *Verify:* `mvn test-compile -pl backend/ai-advisor-service`

- [x] **Task 7:** Chạy kiểm định hội tụ toàn diện (Clean Root, Compile, ArchUnit, CAS/Ledger tests, Frontend build).  
  *Verify:* Chạy bộ lệnh kiểm định hội tụ Spec-Kit.
