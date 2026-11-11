package com.cosmetics.ai.domain.model.graph;

import com.cosmetics.ai.domain.DeterministicInciConflictEngine.InciConflict;
import java.util.List;

/**
 * Pure Java 21 Record for Skin Routine Compatibility & Graph Analysis.
 * Adheres strictly to Hexagonal Architecture (Zero Spring or Adapter dependencies).
 */
public record SkinRoutineGraphAnalysis(
    List<KnowledgeGraphNode> activeNodes,
    List<KnowledgeGraphEdge> edges,
    List<InciConflict> conflicts,
    List<String> synergyRecommendations,
    boolean isSafeForDailyUse,
    String summaryRecommendation
) {
}
