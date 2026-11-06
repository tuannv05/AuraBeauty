package com.cosmetics.order.adapter.in.web;

import com.cosmetics.common.web.ApiResponse;
import com.cosmetics.common.web.SecurityHeaderUtils;
import com.cosmetics.order.adapter.out.persistence.OrderEntity;
import com.cosmetics.order.adapter.out.persistence.OrderLineEntity;
import com.cosmetics.order.adapter.out.persistence.SubOrderEntity;
import com.cosmetics.order.application.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    private UUID resolveUserId(ServerWebExchange exchange) {
        UUID userId = SecurityHeaderUtils.getUserId(exchange);
        if (userId == null) {
            String fallback = exchange.getRequest().getHeaders().getFirst("X-User-Id");
            if (fallback != null) return UUID.fromString(fallback);
            return UUID.fromString("00000000-0000-0000-0000-000000000003"); // default buyer
        }
        return userId;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<ApiResponse<OrderEntity>> placeOrder(
            @RequestBody OrderService.CheckoutRequest request,
            ServerWebExchange exchange
    ) {
        UUID buyerId = resolveUserId(exchange);
        return orderService.placeOrder(buyerId, request).map(ApiResponse::ok);
    }

    @GetMapping("/{id}")
    public Mono<ApiResponse<OrderEntity>> getOrder(@PathVariable UUID id) {
        return orderService.getOrderById(id).map(ApiResponse::ok);
    }

    @GetMapping("/my")
    public Mono<ApiResponse<List<OrderEntity>>> getMyOrders(ServerWebExchange exchange) {
        UUID buyerId = resolveUserId(exchange);
        return orderService.getMyOrders(buyerId).collectList().map(ApiResponse::ok);
    }

    @GetMapping("/{orderId}/sub-orders")
    public Mono<ApiResponse<List<SubOrderEntity>>> getSubOrdersByOrder(@PathVariable UUID orderId) {
        return orderService.getSubOrdersByOrder(orderId).collectList().map(ApiResponse::ok);
    }

    @GetMapping("/sub-orders/{subOrderId}/lines")
    public Mono<ApiResponse<List<OrderLineEntity>>> getOrderLines(@PathVariable UUID subOrderId) {
        return orderService.getOrderLines(subOrderId).collectList().map(ApiResponse::ok);
    }

    @GetMapping("/sub-orders/shop/{shopId}")
    public Mono<ApiResponse<List<SubOrderEntity>>> getSubOrdersByShop(@PathVariable UUID shopId) {
        return orderService.getSubOrdersByShop(shopId).collectList().map(ApiResponse::ok);
    }

    @PutMapping("/sub-orders/{subOrderId}/confirm")
    public Mono<ApiResponse<SubOrderEntity>> confirmSubOrder(@PathVariable UUID subOrderId, ServerWebExchange exchange) {
        UUID userId = resolveUserId(exchange);
        return orderService.confirmSubOrder(subOrderId, userId).map(ApiResponse::ok);
    }

    @PutMapping("/sub-orders/{subOrderId}/ship")
    public Mono<ApiResponse<SubOrderEntity>> shipSubOrder(@PathVariable UUID subOrderId, ServerWebExchange exchange) {
        UUID userId = resolveUserId(exchange);
        return orderService.shipSubOrder(subOrderId, userId).map(ApiResponse::ok);
    }

    @PutMapping("/sub-orders/{subOrderId}/deliver")
    public Mono<ApiResponse<SubOrderEntity>> deliverSubOrder(@PathVariable UUID subOrderId, ServerWebExchange exchange) {
        UUID userId = resolveUserId(exchange);
        return orderService.deliverSubOrder(subOrderId, userId).map(ApiResponse::ok);
    }

    @PutMapping("/sub-orders/{subOrderId}/reject")
    public Mono<ApiResponse<SubOrderEntity>> rejectSubOrder(
            @PathVariable UUID subOrderId,
            @RequestParam(defaultValue = "Out of stock or cannot fulfill") String reason,
            ServerWebExchange exchange
    ) {
        UUID userId = resolveUserId(exchange);
        return orderService.rejectSubOrder(subOrderId, userId, reason).map(ApiResponse::ok);
    }

    @PutMapping("/{id}/expire")
    public Mono<ApiResponse<OrderEntity>> expireOrder(@PathVariable UUID id) {
        return orderService.expireOrder(id).map(ApiResponse::ok);
    }

    @PutMapping("/{id}/cancel")
    public Mono<ApiResponse<OrderEntity>> cancelOrder(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "Cancelled by user") String reason
    ) {
        return orderService.cancelOrder(id, reason).map(ApiResponse::ok);
    }
}
