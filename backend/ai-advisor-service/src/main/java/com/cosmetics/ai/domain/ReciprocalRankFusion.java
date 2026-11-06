package com.cosmetics.ai.domain;

import java.util.*;

/**
 * Reciprocal Rank Fusion (RRF) Domain Utility for Hybrid Search.
 * Merges dense vector semantic results with sparse lexical keyword matches.
 * Formula: RRF_Score(d) = sum( 1.0 / (k + rank_i(d)) )
 */
public final class ReciprocalRankFusion {

    public static final int DEFAULT_K = 60;

    public record RankedItem<T>(T item, double rrfScore, int denseRank, int lexicalRank) {}

    private ReciprocalRankFusion() {}

    /**
     * Kết hợp 2 danh sách kết quả (Vector Search và Lexical Search) theo thuật toán RRF.
     */
    public static <T> List<RankedItem<T>> fuse(List<T> denseResults, List<T> lexicalResults, int k) {
        Map<T, Double> scoreMap = new HashMap<>();
        Map<T, Integer> denseRankMap = new HashMap<>();
        Map<T, Integer> lexicalRankMap = new HashMap<>();

        if (denseResults != null) {
            for (int rank = 0; rank < denseResults.size(); rank++) {
                T item = denseResults.get(rank);
                denseRankMap.put(item, rank + 1);
                scoreMap.put(item, scoreMap.getOrDefault(item, 0.0) + (1.0 / (k + rank + 1)));
            }
        }

        if (lexicalResults != null) {
            for (int rank = 0; rank < lexicalResults.size(); rank++) {
                T item = lexicalResults.get(rank);
                lexicalRankMap.put(item, rank + 1);
                scoreMap.put(item, scoreMap.getOrDefault(item, 0.0) + (1.0 / (k + rank + 1)));
            }
        }

        List<RankedItem<T>> ranked = new ArrayList<>();
        for (Map.Entry<T, Double> entry : scoreMap.entrySet()) {
            T item = entry.getKey();
            double score = entry.getValue();
            int denseRank = denseRankMap.getOrDefault(item, -1);
            int lexicalRank = lexicalRankMap.getOrDefault(item, -1);
            ranked.add(new RankedItem<>(item, score, denseRank, lexicalRank));
        }

        ranked.sort(Comparator.comparingDouble(RankedItem<T>::rrfScore).reversed());
        return List.copyOf(ranked);
    }
}
