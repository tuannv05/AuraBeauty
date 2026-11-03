package com.cosmetics.account.adapter.in.web;

import com.cosmetics.account.adapter.out.jwt.JwtTokenProvider;
import com.cosmetics.account.application.ShopService;
import com.cosmetics.account.application.dto.ShopRegisterRequest;
import com.cosmetics.account.application.dto.ShopResponseDto;
import com.cosmetics.common.web.ApiResponse;
import com.cosmetics.common.web.BusinessException;
import com.cosmetics.common.web.SecurityHeaderUtils;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ShopController {
    private final ShopService shopService;
    private final JwtTokenProvider tokenProvider;

    public ShopController(ShopService shopService, JwtTokenProvider tokenProvider) {
        this.shopService = shopService;
        this.tokenProvider = tokenProvider;
    }

    private UUID resolveUserId(ServerWebExchange exchange) {
        UUID userId = SecurityHeaderUtils.getUserId(exchange);
        if (userId != null) return userId;

        String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (tokenProvider.validateToken(token)) {
                return tokenProvider.getUserId(token);
            }
        }
        throw new BusinessException(HttpStatus.UNAUTHORIZED, "AUTH_REQUIRED", "Authentication required");
    }

    private void verifyAdminRole(ServerWebExchange exchange) {
        List<String> roles = SecurityHeaderUtils.getUserRoles(exchange);
        if (!roles.contains("ROLE_ADMIN")) {
            String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (tokenProvider.validateToken(token) && tokenProvider.getRoles(token).contains("ROLE_ADMIN")) {
                    return;
                }
            }
            throw new BusinessException(HttpStatus.FORBIDDEN, "FORBIDDEN", "Admin privileges required");
        }
    }

    @PostMapping("/shops/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<ApiResponse<ShopResponseDto>> registerShop(
            @Valid @RequestBody ShopRegisterRequest request,
            ServerWebExchange exchange
    ) {
        UUID userId = resolveUserId(exchange);
        return shopService.registerShop(userId, request).map(ApiResponse::ok);
    }

    @GetMapping("/shops/my")
    public Mono<ApiResponse<List<ShopResponseDto>>> getMyShops(ServerWebExchange exchange) {
        UUID userId = resolveUserId(exchange);
        return shopService.getMyShops(userId).collectList().map(ApiResponse::ok);
    }

    @GetMapping("/shops/{id}")
    public Mono<ApiResponse<ShopResponseDto>> getShopById(@PathVariable UUID id) {
        return shopService.getShopById(id).map(ApiResponse::ok);
    }

    @GetMapping("/admin/shops/pending")
    public Mono<ApiResponse<List<ShopResponseDto>>> getPendingShops(ServerWebExchange exchange) {
        verifyAdminRole(exchange);
        return shopService.getPendingShops().collectList().map(ApiResponse::ok);
    }

    @PutMapping("/admin/shops/{id}/approve")
    public Mono<ApiResponse<ShopResponseDto>> approveShop(@PathVariable UUID id, ServerWebExchange exchange) {
        verifyAdminRole(exchange);
        return shopService.approveShop(id).map(ApiResponse::ok);
    }

    @PutMapping("/admin/shops/{id}/reject")
    public Mono<ApiResponse<ShopResponseDto>> rejectShop(@PathVariable UUID id, ServerWebExchange exchange) {
        verifyAdminRole(exchange);
        return shopService.rejectShop(id).map(ApiResponse::ok);
    }
}
