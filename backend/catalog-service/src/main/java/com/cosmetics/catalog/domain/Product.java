package com.cosmetics.catalog.domain;

import com.cosmetics.catalog.domain.model.VtoConfig;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Product {
    private String id;
    private UUID shopId;
    private String name;
    private String brand;
    private String description;
    private String category; // Serum, Toner, Cream, Sunscreen, Cleanser
    private List<String> categoryPath = new ArrayList<>();
    private String subCategory;
    private String registrationNo; // cosmetic registration certificate number
    private List<String> suitableSkinTypes = new ArrayList<>();
    private List<String> skinConcerns = new ArrayList<>();
    private List<String> keyActiveGroups = new ArrayList<>();
    private List<String> safetyEthicsBadges = new ArrayList<>();
    private String formulationTexture;
    private String originCountry;
    private String priceRangeBucket;
    private String volumeSpec;
    private List<Ingredient> ingredients = new ArrayList<>();
    private List<Variant> variants = new ArrayList<>();
    private List<String> images = new ArrayList<>();
    private VtoConfig vtoConfig;
    private ProductStatus status = ProductStatus.DRAFT;
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    public Product() {}

    public Product(String id, UUID shopId, String name, String brand, String description, String category, String registrationNo) {
        this.id = id;
        this.shopId = shopId;
        this.name = name;
        this.brand = brand;
        this.description = description;
        this.category = category;
        this.registrationNo = registrationNo;
        this.status = ProductStatus.DRAFT;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public void submitForReview() {
        if (variants == null || variants.isEmpty()) {
            throw new IllegalStateException("Product must have at least one variant before submission");
        }
        if (registrationNo == null || registrationNo.isBlank()) {
            throw new IllegalStateException("Product must have a cosmetic registration number (Registration No.)");
        }
        this.status = ProductStatus.SUBMITTED;
        this.updatedAt = Instant.now();
    }

    public void approve() {
        if (this.status != ProductStatus.SUBMITTED) {
            throw new IllegalStateException("Only SUBMITTED products can be approved");
        }
        this.status = ProductStatus.PUBLISHED;
        this.updatedAt = Instant.now();
    }

    public void reject(String reason) {
        this.status = ProductStatus.REJECTED;
        this.updatedAt = Instant.now();
    }

    public void deactivate() {
        this.status = ProductStatus.DEACTIVATED;
        this.updatedAt = Instant.now();
    }

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

    public List<Ingredient> getIngredients() { return ingredients; }
    public void setIngredients(List<Ingredient> ingredients) { this.ingredients = ingredients; }
    public List<Variant> getVariants() { return variants; }
    public void setVariants(List<Variant> variants) { this.variants = variants; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    public VtoConfig getVtoConfig() { return vtoConfig; }
    public void setVtoConfig(VtoConfig vtoConfig) { this.vtoConfig = vtoConfig; }
    public ProductStatus getStatus() { return status; }
    public void setStatus(ProductStatus status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
