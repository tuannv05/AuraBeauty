package com.cosmetics.ai.domain.model.graph;

/**
 * Pure Java 21 Record representing a Knowledge Graph Edge.
 * Adheres strictly to Hexagonal Architecture (Zero Spring or Adapter dependencies).
 */
public record KnowledgeGraphEdge(
    String source,
    String target,
    String relationship,    // CONTAINS_ACTIVE, TREATS_CONCERN, SUITABLE_FOR, SYNERGY_WITH, CONFLICTS_WITH, MANUFACTURED_BY
    String color,
    String description,
    boolean animated
) {
    public static KnowledgeGraphEdge synergy(String source, String target, String description) {
        return new KnowledgeGraphEdge(source, target, "SYNERGY_WITH", "#10B981", description, true);
    }

    public static KnowledgeGraphEdge conflict(String source, String target, String description) {
        return new KnowledgeGraphEdge(source, target, "CONFLICTS_WITH", "#EF4444", description, true);
    }

    public static KnowledgeGraphEdge basic(String source, String target, String rel, String color, String description) {
        return new KnowledgeGraphEdge(source, target, rel, color, description, false);
    }
}
