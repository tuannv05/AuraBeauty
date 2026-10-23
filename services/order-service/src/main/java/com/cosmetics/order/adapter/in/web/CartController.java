package com.cosmetics.order.adapter.in.web;

import com.cosmetics.common.web.ApiResponse;
import com.cosmetics.common.web.BusinessException;
import com.cosmetics.common.web.SecurityHeaderUtils;
import com.cosmetics.order.adapter.out.persistence.CartItemEntity;
import com.cosmetics.order.application.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    private UUID resolveBuyerId(ServerWebExchange exchange) {
        UUID userId = SecurityHeaderUtils.getUserId(exchange);
        if (userId == null) {
            // For testing/mocking if direct call without gateway
            String fallback = exchange.getRequest().getHeaders().getFirst("X-Buyer-Id");
            if (fallback != null) return UUID.fromString(fallback);
            return UUID.fromString("00000000-0000-0000-0000-000000000003");
        }
        return userId;
    }

    public static class AddToCartRequest {
        private String skuCode;
        private String productName;
        private UUID shopId;
        private String shopName;
        private BigDecimal unitPrice;
        private int quantity;

        public AddToCartRequest() {}

        public String getSkuCode() { return skuCode; }
        public void setSkuCode(String skuCode) { this.skuCode = skuCode; }
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        public UUID getShopId() { return shopId; }
        public void setShopId(UUID shopId) { this.shopId = shopId; }
        public String getShopName() { return shopName; }
        public void setShopName(String shopName) { this.shopName = shopName; }
        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }

    @GetMapping
    public Mono<ApiResponse<List<CartItemEntity>>> getCart(ServerWebExchange exchange) {
        UUID buyerId = resolveBuyerId(exchange);
        return cartService.getCart(buyerId).collectList().map(ApiResponse::ok);
    }

    @PostMapping("/items")
    public Mono<ApiResponse<CartItemEntity>> addToCart(
            @RequestBody AddToCartRequest req,
            ServerWebExchange exchange
    ) {
        UUID buyerId = resolveBuyerId(exchange);
        return cartService.addToCart(
                buyerId, req.getSkuCode(), req.getProductName(), req.getShopId(),
                req.getShopName() != null ? req.getShopName() : "Official Store",
                req.getUnitPrice(), req.getQuantity() > 0 ? req.getQuantity() : 1
        ).map(ApiResponse::ok);
    }

    @DeleteMapping("/items/{skuCode}")
    public Mono<ApiResponse<Void>> removeItem(
            @PathVariable String skuCode,
            ServerWebExchange exchange
    ) {
        UUID buyerId = resolveBuyerId(exchange);
        return cartService.removeItem(buyerId, skuCode).thenReturn(ApiResponse.ok(null));
    }

    @DeleteMapping
    public Mono<ApiResponse<Void>> clearCart(ServerWebExchange exchange) {
        UUID buyerId = resolveBuyerId(exchange);
        return cartService.clearCart(buyerId).thenReturn(ApiResponse.ok(null));
    }
}
