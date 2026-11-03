package com.cosmetics.account.adapter.in.web;

import com.cosmetics.account.adapter.out.jwt.JwtTokenProvider;
import com.cosmetics.account.application.UserService;
import com.cosmetics.account.application.dto.AddressDto;
import com.cosmetics.account.application.dto.ChangePasswordRequest;
import com.cosmetics.account.application.dto.SkinProfileDto;
import com.cosmetics.account.application.dto.UpdateProfileRequest;
import com.cosmetics.account.application.dto.UserProfileDto;
import com.cosmetics.common.web.ApiResponse;
import com.cosmetics.common.web.BusinessException;
import com.cosmetics.common.web.SecurityHeaderUtils;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping({"/api/users", "/api/v1/accounts"})
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
        throw new BusinessException(HttpStatus.UNAUTHORIZED, "AUTH_REQUIRED", "Yêu cầu đăng nhập tài khoản");
    }

    @GetMapping("/me")
    public Mono<ApiResponse<UserProfileDto>> getMyProfile(ServerWebExchange exchange) {
        UUID userId = resolveUserId(exchange);
        return userService.getProfile(userId).map(ApiResponse::ok);
    }

    @PutMapping("/profile")
    public Mono<ApiResponse<UserProfileDto>> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            ServerWebExchange exchange
    ) {
        UUID userId = resolveUserId(exchange);
        return userService.updateProfile(userId, request).map(ApiResponse::ok);
    }

    @PutMapping("/change-password")
    public Mono<ApiResponse<String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            ServerWebExchange exchange
    ) {
        UUID userId = resolveUserId(exchange);
        return userService.changePassword(userId, request)
                .thenReturn(ApiResponse.ok("Đổi mật khẩu thành công"));
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

    // Address Book Endpoints
    @GetMapping("/addresses")
    public Mono<ApiResponse<List<AddressDto>>> getAddresses(ServerWebExchange exchange) {
        UUID userId = resolveUserId(exchange);
        return userService.getAddresses(userId).collectList().map(ApiResponse::ok);
    }

    @PostMapping("/addresses")
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<ApiResponse<AddressDto>> addAddress(
            @RequestBody AddressDto dto,
            ServerWebExchange exchange
    ) {
        UUID userId = resolveUserId(exchange);
        return userService.addAddress(userId, dto).map(ApiResponse::ok);
    }

    @DeleteMapping("/addresses/{id}")
    public Mono<ApiResponse<String>> deleteAddress(
            @PathVariable UUID id,
            ServerWebExchange exchange
    ) {
        UUID userId = resolveUserId(exchange);
        return userService.deleteAddress(userId, id)
                .thenReturn(ApiResponse.ok("Đã xóa địa chỉ thành công"));
    }

    @PutMapping("/addresses/{id}/default")
    public Mono<ApiResponse<AddressDto>> setDefaultAddress(
            @PathVariable UUID id,
            ServerWebExchange exchange
    ) {
        UUID userId = resolveUserId(exchange);
        return userService.setDefaultAddress(userId, id).map(ApiResponse::ok);
    }
}
