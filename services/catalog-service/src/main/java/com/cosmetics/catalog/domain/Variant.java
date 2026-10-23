package com.cosmetics.catalog.domain;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

public class Variant {
    private String skuCode;
    private String name; // e.g. "50ml", "150ml"
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Map<String, String> attributes = new HashMap<>();

    public Variant() {}

    public Variant(String skuCode, String name, BigDecimal price, BigDecimal originalPrice) {
        this.skuCode = skuCode;
        this.name = name;
        this.price = price;
        this.originalPrice = originalPrice != null ? originalPrice : price;
    }

    public String getSkuCode() { return skuCode; }
    public void setSkuCode(String skuCode) { this.skuCode = skuCode; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }
    public Map<String, String> getAttributes() { return attributes; }
    public void setAttributes(Map<String, String> attributes) { this.attributes = attributes; }
}
