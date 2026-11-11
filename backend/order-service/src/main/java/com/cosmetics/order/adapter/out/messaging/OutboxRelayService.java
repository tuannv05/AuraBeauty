package com.cosmetics.order.adapter.out.messaging;

import com.cosmetics.common.outbox.OutboxMessage;
import com.cosmetics.order.adapter.out.persistence.QuarkusOutboxRepository;
import io.quarkus.scheduler.Scheduled;
import jakarta.enterprise.context.ApplicationScoped;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Mono;
import reactor.kafka.sender.KafkaSender;
import reactor.kafka.sender.SenderOptions;
import reactor.kafka.sender.SenderRecord;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@ApplicationScoped
public class OutboxRelayService {
    private static final Logger log = LoggerFactory.getLogger(OutboxRelayService.class);

    private final QuarkusOutboxRepository outboxRepository;
    private final KafkaSender<String, String> sender;

    public OutboxRelayService(
            QuarkusOutboxRepository outboxRepository,
            @ConfigProperty(name = "kafka.bootstrap.servers", defaultValue = "localhost:9092") String bootstrapServers
    ) {
        this.outboxRepository = outboxRepository;

        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.ACKS_CONFIG, "all");
        this.sender = KafkaSender.create(SenderOptions.create(props));
    }

    @Scheduled(every = "2s")
    public void pollAndSendOutbox() {
        try {
            outboxRepository.findPendingWithLock(50)
                    .flatMap(msg -> {
                        ProducerRecord<String, String> record = new ProducerRecord<>(msg.getTopic(), msg.getAggregateId(), msg.getPayload());
                        SenderRecord<String, String, OutboxMessage> senderRecord = SenderRecord.create(record, msg);

                        return sender.send(Mono.just(senderRecord))
                                .next()
                                .flatMap(result -> {
                                    msg.setStatus("SENT");
                                    msg.setSentAt(Instant.now());
                                    return outboxRepository.save(msg);
                                })
                                .onErrorResume(e -> {
                                    log.error("Failed to relay outbox message {}: ", msg.getId(), e);
                                    msg.setStatus("FAILED");
                                    return outboxRepository.save(msg);
                                });
                    })
                    .subscribe();
        } catch (Exception e) {
            log.warn("Outbox polling error: {}", e.getMessage());
        }
    }
}
