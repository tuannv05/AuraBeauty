package com.cosmetics.inventory.adapter.out.persistence;

import io.smallrye.mutiny.converters.uni.UniReactorConverters;
import io.vertx.mutiny.pgclient.PgPool;
import io.vertx.mutiny.sqlclient.Tuple;
import jakarta.enterprise.context.ApplicationScoped;
import reactor.core.publisher.Mono;

import java.util.UUID;

@ApplicationScoped
public class QuarkusProcessedEventRepository {
    private final PgPool pgPool;

    public QuarkusProcessedEventRepository(PgPool pgPool) {
        this.pgPool = pgPool;
    }

    public Mono<Boolean> existsById(UUID eventId) {
        String sql = "SELECT 1 FROM processed_events WHERE event_id = $1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(eventId))
                .map(rows -> rows.size() > 0)
                .convert().with(UniReactorConverters.toMono());
    }

    public Mono<Void> save(UUID eventId, String eventType) {
        String sql = "INSERT INTO processed_events (event_id, event_type) VALUES ($1, $2) ON CONFLICT DO NOTHING";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(eventId, eventType))
                .replaceWithVoid()
                .convert().with(UniReactorConverters.toMono());
    }
}
