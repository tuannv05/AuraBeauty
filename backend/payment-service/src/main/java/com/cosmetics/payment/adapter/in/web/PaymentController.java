package com.cosmetics.payment.adapter.in.web;

import com.cosmetics.common.web.ApiResponse;
import com.cosmetics.payment.adapter.out.persistence.PaymentEntity;
import com.cosmetics.payment.application.PaymentService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/{orderId}")
    public Mono<ApiResponse<PaymentEntity>> getPayment(@PathVariable UUID orderId) {
        return paymentService.getPaymentByOrderId(orderId).map(ApiResponse::ok);
    }

    @PostMapping("/{orderId}/mock-pay")
    public Mono<ApiResponse<PaymentEntity>> mockPay(
            @PathVariable UUID orderId,
            @RequestParam(defaultValue = "true") boolean success
    ) {
        return paymentService.mockPay(orderId, success).map(ApiResponse::ok);
    }

    @PostMapping("/webhook/{gateway}")
    public Mono<ApiResponse<Map<String, Object>>> handleWebhook(
            @PathVariable String gateway,
            @RequestBody(required = false) Map<String, Object> payload
    ) {
        return paymentService.processWebhook(gateway, payload).map(ApiResponse::ok);
    }

    @GetMapping("/{orderId}/escrow-qr")
    public Mono<ApiResponse<Map<String, Object>>> getEscrowQr(
            @PathVariable UUID orderId,
            @RequestParam(defaultValue = "MOMO") String gateway,
            @RequestParam(defaultValue = "500000") BigDecimal amount
    ) {
        return paymentService.generateEscrowQr(orderId, gateway, amount).map(ApiResponse::ok);
    }
}
