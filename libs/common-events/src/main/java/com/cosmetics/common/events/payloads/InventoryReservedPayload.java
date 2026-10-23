package com.cosmetics.common.events.payloads;

import java.math.BigDecimal;
import java.util.UUID;

public class InventoryReservedPayload {
    private UUID orderId;
    private BigDecimal totalAmount;

    public InventoryReservedPayload() {}
    public InventoryReservedPayload(UUID orderId, BigDecimal totalAmount) {
        this.orderId = orderId;
        this.totalAmount = totalAmount;
    }

    public UUID getOrderId() { return orderId; }
    public void setOrderId(UUID orderId) { this.orderId = orderId; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
}
