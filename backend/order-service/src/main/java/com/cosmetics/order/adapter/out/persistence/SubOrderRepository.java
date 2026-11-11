package com.cosmetics.order.adapter.out.persistence;

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
public class SubOrderRepository {
    private final PgPool pgPool;

    public SubOrderRepository(PgPool pgPool) {
        this.pgPool = pgPool;
    }

    public Flux<SubOrderEntity> findByOrderId(UUID orderId) {
        String sql = "SELECT id, order_id, shop_id, status, sub_total, created_at, updated_at FROM sub_orders WHERE order_id = $1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(orderId))
                .onItem().transformToMulti(rows -> io.smallrye.mutiny.Multi.createFrom().iterable(rows))
                .map(this::toEntity)
                .convert().with(MultiReactorConverters.toFlux());
    }

    public Flux<SubOrderEntity> findByShopIdOrderByCreatedAtDesc(UUID shopId) {
        String sql = "SELECT id, order_id, shop_id, status, sub_total, created_at, updated_at FROM sub_orders WHERE shop_id = $1 ORDER BY created_at DESC";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(shopId))
                .onItem().transformToMulti(rows -> io.smallrye.mutiny.Multi.createFrom().iterable(rows))
                .map(this::toEntity)
                .convert().with(MultiReactorConverters.toFlux());
    }

    public Mono<SubOrderEntity> findById(UUID id) {
        String sql = "SELECT id, order_id, shop_id, status, sub_total, created_at, updated_at FROM sub_orders WHERE id = $1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(id))
                .map(rows -> {
                    var it = rows.iterator();
                    return it.hasNext() ? toEntity(it.next()) : null;
                })
                .convert().with(UniReactorConverters.toMono());
    }

    public Mono<SubOrderEntity> save(SubOrderEntity s) {
        if (s.getId() == null) {
            s.setId(UUID.randomUUID());
        }
        String sql = """
            INSERT INTO sub_orders (id, order_id, shop_id, status, sub_total, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) DO UPDATE SET
                order_id = EXCLUDED.order_id,
                shop_id = EXCLUDED.shop_id,
                status = EXCLUDED.status,
                sub_total = EXCLUDED.sub_total,
                updated_at = EXCLUDED.updated_at
        """;
        OffsetDateTime created = s.getCreatedAt() != null ? s.getCreatedAt().atOffset(ZoneOffset.UTC) : OffsetDateTime.now(ZoneOffset.UTC);
        OffsetDateTime updated = s.getUpdatedAt() != null ? s.getUpdatedAt().atOffset(ZoneOffset.UTC) : OffsetDateTime.now(ZoneOffset.UTC);

        return pgPool.preparedQuery(sql)
                .execute(Tuple.wrap(Arrays.asList(
                        s.getId(),
                        s.getOrderId(),
                        s.getShopId(),
                        s.getStatus(),
                        s.getSubTotal(),
                        created,
                        updated
                )))
                .map(rows -> s)
                .convert().with(UniReactorConverters.toMono());
    }

    public Flux<SubOrderEntity> saveAll(Iterable<SubOrderEntity> subOrders) {
        return Flux.fromIterable(subOrders).flatMap(this::save);
    }

    private SubOrderEntity toEntity(Row row) {
        SubOrderEntity s = new SubOrderEntity();
        s.setId(row.getUUID("id"));
        s.setOrderId(row.getUUID("order_id"));
        s.setShopId(row.getUUID("shop_id"));
        s.setStatus(row.getString("status"));
        s.setSubTotal(row.getBigDecimal("sub_total"));
        var created = row.getOffsetDateTime("created_at");
        if (created != null) s.setCreatedAt(created.toInstant());
        var updated = row.getOffsetDateTime("updated_at");
        if (updated != null) s.setUpdatedAt(updated.toInstant());
        return s;
    }
}
