package com.cosmetics.payment.adapter.in.web;

import com.cosmetics.common.web.ApiResponse;
import com.cosmetics.payment.adapter.out.persistence.LedgerEntryEntity;
import com.cosmetics.payment.application.PaymentService;
import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.converters.uni.UniReactorConverters;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;
import java.util.Map;

@Path("/api/ledger")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class LedgerController {
    private final PaymentService paymentService;

    public LedgerController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GET
    @Path("/entries")
    public Uni<ApiResponse<List<LedgerEntryEntity>>> getAllEntries() {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), paymentService.getAllLedgerEntries().collectList())
                .map(ApiResponse::ok);
    }

    @GET
    @Path("/summary")
    public Uni<ApiResponse<Map<String, Object>>> getSummary() {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), paymentService.getAccountingSummary())
                .map(ApiResponse::ok);
    }
}
