package com.cosmetics.inventory.adapter.out.persistence;

import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface StockItemRepository extends ReactiveCrudRepository<StockItemEntity, String> {

    @Modifying
    @Query("UPDATE stock_items SET reserved = reserved + :qty WHERE sku_code = :skuCode AND (on_hand - reserved) >= :qty")
    Mono<Long> atomicReserve(String skuCode, int qty);

    @Modifying
    @Query("UPDATE stock_items SET reserved = reserved - :qty WHERE sku_code = :skuCode AND reserved >= :qty")
    Mono<Long> atomicRelease(String skuCode, int qty);

    @Modifying
    @Query("UPDATE stock_items SET on_hand = on_hand - :qty, reserved = reserved - :qty WHERE sku_code = :skuCode AND reserved >= :qty")
    Mono<Long> atomicDeduct(String skuCode, int qty);
}
