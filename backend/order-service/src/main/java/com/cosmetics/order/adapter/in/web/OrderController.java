package com.cosmetics.order.adapter.in.web;

import com.cosmetics.common.web.ApiResponse;
import com.cosmetics.common.web.SecurityHeaderUtils;
import com.cosmetics.order.adapter.out.persistence.OrderEntity;
import com.cosmetics.order.adapter.out.persistence.OrderLineEntity;
import com.cosmetics.order.adapter.out.persistence.SubOrderEntity;
import com.cosmetics.order.application.OrderService;
import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.converters.uni.UniReactorConverters;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;
import java.util.UUID;

@Path("/api/orders")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@ApplicationScoped
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    private UUID resolveUserId(String headerUserId) {
        UUID userId = SecurityHeaderUtils.parseUserId(headerUserId);
        if (userId == null) {
            return UUID.fromString("00000000-0000-0000-0000-000000000003"); // default buyer
        }
        return userId;
    }

    @POST
    public Uni<ApiResponse<OrderEntity>> placeOrder(
            OrderService.CheckoutRequest request,
            @HeaderParam("X-User-Id") String headerUserId
    ) {
        UUID buyerId = resolveUserId(headerUserId);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), orderService.placeOrder(buyerId, request))
                .map(ApiResponse::ok);
    }

    @GET
    @Path("/{id}")
    public Uni<ApiResponse<OrderEntity>> getOrder(@PathParam("id") UUID id) {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), orderService.getOrderById(id))
                .map(ApiResponse::ok);
    }

    @GET
    @Path("/my")
    public Uni<ApiResponse<List<OrderEntity>>> getMyOrders(@HeaderParam("X-User-Id") String headerUserId) {
        UUID buyerId = resolveUserId(headerUserId);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), orderService.getMyOrders(buyerId).collectList())
                .map(ApiResponse::ok);
    }

    @GET
    @Path("/{orderId}/sub-orders")
    public Uni<ApiResponse<List<SubOrderEntity>>> getSubOrdersByOrder(@PathParam("orderId") UUID orderId) {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), orderService.getSubOrdersByOrder(orderId).collectList())
                .map(ApiResponse::ok);
    }

    @GET
    @Path("/sub-orders/{subOrderId}/lines")
    public Uni<ApiResponse<List<OrderLineEntity>>> getOrderLines(@PathParam("subOrderId") UUID subOrderId) {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), orderService.getOrderLines(subOrderId).collectList())
                .map(ApiResponse::ok);
    }

    @GET
    @Path("/sub-orders/shop/{shopId}")
    public Uni<ApiResponse<List<SubOrderEntity>>> getSubOrdersByShop(@PathParam("shopId") UUID shopId) {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), orderService.getSubOrdersByShop(shopId).collectList())
                .map(ApiResponse::ok);
    }

    @PUT
    @Path("/sub-orders/{subOrderId}/confirm")
    public Uni<ApiResponse<SubOrderEntity>> confirmSubOrder(
            @PathParam("subOrderId") UUID subOrderId,
            @HeaderParam("X-User-Id") String headerUserId
    ) {
        UUID userId = resolveUserId(headerUserId);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), orderService.confirmSubOrder(subOrderId, userId))
                .map(ApiResponse::ok);
    }

    @PUT
    @Path("/sub-orders/{subOrderId}/ship")
    public Uni<ApiResponse<SubOrderEntity>> shipSubOrder(
            @PathParam("subOrderId") UUID subOrderId,
            @HeaderParam("X-User-Id") String headerUserId
    ) {
        UUID userId = resolveUserId(headerUserId);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), orderService.shipSubOrder(subOrderId, userId))
                .map(ApiResponse::ok);
    }

    @PUT
    @Path("/sub-orders/{subOrderId}/deliver")
    public Uni<ApiResponse<SubOrderEntity>> deliverSubOrder(
            @PathParam("subOrderId") UUID subOrderId,
            @HeaderParam("X-User-Id") String headerUserId
    ) {
        UUID userId = resolveUserId(headerUserId);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), orderService.deliverSubOrder(subOrderId, userId))
                .map(ApiResponse::ok);
    }

    @PUT
    @Path("/sub-orders/{subOrderId}/reject")
    public Uni<ApiResponse<SubOrderEntity>> rejectSubOrder(
            @PathParam("subOrderId") UUID subOrderId,
            @QueryParam("reason") @DefaultValue("Out of stock or cannot fulfill") String reason,
            @HeaderParam("X-User-Id") String headerUserId
    ) {
        UUID userId = resolveUserId(headerUserId);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), orderService.rejectSubOrder(subOrderId, userId, reason))
                .map(ApiResponse::ok);
    }

    @PUT
    @Path("/{id}/expire")
    public Uni<ApiResponse<OrderEntity>> expireOrder(@PathParam("id") UUID id) {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), orderService.expireOrder(id))
                .map(ApiResponse::ok);
    }

    @PUT
    @Path("/{id}/cancel")
    public Uni<ApiResponse<OrderEntity>> cancelOrder(
            @PathParam("id") UUID id,
            @QueryParam("reason") @DefaultValue("Cancelled by user") String reason
    ) {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), orderService.cancelOrder(id, reason))
                .map(ApiResponse::ok);
    }
}
