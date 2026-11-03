package com.cosmetics.payment.adapter.in.messaging;

import com.cosmetics.common.events.EventEnvelope;
import com.cosmetics.common.events.KafkaTopics;
import com.cosmetics.common.events.payloads.InventoryReservedPayload;
import com.cosmetics.payment.application.PaymentService;
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

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
public class PaymentKafkaConsumer {
    private static final Logger log = LoggerFactory.getLogger(PaymentKafkaConsumer.class);

    private final PaymentService paymentService;
    private final ObjectMapper objectMapper;
    private final ReceiverOptions<String, String> receiverOptions;

    public PaymentKafkaConsumer(
            PaymentService paymentService,
            ObjectMapper objectMapper,
            @Value("${spring.kafka.bootstrap-servers:localhost:9092}") String bootstrapServers
    ) {
        this.paymentService = paymentService;
        this.objectMapper = objectMapper;

        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "payment-group");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        this.receiverOptions = ReceiverOptions.create(props);
    }

    @PostConstruct
    public void startListening() {
        ReceiverOptions<String, String> options = receiverOptions.subscription(List.of(
                KafkaTopics.INVENTORY_EVENTS,
                KafkaTopics.ORDER_EVENTS
        ));

        KafkaReceiver.create(options).receive()
                .concatMap(this::handleRecord)
                .subscribe();
    }

    private Mono<Void> handleRecord(ReceiverRecord<String, String> record) {
        String topic = record.topic();
        String json = record.value();

        try {
            if (KafkaTopics.INVENTORY_EVENTS.equals(topic) && json.contains("\"InventoryReserved\"")) {
                EventEnvelope<InventoryReservedPayload> envelope = objectMapper.readValue(
                        json, new TypeReference<EventEnvelope<InventoryReservedPayload>>() {}
                );
                return paymentService.initPendingPayment(envelope.getPayload().getOrderId(), envelope.getPayload().getTotalAmount())
                        .then()
                        .doOnSuccess(v -> record.receiverOffset().acknowledge());
            } else if (KafkaTopics.ORDER_EVENTS.equals(topic)) {
                if (json.contains("\"SubOrderDelivered\"")) {
                    EventEnvelope<Map<String, Object>> envelope = objectMapper.readValue(
                            json, new TypeReference<EventEnvelope<Map<String, Object>>>() {}
                    );
                    Map<String, Object> payload = envelope.getPayload();
                    UUID subOrderId = UUID.fromString((String) payload.get("subOrderId"));
                    UUID orderId = UUID.fromString((String) payload.get("orderId"));
                    UUID shopId = UUID.fromString((String) payload.get("shopId"));
                    BigDecimal subTotal = new BigDecimal(payload.get("subTotal").toString());

                    return paymentService.handleSubOrderDelivered(envelope.getEventId(), subOrderId, orderId, shopId, subTotal)
                            .doOnSuccess(v -> record.receiverOffset().acknowledge());
                } else if (json.contains("\"SubOrderRejected\"")) {
                    EventEnvelope<Map<String, Object>> envelope = objectMapper.readValue(
                            json, new TypeReference<EventEnvelope<Map<String, Object>>>() {}
                    );
                    Map<String, Object> payload = envelope.getPayload();
                    UUID subOrderId = UUID.fromString((String) payload.get("subOrderId"));
                    UUID orderId = UUID.fromString((String) payload.get("orderId"));
                    UUID shopId = UUID.fromString((String) payload.get("shopId"));
                    BigDecimal subTotal = new BigDecimal(payload.get("subTotal").toString());
                    String reason = (String) payload.getOrDefault("reason", "Cancelled");

                    return paymentService.handleSubOrderRejected(envelope.getEventId(), subOrderId, orderId, shopId, subTotal, reason)
                            .doOnSuccess(v -> record.receiverOffset().acknowledge());
                }
            }
        } catch (Exception e) {
            log.error("Error processing record in PaymentKafkaConsumer: ", e);
        }
        record.receiverOffset().acknowledge();
        return Mono.empty();
    }
}
