package com.cosmetics.ai.adapter.in.messaging;

import com.cosmetics.ai.application.AiAdvisorService;
import com.cosmetics.common.events.EventEnvelope;
import com.cosmetics.common.events.KafkaTopics;
import com.cosmetics.common.events.payloads.ProductPublishedPayload;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Mono;
import reactor.kafka.receiver.KafkaReceiver;
import reactor.kafka.receiver.ReceiverOptions;
import reactor.kafka.receiver.ReceiverRecord;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class AiKafkaConsumer {
    private static final Logger log = LoggerFactory.getLogger(AiKafkaConsumer.class);

    private final AiAdvisorService advisorService;
    private final ObjectMapper objectMapper;
    private final ReceiverOptions<String, String> receiverOptions;

    public AiKafkaConsumer(
            AiAdvisorService advisorService,
            ObjectMapper objectMapper,
            @ConfigProperty(name = "kafka.bootstrap.servers", defaultValue = "localhost:9092") String bootstrapServers
    ) {
        this.advisorService = advisorService;
        this.objectMapper = objectMapper;

        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "ai-advisor-group");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        this.receiverOptions = ReceiverOptions.create(props);
    }

    void onStart(@Observes StartupEvent ev) {
        try {
            ReceiverOptions<String, String> options = receiverOptions.subscription(List.of(KafkaTopics.PRODUCT_EVENTS));

            KafkaReceiver.create(options).receive()
                    .concatMap(this::handleRecord)
                    .subscribe();
        } catch (Exception e) {
            log.warn("Kafka subscription not started in AiKafkaConsumer: {}", e.getMessage());
        }
    }

    private Mono<Void> handleRecord(ReceiverRecord<String, String> record) {
        String json = record.value();
        try {
            EventEnvelope<ProductPublishedPayload> envelope = objectMapper.readValue(
                    json, new TypeReference<EventEnvelope<ProductPublishedPayload>>() {}
            );
            if ("ProductPublished".equals(envelope.getEventType()) && envelope.getPayload() != null) {
                log.info("Indexing product into AI vector store: {}", envelope.getPayload().getName());
                return advisorService.indexProduct(envelope.getPayload())
                        .doOnSuccess(v -> record.receiverOffset().acknowledge());
            }
        } catch (Exception e) {
            log.error("Failed to parse ProductPublished event in AI advisor: ", e);
        }
        record.receiverOffset().acknowledge();
        return Mono.empty();
    }
}
