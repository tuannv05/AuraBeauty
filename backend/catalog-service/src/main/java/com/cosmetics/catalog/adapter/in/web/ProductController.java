package com.cosmetics.catalog.adapter.in.web;

import com.cosmetics.catalog.adapter.out.persistence.ProductDocument;
import com.cosmetics.catalog.application.ProductService;
import com.cosmetics.common.web.ApiResponse;
import com.cosmetics.common.web.BusinessException;
import com.cosmetics.common.web.SecurityHeaderUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<ApiResponse<ProductDocument>> createDraft(
            @RequestBody ProductDocument product,
            ServerWebExchange exchange
    ) {
        UUID userId = SecurityHeaderUtils.getUserId(exchange);
        if (product.getShopId() == null && userId != null) {
            product.setShopId(userId);
        }
        return productService.createDraft(product).map(ApiResponse::ok);
    }

    @PutMapping("/{id}/submit")
    public Mono<ApiResponse<ProductDocument>> submitForReview(
            @PathVariable String id,
            ServerWebExchange exchange
    ) {
        UUID userId = SecurityHeaderUtils.getUserId(exchange);
        return productService.submitForReview(id, userId).map(ApiResponse::ok);
    }

    @PutMapping("/admin/{id}/approve")
    public Mono<ApiResponse<ProductDocument>> approveProduct(@PathVariable String id) {
        return productService.approveProduct(id).map(ApiResponse::ok);
    }

    @PutMapping("/admin/{id}/reject")
    public Mono<ApiResponse<ProductDocument>> rejectProduct(
            @PathVariable String id,
            @RequestParam(defaultValue = "Violates policy") String reason
    ) {
        return productService.rejectProduct(id, reason).map(ApiResponse::ok);
    }

    @GetMapping
    public Mono<ApiResponse<List<ProductDocument>>> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String skinType,
            @RequestParam(required = false) String concern,
            @RequestParam(required = false) String activeGroup,
            @RequestParam(required = false) String badge,
            @RequestParam(required = false) String texture,
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String priceBucket
    ) {
        return productService.search(q, category, skinType, concern, activeGroup, badge, texture, origin, priceBucket)
                .collectList().map(ApiResponse::ok);
    }

    @GetMapping("/{id}")
    public Mono<ApiResponse<ProductDocument>> getById(@PathVariable String id) {
        return productService.getById(id).map(ApiResponse::ok);
    }

    @GetMapping("/shop/{shopId}")
    public Mono<ApiResponse<List<ProductDocument>>> getByShopId(@PathVariable UUID shopId) {
        return productService.getByShopId(shopId).collectList().map(ApiResponse::ok);
    }

    @GetMapping("/sku/{skuCode}")
    public Mono<ApiResponse<ProductDocument.VariantSubDoc>> getBySku(@PathVariable String skuCode) {
        return productService.getVariantBySku(skuCode).map(ApiResponse::ok);
    }
}
