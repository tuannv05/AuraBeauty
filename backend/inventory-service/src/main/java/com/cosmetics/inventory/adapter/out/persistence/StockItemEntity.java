package com.cosmetics.inventory.adapter.out.persistence;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table("stock_items")
public class StockItemEntity {
    @Id
    @Column("sku_code")
    private String skuCode;

    @Column("product_id")
    private String productId;

    @Column("shop_id")
    private UUID shopId;

    @Column("on_hand")
    private int onHand;

    @Column("reserved")
    private int reserved;

    public StockItemEntity() {}

    public StockItemEntity(String skuCode, String productId, UUID shopId, int onHand, int reserved) {
        this.skuCode = skuCode;
        this.productId = productId;
        this.shopId = shopId;
        this.onHand = onHand;
        this.reserved = reserved;
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
}
