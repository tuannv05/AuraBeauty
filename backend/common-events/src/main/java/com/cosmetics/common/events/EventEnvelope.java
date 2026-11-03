package com.cosmetics.common.events;

import java.time.Instant;
import java.util.UUID;

public class EventEnvelope<T> {
    private UUID eventId;
    private String eventType;
    private String aggregateType;
    private String aggregateId;
    private Instant occurredAt;
    private T payload;

    public EventEnvelope() {
        this.eventId = UUID.randomUUID();
        this.occurredAt = Instant.now();
    }

    public EventEnvelope(String eventType, String aggregateType, String aggregateId, T payload) {
        this.eventId = UUID.randomUUID();
        this.eventType = eventType;
        this.aggregateType = aggregateType;
        this.aggregateId = aggregateId;
        this.occurredAt = Instant.now();
        this.payload = payload;
    }

    public static <T> EventEnvelope<T> of(String eventType, String aggregateType, String aggregateId, T payload) {
        return new EventEnvelope<>(eventType, aggregateType, aggregateId, payload);
    }

    public UUID getEventId() { return eventId; }
    public void setEventId(UUID eventId) { this.eventId = eventId; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public String getAggregateType() { return aggregateType; }
    public void setAggregateType(String aggregateType) { this.aggregateType = aggregateType; }
    public String getAggregateId() { return aggregateId; }
    public void setAggregateId(String aggregateId) { this.aggregateId = aggregateId; }
    public Instant getOccurredAt() { return occurredAt; }
    public void setOccurredAt(Instant occurredAt) { this.occurredAt = occurredAt; }
    public T getPayload() { return payload; }
    public void setPayload(T payload) { this.payload = payload; }
}
