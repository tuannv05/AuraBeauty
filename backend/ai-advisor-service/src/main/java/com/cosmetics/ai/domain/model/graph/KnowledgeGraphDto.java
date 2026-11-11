package com.cosmetics.ai.domain.model.graph;

import java.util.List;
import java.util.Map;

/**
 * Knowledge Graph container DTO for Subgraphs & Ego-Networks.
 * Pure Java 21 Record compliant with Hexagonal Architecture.
 */
public record KnowledgeGraphDto(
    Map<String, Object> metadata,
    List<KnowledgeGraphNode> nodes,
    List<KnowledgeGraphEdge> edges
) {
}
