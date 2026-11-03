package com.cosmetics.common.events.payloads;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class ProductPublishedPayload {
    private String productId;
    private UUID shopId;
    private String name;
    private String brand;
    private String description;
    private String category;
    private String registrationNo;
    private List<String> suitableSkinTypes;
    private List<String> ingredientInciNames;
    private List<VariantDto> variants;

    public static class VariantDto {
        private String skuCode;
        private String name;
        private BigDecimal price;

        public VariantDto() {}
        public VariantDto(String skuCode, String name, BigDecimal price) {
            this.skuCode = skuCode;
            this.name = name;
            this.price = price;
        }

        public String getSkuCode() { return skuCode; }
        public void setSkuCode(String skuCode) { this.skuCode = skuCode; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
    }

    public ProductPublishedPayload() {}

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    public UUID getShopId() { return shopId; }
    public void setShopId(UUID shopId) { this.shopId = shopId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getRegistrationNo() { return registrationNo; }
    public void setRegistrationNo(String registrationNo) { this.registrationNo = registrationNo; }
    public List<String> getSuitableSkinTypes() { return suitableSkinTypes; }
    public void setSuitableSkinTypes(List<String> suitableSkinTypes) { this.suitableSkinTypes = suitableSkinTypes; }
    public List<String> getIngredientInciNames() { return ingredientInciNames; }
    public void setIngredientInciNames(List<String> ingredientInciNames) { this.ingredientInciNames = ingredientInciNames; }
    public List<VariantDto> getVariants() { return variants; }
    public void setVariants(List<VariantDto> variants) { this.variants = variants; }
}
