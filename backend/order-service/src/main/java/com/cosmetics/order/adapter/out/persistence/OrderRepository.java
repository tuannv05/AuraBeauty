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
public class OrderRepository {
    private final PgPool pgPool;

    public OrderRepository(PgPool pgPool) {
        this.pgPool = pgPool;
    }

    public Flux<OrderEntity> findByBuyerIdOrderByCreatedAtDesc(UUID buyerId) {
        String sql = "SELECT id, buyer_id, status, total_amount, recipient_name, recipient_phone, shipping_address, payment_method, created_at, updated_at FROM orders WHERE buyer_id = $1 ORDER BY created_at DESC";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(buyerId))
                .onItem().transformToMulti(rows -> io.smallrye.mutiny.Multi.createFrom().iterable(rows))
                .map(this::toEntity)
                .convert().with(MultiReactorConverters.toFlux());
    }

    public Mono<OrderEntity> findById(UUID id) {
        String sql = "SELECT id, buyer_id, status, total_amount, recipient_name, recipient_phone, shipping_address, payment_method, created_at, updated_at FROM orders WHERE id = $1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(id))
                .map(rows -> {
                    var it = rows.iterator();
                    return it.hasNext() ? toEntity(it.next()) : null;
                })
                .convert().with(UniReactorConverters.toMono());
    }

    public Mono<OrderEntity> save(OrderEntity order) {
        if (order.getId() == null) {
            order.setId(UUID.randomUUID());
        }
        String sql = """
            INSERT INTO orders (id, buyer_id, status, total_amount, recipient_name, recipient_phone, shipping_address, payment_method, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (id) DO UPDATE SET
                buyer_id = EXCLUDED.buyer_id,
                status = EXCLUDED.status,
                total_amount = EXCLUDED.total_amount,
                recipient_name = EXCLUDED.recipient_name,
                recipient_phone = EXCLUDED.recipient_phone,
                shipping_address = EXCLUDED.shipping_address,
                payment_method = EXCLUDED.payment_method,
                updated_at = EXCLUDED.updated_at
        """;
        OffsetDateTime created = order.getCreatedAt() != null ? order.getCreatedAt().atOffset(ZoneOffset.UTC) : OffsetDateTime.now(ZoneOffset.UTC);
        OffsetDateTime updated = order.getUpdatedAt() != null ? order.getUpdatedAt().atOffset(ZoneOffset.UTC) : OffsetDateTime.now(ZoneOffset.UTC);

        return pgPool.preparedQuery(sql)
                .execute(Tuple.wrap(Arrays.asList(
                        order.getId(),
                        order.getBuyerId(),
                        order.getStatus(),
                        order.getTotalAmount(),
                        order.getRecipientName(),
                        order.getRecipientPhone(),
                        order.getShippingAddress(),
                        order.getPaymentMethod(),
                        created,
                        updated
                )))
                .map(rows -> order)
                .convert().with(UniReactorConverters.toMono());
    }

    private OrderEntity toEntity(Row row) {
        OrderEntity o = new OrderEntity();
        o.setId(row.getUUID("id"));
        o.setBuyerId(row.getUUID("buyer_id"));
        o.setStatus(row.getString("status"));
        o.setTotalAmount(row.getBigDecimal("total_amount"));
        o.setRecipientName(row.getString("recipient_name"));
        o.setRecipientPhone(row.getString("recipient_phone"));
        o.setShippingAddress(row.getString("shipping_address"));
        o.setPaymentMethod(row.getString("payment_method"));
        var created = row.getOffsetDateTime("created_at");
        if (created != null) o.setCreatedAt(created.toInstant());
        var updated = row.getOffsetDateTime("updated_at");
        if (updated != null) o.setUpdatedAt(updated.toInstant());
        return o;
    }
}
