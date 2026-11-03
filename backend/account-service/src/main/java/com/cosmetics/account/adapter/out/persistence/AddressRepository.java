package com.cosmetics.account.adapter.out.persistence;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface AddressRepository extends ReactiveCrudRepository<AddressEntity, UUID> {
    Flux<AddressEntity> findAllByUserIdOrderByCreatedAtDesc(UUID userId);
    Mono<AddressEntity> findByUserIdAndIsDefaultTrue(UUID userId);
}
