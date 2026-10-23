package com.cosmetics.order.adapter.out.persistence;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.util.UUID;

@Table("cart_items")
public class CartItemEntity {
    @Id
    private UUID id;

    @Column("buyer_id")
    private UUID buyerId;

    @Column("shop_id")
    private UUID shopId;

    @Column("sku_code")
    private String skuCode;

    @Column("product_name")
    private String productName;

    @Column("shop_name")
    private String shopName;

    @Column("quantity")
    private int quantity;

    @Column("unit_price")
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
