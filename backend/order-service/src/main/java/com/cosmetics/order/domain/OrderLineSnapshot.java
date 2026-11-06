package com.cosmetics.order.domain;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Anti-Corruption Layer (ACL) Snapshot for Order Lines.
 * Captures an immutable record of product name, CBMP, price and shop info at the exact moment of order placement.
 * Pure Java 21 Record.
 */
public record OrderLineSnapshot(
    String skuCode,
    String productName,
    String cosmeticRegistrationNo,
    int quantity,
    BigDecimal unitPrice,
    BigDecimal lineTotal,
    Instant snapshotAt
) {
    public OrderLineSnapshot {
        if (skuCode == null || skuCode.isBlank()) {
            throw new IllegalArgumentException("SKU code cannot be blank in snapshot");
        }
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive in snapshot");
        }
        if (unitPrice == null || unitPrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Unit price cannot be negative in snapshot");
        }
        if (lineTotal == null) {
            lineTotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
        }
        if (snapshotAt == null) {
            snapshotAt = Instant.now();
        }
    }

    public static OrderLineSnapshot fromLine(OrderLine line, String registrationNo) {
        return new OrderLineSnapshot(
            line.getSkuCode(),
            line.getProductName(),
            registrationNo != null ? registrationNo : "PENDING_CBMP",
            line.getQuantity(),
            line.getUnitPrice(),
            line.getLineTotal(),
            Instant.now()
        );
    }
}
