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
public class CartItemRepository {
    private final PgPool pgPool;

    public CartItemRepository(PgPool pgPool) {
        this.pgPool = pgPool;
    }

    public Flux<CartItemEntity> findByBuyerId(UUID buyerId) {
        String sql = "SELECT id, buyer_id, shop_id, sku_code, product_name, shop_name, quantity, unit_price FROM cart_items WHERE buyer_id = $1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(buyerId))
                .onItem().transformToMulti(rows -> io.smallrye.mutiny.Multi.createFrom().iterable(rows))
                .map(this::toEntity)
                .convert().with(MultiReactorConverters.toFlux());
    }

    public Mono<CartItemEntity> findByBuyerIdAndSkuCode(UUID buyerId, String skuCode) {
        String sql = "SELECT id, buyer_id, shop_id, sku_code, product_name, shop_name, quantity, unit_price FROM cart_items WHERE buyer_id = $1 AND sku_code = $2 LIMIT 1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(buyerId, skuCode))
                .map(rows -> {
                    var it = rows.iterator();
                    return it.hasNext() ? toEntity(it.next()) : null;
                })
                .convert().with(UniReactorConverters.toMono());
    }

    public Mono<CartItemEntity> save(CartItemEntity item) {
        if (item.getId() == null) {
            item.setId(UUID.randomUUID());
        }
        String sql = """
            INSERT INTO cart_items (id, buyer_id, shop_id, sku_code, product_name, shop_name, quantity, unit_price)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (id) DO UPDATE SET
                quantity = EXCLUDED.quantity,
                unit_price = EXCLUDED.unit_price
        """;
        return pgPool.preparedQuery(sql)
                .execute(Tuple.wrap(Arrays.asList(
                        item.getId(),
                        item.getBuyerId(),
                        item.getShopId(),
                        item.getSkuCode(),
                        item.getProductName(),
                        item.getShopName(),
                        item.getQuantity(),
                        item.getUnitPrice()
                )))
                .map(rows -> item)
                .convert().with(UniReactorConverters.toMono());
    }

    public Mono<Void> delete(CartItemEntity item) {
        String sql = "DELETE FROM cart_items WHERE id = $1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(item.getId()))
                .replaceWithVoid()
                .convert().with(UniReactorConverters.toMono());
    }

    public Mono<Void> deleteByBuyerId(UUID buyerId) {
        String sql = "DELETE FROM cart_items WHERE buyer_id = $1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(buyerId))
                .replaceWithVoid()
                .convert().with(UniReactorConverters.toMono());
    }

    private CartItemEntity toEntity(Row row) {
        CartItemEntity c = new CartItemEntity();
        c.setId(row.getUUID("id"));
        c.setBuyerId(row.getUUID("buyer_id"));
        c.setShopId(row.getUUID("shop_id"));
        c.setSkuCode(row.getString("sku_code"));
        c.setProductName(row.getString("product_name"));
        c.setShopName(row.getString("shop_name"));
        c.setQuantity(row.getInteger("quantity"));
        c.setUnitPrice(row.getBigDecimal("unit_price"));
        return c;
    }
}
