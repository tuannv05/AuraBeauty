package com.cosmetics.payment.application;

import com.cosmetics.common.events.KafkaTopics;
import com.cosmetics.common.events.payloads.PaymentFailedPayload;
import com.cosmetics.common.events.payloads.PaymentSucceededPayload;
import com.cosmetics.common.outbox.ProcessedEvent;
import com.cosmetics.common.web.BusinessException;
import com.cosmetics.payment.adapter.out.persistence.LedgerEntryEntity;
import com.cosmetics.payment.adapter.out.persistence.LedgerEntryRepository;
import com.cosmetics.payment.adapter.out.persistence.PaymentEntity;
import com.cosmetics.payment.adapter.out.persistence.PaymentRepository;
import com.cosmetics.payment.adapter.out.persistence.QuarkusOutboxHelper;
import com.cosmetics.payment.adapter.out.persistence.QuarkusProcessedEventRepository;
import com.cosmetics.payment.domain.AccountType;
import com.cosmetics.payment.domain.EntryType;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@ApplicationScoped
public class PaymentService {
    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final LedgerEntryRepository ledgerEntryRepository;
    private final QuarkusProcessedEventRepository processedEventRepository;
    private final QuarkusOutboxHelper outboxHelper;

    public PaymentService(
            PaymentRepository paymentRepository,
            LedgerEntryRepository ledgerEntryRepository,
            QuarkusProcessedEventRepository processedEventRepository,
            QuarkusOutboxHelper outboxHelper
    ) {
        this.paymentRepository = paymentRepository;
        this.ledgerEntryRepository = ledgerEntryRepository;
        this.processedEventRepository = processedEventRepository;
        this.outboxHelper = outboxHelper;
    }

    public Mono<PaymentEntity> getPaymentByOrderId(UUID orderId) {
        return paymentRepository.findByOrderId(orderId)
                .switchIfEmpty(Mono.error(new BusinessException(404, "PAYMENT_NOT_FOUND", "Payment not found for order: " + orderId)));
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

    @Transactional
    public Mono<Map<String, Object>> processWebhook(String gateway, Map<String, Object> payload) {
        if (payload == null) payload = Map.of();
        String orderIdStr = payload.get("orderId") != null ? String.valueOf(payload.get("orderId")) : null;
        if (orderIdStr == null && payload.get("extraData") != null) {
            orderIdStr = String.valueOf(payload.get("extraData"));
        }
        if (orderIdStr == null) {
            return Mono.error(new BusinessException(400, "MISSING_ORDER_ID", "orderId is required in webhook payload"));
        }

        UUID orderId;
        try {
            orderId = UUID.fromString(orderIdStr.replace("AURA-", "").replace("AURA ", "").trim());
        } catch (IllegalArgumentException e) {
            orderId = UUID.nameUUIDFromBytes(orderIdStr.getBytes());
        }

        boolean isSuccess = true;
        if (payload.get("resultCode") != null) {
            isSuccess = "0".equals(String.valueOf(payload.get("resultCode")));
        } else if (payload.get("status") != null) {
            String status = String.valueOf(payload.get("status")).toUpperCase();
            isSuccess = "SUCCESS".equals(status) || "PAID".equals(status) || "COMPLETED".equals(status);
        }

        final UUID targetOrderId = orderId;
        final boolean finalSuccess = isSuccess;
        return mockPay(targetOrderId, finalSuccess)
                .map(payment -> Map.of(
                        "gateway", gateway != null ? gateway.toUpperCase() : "MOMO",
                        "orderId", targetOrderId.toString(),
                        "paymentId", payment.getId().toString(),
                        "status", finalSuccess ? "SUCCESS" : "FAILED",
                        "amount", payment.getAmount(),
                        "message", finalSuccess ? "Payment confirmed via webhook" : "Payment failed via webhook"
                ));
    }

    public Mono<Map<String, Object>> generateEscrowQr(UUID orderId, String gateway, BigDecimal amount) {
        String cleanGateway = gateway != null ? gateway.toUpperCase() : "MOMO";
        BigDecimal cleanAmount = amount != null ? amount : BigDecimal.valueOf(500000);
        String accountName = "AURA BEAUTY MALL - SHOP ESCROW";
        String accountNumber = "0901234567";
        String bankName = "MOMO".equals(cleanGateway) ? "Ví Điện Tử MoMo (Ký Quỹ Shop)" : "Ngân hàng TMCP Quân Đội (MB Bank)";
        String transferContent = "AURA " + orderId.toString().substring(0, Math.min(8, orderId.toString().length())).toUpperCase();

        String qrUrl = "MOMO".equals(cleanGateway)
                ? "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=2|99|0901234567|MOMO|AURA_ESCROW|" + cleanAmount + "|" + transferContent
                : "https://img.vietqr.io/image/MB-0901234567-compact2.png?amount=" + cleanAmount + "&addInfo=" + transferContent + "&accountName=" + accountName.replace(" ", "%20");

        Map<String, Object> result = new HashMap<>();
        result.put("orderId", orderId);
        result.put("gateway", cleanGateway);
        result.put("amount", cleanAmount);
        result.put("accountName", accountName);
        result.put("accountNumber", accountNumber);
        result.put("bankName", bankName);
        result.put("transferContent", transferContent);
        result.put("qrUrl", qrUrl);
        result.put("timeoutSeconds", 900);
        result.put("expiresAt", java.time.Instant.now().plusSeconds(900).toString());

        return Mono.just(result);
    }
}
