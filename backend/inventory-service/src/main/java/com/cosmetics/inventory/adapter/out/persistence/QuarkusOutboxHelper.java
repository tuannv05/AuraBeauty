package com.cosmetics.inventory.adapter.out.persistence;

import com.cosmetics.common.events.EventEnvelope;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.smallrye.mutiny.converters.uni.UniReactorConverters;
import io.vertx.mutiny.pgclient.PgPool;
import io.vertx.mutiny.sqlclient.Tuple;
import jakarta.enterprise.context.ApplicationScoped;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Arrays;

@ApplicationScoped
public class QuarkusOutboxHelper {
    private final PgPool pgPool;
    private final ObjectMapper objectMapper;

    public QuarkusOutboxHelper(PgPool pgPool, ObjectMapper objectMapper) {
        this.pgPool = pgPool;
        this.objectMapper = objectMapper;
    }

    public <T> Mono<Void> recordEvent(String topic, String aggregateType, String aggregateId, String eventType, T payload) {
        EventEnvelope<T> envelope = EventEnvelope.of(eventType, aggregateType, aggregateId, payload);
        try {
            String json = objectMapper.writeValueAsString(envelope);
            String sql = "INSERT INTO outbox_messages (id, aggregate_type, aggregate_id, event_type, topic, payload, status, created_at) " +
                         "VALUES ($1, $2, $3, $4, $5, $6, 'PENDING', $7)";
            Tuple tuple = Tuple.wrap(Arrays.asList(envelope.getEventId(), aggregateType, aggregateId, eventType, topic, json, Instant.now()));
            return pgPool.preparedQuery(sql)
                    .execute(tuple)
                    .replaceWithVoid()
                    .convert().with(UniReactorConverters.toMono());
        } catch (JsonProcessingException e) {
            return Mono.error(new RuntimeException("Failed to serialize event payload to JSON", e));
        }
    }
}
