package com.cosmetics.account.application;

import com.cosmetics.account.adapter.out.jwt.JwtTokenProvider;
import com.cosmetics.account.adapter.out.persistence.ShopEntity;
import com.cosmetics.account.adapter.out.persistence.ShopRepository;
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
    private final ShopRepository shopRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       ShopRepository shopRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.shopRepository = shopRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public Mono<AuthResponse> register(RegisterRequest request) {
        return userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .flatMap(existing -> Mono.<AuthResponse>error(
                        new BusinessException(HttpStatus.CONFLICT, "ACCOUNT_001", "Email đã tồn tại trong hệ thống")
                ))
                .switchIfEmpty(Mono.defer(() -> {
                    String hashed = passwordEncoder.encode(request.getPassword());
                    boolean isSeller = "SELLER".equalsIgnoreCase(request.getRole());
                    String rolesStr = isSeller ? "ROLE_SELLER,ROLE_BUYER" : "ROLE_BUYER";
                    UUID userId = UUID.randomUUID();

                    UserEntity user = new UserEntity(
                            userId,
                            request.getEmail().trim().toLowerCase(),
                            hashed,
                            request.getFullName().trim(),
                            request.getPhone() != null ? request.getPhone().trim() : "",
                            rolesStr,
                            "ACTIVE"
                    );

                    return userRepository.save(user)
                            .flatMap(savedUser -> {
                                List<String> roles = Arrays.stream(rolesStr.split(",")).toList();
                                String accessToken = tokenProvider.generateAccessToken(savedUser.getId(), savedUser.getEmail(), roles);
                                String refreshToken = tokenProvider.generateRefreshToken(savedUser.getId());

                                if (isSeller) {
                                    String sName = (request.getShopName() != null && !request.getShopName().isBlank())
                                            ? request.getShopName().trim()
                                            : "Gian Hàng " + savedUser.getFullName();
                                    ShopEntity shop = new ShopEntity(
                                            UUID.randomUUID(),
                                            savedUser.getId(),
                                            sName,
                                            "Gian hàng mỹ phẩm đăng ký mới",
                                            "PENDING",
                                            "DKKD-" + Math.floor(100000 + Math.random() * 900000)
                                    );
                                    return shopRepository.save(shop)
                                            .thenReturn(new AuthResponse(savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), roles, accessToken, refreshToken));
                                }

                                return Mono.just(new AuthResponse(savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), roles, accessToken, refreshToken));
                            });
                }));
    }

    public Mono<AuthResponse> login(LoginRequest request) {
        return userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .switchIfEmpty(Mono.error(new BusinessException(HttpStatus.UNAUTHORIZED, "AUTH_001", "Email hoặc mật khẩu không chính xác")))
                .flatMap(user -> {
                    if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                        return Mono.error(new BusinessException(HttpStatus.UNAUTHORIZED, "AUTH_001", "Email hoặc mật khẩu không chính xác"));
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
            return Mono.error(new BusinessException(HttpStatus.UNAUTHORIZED, "AUTH_002", "Refresh token không hợp lệ hoặc đã hết hạn"));
        }
        UUID userId = tokenProvider.getUserId(refreshToken);
        return userRepository.findById(userId)
                .switchIfEmpty(Mono.error(new BusinessException(HttpStatus.UNAUTHORIZED, "AUTH_003", "Người dùng không tồn tại")))
                .map(user -> {
                    List<String> roles = Arrays.stream(user.getRoles().split(","))
                            .map(String::trim)
                            .toList();
                    String newAccessToken = tokenProvider.generateAccessToken(user.getId(), user.getEmail(), roles);
                    return new AuthResponse(user.getId(), user.getEmail(), user.getFullName(), roles, newAccessToken, refreshToken);
                });
    }
}
