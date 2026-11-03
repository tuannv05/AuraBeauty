package com.cosmetics.order.adapter.out.persistence;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

import java.util.UUID;

public interface OrderLineRepository extends ReactiveCrudRepository<OrderLineEntity, UUID> {
    Flux<OrderLineEntity> findBySubOrderId(UUID subOrderId);
}
