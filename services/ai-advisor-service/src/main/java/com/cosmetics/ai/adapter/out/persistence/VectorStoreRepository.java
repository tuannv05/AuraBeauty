package com.cosmetics.ai.adapter.out.persistence;

import com.cosmetics.ai.domain.KnowledgeChunk;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.UUID;

@Repository
public class VectorStoreRepository {
    private final DatabaseClient databaseClient;

    public VectorStoreRepository(DatabaseClient databaseClient) {
        this.databaseClient = databaseClient;
    }

    public static String formatVector(float[] vector) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < vector.length; i++) {
            sb.append(vector[i]);
            if (i < vector.length - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }

    public Mono<Void> saveChunk(UUID id, String productId, UUID shopId, String title, String content, String metadata, float[] embedding) {
        String vecStr = formatVector(embedding);
        return databaseClient.sql("""
            INSERT INTO knowledge_chunks (id, product_id, shop_id, title, content, metadata, embedding)
            VALUES (:id, :productId, :shopId, :title, :content, :metadata, :vec::vector)
            ON CONFLICT (id) DO UPDATE 
            SET title = EXCLUDED.title, content = EXCLUDED.content, metadata = EXCLUDED.metadata, embedding = EXCLUDED.embedding
        """)
        .bind("id", id)
        .bind("productId", productId)
        .bind("shopId", shopId)
        .bind("title", title)
        .bind("content", content)
        .bind("metadata", metadata != null ? metadata : "{}")
        .bind("vec", vecStr)
        .then();
    }

    public Flux<KnowledgeChunk> findTopKSimilar(float[] queryVector, int topK) {
        String vecStr = formatVector(queryVector);
        return databaseClient.sql("""
            SELECT id, product_id, shop_id, title, content, metadata,
                   (1 - (embedding <=> :vec::vector)) AS similarity
            FROM knowledge_chunks
            ORDER BY embedding <=> :vec::vector
            LIMIT :topK
        """)
        .bind("vec", vecStr)
        .bind("topK", topK)
        .map((row, meta) -> new KnowledgeChunk(
                row.get("id", UUID.class),
                row.get("product_id", String.class),
                row.get("shop_id", UUID.class),
                row.get("title", String.class),
                row.get("content", String.class),
                row.get("metadata", String.class),
                row.get("similarity", Number.class) != null ? row.get("similarity", Number.class).doubleValue() : 0.0
        ))
        .all();
    }

    public Mono<Void> deleteByProductId(String productId) {
        return databaseClient.sql("DELETE FROM knowledge_chunks WHERE product_id = :productId")
                .bind("productId", productId)
                .then();
    }
}
