package com.cosmetics.order.application;

import com.cosmetics.common.events.KafkaTopics;
import com.cosmetics.common.events.payloads.OrderPlacedPayload;
import com.cosmetics.common.events.payloads.ReleaseStockPayload;
import com.cosmetics.common.outbox.ProcessedEvent;
import com.cosmetics.common.web.BusinessException;
import com.cosmetics.order.adapter.out.persistence.*;
import jakarta.enterprise.context.ApplicationScoped;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@ApplicationScoped
public class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final SubOrderRepository subOrderRepository;
    private final OrderLineRepository orderLineRepository;
    private final CartItemRepository cartItemRepository;
    private final QuarkusProcessedEventRepository processedEventRepository;
    private final QuarkusOutboxHelper outboxHelper;

    public OrderService(
            OrderRepository orderRepository,
            SubOrderRepository subOrderRepository,
            OrderLineRepository orderLineRepository,
            CartItemRepository cartItemRepository,
            QuarkusProcessedEventRepository processedEventRepository,
            QuarkusOutboxHelper outboxHelper
    ) {
        this.orderRepository = orderRepository;
        this.subOrderRepository = subOrderRepository;
        this.orderLineRepository = orderLineRepository;
        this.cartItemRepository = cartItemRepository;
        this.processedEventRepository = processedEventRepository;
        this.outboxHelper = outboxHelper;
    }

    public static class CheckoutRequest {
        private String recipientName;
        private String recipientPhone;
        private String shippingAddress;
        private String paymentMethod; // COD, MOMO, VIETQR, VNPAY, WALLET, CARD

        public CheckoutRequest() {}
        public CheckoutRequest(String recipientName, String recipientPhone, String shippingAddress) {
            this(recipientName, recipientPhone, shippingAddress, "COD");
        }
        public CheckoutRequest(String recipientName, String recipientPhone, String shippingAddress, String paymentMethod) {
            this.recipientName = recipientName;
            this.recipientPhone = recipientPhone;
            this.shippingAddress = shippingAddress;
            this.paymentMethod = paymentMethod;
        }

        public String getRecipientName() { return recipientName; }
        public void setRecipientName(String recipientName) { this.recipientName = recipientName; }
        public String getRecipientPhone() { return recipientPhone; }
        public void setRecipientPhone(String recipientPhone) { this.recipientPhone = recipientPhone; }
        public String getShippingAddress() { return shippingAddress; }
        public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    }

    public Mono<OrderEntity> placeOrder(UUID buyerId, CheckoutRequest request) {
        return cartItemRepository.findByBuyerId(buyerId).collectList()
                .flatMap(cartItems -> {
                    if (cartItems.isEmpty()) {
                        return Mono.error(new BusinessException(400, "CART_EMPTY", "Cart is empty"));
                    }

                    // Calculate total
                    BigDecimal totalAmount = cartItems.stream()
                            .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    UUID orderId = UUID.randomUUID();
                    String paymentMethod = request.getPaymentMethod() != null ? request.getPaymentMethod().toUpperCase() : "COD";
                    boolean isOnline = "MOMO".equals(paymentMethod) || "VIETQR".equals(paymentMethod) || "QR".equals(paymentMethod) || "VNPAY".equals(paymentMethod) || "WALLET".equals(paymentMethod) || "CARD".equals(paymentMethod);
                    String initialStatus = isOnline ? "PENDING_PAYMENT" : "CREATED";
                    String subInitialStatus = isOnline ? "PENDING_PAYMENT" : "PENDING";

                    OrderEntity order = new OrderEntity(
                            orderId,
                            buyerId,
                            initialStatus,
                            totalAmount,
                            request.getRecipientName(),
                            request.getRecipientPhone(),
                            request.getShippingAddress(),
                            paymentMethod
                    );

                    // Group by ShopId to split into Sub-orders
                    Map<UUID, List<CartItemEntity>> shopGroups = new HashMap<>();
                    for (CartItemEntity item : cartItems) {
                        shopGroups.computeIfAbsent(item.getShopId(), k -> new ArrayList<>()).add(item);
                    }

                    List<SubOrderEntity> subOrders = new ArrayList<>();
                    List<OrderLineEntity> orderLines = new ArrayList<>();
                    List<OrderPlacedPayload.SubOrderDto> subOrderDtos = new ArrayList<>();
                    List<OrderPlacedPayload.ItemDto> itemDtos = new ArrayList<>();

                    for (Map.Entry<UUID, List<CartItemEntity>> entry : shopGroups.entrySet()) {
                        UUID shopId = entry.getKey();
                        List<CartItemEntity> items = entry.getValue();

                        BigDecimal subTotal = items.stream()
                                .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                        UUID subOrderId = UUID.randomUUID();
                        SubOrderEntity subOrder = new SubOrderEntity(subOrderId, orderId, shopId, subInitialStatus, subTotal);
                        subOrders.add(subOrder);
                        subOrderDtos.add(new OrderPlacedPayload.SubOrderDto(subOrderId, shopId, subTotal));

                        for (CartItemEntity i : items) {
                            UUID lineId = UUID.randomUUID();
                            BigDecimal lineTotal = i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity()));
                            orderLines.add(new OrderLineEntity(lineId, subOrderId, i.getSkuCode(), i.getProductName(), i.getQuantity(), i.getUnitPrice(), lineTotal));
                            itemDtos.add(new OrderPlacedPayload.ItemDto(subOrderId, i.getSkuCode(), i.getProductName(), i.getQuantity(), i.getUnitPrice()));
                        }
                    }

                    OrderPlacedPayload payload = new OrderPlacedPayload();
                    payload.setOrderId(orderId);
                    payload.setBuyerId(buyerId);
                    payload.setTotalAmount(totalAmount);
                    payload.setSubOrders(subOrderDtos);
                    payload.setItems(itemDtos);

                    return orderRepository.save(order)
                            .thenMany(subOrderRepository.saveAll(subOrders))
                            .thenMany(orderLineRepository.saveAll(orderLines))
                            .then(outboxHelper.recordEvent(
                                    KafkaTopics.ORDER_EVENTS,
                                    "Order",
                                    orderId.toString(),
                                    "OrderPlaced",
                                    payload
                            ))
                            .then(cartItemRepository.deleteByBuyerId(buyerId))
                            .thenReturn(order);
                });
    }

    public Mono<OrderEntity> getOrderById(UUID orderId) {
        return orderRepository.findById(orderId)
                .switchIfEmpty(Mono.error(new BusinessException(404, "ORDER_NOT_FOUND", "Order not found")));
    }

    public Flux<OrderEntity> getMyOrders(UUID buyerId) {
        return orderRepository.findByBuyerIdOrderByCreatedAtDesc(buyerId);
    }

    public Flux<SubOrderEntity> getSubOrdersByShop(UUID shopId) {
        return subOrderRepository.findByShopIdOrderByCreatedAtDesc(shopId);
    }

    public Flux<SubOrderEntity> getSubOrdersByOrder(UUID orderId) {
        return subOrderRepository.findByOrderId(orderId);
    }

    public Flux<OrderLineEntity> getOrderLines(UUID subOrderId) {
        return orderLineRepository.findBySubOrderId(subOrderId);
    }

    public Mono<SubOrderEntity> confirmSubOrder(UUID subOrderId, UUID shopId) {
        return subOrderRepository.findById(subOrderId)
                .switchIfEmpty(Mono.error(new BusinessException(404, "SUB_ORDER_NOT_FOUND", "Sub-order not found")))
                .flatMap(sub -> {
                    sub.setStatus("CONFIRMED");
                    sub.setUpdatedAt(Instant.now());
                    return subOrderRepository.save(sub);
                });
    }

    public Mono<SubOrderEntity> shipSubOrder(UUID subOrderId, UUID shopId) {
        return subOrderRepository.findById(subOrderId)
                .switchIfEmpty(Mono.error(new BusinessException(404, "SUB_ORDER_NOT_FOUND", "Sub-order not found")))
                .flatMap(sub -> {
                    sub.setStatus("SHIPPED");
                    sub.setUpdatedAt(Instant.now());
                    return subOrderRepository.save(sub);
                });
    }

    public Mono<SubOrderEntity> deliverSubOrder(UUID subOrderId, UUID shopId) {
        return subOrderRepository.findById(subOrderId)
                .switchIfEmpty(Mono.error(new BusinessException(404, "SUB_ORDER_NOT_FOUND", "Sub-order not found")))
                .flatMap(sub -> {
                    sub.setStatus("DELIVERED");
                    sub.setUpdatedAt(Instant.now());
                    return subOrderRepository.save(sub)
                            .flatMap(saved -> outboxHelper.recordEvent(
                                    KafkaTopics.ORDER_EVENTS,
                                    "SubOrder",
                                    saved.getId().toString(),
                                    "SubOrderDelivered",
                                    Map.of("subOrderId", saved.getId(), "orderId", saved.getOrderId(), "shopId", saved.getShopId(), "subTotal", saved.getSubTotal())
                            ).thenReturn(saved));
                });
    }

    public Mono<SubOrderEntity> rejectSubOrder(UUID subOrderId, UUID shopId, String reason) {
        return subOrderRepository.findById(subOrderId)
                .switchIfEmpty(Mono.error(new BusinessException(404, "SUB_ORDER_NOT_FOUND", "Sub-order not found")))
                .flatMap(sub -> {
                    sub.setStatus("REJECTED");
                    sub.setUpdatedAt(Instant.now());
                    return subOrderRepository.save(sub)
                            .flatMap(saved -> outboxHelper.recordEvent(
                                    KafkaTopics.ORDER_EVENTS,
                                    "SubOrder",
                                    saved.getId().toString(),
                                    "SubOrderRejected",
                                    Map.of("subOrderId", saved.getId(), "orderId", saved.getOrderId(), "shopId", saved.getShopId(), "subTotal", saved.getSubTotal(), "reason", reason)
                            ).thenReturn(saved));
                });
    }

    // Saga event listeners
    public Mono<Void> handleInventoryReserved(UUID eventId, UUID orderId) {
        return processedEventRepository.existsById(eventId)
                .flatMap(exists -> {
                    if (Boolean.TRUE.equals(exists)) return Mono.empty();
                    return orderRepository.findById(orderId)
                            .flatMap(order -> {
                                order.setStatus("PENDING_PAYMENT");
                                order.setUpdatedAt(Instant.now());
                                return orderRepository.save(order);
                            })
                            .then(processedEventRepository.save(new ProcessedEvent(eventId, "InventoryReserved")))
                            .then();
                });
    }

    public Mono<Void> handleInventoryRejected(UUID eventId, UUID orderId, String reason) {
        return processedEventRepository.existsById(eventId)
                .flatMap(exists -> {
                    if (Boolean.TRUE.equals(exists)) return Mono.empty();
                    return orderRepository.findById(orderId)
                            .flatMap(order -> {
                                order.setStatus("CANCELLED");
                                order.setUpdatedAt(Instant.now());
                                return orderRepository.save(order);
                            })
                            .then(subOrderRepository.findByOrderId(orderId)
                                    .flatMap(sub -> {
                                        sub.setStatus("REJECTED");
                                        return subOrderRepository.save(sub);
                                    }).then())
                            .then(processedEventRepository.save(new ProcessedEvent(eventId, "InventoryRejected")))
                            .then();
                });
    }

    public Mono<Void> handlePaymentSucceeded(UUID eventId, UUID orderId) {
        return processedEventRepository.existsById(eventId)
                .flatMap(exists -> {
                    if (Boolean.TRUE.equals(exists)) return Mono.empty();
                    return orderRepository.findById(orderId)
                            .flatMap(order -> {
                                order.setStatus("PAID");
                                order.setUpdatedAt(Instant.now());
                                return orderRepository.save(order);
                            })
                            .then(subOrderRepository.findByOrderId(orderId)
                                    .flatMap(sub -> {
                                        sub.setStatus("READY_FOR_PROCESSING");
                                        return subOrderRepository.save(sub);
                                    }).then())
                            .then(processedEventRepository.save(new ProcessedEvent(eventId, "PaymentSucceeded")))
                            .then();
                });
    }

    public Mono<Void> handlePaymentFailed(UUID eventId, UUID orderId, String reason) {
        return processedEventRepository.existsById(eventId)
                .flatMap(exists -> {
                    if (Boolean.TRUE.equals(exists)) return Mono.empty();
                    return orderRepository.findById(orderId)
                            .flatMap(order -> {
                                order.setStatus("CANCELLED");
                                order.setUpdatedAt(Instant.now());
                                return orderRepository.save(order);
                            })
                            .then(subOrderRepository.findByOrderId(orderId)
                                    .flatMap(sub -> {
                                        sub.setStatus("REJECTED");
                                        return subOrderRepository.save(sub);
                                    }).then())
                            .then(outboxHelper.recordEvent(
                                    KafkaTopics.ORDER_EVENTS,
                                    "Order",
                                    orderId.toString(),
                                    "ReleaseStock",
                                    new ReleaseStockPayload(orderId, reason)
                            ))
                            .then(processedEventRepository.save(new ProcessedEvent(eventId, "PaymentFailed")))
                            .then();
                });
    }

    public Mono<OrderEntity> expireOrder(UUID orderId) {
        return orderRepository.findById(orderId)
                .switchIfEmpty(Mono.error(new BusinessException(404, "ORDER_NOT_FOUND", "Order not found: " + orderId)))
                .flatMap(order -> {
                    if ("PAID".equals(order.getStatus()) || "COMPLETED".equals(order.getStatus())) {
                        return Mono.error(new BusinessException(400, "ORDER_ALREADY_PAID", "Order already paid"));
                    }
                    order.setStatus("EXPIRED");
                    order.setUpdatedAt(Instant.now());
                    return orderRepository.save(order)
                            .then(subOrderRepository.findByOrderId(orderId)
                                    .flatMap(sub -> {
                                        sub.setStatus("CANCELLED");
                                        sub.setUpdatedAt(Instant.now());
                                        return subOrderRepository.save(sub);
                                    }).then())
                            .then(outboxHelper.recordEvent(
                                    KafkaTopics.ORDER_EVENTS,
                                    "Order",
                                    orderId.toString(),
                                    "ReleaseStock",
                                    new ReleaseStockPayload(orderId, "Payment expired (15-minute timeout)")
                            ))
                            .thenReturn(order);
                });
    }

    public Mono<OrderEntity> cancelOrder(UUID orderId, String reason) {
        return orderRepository.findById(orderId)
                .switchIfEmpty(Mono.error(new BusinessException(404, "ORDER_NOT_FOUND", "Order not found: " + orderId)))
                .flatMap(order -> {
                    if ("COMPLETED".equals(order.getStatus())) {
                        return Mono.error(new BusinessException(400, "ORDER_COMPLETED", "Cannot cancel completed order"));
                    }
                    order.setStatus("CANCELLED");
                    order.setUpdatedAt(Instant.now());
                    return orderRepository.save(order)
                            .then(subOrderRepository.findByOrderId(orderId)
                                    .flatMap(sub -> {
                                        sub.setStatus("REJECTED");
                                        return subOrderRepository.save(sub);
                                    }).then())
                            .then(outboxHelper.recordEvent(
                                    KafkaTopics.ORDER_EVENTS,
                                    "Order",
                                    orderId.toString(),
                                    "ReleaseStock",
                                    new ReleaseStockPayload(orderId, reason != null ? reason : "Order cancelled by buyer/system")
                            ))
                            .thenReturn(order);
                });
    }
}
