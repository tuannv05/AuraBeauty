package com.cosmetics.account.adapter.in.web;

import com.cosmetics.account.application.AuthService;
import com.cosmetics.account.application.dto.AuthResponse;
import com.cosmetics.account.application.dto.LoginRequest;
import com.cosmetics.account.application.dto.RefreshTokenRequest;
import com.cosmetics.account.application.dto.RegisterRequest;
import com.cosmetics.common.web.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        return authService.registerBuyer(request).map(ApiResponse::ok);
    }

    @PostMapping("/login")
    public Mono<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request).map(ApiResponse::ok);
    }

    @PostMapping("/refresh")
    public Mono<ApiResponse<AuthResponse>> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return authService.refreshToken(request.getRefreshToken()).map(ApiResponse::ok);
    }
}
