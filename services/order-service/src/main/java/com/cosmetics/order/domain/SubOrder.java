package com.cosmetics.order.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class SubOrder {
    private UUID id;
    private UUID orderId;
    private UUID shopId;
    private String status; // PENDING, READY_FOR_PROCESSING, CONFIRMED, SHIPPED, DELIVERED, REJECTED, REFUNDED
    private BigDecimal subTotal;
    private List<OrderLine> lines = new ArrayList<>();
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    public SubOrder() {}

    public SubOrder(UUID id, UUID orderId, UUID shopId, BigDecimal subTotal) {
        this.id = id != null ? id : UUID.randomUUID();
        this.orderId = orderId;
        this.shopId = shopId;
        this.subTotal = subTotal;
        this.status = "PENDING";
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getOrderId() { return orderId; }
    public void setOrderId(UUID orderId) { this.orderId = orderId; }
    public UUID getShopId() { return shopId; }
    public void setShopId(UUID shopId) { this.shopId = shopId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public BigDecimal getSubTotal() { return subTotal; }
    public void setSubTotal(BigDecimal subTotal) { this.subTotal = subTotal; }
    public List<OrderLine> getLines() { return lines; }
    public void setLines(List<OrderLine> lines) { this.lines = lines; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
