package com.cosmetics.ai.adapter.out.persistence;

import com.cosmetics.ai.domain.KnowledgeChunk;
import io.smallrye.mutiny.converters.multi.MultiReactorConverters;
import io.smallrye.mutiny.converters.uni.UniReactorConverters;
import io.vertx.mutiny.pgclient.PgPool;
import io.vertx.mutiny.sqlclient.Row;
import io.vertx.mutiny.sqlclient.Tuple;
import jakarta.enterprise.context.ApplicationScoped;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.UUID;

@ApplicationScoped
public class VectorStoreRepository {
    private final PgPool pgPool;

    public VectorStoreRepository(PgPool pgPool) {
        this.pgPool = pgPool;
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
        String sql = """
            INSERT INTO knowledge_chunks (id, product_id, shop_id, title, content, metadata, embedding)
            VALUES ($1, $2, $3, $4, $5, $6, $7::vector)
            ON CONFLICT (id) DO UPDATE
            SET title = EXCLUDED.title, content = EXCLUDED.content, metadata = EXCLUDED.metadata, embedding = EXCLUDED.embedding
        """;
        return pgPool.preparedQuery(sql)
                .execute(Tuple.wrap(Arrays.asList(
                        id,
                        productId,
                        shopId,
                        title,
                        content,
                        metadata != null ? metadata : "{}",
                        vecStr
                )))
                .replaceWithVoid()
                .convert().with(UniReactorConverters.toMono());
    }

    public Flux<KnowledgeChunk> findTopKSimilar(float[] queryVector, int topK) {
        String vecStr = formatVector(queryVector);
        String sql = """
            SELECT id, product_id, shop_id, title, content, metadata,
                   (1 - (embedding <=> $1::vector)) AS similarity
            FROM knowledge_chunks
            ORDER BY embedding <=> $1::vector
            LIMIT $2
        """;
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(vecStr, topK))
                .onItem().transformToMulti(rows -> io.smallrye.mutiny.Multi.createFrom().iterable(rows))
                .map(this::toChunk)
                .convert().with(MultiReactorConverters.toFlux());
    }

    public Mono<Void> deleteByProductId(String productId) {
        String sql = "DELETE FROM knowledge_chunks WHERE product_id = $1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(productId))
                .replaceWithVoid()
                .convert().with(UniReactorConverters.toMono());
    }

    private KnowledgeChunk toChunk(Row row) {
        Number sim = (Number) row.getValue("similarity");
        return new KnowledgeChunk(
                row.getUUID("id"),
                row.getString("product_id"),
                row.getUUID("shop_id"),
                row.getString("title"),
                row.getString("content"),
                row.getString("metadata"),
                sim != null ? sim.doubleValue() : 0.0
        );
    }
}
