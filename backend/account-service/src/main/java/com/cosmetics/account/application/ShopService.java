package com.cosmetics.account.application;

import com.cosmetics.account.adapter.out.persistence.QuarkusOutboxHelper;
import com.cosmetics.account.adapter.out.persistence.ShopEntity;
import com.cosmetics.account.adapter.out.persistence.ShopRepository;
import com.cosmetics.account.adapter.out.persistence.UserEntity;
import com.cosmetics.account.adapter.out.persistence.UserRepository;
import com.cosmetics.account.application.dto.ShopRegisterRequest;
import com.cosmetics.account.application.dto.ShopResponseDto;
import com.cosmetics.common.events.KafkaTopics;
import com.cosmetics.common.web.BusinessException;
import jakarta.enterprise.context.ApplicationScoped;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.*;

@ApplicationScoped
public class ShopService {
    private final ShopRepository shopRepository;
    private final UserRepository userRepository;
    private final QuarkusOutboxHelper outboxHelper;

    public ShopService(ShopRepository shopRepository, UserRepository userRepository, QuarkusOutboxHelper outboxHelper) {
        this.shopRepository = shopRepository;
        this.userRepository = userRepository;
        this.outboxHelper = outboxHelper;
    }

    public Mono<ShopResponseDto> registerShop(UUID userId, ShopRegisterRequest request) {
        return shopRepository.existsByShopName(request.getShopName())
                .flatMap(exists -> {
                    if (Boolean.TRUE.equals(exists)) {
                        return Mono.error(new BusinessException(409, "SHOP_001", "Shop name is already taken"));
                    }
                    ShopEntity shop = new ShopEntity(
                            UUID.randomUUID(),
                            userId,
                            request.getShopName(),
                            request.getDescription(),
                            "PENDING",
                            request.getBusinessRegistrationNo()
                    );
                    return shopRepository.save(shop)
                            .flatMap(saved -> userRepository.findById(userId)
                                    .flatMap(user -> {
                                        if (!user.getRoles().contains("ROLE_SELLER")) {
                                            user.setRoles(user.getRoles() + ",ROLE_SELLER");
                                            return userRepository.save(user);
                                        }
                                        return Mono.just(user);
                                    })
                                    .then(outboxHelper.recordEvent(
                                            KafkaTopics.SHOP_EVENTS,
                                            "Shop",
                                            saved.getId().toString(),
                                            "ShopRegistered",
                                            Map.of("shopId", saved.getId(), "ownerId", saved.getOwnerId(), "shopName", saved.getShopName())
                                    ))
                                    .thenReturn(toDto(saved)));
                });
    }

    public Mono<ShopResponseDto> approveShop(UUID shopId) {
        return shopRepository.findById(shopId)
                .switchIfEmpty(Mono.error(new BusinessException(404, "SHOP_002", "Shop not found")))
                .flatMap(shop -> {
                    shop.setStatus("APPROVED");
                    shop.setUpdatedAt(Instant.now());
                    return shopRepository.save(shop)
                            .flatMap(saved -> outboxHelper.recordEvent(
                                    KafkaTopics.SHOP_EVENTS,
                                    "Shop",
                                    saved.getId().toString(),
                                    "ShopApproved",
                                    Map.of("shopId", saved.getId(), "ownerId", saved.getOwnerId(), "shopName", saved.getShopName())
                            ).thenReturn(toDto(saved)));
                });
    }

    public Mono<ShopResponseDto> rejectShop(UUID shopId) {
        return shopRepository.findById(shopId)
                .switchIfEmpty(Mono.error(new BusinessException(404, "SHOP_002", "Shop not found")))
                .flatMap(shop -> {
                    shop.setStatus("REJECTED");
                    shop.setUpdatedAt(Instant.now());
                    return shopRepository.save(shop).map(this::toDto);
                });
    }

    public Mono<ShopResponseDto> getShopById(UUID shopId) {
        return shopRepository.findById(shopId)
                .switchIfEmpty(Mono.error(new BusinessException(404, "SHOP_002", "Shop not found")))
                .map(this::toDto);
    }

    public Flux<ShopResponseDto> getMyShops(UUID ownerId) {
        return shopRepository.findByOwnerId(ownerId).map(this::toDto);
    }

    public Flux<ShopResponseDto> getPendingShops() {
        return shopRepository.findByStatus("PENDING").map(this::toDto);
    }

    private ShopResponseDto toDto(ShopEntity s) {
        return new ShopResponseDto(
                s.getId(),
                s.getOwnerId(),
                s.getShopName(),
                s.getDescription(),
                s.getStatus(),
                s.getBusinessRegistrationNo(),
                s.getCreatedAt()
        );
    }
}
