package com.cosmetics.account.application;

import com.cosmetics.account.adapter.out.jwt.JwtTokenProvider;
import com.cosmetics.account.adapter.out.persistence.UserEntity;
import com.cosmetics.account.adapter.out.persistence.UserRepository;
import com.cosmetics.account.application.dto.AuthResponse;
import com.cosmetics.account.application.dto.LoginRequest;
import com.cosmetics.account.application.dto.RegisterRequest;
import com.cosmetics.common.web.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public Mono<AuthResponse> registerBuyer(RegisterRequest request) {
        return userRepository.findByEmail(request.getEmail())
                .flatMap(existing -> Mono.<AuthResponse>error(
                        new BusinessException(HttpStatus.CONFLICT, "ACCOUNT_001", "Email already exists in system")
                ))
                .switchIfEmpty(Mono.defer(() -> {
                    String hashed = passwordEncoder.encode(request.getPassword());
                    UserEntity entity = new UserEntity(
                            UUID.randomUUID(),
                            request.getEmail(),
                            hashed,
                            request.getFullName(),
                            request.getPhone(),
                            "ROLE_BUYER",
                            "ACTIVE"
                    );
                    return userRepository.save(entity)
                            .map(saved -> {
                                List<String> roles = List.of("ROLE_BUYER");
                                String accessToken = tokenProvider.generateAccessToken(saved.getId(), saved.getEmail(), roles);
                                String refreshToken = tokenProvider.generateRefreshToken(saved.getId());
                                return new AuthResponse(saved.getId(), saved.getEmail(), saved.getFullName(), roles, accessToken, refreshToken);
                            });
                }));
    }

    public Mono<AuthResponse> login(LoginRequest request) {
        return userRepository.findByEmail(request.getEmail())
                .switchIfEmpty(Mono.error(new BusinessException(HttpStatus.UNAUTHORIZED, "AUTH_001", "Invalid email or password")))
                .flatMap(user -> {
                    if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                        return Mono.error(new BusinessException(HttpStatus.UNAUTHORIZED, "AUTH_001", "Invalid email or password"));
                    }
                    List<String> roles = Arrays.stream(user.getRoles().split(","))
                            .map(String::trim)
                            .toList();
                    String accessToken = tokenProvider.generateAccessToken(user.getId(), user.getEmail(), roles);
                    String refreshToken = tokenProvider.generateRefreshToken(user.getId());
                    return Mono.just(new AuthResponse(user.getId(), user.getEmail(), user.getFullName(), roles, accessToken, refreshToken));
                });
    }

    public Mono<AuthResponse> refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            return Mono.error(new BusinessException(HttpStatus.UNAUTHORIZED, "AUTH_002", "Refresh token is invalid or expired"));
        }
        UUID userId = tokenProvider.getUserId(refreshToken);
        return userRepository.findById(userId)
                .switchIfEmpty(Mono.error(new BusinessException(HttpStatus.UNAUTHORIZED, "AUTH_003", "User not found")))
                .map(user -> {
                    List<String> roles = Arrays.stream(user.getRoles().split(","))
                            .map(String::trim)
                            .toList();
                    String newAccessToken = tokenProvider.generateAccessToken(user.getId(), user.getEmail(), roles);
                    return new AuthResponse(user.getId(), user.getEmail(), user.getFullName(), roles, newAccessToken, refreshToken);
                });
    }
}
