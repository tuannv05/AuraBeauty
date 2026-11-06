package com.cosmetics.common.outbox;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.UUID;
import java.util.function.Supplier;

/**
 * Reactive Transactional Inbox (Idempotent Consumer) Implementation.
 * Prevents duplicate processing of Kafka messages & Payment Webhooks across all services.
 * 100% Non-Blocking Reactive Streams.
 */
@Component
public class TransactionalInbox {

    private static final Logger log = LoggerFactory.getLogger(TransactionalInbox.class);

    private final ProcessedEventRepository processedEventRepository;

    public TransactionalInbox(ProcessedEventRepository processedEventRepository) {
        this.processedEventRepository = processedEventRepository;
    }

    /**
     * Thực thi một tác vụ tiêu thụ sự kiện (Kafka/Webhook) một cách Idempotent:
     * Nếu eventId đã được ghi nhận xử lý trước đó, bỏ qua an toàn (No-Op).
     * Nếu chưa, thực thi nghiệp vụ và đánh dấu eventId vào bảng processed_events.
     */
    public <T> Mono<T> executeIdempotent(UUID eventId, String eventType, Supplier<Mono<T>> businessAction) {
        if (eventId == null) {
            return businessAction.get();
        }

        return processedEventRepository.existsById(eventId)
            .flatMap(alreadyProcessed -> {
                if (Boolean.TRUE.equals(alreadyProcessed)) {
                    log.warn("[IDEMPOTENCY HIT] Event {} (type: {}) already processed. Skipping safely.", eventId, eventType);
                    return Mono.empty();
                }

                return businessAction.get()
                    .flatMap(result ->
                        processedEventRepository.save(new ProcessedEvent(eventId, eventType))
                            .thenReturn(result)
                    )
                    .switchIfEmpty(
                        processedEventRepository.save(new ProcessedEvent(eventId, eventType))
                            .then(Mono.empty())
                    );
            });
    }
}
