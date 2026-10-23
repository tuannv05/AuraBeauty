package com.cosmetics.order.adapter.out.messaging;

import com.cosmetics.common.outbox.OutboxMessage;
import com.cosmetics.common.outbox.OutboxRepository;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import reactor.kafka.sender.KafkaSender;
import reactor.kafka.sender.SenderOptions;
import reactor.kafka.sender.SenderRecord;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Component
@EnableScheduling
public class OutboxRelayService {
    private static final Logger log = LoggerFactory.getLogger(OutboxRelayService.class);

    private final OutboxRepository outboxRepository;
    private final KafkaSender<String, String> sender;

    public OutboxRelayService(
            OutboxRepository outboxRepository,
            @Value("${spring.kafka.bootstrap-servers:localhost:9092}") String bootstrapServers
    ) {
        this.outboxRepository = outboxRepository;

        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.ACKS_CONFIG, "all");
        this.sender = KafkaSender.create(SenderOptions.create(props));
    }

    @Scheduled(fixedDelay = 2000)
    public void pollAndSendOutbox() {
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
    }
}
