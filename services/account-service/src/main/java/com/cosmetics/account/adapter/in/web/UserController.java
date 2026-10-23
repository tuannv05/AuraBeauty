package com.cosmetics.account.adapter.in.web;

import com.cosmetics.account.adapter.out.jwt.JwtTokenProvider;
import com.cosmetics.account.application.UserService;
import com.cosmetics.account.application.dto.SkinProfileDto;
import com.cosmetics.account.application.dto.UserProfileDto;
import com.cosmetics.common.web.ApiResponse;
import com.cosmetics.common.web.BusinessException;
import com.cosmetics.common.web.SecurityHeaderUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final JwtTokenProvider tokenProvider;

    public UserController(UserService userService, JwtTokenProvider tokenProvider) {
        this.userService = userService;
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

    @GetMapping("/me")
    public Mono<ApiResponse<UserProfileDto>> getMyProfile(ServerWebExchange exchange) {
        UUID userId = resolveUserId(exchange);
        return userService.getProfile(userId).map(ApiResponse::ok);
    }

    @GetMapping("/skin-profile")
    public Mono<ApiResponse<SkinProfileDto>> getSkinProfile(ServerWebExchange exchange) {
        UUID userId = resolveUserId(exchange);
        return userService.getSkinProfile(userId).map(ApiResponse::ok);
    }

    @PutMapping("/skin-profile")
    public Mono<ApiResponse<SkinProfileDto>> updateSkinProfile(
            @RequestBody SkinProfileDto dto,
            ServerWebExchange exchange
    ) {
        UUID userId = resolveUserId(exchange);
        return userService.updateSkinProfile(userId, dto).map(ApiResponse::ok);
    }
}
