package com.cosmetics.inventory.adapter.in.messaging;

import com.cosmetics.common.events.EventEnvelope;
import com.cosmetics.common.events.KafkaTopics;
import com.cosmetics.common.events.payloads.OrderPlacedPayload;
import com.cosmetics.common.events.payloads.PaymentFailedPayload;
import com.cosmetics.common.events.payloads.ProductPublishedPayload;
import com.cosmetics.common.events.payloads.ReleaseStockPayload;
import com.cosmetics.inventory.adapter.out.persistence.StockItemEntity;
import com.cosmetics.inventory.adapter.out.persistence.StockItemRepository;
import com.cosmetics.inventory.application.InventoryService;
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
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.kafka.receiver.KafkaReceiver;
import reactor.kafka.receiver.ReceiverOptions;
import reactor.kafka.receiver.ReceiverRecord;

import java.util.*;

@ApplicationScoped
public class InventoryKafkaConsumer {
    private static final Logger log = LoggerFactory.getLogger(InventoryKafkaConsumer.class);

    private final InventoryService inventoryService;
    private final StockItemRepository stockItemRepository;
    private final ObjectMapper objectMapper;
    private final ReceiverOptions<String, String> receiverOptions;

    public InventoryKafkaConsumer(
            InventoryService inventoryService,
            StockItemRepository stockItemRepository,
            ObjectMapper objectMapper,
            @ConfigProperty(name = "kafka.bootstrap.servers", defaultValue = "localhost:9092") String bootstrapServers
    ) {
        this.inventoryService = inventoryService;
        this.stockItemRepository = stockItemRepository;
        this.objectMapper = objectMapper;

        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "inventory-group");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        this.receiverOptions = ReceiverOptions.create(props);
    }

    void onStart(@Observes StartupEvent ev) {
        startListening();
    }

    public void startListening() {
        ReceiverOptions<String, String> options = receiverOptions.subscription(List.of(
                KafkaTopics.ORDER_EVENTS,
                KafkaTopics.PAYMENT_EVENTS,
                KafkaTopics.PRODUCT_EVENTS,
                KafkaTopics.INVENTORY_EVENTS
        ));

        KafkaReceiver.create(options)
                .receive()
                .flatMap(this::handleRecord)
                .onErrorContinue((err, obj) -> log.error("Error processing inventory kafka record: ", err))
                .subscribe();
    }

    private Mono<Void> handleRecord(ReceiverRecord<String, String> record) {
        String json = record.value();
        String topic = record.topic();

        return Mono.fromCallable(() -> objectMapper.readTree(json))
                .flatMap(node -> {
                    String eventType = node.has("eventType") ? node.get("eventType").asText() : "";
                    UUID eventId = node.has("eventId") ? UUID.fromString(node.get("eventId").asText()) : UUID.randomUUID();

                    if ("OrderPlaced".equalsIgnoreCase(eventType)) {
                        EventEnvelope<OrderPlacedPayload> envelope = objectMapper.convertValue(
                                node,
                                new TypeReference<EventEnvelope<OrderPlacedPayload>>() {}
                        );
                        return inventoryService.processOrderPlaced(eventId, envelope.getPayload());
                    } else if ("PaymentFailed".equalsIgnoreCase(eventType)) {
                        EventEnvelope<PaymentFailedPayload> envelope = objectMapper.convertValue(
                                node,
                                new TypeReference<EventEnvelope<PaymentFailedPayload>>() {}
                        );
                        return inventoryService.releaseOrderStock(envelope.getPayload().getOrderId(), "Payment Failed");
                    } else if ("ReleaseStock".equalsIgnoreCase(eventType)) {
                        EventEnvelope<ReleaseStockPayload> envelope = objectMapper.convertValue(
                                node,
                                new TypeReference<EventEnvelope<ReleaseStockPayload>>() {}
                        );
                        return inventoryService.releaseOrderStock(envelope.getPayload().getOrderId(), envelope.getPayload().getReason());
                    } else if ("ProductPublished".equalsIgnoreCase(eventType)) {
                        EventEnvelope<ProductPublishedPayload> envelope = objectMapper.convertValue(
                                node,
                                new TypeReference<EventEnvelope<ProductPublishedPayload>>() {}
                        );
                        ProductPublishedPayload p = envelope.getPayload();
                        if (p.getVariants() != null) {
                            return Flux.fromIterable(p.getVariants())
                                    .flatMap(v -> stockItemRepository.save(new StockItemEntity(
                                            v.getSkuCode(),
                                            p.getProductId(),
                                            p.getShopId(),
                                            100,
                                            0
                                    )))
                                    .then();
                        }
                    }
                    return Mono.empty();
                })
                .doOnSuccess(v -> record.receiverOffset().acknowledge())
                .doOnError(err -> log.error("Failed to handle event from topic {}: {}", topic, err.getMessage()))
                .then();
    }
}
