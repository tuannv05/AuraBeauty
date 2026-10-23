package com.cosmetics.order.adapter.out.persistence;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface CartItemRepository extends ReactiveCrudRepository<CartItemEntity, UUID> {
    Flux<CartItemEntity> findByBuyerId(UUID buyerId);
    Mono<CartItemEntity> findByBuyerIdAndSkuCode(UUID buyerId, String skuCode);
    Mono<Void> deleteByBuyerId(UUID buyerId);
}
