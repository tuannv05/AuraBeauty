package com.cosmetics.inventory;

import com.cosmetics.inventory.domain.FefoAllocationPolicy;
import com.cosmetics.inventory.domain.InventoryLot;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class FefoAllocationPolicyTest {

    @Test
    @DisplayName("FEFO must allocate earlier expiring lots first and exclude near-expiry (< 6 months) lots")
    void testFefoAllocation() {
        LocalDate today = LocalDate.of(2026, 11, 1);

        // Lô 1: Hết hạn sau 3 tháng -> Cận date (< 180 ngày) -> BỊ KHÓA
        InventoryLot lotNearExpiry = new InventoryLot("LOT-001", "SKU-SERUM", today.minusMonths(3), today.plusMonths(3), 50, 0);

        // Lô 2: Hết hạn sau 12 tháng -> Hợp lệ, xuất trước Lô 3
        InventoryLot lotValidEarlier = new InventoryLot("LOT-002", "SKU-SERUM", today.minusMonths(1), today.plusMonths(12), 20, 0);

        // Lô 3: Hết hạn sau 24 tháng -> Hợp lệ, xuất sau Lô 2
        InventoryLot lotValidLater = new InventoryLot("LOT-003", "SKU-SERUM", today, today.plusMonths(24), 100, 0);

        // Yêu cầu phân bổ 30 sản phẩm
        FefoAllocationPolicy.AllocationResult result = FefoAllocationPolicy.allocate(
            List.of(lotNearExpiry, lotValidLater, lotValidEarlier),
            30,
            today
        );

        assertTrue(result.isFullyAllocated(), "Allocation must be fully fulfilled");
        assertEquals(2, result.allocations().size(), "Must allocate from 2 valid lots");

        // Lô đầu tiên được chọn phải là LOT-002 (20 chiếc)
        assertEquals("LOT-002", result.allocations().get(0).lotNumber());
        assertEquals(20, result.allocations().get(0).allocatedQuantity());

        // Lô thứ hai được chọn là LOT-003 (10 chiếc còn lại)
        assertEquals("LOT-003", result.allocations().get(1).lotNumber());
        assertEquals(10, result.allocations().get(1).allocatedQuantity());
    }
}
