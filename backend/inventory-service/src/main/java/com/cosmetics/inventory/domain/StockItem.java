package com.cosmetics.inventory.domain;

import java.util.UUID;

public class StockItem {
    private String skuCode;
    private String productId;
    private UUID shopId;
    private int onHand;
    private int reserved;
    private long version = 0L;

    public StockItem() {}

    public StockItem(String skuCode, String productId, UUID shopId, int onHand, int reserved) {
        this(skuCode, productId, shopId, onHand, reserved, 0L);
    }

    public StockItem(String skuCode, String productId, UUID shopId, int onHand, int reserved, long version) {
        this.skuCode = skuCode;
        this.productId = productId;
        this.shopId = shopId;
        this.onHand = onHand;
        this.reserved = reserved;
        this.version = version;
    }

    public int getAvailable() {
        return onHand - reserved;
    }

    public String getSkuCode() { return skuCode; }
    public void setSkuCode(String skuCode) { this.skuCode = skuCode; }
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    public UUID getShopId() { return shopId; }
    public void setShopId(UUID shopId) { this.shopId = shopId; }
    public int getOnHand() { return onHand; }
    public void setOnHand(int onHand) { this.onHand = onHand; }
    public int getReserved() { return reserved; }
    public void setReserved(int reserved) { this.reserved = reserved; }
    public long getVersion() { return version; }
    public void setVersion(long version) { this.version = version; }
}
