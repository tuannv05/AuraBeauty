package com.cosmetics.common.outbox;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import java.util.UUID;

public interface OutboxRepository extends ReactiveCrudRepository<OutboxMessage, UUID> {
    @Query("SELECT * FROM outbox_messages WHERE status = 'PENDING' ORDER BY created_at ASC LIMIT :limit FOR UPDATE SKIP LOCKED")
    Flux<OutboxMessage> findPendingWithLock(int limit);
}
