# 📝 DANH SÁCH ĐẦU VIỆC THỰC THI (TASKS): COMPLETE PLATFORM UPGRADE

> **Mã kế hoạch:** `complete-platform-upgrade-tasks`  
> **Căn cứ kế hoạch:** [complete-platform-upgrade-plan.md](file:///d:/A_javaFW/WebBanMP/docs/flows/complete-platform-upgrade-plan.md)

---

## DANH SÁCH NHIỆM VỤ TUẦN TỰ (CHIA THEO 5 HẠNG MỤC)

### HẠNG MỤC 1: RICH DDD, BẢO MẬT 5 TẦNG & ARCHUNIT TESTS
- [x] **Task 1.1:** Củng cố Domain Model trong `backend/catalog-service` (`CosmeticSafetySpecification`, `InciIngredient`, `Product`).  
  *Verify:* `mvn test-compile -pl backend/catalog-service`
- [x] **Task 1.2:** Củng cố Domain Model trong `backend/inventory-service` (FEFO `InventoryLot` khóa hạn `< 6 tháng`, CAS `StockItem`).  
  *Verify:* `mvn test -pl backend/inventory-service -Dtest=AtomicStockConcurrencyTest`
- [x] **Task 1.3:** Củng cố Domain Model trong `backend/order-service` (`MasterOrder`, `SubOrder`, `OrderLineSnapshot`, Pro-rata discount, Java 21 `sealed interface OrderStatus`).  
  *Verify:* `mvn test-compile -pl backend/order-service`
- [x] **Task 1.4:** Củng cố Domain Model trong `backend/payment-service` (`DoubleEntryLedger` bất biến $\sum \text{Debit} = \sum \text{Credit}$, 10% hoa hồng sàn / 90% Shop).  
  *Verify:* `mvn test-compile -pl backend/payment-service`
- [x] **Task 1.5:** Mở rộng và chạy toàn bộ ArchUnit tests `HexagonalArchitectureTest` trên cả 4 microservices (`account-service`, `catalog-service`, `order-service`, `payment-service`).  
  *Verify:* `mvn test -Dtest=*ArchitectureTest`

---

### HẠNG MỤC 2: REACTIVE MICROSERVICES, TRANSACTIONAL OUTBOX/INBOX & SAGA RESILIENCE
- [x] **Task 2.1:** Đảm bảo `backend/common-outbox` gắn `aggregateId` làm Kafka Partition Key.  
  *Verify:* `mvn test-compile -pl backend/common-outbox`
- [x] **Task 2.2:** Củng cố `TransactionalInbox` / `IdempotentConsumer` chống lặp sự kiện Kafka/Webhook.  
  *Verify:* `mvn test-compile -pl backend/common-outbox`
- [x] **Task 2.3:** Bổ sung cơ chế bù trừ Saga Compensation và Timeout Recovery (15 phút hủy đơn nhả kho CAS).  
  *Verify:* `mvn test-compile -pl backend/order-service,backend/inventory-service`

---

### HẠNG MỤC 3: HYBRID RAG, 28-DAY ROUTINE & MULTI-STAGE SSE
- [x] **Task 3.1:** Củng cố Hybrid Search (Vector + INCI Lexical + RRF) trong `backend/ai-advisor-service`.  
  *Verify:* `mvn test-compile -pl backend/ai-advisor-service`
- [x] **Task 3.2:** Củng cố Deterministic INCI Conflict Engine và lịch trình Skin Cycling 28 ngày.  
  *Verify:* `mvn test-compile -pl backend/ai-advisor-service`
- [x] **Task 3.3:** Đảm bảo luồng Multi-Stage SSE (`/api/ai/advisor/stream`) phát đủ 5 stage sự kiện.  
  *Verify:* `mvn test-compile -pl backend/ai-advisor-service`

---

### HẠNG MỤC 4: MCP SERVER MODEL CONTEXT PROTOCOL
- [x] **Task 4.1:** Khởi tạo `mcp/aura-beauty-mcp-server/package.json` và cấu hình server.  
  *Verify:* `node -v`
- [x] **Task 4.2:** Viết mã thực thi `mcp/aura-beauty-mcp-server/index.js` cung cấp 4 MCP tools: `check_inci_conflict`, `get_fefo_stock_status`, `audit_double_entry_ledger`, `inspect_split_order_saga`.  
  *Verify:* `node mcp/aura-beauty-mcp-server/test_tools.cjs`
- [x] **Task 4.3:** Cập nhật `mcp/AGENTS.md` và tài liệu cấu hình MCP.  
  *Verify:* Kiểm tra `mcp/AGENTS.md`

---

### HẠNG MỤC 5: AURA VTO 2.0 & UI/UX 4 TRẠNG THÁI (FRONTEND)
- [x] **Task 5.1:** Đảm bảo One-Euro Filter (1€ Filter) và PBR Blending giữ vân môi trong `frontend/src/features/vto/`.  
  *Verify:* `npm --prefix frontend run build`
- [x] **Task 5.2:** Tạm dừng hiệu ứng nền (AuraIntro/Particles) khi mở Modal AR để tối ưu GPU 60 FPS.  
  *Verify:* `npm --prefix frontend run build`
- [x] **Task 5.3:** Đảm bảo các nút gọi API có chống double-submit (`disabled` + spinner) và các thao tác phá hủy có Confirm Modal.  
  *Verify:* `npm --prefix frontend run build`

---

### HẠNG MỤC 6: HỘI TỤ KIỂM ĐỊNH TOÀN DIỆN (SPEC-KIT CONVERGENCE)
- [x] **Task 6.1:** Kiểm tra kỷ luật Clean Root (Chỉ có `AGENTS.md`, `GEMINI.md`, `pom.xml`, `.gitignore`, `.antigravity/`, `.specify/`).  
  *Verify:* `git status --short`
- [x] **Task 6.2:** Biên dịch toàn bộ Backend: `mvn clean test-compile`
- [x] **Task 6.3:** Chạy toàn bộ ArchUnit tests: `mvn test -Dtest=*ArchitectureTest`
- [x] **Task 6.4:** Chạy các bài test chuyên sâu: `mvn test -pl backend/inventory-service,backend/order-service,backend/payment-service,backend/ai-advisor-service`
- [x] **Task 6.5:** Build Frontend thành công 100%: `npm --prefix frontend run build`
