package com.cosmetics.catalog.adapter.out.messaging;

import com.cosmetics.common.events.EventEnvelope;
import com.cosmetics.common.events.KafkaTopics;
import com.cosmetics.common.events.payloads.ProductPublishedPayload;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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

import java.util.HashMap;
import java.util.Map;

@ApplicationScoped
public class CatalogEventPublisher {
    private static final Logger log = LoggerFactory.getLogger(CatalogEventPublisher.class);
    private final KafkaSender<String, String> sender;
    private final ObjectMapper objectMapper;

    public CatalogEventPublisher(
            @ConfigProperty(name = "kafka.bootstrap.servers", defaultValue = "localhost:9092") String bootstrapServers,
            ObjectMapper objectMapper
    ) {
        this.objectMapper = objectMapper;
        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.ACKS_CONFIG, "all");
        this.sender = KafkaSender.create(SenderOptions.create(props));
    }

    public Mono<Void> publishProductPublished(ProductPublishedPayload payload) {
        try {
            EventEnvelope<ProductPublishedPayload> envelope = EventEnvelope.of(
                    "ProductPublished",
                    "Product",
                    payload.getProductId(),
                    payload
            );
            String json = objectMapper.writeValueAsString(envelope);
            ProducerRecord<String, String> record = new ProducerRecord<>(KafkaTopics.PRODUCT_EVENTS, payload.getProductId(), json);
            SenderRecord<String, String, String> senderRecord = SenderRecord.create(record, payload.getProductId());

            return sender.send(Mono.just(senderRecord))
                    .doOnNext(r -> log.info("Published ProductPublished event for productId: {}", payload.getProductId()))
                    .then();
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize ProductPublished event: ", e);
            return Mono.error(e);
        }
    }
}
