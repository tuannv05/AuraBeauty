package com.cosmetics.ai.domain;

import java.util.UUID;

public class KnowledgeChunk {
    private UUID id;
    private String productId;
    private UUID shopId;
    private String title;
    private String content;
    private String metadata;
    private double similarity;

    public KnowledgeChunk() {}

    public KnowledgeChunk(UUID id, String productId, UUID shopId, String title, String content, String metadata, double similarity) {
        this.id = id;
        this.productId = productId;
        this.shopId = shopId;
        this.title = title;
        this.content = content;
        this.metadata = metadata;
        this.similarity = similarity;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    public UUID getShopId() { return shopId; }
    public void setShopId(UUID shopId) { this.shopId = shopId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }
    public double getSimilarity() { return similarity; }
    public void setSimilarity(double similarity) { this.similarity = similarity; }
}
