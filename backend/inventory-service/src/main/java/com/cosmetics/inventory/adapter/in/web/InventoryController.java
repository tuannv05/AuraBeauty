package com.cosmetics.inventory.adapter.in.web;

import com.cosmetics.common.web.ApiResponse;
import com.cosmetics.inventory.adapter.out.persistence.StockItemEntity;
import com.cosmetics.inventory.application.InventoryService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping("/{skuCode}")
    public Mono<ApiResponse<StockItemEntity>> getStock(@PathVariable String skuCode) {
        return inventoryService.getStock(skuCode).map(ApiResponse::ok);
    }

    @PutMapping("/{skuCode}/stock")
    public Mono<ApiResponse<StockItemEntity>> updateOnHand(
            @PathVariable String skuCode,
            @RequestParam int onHand
    ) {
        return inventoryService.updateOnHand(skuCode, onHand).map(ApiResponse::ok);
    }
}
