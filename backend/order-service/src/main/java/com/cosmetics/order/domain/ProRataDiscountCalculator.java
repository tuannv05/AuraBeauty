package com.cosmetics.order.domain;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Pro-rata Discount Allocation Domain Service for Multi-Vendor Split Orders.
 * Uses exact BigDecimal arithmetic with HALF_UP rounding.
 * Invariant: Sum of sub-order discounts must strictly equal total voucher discount.
 */
public final class ProRataDiscountCalculator {

    private ProRataDiscountCalculator() {}

    public record SubOrderDiscount(UUID shopId, BigDecimal allocatedDiscount, BigDecimal payableAmount) {}

    /**
     * Phân bổ voucher giảm giá toàn sàn cho từng SubOrder theo tỷ lệ giá trị hàng hóa.
     * @param subOrderTotals Map chứa shopId và giá trị tổng hàng của shop đó trước giảm giá
     * @param totalVoucherDiscount Số tiền giảm giá của voucher sàn
     */
    public static List<SubOrderDiscount> allocate(Map<UUID, BigDecimal> subOrderTotals, BigDecimal totalVoucherDiscount) {
        if (subOrderTotals == null || subOrderTotals.isEmpty()) {
            return List.of();
        }

        BigDecimal masterGrossTotal = subOrderTotals.values().stream()
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (masterGrossTotal.compareTo(BigDecimal.ZERO) <= 0 || totalVoucherDiscount == null || totalVoucherDiscount.compareTo(BigDecimal.ZERO) <= 0) {
            return subOrderTotals.entrySet().stream()
                .map(e -> new SubOrderDiscount(e.getKey(), BigDecimal.ZERO, e.getValue()))
                .toList();
        }

        // Nếu voucher lớn hơn hoặc bằng tổng đơn hàng -> Giảm tối đa bằng tổng đơn
        BigDecimal effectiveDiscount = totalVoucherDiscount.min(masterGrossTotal);

        List<SubOrderDiscount> results = new ArrayList<>();
        BigDecimal accumulatedAllocated = BigDecimal.ZERO;
        List<Map.Entry<UUID, BigDecimal>> entries = new ArrayList<>(subOrderTotals.entrySet());

        for (int i = 0; i < entries.size(); i++) {
            Map.Entry<UUID, BigDecimal> entry = entries.get(i);
            UUID shopId = entry.getKey();
            BigDecimal subGross = entry.getValue();

            BigDecimal subDiscount;
            if (i == entries.size() - 1) {
                // Shop cuối cùng nhận phần bù trừ chính xác để sum(subDiscount) == effectiveDiscount
                subDiscount = effectiveDiscount.subtract(accumulatedAllocated);
            } else {
                // Tỷ lệ = subGross / masterGrossTotal
                subDiscount = effectiveDiscount.multiply(subGross)
                    .divide(masterGrossTotal, 0, RoundingMode.HALF_UP);
                accumulatedAllocated = accumulatedAllocated.add(subDiscount);
            }

            BigDecimal payable = subGross.subtract(subDiscount).max(BigDecimal.ZERO);
            results.add(new SubOrderDiscount(shopId, subDiscount, payable));
        }

        return List.copyOf(results);
    }
}
