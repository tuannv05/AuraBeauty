package com.cosmetics.order.adapter.out.persistence;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

import java.util.UUID;

public interface SubOrderRepository extends ReactiveCrudRepository<SubOrderEntity, UUID> {
    Flux<SubOrderEntity> findByOrderId(UUID orderId);
    Flux<SubOrderEntity> findByShopIdOrderByCreatedAtDesc(UUID shopId);
}
