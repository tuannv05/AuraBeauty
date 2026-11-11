package com.cosmetics.order.adapter.out.persistence;

import com.cosmetics.common.outbox.OutboxMessage;
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

@ApplicationScoped
public class QuarkusOutboxRepository {
    private final PgPool pgPool;

    public QuarkusOutboxRepository(PgPool pgPool) {
        this.pgPool = pgPool;
    }

    public Flux<OutboxMessage> findPendingWithLock(int limit) {
        String sql = "SELECT id, aggregate_type, aggregate_id, event_type, topic, payload, status, created_at, sent_at FROM outbox_messages WHERE status = 'PENDING' ORDER BY created_at ASC LIMIT $1 FOR UPDATE SKIP LOCKED";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(limit))
                .onItem().transformToMulti(rows -> io.smallrye.mutiny.Multi.createFrom().iterable(rows))
                .map(this::toEntity)
                .convert().with(MultiReactorConverters.toFlux());
    }

    public Mono<OutboxMessage> save(OutboxMessage msg) {
        String sql = """
            INSERT INTO outbox_messages (id, aggregate_type, aggregate_id, event_type, topic, payload, status, created_at, sent_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (id) DO UPDATE SET
                status = EXCLUDED.status,
                sent_at = EXCLUDED.sent_at
        """;
        OffsetDateTime created = msg.getCreatedAt() != null ? msg.getCreatedAt().atOffset(ZoneOffset.UTC) : OffsetDateTime.now(ZoneOffset.UTC);
        OffsetDateTime sent = msg.getSentAt() != null ? msg.getSentAt().atOffset(ZoneOffset.UTC) : null;

        return pgPool.preparedQuery(sql)
                .execute(Tuple.wrap(java.util.Arrays.asList(
                        msg.getId(),
                        msg.getAggregateType(),
                        msg.getAggregateId(),
                        msg.getEventType(),
                        msg.getTopic(),
                        msg.getPayload(),
                        msg.getStatus(),
                        created,
                        sent
                )))
                .map(rows -> msg)
                .convert().with(UniReactorConverters.toMono());
    }

    private OutboxMessage toEntity(Row row) {
        OutboxMessage m = new OutboxMessage();
        m.setId(row.getUUID("id"));
        m.setAggregateType(row.getString("aggregate_type"));
        m.setAggregateId(row.getString("aggregate_id"));
        m.setEventType(row.getString("event_type"));
        m.setTopic(row.getString("topic"));
        m.setPayload(row.getString("payload"));
        m.setStatus(row.getString("status"));
        var created = row.getOffsetDateTime("created_at");
        if (created != null) m.setCreatedAt(created.toInstant());
        var sent = row.getOffsetDateTime("sent_at");
        if (sent != null) m.setSentAt(sent.toInstant());
        return m;
    }
}
