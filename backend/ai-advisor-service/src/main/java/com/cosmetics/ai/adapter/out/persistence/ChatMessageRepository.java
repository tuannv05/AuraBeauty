package com.cosmetics.ai.adapter.out.persistence;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

import java.util.UUID;

public interface ChatMessageRepository extends ReactiveCrudRepository<ChatMessageEntity, UUID> {
    Flux<ChatMessageEntity> findByConversationIdOrderByCreatedAtAsc(UUID conversationId);
}
