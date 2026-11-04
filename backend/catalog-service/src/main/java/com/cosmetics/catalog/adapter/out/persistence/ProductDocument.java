package com.cosmetics.catalog.adapter.out.persistence;

import com.cosmetics.catalog.domain.model.VtoConfig;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Document(collection = "products")
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductDocument {
    @Id
    private String id;

    @Indexed
    private UUID shopId;

    @TextIndexed(weight = 3)
    private String name;

    @TextIndexed(weight = 2)
    private String brand;

    @TextIndexed(weight = 1)
    private String description;

    @Indexed
    private String category;

    @Indexed
    private List<String> categoryPath = new ArrayList<>();

    @Indexed
    private String subCategory;

    private String registrationNo;

    @Indexed
    private List<String> suitableSkinTypes = new ArrayList<>();

    @Indexed
    private List<String> skinConcerns = new ArrayList<>();

    @Indexed
    private List<String> keyActiveGroups = new ArrayList<>();

    @Indexed
    private List<String> safetyEthicsBadges = new ArrayList<>();

    @Indexed
    private String formulationTexture;

    @Indexed
    private String originCountry;

    private String priceRangeBucket;
    private String volumeSpec;

    private List<IngredientSubDoc> ingredients = new ArrayList<>();

    private List<VariantSubDoc> variants = new ArrayList<>();

    private List<String> images = new ArrayList<>();

    private VtoConfig vtoConfig;

    @Indexed
    private String status; // DRAFT, SUBMITTED, PUBLISHED, REJECTED, DEACTIVATED

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class IngredientSubDoc {
        private String inciName;
        private String purpose;
        private boolean potentialIrritant;

        public IngredientSubDoc() {}
        public IngredientSubDoc(String inciName, String purpose, boolean potentialIrritant) {
            this.inciName = inciName;
            this.purpose = purpose;
            this.potentialIrritant = potentialIrritant;
        }

        public String getInciName() { return inciName; }
        public void setInciName(String inciName) { this.inciName = inciName; }
        public String getPurpose() { return purpose; }
        public void setPurpose(String purpose) { this.purpose = purpose; }
        public boolean isPotentialIrritant() { return potentialIrritant; }
        public void setPotentialIrritant(boolean potentialIrritant) { this.potentialIrritant = potentialIrritant; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class VariantSubDoc {
        @Indexed
        private String skuCode;
        private String name;
        private BigDecimal price;
        private BigDecimal originalPrice;
        private Map<String, String> attributes;

        public VariantSubDoc() {}
        public VariantSubDoc(String skuCode, String name, BigDecimal price, BigDecimal originalPrice, Map<String, String> attributes) {
            this.skuCode = skuCode;
            this.name = name;
            this.price = price;
            this.originalPrice = originalPrice;
            this.attributes = attributes;
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

    public ProductDocument() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
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

    public List<String> getCategoryPath() { return categoryPath; }
    public void setCategoryPath(List<String> categoryPath) { this.categoryPath = categoryPath; }

    public String getSubCategory() { return subCategory; }
    public void setSubCategory(String subCategory) { this.subCategory = subCategory; }
    public String getRegistrationNo() { return registrationNo; }
    public void setRegistrationNo(String registrationNo) { this.registrationNo = registrationNo; }
    public List<String> getSuitableSkinTypes() { return suitableSkinTypes; }
    public void setSuitableSkinTypes(List<String> suitableSkinTypes) { this.suitableSkinTypes = suitableSkinTypes; }

    public List<String> getSkinConcerns() { return skinConcerns; }
    public void setSkinConcerns(List<String> skinConcerns) { this.skinConcerns = skinConcerns; }

    public List<String> getKeyActiveGroups() { return keyActiveGroups; }
    public void setKeyActiveGroups(List<String> keyActiveGroups) { this.keyActiveGroups = keyActiveGroups; }

    public List<String> getSafetyEthicsBadges() { return safetyEthicsBadges; }
    public void setSafetyEthicsBadges(List<String> safetyEthicsBadges) { this.safetyEthicsBadges = safetyEthicsBadges; }

    public String getFormulationTexture() { return formulationTexture; }
    public void setFormulationTexture(String formulationTexture) { this.formulationTexture = formulationTexture; }

    public String getOriginCountry() { return originCountry; }
    public void setOriginCountry(String originCountry) { this.originCountry = originCountry; }

    public String getPriceRangeBucket() { return priceRangeBucket; }
    public void setPriceRangeBucket(String priceRangeBucket) { this.priceRangeBucket = priceRangeBucket; }

    public String getVolumeSpec() { return volumeSpec; }
    public void setVolumeSpec(String volumeSpec) { this.volumeSpec = volumeSpec; }

    public List<IngredientSubDoc> getIngredients() { return ingredients; }
    public void setIngredients(List<IngredientSubDoc> ingredients) { this.ingredients = ingredients; }
    public List<VariantSubDoc> getVariants() { return variants; }
    public void setVariants(List<VariantSubDoc> variants) { this.variants = variants; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    public VtoConfig getVtoConfig() { return vtoConfig; }
    public void setVtoConfig(VtoConfig vtoConfig) { this.vtoConfig = vtoConfig; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
