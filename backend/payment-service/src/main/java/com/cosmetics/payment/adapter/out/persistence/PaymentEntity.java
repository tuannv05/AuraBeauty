package com.cosmetics.payment.adapter.out.persistence;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class PaymentEntity {
    private UUID id;
    private UUID orderId;
    private UUID buyerId;
    private BigDecimal amount;
    private String paymentMethod; // MOCK_GATEWAY, COD
    private String status; // PENDING, SUCCESS, FAILED, REFUNDED
    private Instant createdAt;

    public PaymentEntity() {}

    public PaymentEntity(UUID id, UUID orderId, UUID buyerId, BigDecimal amount, String paymentMethod, String status) {
        this.id = id != null ? id : UUID.randomUUID();
        this.orderId = orderId;
        this.buyerId = buyerId;
        this.amount = amount;
        this.paymentMethod = paymentMethod != null ? paymentMethod : "MOCK_GATEWAY";
        this.status = status != null ? status : "PENDING";
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getOrderId() { return orderId; }
    public void setOrderId(UUID orderId) { this.orderId = orderId; }
    public UUID getBuyerId() { return buyerId; }
    public void setBuyerId(UUID buyerId) { this.buyerId = buyerId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
