package com.cosmetics.inventory.domain;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * Rich Domain Model for Cosmetic Inventory Lots under FEFO Management.
 * Pure Java 21 - Zero Spring / DB dependencies.
 */
public record InventoryLot(
    String lotNumber,
    String skuCode,
    LocalDate manufacturingDate,
    LocalDate expiryDate,
    int onHandQuantity,
    int reservedQuantity
) {
    public static final long NEAR_EXPIRY_THRESHOLD_DAYS = 180; // 6 tháng

    public InventoryLot {
        if (lotNumber == null || lotNumber.isBlank()) {
            throw new IllegalArgumentException("Lot number cannot be blank");
        }
        if (expiryDate.isBefore(manufacturingDate)) {
            throw new IllegalArgumentException("Expiry date cannot be before manufacturing date");
        }
        if (onHandQuantity < 0 || reservedQuantity < 0) {
            throw new IllegalArgumentException("Quantities cannot be negative");
        }
    }

    public int getAvailableQuantity() {
        return Math.max(0, onHandQuantity - reservedQuantity);
    }

    /**
     * Kiểm tra lô hàng cận hạn sử dụng (< 180 ngày).
     */
    public boolean isNearExpiry(LocalDate referenceDate) {
        return ChronoUnit.DAYS.between(referenceDate, expiryDate) < NEAR_EXPIRY_THRESHOLD_DAYS;
    }

    /**
     * Kiểm tra lô hàng đã hết hạn sử dụng.
     */
    public boolean isExpired(LocalDate referenceDate) {
        return expiryDate.isBefore(referenceDate);
    }
}
