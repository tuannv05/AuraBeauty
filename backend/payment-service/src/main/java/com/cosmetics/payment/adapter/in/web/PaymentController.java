package com.cosmetics.payment.adapter.in.web;

import com.cosmetics.common.web.ApiResponse;
import com.cosmetics.payment.adapter.out.persistence.PaymentEntity;
import com.cosmetics.payment.application.PaymentService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

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
}
