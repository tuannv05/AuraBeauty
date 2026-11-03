package com.cosmetics.payment.adapter.out.persistence;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface PaymentRepository extends ReactiveCrudRepository<PaymentEntity, UUID> {
    Mono<PaymentEntity> findByOrderId(UUID orderId);
}
