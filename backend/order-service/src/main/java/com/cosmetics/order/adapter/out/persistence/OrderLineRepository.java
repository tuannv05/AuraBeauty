package com.cosmetics.order.adapter.out.persistence;

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
public class OrderLineRepository {
    private final PgPool pgPool;

    public OrderLineRepository(PgPool pgPool) {
        this.pgPool = pgPool;
    }

    public Flux<OrderLineEntity> findBySubOrderId(UUID subOrderId) {
        String sql = "SELECT id, sub_order_id, sku_code, product_name, quantity, unit_price, line_total FROM order_lines WHERE sub_order_id = $1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(subOrderId))
                .onItem().transformToMulti(rows -> io.smallrye.mutiny.Multi.createFrom().iterable(rows))
                .map(this::toEntity)
                .convert().with(MultiReactorConverters.toFlux());
    }

    public Mono<OrderLineEntity> save(OrderLineEntity line) {
        if (line.getId() == null) {
            line.setId(UUID.randomUUID());
        }
        String sql = """
            INSERT INTO order_lines (id, sub_order_id, sku_code, product_name, quantity, unit_price, line_total)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) DO UPDATE SET
                sub_order_id = EXCLUDED.sub_order_id,
                sku_code = EXCLUDED.sku_code,
                product_name = EXCLUDED.product_name,
                quantity = EXCLUDED.quantity,
                unit_price = EXCLUDED.unit_price,
                line_total = EXCLUDED.line_total
        """;
        return pgPool.preparedQuery(sql)
                .execute(Tuple.wrap(Arrays.asList(
                        line.getId(),
                        line.getSubOrderId(),
                        line.getSkuCode(),
                        line.getProductName(),
                        line.getQuantity(),
                        line.getUnitPrice(),
                        line.getLineTotal()
                )))
                .map(rows -> line)
                .convert().with(UniReactorConverters.toMono());
    }

    public Flux<OrderLineEntity> saveAll(Iterable<OrderLineEntity> lines) {
        return Flux.fromIterable(lines).flatMap(this::save);
    }

    private OrderLineEntity toEntity(Row row) {
        OrderLineEntity l = new OrderLineEntity();
        l.setId(row.getUUID("id"));
        l.setSubOrderId(row.getUUID("sub_order_id"));
        l.setSkuCode(row.getString("sku_code"));
        l.setProductName(row.getString("product_name"));
        l.setQuantity(row.getInteger("quantity"));
        l.setUnitPrice(row.getBigDecimal("unit_price"));
        l.setLineTotal(row.getBigDecimal("line_total"));
        return l;
    }
}
