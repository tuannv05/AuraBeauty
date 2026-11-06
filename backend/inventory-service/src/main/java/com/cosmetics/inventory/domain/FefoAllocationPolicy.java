package com.cosmetics.inventory.domain;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * FEFO (First-Expired, First-Out) Lot Allocation Domain Service.
 * Ensures cosmetics are distributed strictly by expiry date, protecting buyers from expired/near-expiry products.
 */
public final class FefoAllocationPolicy {

    private FefoAllocationPolicy() {}

    public record LotAllocation(String lotNumber, int allocatedQuantity, LocalDate expiryDate) {}

    public record AllocationResult(List<LotAllocation> allocations, int remainingUnallocated) {
        public boolean isFullyAllocated() {
            return remainingUnallocated == 0;
        }
    }

    /**
     * Phân bổ số lượng SKU theo chiến lược FEFO:
     * 1. Loại bỏ các lô đã hết hạn hoặc cận hạn (< 6 tháng).
     * 2. Sắp xếp các lô hợp lệ theo ngày hết hạn tăng dần (Lô nào hết hạn trước thì xuất trước).
     * 3. Trừ số lượng khả dụng của từng lô cho đến khi đủ số lượng yêu cầu.
     */
    public static AllocationResult allocate(List<InventoryLot> lots, int requestedQty, LocalDate referenceDate) {
        if (requestedQty <= 0) {
            return new AllocationResult(List.of(), 0);
        }
        if (lots == null || lots.isEmpty()) {
            return new AllocationResult(List.of(), requestedQty);
        }

        // 1 & 2: Lọc các lô an toàn (không hết hạn và không cận date < 180 ngày) và sắp xếp FEFO
        List<InventoryLot> eligibleLots = lots.stream()
            .filter(lot -> !lot.isExpired(referenceDate) && !lot.isNearExpiry(referenceDate))
            .filter(lot -> lot.getAvailableQuantity() > 0)
            .sorted(Comparator.comparing(InventoryLot::expiryDate))
            .toList();

        List<LotAllocation> allocations = new ArrayList<>();
        int needed = requestedQty;

        // 3: Phân bổ từng lô
        for (InventoryLot lot : eligibleLots) {
            if (needed <= 0) break;
            int availableInLot = lot.getAvailableQuantity();
            int take = Math.min(needed, availableInLot);
            allocations.add(new LotAllocation(lot.lotNumber(), take, lot.expiryDate()));
            needed -= take;
        }

        return new AllocationResult(List.copyOf(allocations), needed);
    }
}
