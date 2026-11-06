package com.cosmetics.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JwtAuthGatewayFilter implements GlobalFilter, Ordered {

    private final SecretKey key;

    public JwtAuthGatewayFilter(@Value("${jwt.secret:defaultSecretKeyForCosmeticsPlatformProjectMustBeLongEnough123456789}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    private static final List<String> PUBLIC_PREFIXES = List.of(
            "/api/auth/",
            "/api/advisor/",
            "/actuator/"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        // Distributed Tracing: Ensure X-Correlation-Id is present across all Gateway routes
        String correlationId = exchange.getRequest().getHeaders().getFirst("X-Correlation-Id");
        if (correlationId == null || correlationId.isBlank()) {
            correlationId = java.util.UUID.randomUUID().toString();
        }
        exchange.getResponse().getHeaders().set("X-Correlation-Id", correlationId);
        ServerHttpRequest baseMutated = exchange.getRequest().mutate()
                .header("X-Correlation-Id", correlationId)
                .build();
        ServerWebExchange mutatedExchange = exchange.mutate().request(baseMutated).build();

        // 1. Check if public path
        for (String prefix : PUBLIC_PREFIXES) {
            if (path.startsWith(prefix)) {
                return chain.filter(mutatedExchange);
            }
        }

        // Public read-only paths for catalog, shop browsing, and SSE advisor
        if (mutatedExchange.getRequest().getMethod().name().equals("GET")) {
            if (path.startsWith("/api/products") || path.startsWith("/api/shops") || path.startsWith("/api/advisor")) {
                // If token present, still parse and inject headers, but don't reject if missing
                String authHeader = mutatedExchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    try {
                        Claims claims = parseClaims(authHeader.substring(7));
                        ServerHttpRequest mutatedRequest = mutateRequestWithClaims(mutatedExchange.getRequest(), claims);
                        return chain.filter(mutatedExchange.mutate().request(mutatedRequest).build());
                    } catch (Exception ignored) {}
                }
                return chain.filter(mutatedExchange);
            }
        }

        // 2. Secured endpoints: Validate JWT
        String authHeader = mutatedExchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            mutatedExchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return mutatedExchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);
        try {
            Claims claims = parseClaims(token);
            ServerHttpRequest mutatedRequest = mutateRequestWithClaims(mutatedExchange.getRequest(), claims);
            return chain.filter(mutatedExchange.mutate().request(mutatedRequest).build());
        } catch (JwtException | IllegalArgumentException e) {
            mutatedExchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return mutatedExchange.getResponse().setComplete();
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }

    private ServerHttpRequest mutateRequestWithClaims(ServerHttpRequest request, Claims claims) {
        String userId = claims.getSubject();
        String email = claims.get("email", String.class);
        Object rolesObj = claims.get("roles");
        String roles = "";
        if (rolesObj instanceof List<?> list) {
            roles = String.join(",", list.stream().map(Object::toString).toList());
        }

        return request.mutate()
                .header("X-User-Id", userId != null ? userId : "")
                .header("X-User-Email", email != null ? email : "")
                .header("X-User-Roles", roles)
                .build();
    }

    @Override
    public int getOrder() {
        return -100;
    }
}
