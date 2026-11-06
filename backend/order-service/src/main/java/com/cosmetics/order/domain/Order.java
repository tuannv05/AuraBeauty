package com.cosmetics.order.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Order {
    private UUID id;
    private UUID buyerId;
    private String status; // CREATED, PENDING_PAYMENT, PAID, CANCELLED, COMPLETED, EXPIRED
    private BigDecimal totalAmount;
    private String recipientName;
    private String recipientPhone;
    private String shippingAddress;
    private String paymentMethod; // COD, MOMO, VIETQR, VNPAY, CARD
    private List<SubOrder> subOrders = new ArrayList<>();
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    public Order() {}

    public Order(UUID id, UUID buyerId, BigDecimal totalAmount, String recipientName, String recipientPhone, String shippingAddress) {
        this.id = id != null ? id : UUID.randomUUID();
        this.buyerId = buyerId;
        this.totalAmount = totalAmount;
        this.recipientName = recipientName;
        this.recipientPhone = recipientPhone;
        this.shippingAddress = shippingAddress;
        this.status = "CREATED";
        this.paymentMethod = "COD";
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
    public List<SubOrder> getSubOrders() { return subOrders; }
    public void setSubOrders(List<SubOrder> subOrders) { this.subOrders = subOrders; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
