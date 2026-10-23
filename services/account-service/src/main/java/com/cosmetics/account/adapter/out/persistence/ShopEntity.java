package com.cosmetics.account.adapter.out.persistence;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

@Table("shops")
public class ShopEntity {
    @Id
    private UUID id;

    @Column("owner_id")
    private UUID ownerId;

    @Column("shop_name")
    private String shopName;

    @Column("description")
    private String description;

    @Column("status")
    private String status; // PENDING, APPROVED, REJECTED

    @Column("business_registration_no")
    private String businessRegistrationNo;

    @Column("created_at")
    private Instant createdAt;

    @Column("updated_at")
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
