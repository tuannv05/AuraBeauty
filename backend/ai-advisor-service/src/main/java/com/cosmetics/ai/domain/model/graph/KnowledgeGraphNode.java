package com.cosmetics.ai.domain.model.graph;

import java.util.Map;

/**
 * Pure Java 21 Record representing a Knowledge Graph Node.
 * Adheres strictly to Hexagonal Architecture (Zero Spring or Adapter dependencies).
 */
public record KnowledgeGraphNode(
    String id,
    String label,
    String type,        // PRODUCT, INGREDIENT, SKIN_TYPE, SKIN_CONCERN, BRAND
    String category,
    String color,
    int val,
    String description,
    Map<String, Object> metadata
) {
    public static KnowledgeGraphNode of(String id, String label, String type, String color, int val, String description) {
        return new KnowledgeGraphNode(id, label, type, type, color, val, description, Map.of());
    }
}
