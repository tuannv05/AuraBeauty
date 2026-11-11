package com.cosmetics.order.adapter.out.persistence;

import java.math.BigDecimal;
import java.util.UUID;

public class OrderLineEntity {
    private UUID id;
    private UUID subOrderId;
    private String skuCode;
    private String productName;
    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal lineTotal;

    public OrderLineEntity() {}

    public OrderLineEntity(UUID id, UUID subOrderId, String skuCode, String productName, int quantity, BigDecimal unitPrice, BigDecimal lineTotal) {
        this.id = id != null ? id : UUID.randomUUID();
        this.subOrderId = subOrderId;
        this.skuCode = skuCode;
        this.productName = productName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.lineTotal = lineTotal;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getSubOrderId() { return subOrderId; }
    public void setSubOrderId(UUID subOrderId) { this.subOrderId = subOrderId; }
    public String getSkuCode() { return skuCode; }
    public void setSkuCode(String skuCode) { this.skuCode = skuCode; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    public BigDecimal getLineTotal() { return lineTotal; }
    public void setLineTotal(BigDecimal lineTotal) { this.lineTotal = lineTotal; }
}
