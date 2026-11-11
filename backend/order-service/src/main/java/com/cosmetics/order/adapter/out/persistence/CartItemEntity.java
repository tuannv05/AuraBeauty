package com.cosmetics.order.adapter.out.persistence;

import java.math.BigDecimal;
import java.util.UUID;

public class CartItemEntity {
    private UUID id;
    private UUID buyerId;
    private UUID shopId;
    private String skuCode;
    private String productName;
    private String shopName;
    private int quantity;
    private BigDecimal unitPrice;

    public CartItemEntity() {}

    public CartItemEntity(UUID id, UUID buyerId, UUID shopId, String skuCode, String productName, String shopName, int quantity, BigDecimal unitPrice) {
        this.id = id != null ? id : UUID.randomUUID();
        this.buyerId = buyerId;
        this.shopId = shopId;
        this.skuCode = skuCode;
        this.productName = productName;
        this.shopName = shopName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getBuyerId() { return buyerId; }
    public void setBuyerId(UUID buyerId) { this.buyerId = buyerId; }
    public UUID getShopId() { return shopId; }
    public void setShopId(UUID shopId) { this.shopId = shopId; }
    public String getSkuCode() { return skuCode; }
    public void setSkuCode(String skuCode) { this.skuCode = skuCode; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
}
