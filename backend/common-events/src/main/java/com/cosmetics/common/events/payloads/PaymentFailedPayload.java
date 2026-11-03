package com.cosmetics.common.events.payloads;

import java.util.UUID;

public class PaymentFailedPayload {
    private UUID orderId;
    private String reason;

    public PaymentFailedPayload() {}
    public PaymentFailedPayload(UUID orderId, String reason) {
        this.orderId = orderId;
        this.reason = reason;
    }

    public UUID getOrderId() { return orderId; }
    public void setOrderId(UUID orderId) { this.orderId = orderId; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
