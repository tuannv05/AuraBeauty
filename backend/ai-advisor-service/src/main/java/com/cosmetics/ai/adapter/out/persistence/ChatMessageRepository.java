package com.cosmetics.ai.adapter.out.persistence;

import io.smallrye.mutiny.converters.multi.MultiReactorConverters;
import io.smallrye.mutiny.converters.uni.UniReactorConverters;
import io.vertx.mutiny.pgclient.PgPool;
import io.vertx.mutiny.sqlclient.Row;
import io.vertx.mutiny.sqlclient.Tuple;
import jakarta.enterprise.context.ApplicationScoped;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.UUID;

@ApplicationScoped
public class ChatMessageRepository {
    private final PgPool pgPool;

    public ChatMessageRepository(PgPool pgPool) {
        this.pgPool = pgPool;
    }

    public Mono<ChatMessageEntity> save(ChatMessageEntity entity) {
        String sql = """
            INSERT INTO chat_messages (id, conversation_id, role, content, citations, created_at)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) DO UPDATE SET
                content = EXCLUDED.content,
                citations = EXCLUDED.citations
        """;
        if (entity.getId() == null) {
            entity.setId(UUID.randomUUID());
        }
        OffsetDateTime createdAt = entity.getCreatedAt() != null
                ? entity.getCreatedAt().atOffset(ZoneOffset.UTC)
                : OffsetDateTime.now(ZoneOffset.UTC);

        return pgPool.preparedQuery(sql)
                .execute(Tuple.wrap(Arrays.asList(
                        entity.getId(),
                        entity.getConversationId(),
                        entity.getRole(),
                        entity.getContent(),
                        entity.getCitations(),
                        createdAt
                )))
                .map(rows -> entity)
                .convert().with(UniReactorConverters.toMono());
    }

    public Flux<ChatMessageEntity> findByConversationIdOrderByCreatedAtAsc(UUID conversationId) {
        String sql = "SELECT id, conversation_id, role, content, citations, created_at FROM chat_messages WHERE conversation_id = $1 ORDER BY created_at ASC";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(conversationId))
                .onItem().transformToMulti(rows -> io.smallrye.mutiny.Multi.createFrom().iterable(rows))
                .map(this::toEntity)
                .convert().with(MultiReactorConverters.toFlux());
    }

    private ChatMessageEntity toEntity(Row row) {
        OffsetDateTime created = row.getOffsetDateTime("created_at");
        return new ChatMessageEntity(
                row.getUUID("id"),
                row.getUUID("conversation_id"),
                row.getString("role"),
                row.getString("content"),
                row.getString("citations"),
                created != null ? created.toInstant() : null
        );
    }
}
