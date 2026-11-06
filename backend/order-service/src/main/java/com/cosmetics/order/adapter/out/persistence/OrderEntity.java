package com.cosmetics.order.adapter.out.persistence;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Table("orders")
public class OrderEntity {
    @Id
    private UUID id;

    @Column("buyer_id")
    private UUID buyerId;

    @Column("status")
    private String status;

    @Column("total_amount")
    private BigDecimal totalAmount;

    @Column("recipient_name")
    private String recipientName;

    @Column("recipient_phone")
    private String recipientPhone;

    @Column("shipping_address")
    private String shippingAddress;

    @Column("payment_method")
    private String paymentMethod;

    @Column("created_at")
    private Instant createdAt;

    @Column("updated_at")
    private Instant updatedAt;

    public OrderEntity() {}

    public OrderEntity(UUID id, UUID buyerId, String status, BigDecimal totalAmount, String recipientName, String recipientPhone, String shippingAddress) {
        this(id, buyerId, status, totalAmount, recipientName, recipientPhone, shippingAddress, "COD");
    }

    public OrderEntity(UUID id, UUID buyerId, String status, BigDecimal totalAmount, String recipientName, String recipientPhone, String shippingAddress, String paymentMethod) {
        this.id = id != null ? id : UUID.randomUUID();
        this.buyerId = buyerId;
        this.status = status != null ? status : "CREATED";
        this.totalAmount = totalAmount;
        this.recipientName = recipientName;
        this.recipientPhone = recipientPhone;
        this.shippingAddress = shippingAddress;
        this.paymentMethod = paymentMethod != null ? paymentMethod : "COD";
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getBuyerId() { return buyerId; }
    public void setBuyerId(UUID buyerId) { this.buyerId = buyerId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }
    public String getRecipientPhone() { return recipientPhone; }
    public void setRecipientPhone(String recipientPhone) { this.recipientPhone = recipientPhone; }
    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
