package com.cosmetics.order.adapter.in.web;

import com.cosmetics.common.web.ApiResponse;
import com.cosmetics.common.web.SecurityHeaderUtils;
import com.cosmetics.order.adapter.out.persistence.CartItemEntity;
import com.cosmetics.order.application.CartService;
import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.converters.uni.UniReactorConverters;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Path("/api/cart")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@ApplicationScoped
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    private UUID resolveBuyerId(String headerUserId, String headerBuyerId) {
        UUID userId = SecurityHeaderUtils.parseUserId(headerUserId);
        if (userId != null) return userId;
        UUID buyerId = SecurityHeaderUtils.parseUserId(headerBuyerId);
        if (buyerId != null) return buyerId;
        return UUID.fromString("00000000-0000-0000-0000-000000000003");
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

    @GET
    public Uni<ApiResponse<List<CartItemEntity>>> getCart(
            @HeaderParam("X-User-Id") String headerUserId,
            @HeaderParam("X-Buyer-Id") String headerBuyerId
    ) {
        UUID buyerId = resolveBuyerId(headerUserId, headerBuyerId);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), cartService.getCart(buyerId).collectList())
                .map(ApiResponse::ok);
    }

    @POST
    @Path("/items")
    public Uni<ApiResponse<CartItemEntity>> addToCart(
            AddToCartRequest req,
            @HeaderParam("X-User-Id") String headerUserId,
            @HeaderParam("X-Buyer-Id") String headerBuyerId
    ) {
        UUID buyerId = resolveBuyerId(headerUserId, headerBuyerId);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(),
                cartService.addToCart(
                        buyerId, req.getSkuCode(), req.getProductName(), req.getShopId(),
                        req.getShopName() != null ? req.getShopName() : "Official Store",
                        req.getUnitPrice(), req.getQuantity() > 0 ? req.getQuantity() : 1
                )
        ).map(ApiResponse::ok);
    }

    @DELETE
    @Path("/items/{skuCode}")
    public Uni<ApiResponse<Void>> removeItem(
            @PathParam("skuCode") String skuCode,
            @HeaderParam("X-User-Id") String headerUserId,
            @HeaderParam("X-Buyer-Id") String headerBuyerId
    ) {
        UUID buyerId = resolveBuyerId(headerUserId, headerBuyerId);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(),
                cartService.removeItem(buyerId, skuCode).thenReturn(ApiResponse.<Void>ok(null))
        );
    }

    @DELETE
    public Uni<ApiResponse<Void>> clearCart(
            @HeaderParam("X-User-Id") String headerUserId,
            @HeaderParam("X-Buyer-Id") String headerBuyerId
    ) {
        UUID buyerId = resolveBuyerId(headerUserId, headerBuyerId);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(),
                cartService.clearCart(buyerId).thenReturn(ApiResponse.<Void>ok(null))
        );
    }
}
