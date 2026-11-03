package com.cosmetics.common.events.payloads;

import java.math.BigDecimal;
import java.util.UUID;

public class PaymentSucceededPayload {
    private UUID paymentId;
    private UUID orderId;
    private BigDecimal amount;

    public PaymentSucceededPayload() {}
    public PaymentSucceededPayload(UUID paymentId, UUID orderId, BigDecimal amount) {
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.amount = amount;
    }

    public UUID getPaymentId() { return paymentId; }
    public void setPaymentId(UUID paymentId) { this.paymentId = paymentId; }
    public UUID getOrderId() { return orderId; }
    public void setOrderId(UUID orderId) { this.orderId = orderId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}
