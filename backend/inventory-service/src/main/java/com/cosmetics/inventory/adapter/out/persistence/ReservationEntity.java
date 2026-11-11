package com.cosmetics.inventory.adapter.out.persistence;

import java.time.Instant;
import java.util.UUID;

public class ReservationEntity {
    private UUID id;
    private UUID orderId;
    private String skuCode;
    private int quantity;
    private String status; // ACTIVE, CONFIRMED, RELEASED
    private Instant expiresAt;

    public ReservationEntity() {}

    public ReservationEntity(UUID id, UUID orderId, String skuCode, int quantity, String status, Instant expiresAt) {
        this.id = id != null ? id : UUID.randomUUID();
        this.orderId = orderId;
        this.skuCode = skuCode;
        this.quantity = quantity;
        this.status = status != null ? status : "ACTIVE";
        this.expiresAt = expiresAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getOrderId() { return orderId; }
    public void setOrderId(UUID orderId) { this.orderId = orderId; }
    public String getSkuCode() { return skuCode; }
    public void setSkuCode(String skuCode) { this.skuCode = skuCode; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
}
