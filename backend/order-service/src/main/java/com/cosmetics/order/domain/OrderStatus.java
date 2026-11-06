package com.cosmetics.order.domain;

/**
 * Java 21 Sealed Interface for Strict Domain Order State Machine.
 * Guarantees compile-time pattern matching exhaustiveness without runtime fallback gaps.
 */
public sealed interface OrderStatus {

    String code();

    record Created() implements OrderStatus {
        @Override public String code() { return "CREATED"; }
    }

    record PendingPayment(long timeoutSeconds) implements OrderStatus {
        public PendingPayment() { this(900); } // 15 phút đếm ngược
        @Override public String code() { return "PENDING_PAYMENT"; }
    }

    record Confirmed() implements OrderStatus {
        @Override public String code() { return "CONFIRMED"; }
    }

    record Processing() implements OrderStatus {
        @Override public String code() { return "PROCESSING"; }
    }

    record Shipped(String trackingNumber) implements OrderStatus {
        @Override public String code() { return "SHIPPED"; }
    }

    record Delivered() implements OrderStatus {
        @Override public String code() { return "DELIVERED"; }
    }

    record Settled() implements OrderStatus {
        @Override public String code() { return "SETTLED"; }
    }

    record Cancelled(String reason) implements OrderStatus {
        @Override public String code() { return "CANCELLED"; }
    }

    record Expired() implements OrderStatus {
        @Override public String code() { return "EXPIRED"; }
    }

    static OrderStatus fromCode(String code) {
        if (code == null) return new Created();
        return switch (code.toUpperCase().trim()) {
            case "PENDING_PAYMENT" -> new PendingPayment();
            case "CONFIRMED", "PAID" -> new Confirmed();
            case "PROCESSING" -> new Processing();
            case "SHIPPED" -> new Shipped("DEFAULT-TRACKING");
            case "DELIVERED" -> new Delivered();
            case "SETTLED" -> new Settled();
            case "CANCELLED" -> new Cancelled("USER_OR_SYSTEM_CANCELLED");
            case "EXPIRED" -> new Expired();
            default -> new Created();
        };
    }
}
