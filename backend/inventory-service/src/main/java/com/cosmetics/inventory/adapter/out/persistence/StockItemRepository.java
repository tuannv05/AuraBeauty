package com.cosmetics.inventory.adapter.out.persistence;

import io.smallrye.mutiny.converters.uni.UniReactorConverters;
import io.vertx.mutiny.pgclient.PgPool;
import io.vertx.mutiny.sqlclient.Tuple;
import jakarta.enterprise.context.ApplicationScoped;
import reactor.core.publisher.Mono;

@ApplicationScoped
public class StockItemRepository {

    private final PgPool pgPool;

    public StockItemRepository(PgPool pgPool) {
        this.pgPool = pgPool;
    }

    public Mono<Long> atomicReserve(String skuCode, int qty) {
        String sql = "UPDATE stock_items SET reserved = reserved + $1 WHERE sku_code = $2 AND (on_hand - reserved) >= $1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(qty, skuCode))
                .map(rows -> (long) rows.rowCount())
                .convert().with(UniReactorConverters.toMono());
    }

    public Mono<Long> atomicRelease(String skuCode, int qty) {
        String sql = "UPDATE stock_items SET reserved = reserved - $1 WHERE sku_code = $2 AND reserved >= $1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(qty, skuCode))
                .map(rows -> (long) rows.rowCount())
                .convert().with(UniReactorConverters.toMono());
    }

    public Mono<Long> atomicDeduct(String skuCode, int qty) {
        String sql = "UPDATE stock_items SET on_hand = on_hand - $1, reserved = reserved - $1 WHERE sku_code = $2 AND reserved >= $1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(qty, skuCode))
                .map(rows -> (long) rows.rowCount())
                .convert().with(UniReactorConverters.toMono());
    }

    public Mono<StockItemEntity> findById(String skuCode) {
        String sql = "SELECT sku_code, product_id, shop_id, on_hand, reserved FROM stock_items WHERE sku_code = $1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(skuCode))
                .map(rows -> {
                    var it = rows.iterator();
                    if (!it.hasNext()) return null;
                    var row = it.next();
                    return new StockItemEntity(
                            row.getString("sku_code"),
                            row.getString("product_id"),
                            row.getUUID("shop_id"),
                            row.getInteger("on_hand"),
                            row.getInteger("reserved")
                    );
                })
                .convert().with(UniReactorConverters.toMono());
    }

    public Mono<StockItemEntity> save(StockItemEntity item) {
        String sql = "INSERT INTO stock_items (sku_code, product_id, shop_id, on_hand, reserved) VALUES ($1, $2, $3, $4, $5) " +
                     "ON CONFLICT (sku_code) DO UPDATE SET on_hand = $4, reserved = $5 RETURNING sku_code, product_id, shop_id, on_hand, reserved";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(item.getSkuCode(), item.getProductId(), item.getShopId(), item.getOnHand(), item.getReserved()))
                .map(rows -> item)
                .convert().with(UniReactorConverters.toMono());
    }
}
