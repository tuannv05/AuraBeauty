package com.cosmetics.inventory.application;

import com.cosmetics.common.events.KafkaTopics;
import com.cosmetics.common.events.payloads.InventoryRejectedPayload;
import com.cosmetics.common.events.payloads.InventoryReservedPayload;
import com.cosmetics.common.events.payloads.OrderPlacedPayload;
import com.cosmetics.common.outbox.OutboxHelper;
import com.cosmetics.common.outbox.ProcessedEvent;
import com.cosmetics.common.outbox.ProcessedEventRepository;
import com.cosmetics.common.web.BusinessException;
import com.cosmetics.inventory.adapter.out.persistence.ReservationEntity;
import com.cosmetics.inventory.adapter.out.persistence.ReservationRepository;
import com.cosmetics.inventory.adapter.out.persistence.StockItemEntity;
import com.cosmetics.inventory.adapter.out.persistence.StockItemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class InventoryService {
    private static final Logger log = LoggerFactory.getLogger(InventoryService.class);

    private final StockItemRepository stockItemRepository;
    private final ReservationRepository reservationRepository;
    private final ProcessedEventRepository processedEventRepository;
    private final OutboxHelper outboxHelper;

    public InventoryService(
            StockItemRepository stockItemRepository,
            ReservationRepository reservationRepository,
            ProcessedEventRepository processedEventRepository,
            OutboxHelper outboxHelper
    ) {
        this.stockItemRepository = stockItemRepository;
        this.reservationRepository = reservationRepository;
        this.processedEventRepository = processedEventRepository;
        this.outboxHelper = outboxHelper;
    }

    public Mono<StockItemEntity> getStock(String skuCode) {
        return stockItemRepository.findById(skuCode)
                .switchIfEmpty(Mono.error(new BusinessException(HttpStatus.NOT_FOUND, "STOCK_NOT_FOUND", "SKU not found: " + skuCode)));
    }

    public Mono<StockItemEntity> updateOnHand(String skuCode, int onHand) {
        return stockItemRepository.findById(skuCode)
                .switchIfEmpty(Mono.error(new BusinessException(HttpStatus.NOT_FOUND, "STOCK_NOT_FOUND", "SKU not found: " + skuCode)))
                .flatMap(item -> {
                    item.setOnHand(onHand);
                    return stockItemRepository.save(item);
                });
    }

    @Transactional
    public Mono<Void> processOrderPlaced(UUID eventId, OrderPlacedPayload payload) {
        return processedEventRepository.existsById(eventId)
                .flatMap(processed -> {
                    if (Boolean.TRUE.equals(processed)) {
                        log.info("Event {} already processed, skipping idempotent consumer.", eventId);
                        return Mono.empty();
                    }
                    return executeReservation(payload)
                            .then(processedEventRepository.save(new ProcessedEvent(eventId, "OrderPlaced")))
                            .then();
                });
    }

    private Mono<Void> executeReservation(OrderPlacedPayload payload) {
        UUID orderId = payload.getOrderId();
        List<OrderPlacedPayload.ItemDto> items = payload.getItems();
        if (items == null || items.isEmpty()) {
            return outboxHelper.recordEvent(
                    KafkaTopics.INVENTORY_EVENTS,
                    "Inventory",
                    orderId.toString(),
                    "InventoryRejected",
                    new InventoryRejectedPayload(orderId, "Empty order items")
            ).then();
        }

        List<OrderPlacedPayload.ItemDto> successfullyReserved = new ArrayList<>();
        Instant expiresAt = Instant.now().plus(15, ChronoUnit.MINUTES);

        return Flux.fromIterable(items)
                .concatMap(item -> stockItemRepository.atomicReserve(item.getSkuCode(), item.getQuantity())
                        .flatMap(rowsUpdated -> {
                            if (rowsUpdated > 0) {
                                successfullyReserved.add(item);
                                return reservationRepository.save(new ReservationEntity(
                                        UUID.randomUUID(),
                                        orderId,
                                        item.getSkuCode(),
                                        item.getQuantity(),
                                        "ACTIVE",
                                        expiresAt
                                ));
                            } else {
                                return Mono.error(new RuntimeException("OUT_OF_STOCK:" + item.getSkuCode()));
                            }
                        }))
                .then(outboxHelper.recordEvent(
                        KafkaTopics.INVENTORY_EVENTS,
                        "Inventory",
                        orderId.toString(),
                        "InventoryReserved",
                        new InventoryReservedPayload(orderId, payload.getTotalAmount())
                ))
                .onErrorResume(err -> {
                    log.warn("Stock reservation failed for order {}: {}. Releasing partial reservations...", orderId, err.getMessage());
                    return Flux.fromIterable(successfullyReserved)
                            .flatMap(item -> stockItemRepository.atomicRelease(item.getSkuCode(), item.getQuantity()))
                            .then(reservationRepository.findByOrderId(orderId)
                                    .flatMap(r -> {
                                        r.setStatus("RELEASED");
                                        return reservationRepository.save(r);
                                    }).then())
                            .then(outboxHelper.recordEvent(
                                    KafkaTopics.INVENTORY_EVENTS,
                                    "Inventory",
                                    orderId.toString(),
                                    "InventoryRejected",
                                    new InventoryRejectedPayload(orderId, err.getMessage())
                            ));
                })
                .then();
    }

    @Transactional
    public Mono<Void> releaseOrderStock(UUID orderId, String reason) {
        log.info("Releasing stock for order {} reason: {}", orderId, reason);
        return reservationRepository.findByOrderIdAndStatus(orderId, "ACTIVE")
                .flatMap(r -> stockItemRepository.atomicRelease(r.getSkuCode(), r.getQuantity())
                        .then(Mono.defer(() -> {
                            r.setStatus("RELEASED");
                            return reservationRepository.save(r);
                        })))
                .then();
    }

    @Transactional
    public Mono<Void> confirmOrderStock(UUID orderId) {
        log.info("Confirming stock deduction for order {}", orderId);
        return reservationRepository.findByOrderIdAndStatus(orderId, "ACTIVE")
                .flatMap(r -> stockItemRepository.atomicDeduct(r.getSkuCode(), r.getQuantity())
                        .then(Mono.defer(() -> {
                            r.setStatus("CONFIRMED");
                            return reservationRepository.save(r);
                        })))
                .then();
    }
}
