package com.cosmetics.order.adapter.out.persistence;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Table("sub_orders")
public class SubOrderEntity {
    @Id
    private UUID id;

    @Column("order_id")
    private UUID orderId;

    @Column("shop_id")
    private UUID shopId;

    @Column("status")
    private String status;

    @Column("sub_total")
    private BigDecimal subTotal;

    @Column("created_at")
    private Instant createdAt;

    @Column("updated_at")
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
