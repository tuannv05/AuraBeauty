package com.cosmetics.account.adapter.out.persistence;

import java.time.Instant;
import java.util.UUID;

public class ShopEntity {
    private UUID id;
    private UUID ownerId;
    private String shopName;
    private String description;
    private String status; // PENDING, APPROVED, REJECTED
    private String businessRegistrationNo;
    private Instant createdAt;
    private Instant updatedAt;

    public ShopEntity() {}

    public ShopEntity(UUID id, UUID ownerId, String shopName, String description, String status, String businessRegistrationNo) {
        this.id = id != null ? id : UUID.randomUUID();
        this.ownerId = ownerId;
        this.shopName = shopName;
        this.description = description;
        this.status = status != null ? status : "PENDING";
        this.businessRegistrationNo = businessRegistrationNo;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getOwnerId() { return ownerId; }
    public void setOwnerId(UUID ownerId) { this.ownerId = ownerId; }
    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getBusinessRegistrationNo() { return businessRegistrationNo; }
    public void setBusinessRegistrationNo(String businessRegistrationNo) { this.businessRegistrationNo = businessRegistrationNo; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
