package com.cosmetics.payment.application;

import com.cosmetics.common.events.KafkaTopics;
import com.cosmetics.common.events.payloads.PaymentFailedPayload;
import com.cosmetics.common.events.payloads.PaymentSucceededPayload;
import com.cosmetics.common.outbox.OutboxHelper;
import com.cosmetics.common.outbox.ProcessedEvent;
import com.cosmetics.common.outbox.ProcessedEventRepository;
import com.cosmetics.common.web.BusinessException;
import com.cosmetics.payment.adapter.out.persistence.LedgerEntryEntity;
import com.cosmetics.payment.adapter.out.persistence.LedgerEntryRepository;
import com.cosmetics.payment.adapter.out.persistence.PaymentEntity;
import com.cosmetics.payment.adapter.out.persistence.PaymentRepository;
import com.cosmetics.payment.domain.AccountType;
import com.cosmetics.payment.domain.EntryType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class PaymentService {
    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final LedgerEntryRepository ledgerEntryRepository;
    private final ProcessedEventRepository processedEventRepository;
    private final OutboxHelper outboxHelper;

    public PaymentService(
            PaymentRepository paymentRepository,
            LedgerEntryRepository ledgerEntryRepository,
            ProcessedEventRepository processedEventRepository,
            OutboxHelper outboxHelper
    ) {
        this.paymentRepository = paymentRepository;
        this.ledgerEntryRepository = ledgerEntryRepository;
        this.processedEventRepository = processedEventRepository;
        this.outboxHelper = outboxHelper;
    }

    public Mono<PaymentEntity> getPaymentByOrderId(UUID orderId) {
        return paymentRepository.findByOrderId(orderId)
                .switchIfEmpty(Mono.error(new BusinessException(HttpStatus.NOT_FOUND, "PAYMENT_NOT_FOUND", "Payment not found for order: " + orderId)));
    }

    @Transactional
    public Mono<PaymentEntity> initPendingPayment(UUID orderId, BigDecimal amount) {
        return paymentRepository.findByOrderId(orderId)
                .flatMap(existing -> {
                    existing.setAmount(amount);
                    existing.setStatus("PENDING");
                    return paymentRepository.save(existing);
                })
                .switchIfEmpty(Mono.defer(() -> {
                    PaymentEntity p = new PaymentEntity(UUID.randomUUID(), orderId, UUID.randomUUID(), amount, "MOCK_GATEWAY", "PENDING");
                    return paymentRepository.save(p);
                }));
    }

    @Transactional
    public Mono<PaymentEntity> mockPay(UUID orderId, boolean success) {
        return paymentRepository.findByOrderId(orderId)
                .switchIfEmpty(Mono.defer(() -> {
                    // Create payment if not created by event yet
                    PaymentEntity p = new PaymentEntity(UUID.randomUUID(), orderId, UUID.randomUUID(), BigDecimal.valueOf(500000), "MOCK_GATEWAY", "PENDING");
                    return paymentRepository.save(p);
                }))
                .flatMap(payment -> {
                    if (success) {
                        payment.setStatus("SUCCESS");
                        LedgerEntryEntity entry = new LedgerEntryEntity(
                                UUID.randomUUID(),
                                payment.getId(),
                                AccountType.BUYER_ACCOUNT.name(),
                                AccountType.ESCROW_HOLDING.name(),
                                payment.getAmount(),
                                EntryType.ORDER_PAYMENT.name(),
                                "Buyer payment received into Escrow for Order " + orderId
                        );

                        return paymentRepository.save(payment)
                                .then(ledgerEntryRepository.save(entry))
                                .then(outboxHelper.recordEvent(
                                        KafkaTopics.PAYMENT_EVENTS,
                                        "Payment",
                                        payment.getId().toString(),
                                        "PaymentSucceeded",
                                        new PaymentSucceededPayload(payment.getId(), orderId, payment.getAmount())
                                ))
                                .thenReturn(payment);
                    } else {
                        payment.setStatus("FAILED");
                        return paymentRepository.save(payment)
                                .then(outboxHelper.recordEvent(
                                        KafkaTopics.PAYMENT_EVENTS,
                                        "Payment",
                                        payment.getId().toString(),
                                        "PaymentFailed",
                                        new PaymentFailedPayload(orderId, "Mock payment rejected by user or card declined")
                                ))
                                .thenReturn(payment);
                    }
                });
    }

    @Transactional
    public Mono<Void> handleSubOrderDelivered(UUID eventId, UUID subOrderId, UUID orderId, UUID shopId, BigDecimal subTotal) {
        return processedEventRepository.existsById(eventId)
                .flatMap(exists -> {
                    if (Boolean.TRUE.equals(exists)) return Mono.empty();

                    BigDecimal commissionRate = BigDecimal.valueOf(0.10); // 10%
                    BigDecimal commissionAmount = subTotal.multiply(commissionRate).setScale(2, RoundingMode.HALF_UP);
                    BigDecimal sellerPayout = subTotal.subtract(commissionAmount);

                    LedgerEntryEntity commissionEntry = new LedgerEntryEntity(
                            UUID.randomUUID(),
                            subOrderId,
                            AccountType.ESCROW_HOLDING.name(),
                            AccountType.PLATFORM_REVENUE.name(),
                            commissionAmount,
                            EntryType.COMMISSION_FEE.name(),
                            "10% Platform commission on delivered SubOrder " + subOrderId
                    );

                    LedgerEntryEntity payoutEntry = new LedgerEntryEntity(
                            UUID.randomUUID(),
                            subOrderId,
                            AccountType.ESCROW_HOLDING.name(),
                            AccountType.SELLER_PAYABLE.name(),
                            sellerPayout,
                            EntryType.SELLER_PAYOUT.name(),
                            "90% Seller payout for Shop " + shopId + " on delivered SubOrder " + subOrderId
                    );

                    return ledgerEntryRepository.saveAll(List.of(commissionEntry, payoutEntry))
                            .then(processedEventRepository.save(new ProcessedEvent(eventId, "SubOrderDelivered")))
                            .then();
                });
    }

    @Transactional
    public Mono<Void> handleSubOrderRejected(UUID eventId, UUID subOrderId, UUID orderId, UUID shopId, BigDecimal subTotal, String reason) {
        return processedEventRepository.existsById(eventId)
                .flatMap(exists -> {
                    if (Boolean.TRUE.equals(exists)) return Mono.empty();

                    LedgerEntryEntity refundEntry = new LedgerEntryEntity(
                            UUID.randomUUID(),
                            subOrderId,
                            AccountType.ESCROW_HOLDING.name(),
                            AccountType.BUYER_ACCOUNT.name(),
                            subTotal,
                            EntryType.REFUND.name(),
                            "Refund to buyer for rejected SubOrder " + subOrderId + ": " + reason
                    );

                    return ledgerEntryRepository.save(refundEntry)
                            .then(processedEventRepository.save(new ProcessedEvent(eventId, "SubOrderRejected")))
                            .then();
                });
    }

    public Flux<LedgerEntryEntity> getAllLedgerEntries() {
        return ledgerEntryRepository.findAllByOrderByRecordedAtDesc();
    }

    public Mono<Map<String, Object>> getAccountingSummary() {
        return Mono.zip(
                ledgerEntryRepository.sumPlatformRevenue(),
                ledgerEntryRepository.sumSellerPayable(),
                ledgerEntryRepository.count()
        ).map(tuple -> Map.of(
                "totalPlatformRevenue", tuple.getT1(),
                "totalSellerPayable", tuple.getT2(),
                "totalLedgerEntries", tuple.getT3()
        ));
    }
}
