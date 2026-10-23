package com.cosmetics.catalog.domain;

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
    private String registrationNo; // cosmetic registration certificate number
    private List<String> suitableSkinTypes = new ArrayList<>();
    private List<Ingredient> ingredients = new ArrayList<>();
    private List<Variant> variants = new ArrayList<>();
    private List<String> images = new ArrayList<>();
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
    public String getRegistrationNo() { return registrationNo; }
    public void setRegistrationNo(String registrationNo) { this.registrationNo = registrationNo; }
    public List<String> getSuitableSkinTypes() { return suitableSkinTypes; }
    public void setSuitableSkinTypes(List<String> suitableSkinTypes) { this.suitableSkinTypes = suitableSkinTypes; }
    public List<Ingredient> getIngredients() { return ingredients; }
    public void setIngredients(List<Ingredient> ingredients) { this.ingredients = ingredients; }
    public List<Variant> getVariants() { return variants; }
    public void setVariants(List<Variant> variants) { this.variants = variants; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    public ProductStatus getStatus() { return status; }
    public void setStatus(ProductStatus status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
