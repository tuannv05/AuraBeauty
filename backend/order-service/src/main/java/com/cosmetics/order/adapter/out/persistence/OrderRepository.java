package com.cosmetics.order.adapter.out.persistence;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

import java.util.UUID;

public interface OrderRepository extends ReactiveCrudRepository<OrderEntity, UUID> {
    Flux<OrderEntity> findByBuyerIdOrderByCreatedAtDesc(UUID buyerId);
}
