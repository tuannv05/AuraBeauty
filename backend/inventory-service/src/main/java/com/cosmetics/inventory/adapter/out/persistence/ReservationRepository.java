package com.cosmetics.inventory.adapter.out.persistence;

import io.smallrye.mutiny.converters.multi.MultiReactorConverters;
import io.smallrye.mutiny.converters.uni.UniReactorConverters;
import io.vertx.mutiny.pgclient.PgPool;
import io.vertx.mutiny.sqlclient.Tuple;
import jakarta.enterprise.context.ApplicationScoped;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class ReservationRepository {

    private final PgPool pgPool;

    public ReservationRepository(PgPool pgPool) {
        this.pgPool = pgPool;
    }

    public Flux<ReservationEntity> findByOrderId(UUID orderId) {
        String sql = "SELECT id, order_id, sku_code, quantity, status, expires_at FROM reservations WHERE order_id = $1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(orderId))
                .onItem().transformToMulti(rows -> {
                    List<ReservationEntity> list = new ArrayList<>();
                    for (var row : rows) {
                        list.add(new ReservationEntity(
                                row.getUUID("id"),
                                row.getUUID("order_id"),
                                row.getString("sku_code"),
                                row.getInteger("quantity"),
                                row.getString("status"),
                                row.getOffsetDateTime("expires_at") != null ? row.getOffsetDateTime("expires_at").toInstant() : null
                        ));
                    }
                    return io.smallrye.mutiny.Multi.createFrom().iterable(list);
                })
                .convert().with(MultiReactorConverters.toFlux());
    }

    public Flux<ReservationEntity> findByOrderIdAndStatus(UUID orderId, String status) {
        String sql = "SELECT id, order_id, sku_code, quantity, status, expires_at FROM reservations WHERE order_id = $1 AND status = $2";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(orderId, status))
                .onItem().transformToMulti(rows -> {
                    List<ReservationEntity> list = new ArrayList<>();
                    for (var row : rows) {
                        list.add(new ReservationEntity(
                                row.getUUID("id"),
                                row.getUUID("order_id"),
                                row.getString("sku_code"),
                                row.getInteger("quantity"),
                                row.getString("status"),
                                row.getOffsetDateTime("expires_at") != null ? row.getOffsetDateTime("expires_at").toInstant() : null
                        ));
                    }
                    return io.smallrye.mutiny.Multi.createFrom().iterable(list);
                })
                .convert().with(MultiReactorConverters.toFlux());
    }

    public Mono<ReservationEntity> save(ReservationEntity entity) {
        String sql = "INSERT INTO reservations (id, order_id, sku_code, quantity, status, expires_at) " +
                     "VALUES ($1, $2, $3, $4, $5, $6) " +
                     "ON CONFLICT (id) DO UPDATE SET status = $5";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(entity.getId(), entity.getOrderId(), entity.getSkuCode(), entity.getQuantity(), entity.getStatus(), entity.getExpiresAt()))
                .map(rows -> entity)
                .convert().with(UniReactorConverters.toMono());
    }
}
