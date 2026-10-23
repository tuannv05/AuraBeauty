package com.cosmetics.account.adapter.out.persistence;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import java.util.UUID;

public interface SkinProfileRepository extends ReactiveCrudRepository<SkinProfileEntity, UUID> {
}
