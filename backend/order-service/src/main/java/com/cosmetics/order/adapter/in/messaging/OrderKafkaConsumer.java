package com.cosmetics.order.adapter.in.messaging;

import com.cosmetics.common.events.EventEnvelope;
import com.cosmetics.common.events.KafkaTopics;
import com.cosmetics.common.events.payloads.InventoryRejectedPayload;
import com.cosmetics.common.events.payloads.InventoryReservedPayload;
import com.cosmetics.common.events.payloads.PaymentFailedPayload;
import com.cosmetics.common.events.payloads.PaymentSucceededPayload;
import com.cosmetics.order.application.OrderService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import reactor.kafka.receiver.KafkaReceiver;
import reactor.kafka.receiver.ReceiverOptions;
import reactor.kafka.receiver.ReceiverRecord;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class OrderKafkaConsumer {
    private static final Logger log = LoggerFactory.getLogger(OrderKafkaConsumer.class);

    private final OrderService orderService;
    private final ObjectMapper objectMapper;
    private final ReceiverOptions<String, String> receiverOptions;

    public OrderKafkaConsumer(
            OrderService orderService,
            ObjectMapper objectMapper,
            @Value("${spring.kafka.bootstrap-servers:localhost:9092}") String bootstrapServers
    ) {
        this.orderService = orderService;
        this.objectMapper = objectMapper;

        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "order-group");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        this.receiverOptions = ReceiverOptions.create(props);
    }

    @PostConstruct
    public void startListening() {
        ReceiverOptions<String, String> options = receiverOptions.subscription(List.of(
                KafkaTopics.INVENTORY_EVENTS,
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
            if (KafkaTopics.INVENTORY_EVENTS.equals(topic)) {
                if (json.contains("\"InventoryReserved\"")) {
                    EventEnvelope<InventoryReservedPayload> envelope = objectMapper.readValue(
                            json, new TypeReference<EventEnvelope<InventoryReservedPayload>>() {}
                    );
                    return orderService.handleInventoryReserved(envelope.getEventId(), envelope.getPayload().getOrderId())
                            .doOnSuccess(v -> record.receiverOffset().acknowledge());
                } else if (json.contains("\"InventoryRejected\"")) {
                    EventEnvelope<InventoryRejectedPayload> envelope = objectMapper.readValue(
                            json, new TypeReference<EventEnvelope<InventoryRejectedPayload>>() {}
                    );
                    return orderService.handleInventoryRejected(envelope.getEventId(), envelope.getPayload().getOrderId(), envelope.getPayload().getReason())
                            .doOnSuccess(v -> record.receiverOffset().acknowledge());
                }
            } else if (KafkaTopics.PAYMENT_EVENTS.equals(topic)) {
                if (json.contains("\"PaymentSucceeded\"")) {
                    EventEnvelope<PaymentSucceededPayload> envelope = objectMapper.readValue(
                            json, new TypeReference<EventEnvelope<PaymentSucceededPayload>>() {}
                    );
                    return orderService.handlePaymentSucceeded(envelope.getEventId(), envelope.getPayload().getOrderId())
                            .doOnSuccess(v -> record.receiverOffset().acknowledge());
                } else if (json.contains("\"PaymentFailed\"")) {
                    EventEnvelope<PaymentFailedPayload> envelope = objectMapper.readValue(
                            json, new TypeReference<EventEnvelope<PaymentFailedPayload>>() {}
                    );
                    return orderService.handlePaymentFailed(envelope.getEventId(), envelope.getPayload().getOrderId(), envelope.getPayload().getReason())
                            .doOnSuccess(v -> record.receiverOffset().acknowledge());
                }
            }
        } catch (Exception e) {
            log.error("Error processing record in OrderKafkaConsumer: ", e);
        }
        record.receiverOffset().acknowledge();
        return Mono.empty();
    }
}
