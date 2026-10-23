package com.cosmetics.common.outbox;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import java.util.UUID;

public interface ProcessedEventRepository extends ReactiveCrudRepository<ProcessedEvent, UUID> {
}
