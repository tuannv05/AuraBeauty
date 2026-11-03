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
import jakarta.annotation.PostConstruct;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.kafka.receiver.KafkaReceiver;
import reactor.kafka.receiver.ReceiverOptions;
import reactor.kafka.receiver.ReceiverRecord;

import java.util.*;

@Component
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
            @Value("${spring.kafka.bootstrap-servers:localhost:9092}") String bootstrapServers
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

    @PostConstruct
    public void startListening() {
        ReceiverOptions<String, String> options = receiverOptions.subscription(List.of(
                KafkaTopics.ORDER_EVENTS,
                KafkaTopics.PRODUCT_EVENTS,
                KafkaTopics.PAYMENT_EVENTS
        ));

        KafkaReceiver.create(options).receive()
                .concatMap(this::handleRecord)
                .subscribe();
    }

    private Mono<Void> handleRecord(ReceiverRecord<String, String> record) {
        String topic = record.topic();
        String json = record.value();
        try {
            if (KafkaTopics.PRODUCT_EVENTS.equals(topic)) {
                EventEnvelope<ProductPublishedPayload> envelope = objectMapper.readValue(
                        json, new TypeReference<EventEnvelope<ProductPublishedPayload>>() {}
                );
                if ("ProductPublished".equals(envelope.getEventType()) && envelope.getPayload() != null) {
                    ProductPublishedPayload p = envelope.getPayload();
                    if (p.getVariants() != null) {
                        return Flux.fromIterable(p.getVariants())
                                .flatMap(v -> stockItemRepository.findById(v.getSkuCode())
                                        .switchIfEmpty(stockItemRepository.save(new StockItemEntity(
                                                v.getSkuCode(), p.getProductId(), p.getShopId(), 100, 0
                                        ))))
                                .then()
                                .doOnSuccess(v -> record.receiverOffset().acknowledge());
                    }
                }
            } else if (KafkaTopics.ORDER_EVENTS.equals(topic)) {
                EventEnvelope<OrderPlacedPayload> envelope = objectMapper.readValue(
                        json, new TypeReference<EventEnvelope<OrderPlacedPayload>>() {}
                );
                if ("OrderPlaced".equals(envelope.getEventType()) && envelope.getPayload() != null) {
                    return inventoryService.processOrderPlaced(envelope.getEventId(), envelope.getPayload())
                            .doOnSuccess(v -> record.receiverOffset().acknowledge());
                }
            } else if (KafkaTopics.PAYMENT_EVENTS.equals(topic)) {
                EventEnvelope<PaymentFailedPayload> envelope = objectMapper.readValue(
                        json, new TypeReference<EventEnvelope<PaymentFailedPayload>>() {}
                );
                if ("PaymentFailed".equals(envelope.getEventType()) && envelope.getPayload() != null) {
                    return inventoryService.releaseOrderStock(envelope.getPayload().getOrderId(), envelope.getPayload().getReason())
                            .doOnSuccess(v -> record.receiverOffset().acknowledge());
                } else if ("PaymentSucceeded".equals(envelope.getEventType())) {
                    EventEnvelope<Map<String, Object>> succEnvelope = objectMapper.readValue(
                            json, new TypeReference<EventEnvelope<Map<String, Object>>>() {}
                    );
                    UUID orderId = UUID.fromString((String) succEnvelope.getPayload().get("orderId"));
                    return inventoryService.confirmOrderStock(orderId)
                            .doOnSuccess(v -> record.receiverOffset().acknowledge());
                }
            }
        } catch (Exception e) {
            log.error("Error processing message from topic {}: ", topic, e);
        }
        record.receiverOffset().acknowledge();
        return Mono.empty();
    }
}
