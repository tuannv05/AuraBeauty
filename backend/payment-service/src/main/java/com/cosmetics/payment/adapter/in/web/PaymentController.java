package com.cosmetics.payment.adapter.in.web;

import com.cosmetics.common.web.ApiResponse;
import com.cosmetics.payment.adapter.out.persistence.PaymentEntity;
import com.cosmetics.payment.application.PaymentService;
import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.converters.uni.UniReactorConverters;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Path("/api/payments")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GET
    @Path("/{orderId}")
    public Uni<ApiResponse<PaymentEntity>> getPayment(@PathParam("orderId") UUID orderId) {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), paymentService.getPaymentByOrderId(orderId))
                .map(ApiResponse::ok);
    }

    @POST
    @Path("/{orderId}/mock-pay")
    public Uni<ApiResponse<PaymentEntity>> mockPay(
            @PathParam("orderId") UUID orderId,
            @QueryParam("success") @DefaultValue("true") boolean success
    ) {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), paymentService.mockPay(orderId, success))
                .map(ApiResponse::ok);
    }

    @POST
    @Path("/webhook/{gateway}")
    public Uni<ApiResponse<Map<String, Object>>> handleWebhook(
            @PathParam("gateway") String gateway,
            Map<String, Object> payload
    ) {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), paymentService.processWebhook(gateway, payload))
                .map(ApiResponse::ok);
    }

    @GET
    @Path("/{orderId}/escrow-qr")
    public Uni<ApiResponse<Map<String, Object>>> getEscrowQr(
            @PathParam("orderId") UUID orderId,
            @QueryParam("gateway") @DefaultValue("MOMO") String gateway,
            @QueryParam("amount") @DefaultValue("500000") BigDecimal amount
    ) {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), paymentService.generateEscrowQr(orderId, gateway, amount))
                .map(ApiResponse::ok);
    }
}
