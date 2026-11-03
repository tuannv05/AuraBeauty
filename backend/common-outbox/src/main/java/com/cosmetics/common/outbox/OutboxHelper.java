package com.cosmetics.common.outbox;

import com.cosmetics.common.events.EventEnvelope;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class OutboxHelper {
    private final OutboxRepository outboxRepository;
    private final ObjectMapper objectMapper;

    public OutboxHelper(OutboxRepository outboxRepository, ObjectMapper objectMapper) {
        this.outboxRepository = outboxRepository;
        this.objectMapper = objectMapper;
    }

    public <T> Mono<OutboxMessage> recordEvent(String topic, String aggregateType, String aggregateId, String eventType, T payload) {
        EventEnvelope<T> envelope = EventEnvelope.of(eventType, aggregateType, aggregateId, payload);
        try {
            String json = objectMapper.writeValueAsString(envelope);
            OutboxMessage msg = new OutboxMessage(envelope.getEventId(), aggregateType, aggregateId, eventType, topic, json);
            return outboxRepository.save(msg);
        } catch (JsonProcessingException e) {
            return Mono.error(new RuntimeException("Failed to serialize event payload to JSON", e));
        }
    }
}
