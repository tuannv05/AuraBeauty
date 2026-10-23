package com.cosmetics.account.application.dto;

import java.time.Instant;
import java.util.UUID;

public class ShopResponseDto {
    private UUID id;
    private UUID ownerId;
    private String shopName;
    private String description;
    private String status;
    private String businessRegistrationNo;
    private Instant createdAt;

    public ShopResponseDto() {}

    public ShopResponseDto(UUID id, UUID ownerId, String shopName, String description, String status, String businessRegistrationNo, Instant createdAt) {
        this.id = id;
        this.ownerId = ownerId;
        this.shopName = shopName;
        this.description = description;
        this.status = status;
        this.businessRegistrationNo = businessRegistrationNo;
        this.createdAt = createdAt;
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
}
