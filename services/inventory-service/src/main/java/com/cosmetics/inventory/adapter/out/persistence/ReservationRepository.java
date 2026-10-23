package com.cosmetics.inventory.adapter.out.persistence;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

import java.util.UUID;

public interface ReservationRepository extends ReactiveCrudRepository<ReservationEntity, UUID> {
    Flux<ReservationEntity> findByOrderId(UUID orderId);
    Flux<ReservationEntity> findByOrderIdAndStatus(UUID orderId, String status);
}
