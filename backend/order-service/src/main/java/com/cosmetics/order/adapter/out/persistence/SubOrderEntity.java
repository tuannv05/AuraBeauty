package com.cosmetics.order.adapter.out.persistence;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class SubOrderEntity {
    private UUID id;
    private UUID orderId;
    private UUID shopId;
    private String status;
    private BigDecimal subTotal;
    private Instant createdAt;
    private Instant updatedAt;

    public SubOrderEntity() {}

    public SubOrderEntity(UUID id, UUID orderId, UUID shopId, String status, BigDecimal subTotal) {
        this.id = id != null ? id : UUID.randomUUID();
        this.orderId = orderId;
        this.shopId = shopId;
        this.status = status != null ? status : "PENDING";
        this.subTotal = subTotal;
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
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
