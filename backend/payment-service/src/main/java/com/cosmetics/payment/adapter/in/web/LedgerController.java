package com.cosmetics.payment.adapter.in.web;

import com.cosmetics.common.web.ApiResponse;
import com.cosmetics.payment.adapter.out.persistence.LedgerEntryEntity;
import com.cosmetics.payment.application.PaymentService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ledger")
public class LedgerController {
    private final PaymentService paymentService;

    public LedgerController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/entries")
    public Mono<ApiResponse<List<LedgerEntryEntity>>> getAllEntries() {
        return paymentService.getAllLedgerEntries().collectList().map(ApiResponse::ok);
    }

    @GetMapping("/summary")
    public Mono<ApiResponse<Map<String, Object>>> getSummary() {
        return paymentService.getAccountingSummary().map(ApiResponse::ok);
    }
}
