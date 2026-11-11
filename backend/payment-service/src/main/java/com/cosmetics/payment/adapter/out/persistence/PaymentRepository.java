package com.cosmetics.payment.adapter.out.persistence;

import io.smallrye.mutiny.converters.uni.UniReactorConverters;
import io.vertx.mutiny.pgclient.PgPool;
import io.vertx.mutiny.sqlclient.Row;
import io.vertx.mutiny.sqlclient.Tuple;
import jakarta.enterprise.context.ApplicationScoped;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

@ApplicationScoped
public class PaymentRepository {
    private final PgPool pgPool;

    public PaymentRepository(PgPool pgPool) {
        this.pgPool = pgPool;
    }

    public Mono<PaymentEntity> findByOrderId(UUID orderId) {
        String sql = "SELECT id, order_id, buyer_id, amount, payment_method, status, created_at FROM payments WHERE order_id = $1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(orderId))
                .map(rows -> {
                    var it = rows.iterator();
                    return it.hasNext() ? toEntity(it.next()) : null;
                })
                .convert().with(UniReactorConverters.toMono());
    }

    public Mono<PaymentEntity> save(PaymentEntity payment) {
        if (payment.getId() == null) {
            payment.setId(UUID.randomUUID());
        }
        String sql = """
            INSERT INTO payments (id, order_id, buyer_id, amount, payment_method, status, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) DO UPDATE SET
                order_id = EXCLUDED.order_id,
                buyer_id = EXCLUDED.buyer_id,
                amount = EXCLUDED.amount,
                payment_method = EXCLUDED.payment_method,
                status = EXCLUDED.status
        """;
        OffsetDateTime created = payment.getCreatedAt() != null ? payment.getCreatedAt().atOffset(ZoneOffset.UTC) : OffsetDateTime.now(ZoneOffset.UTC);

        return pgPool.preparedQuery(sql)
                .execute(Tuple.wrap(java.util.Arrays.asList(
                        payment.getId(),
                        payment.getOrderId(),
                        payment.getBuyerId(),
                        payment.getAmount(),
                        payment.getPaymentMethod(),
                        payment.getStatus(),
                        created
                )))
                .map(rows -> payment)
                .convert().with(UniReactorConverters.toMono());
    }

    private PaymentEntity toEntity(Row row) {
        PaymentEntity p = new PaymentEntity();
        p.setId(row.getUUID("id"));
        p.setOrderId(row.getUUID("order_id"));
        p.setBuyerId(row.getUUID("buyer_id"));
        p.setAmount(row.getBigDecimal("amount"));
        p.setPaymentMethod(row.getString("payment_method"));
        p.setStatus(row.getString("status"));
        var created = row.getOffsetDateTime("created_at");
        if (created != null) p.setCreatedAt(created.toInstant());
        return p;
    }
}
