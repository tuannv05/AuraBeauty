package com.cosmetics.account.adapter.out.persistence;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface ShopRepository extends ReactiveCrudRepository<ShopEntity, UUID> {
    Flux<ShopEntity> findByOwnerId(UUID ownerId);
    Flux<ShopEntity> findByStatus(String status);
    Mono<Boolean> existsByShopName(String shopName);
}
