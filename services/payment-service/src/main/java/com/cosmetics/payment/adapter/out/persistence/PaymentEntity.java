package com.cosmetics.payment.adapter.out.persistence;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Table("payments")
public class PaymentEntity {
    @Id
    private UUID id;

    @Column("order_id")
    private UUID orderId;

    @Column("buyer_id")
    private UUID buyerId;

    @Column("amount")
    private BigDecimal amount;

    @Column("payment_method")
    private String paymentMethod; // MOCK_GATEWAY, COD

    @Column("status")
    private String status; // PENDING, SUCCESS, FAILED, REFUNDED

    @Column("created_at")
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
