package com.cosmetics.inventory.adapter.in.web;

import com.cosmetics.common.web.ApiResponse;
import com.cosmetics.inventory.adapter.out.persistence.StockItemEntity;
import com.cosmetics.inventory.application.InventoryService;
import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.converters.uni.UniReactorConverters;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

@Path("/api/inventory")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class InventoryController {
    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GET
    @Path("/{skuCode}")
    public Uni<ApiResponse<StockItemEntity>> getStock(@PathParam("skuCode") String skuCode) {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), inventoryService.getStock(skuCode))
                .map(ApiResponse::ok);
    }

    @PUT
    @Path("/{skuCode}/stock")
    public Uni<ApiResponse<StockItemEntity>> updateOnHand(
            @PathParam("skuCode") String skuCode,
            @QueryParam("onHand") int onHand
    ) {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), inventoryService.updateOnHand(skuCode, onHand))
                .map(ApiResponse::ok);
    }
}
