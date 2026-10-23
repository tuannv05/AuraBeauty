package com.cosmetics.order.application;

import com.cosmetics.order.adapter.out.persistence.CartItemEntity;
import com.cosmetics.order.adapter.out.persistence.CartItemRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class CartService {
    private final CartItemRepository cartItemRepository;

    public CartService(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    public Flux<CartItemEntity> getCart(UUID buyerId) {
        return cartItemRepository.findByBuyerId(buyerId);
    }

    public Mono<CartItemEntity> addToCart(UUID buyerId, String skuCode, String productName, UUID shopId, String shopName, BigDecimal unitPrice, int quantity) {
        return cartItemRepository.findByBuyerIdAndSkuCode(buyerId, skuCode)
                .flatMap(existing -> {
                    existing.setQuantity(existing.getQuantity() + quantity);
                    return cartItemRepository.save(existing);
                })
                .switchIfEmpty(Mono.defer(() -> {
                    CartItemEntity item = new CartItemEntity(UUID.randomUUID(), buyerId, shopId, skuCode, productName, shopName, quantity, unitPrice);
                    return cartItemRepository.save(item);
                }));
    }

    public Mono<Void> removeItem(UUID buyerId, String skuCode) {
        return cartItemRepository.findByBuyerIdAndSkuCode(buyerId, skuCode)
                .flatMap(cartItemRepository::delete);
    }

    public Mono<Void> clearCart(UUID buyerId) {
        return cartItemRepository.deleteByBuyerId(buyerId);
    }
}
