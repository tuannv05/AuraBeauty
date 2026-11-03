package com.cosmetics.common.web;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.server.ServerWebExchange;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

public class SecurityHeaderUtils {
    public static final String HEADER_USER_ID = "X-User-Id";
    public static final String HEADER_USER_ROLES = "X-User-Roles";
    public static final String HEADER_USER_EMAIL = "X-User-Email";

    public static UUID getUserId(ServerWebExchange exchange) {
        String idStr = exchange.getRequest().getHeaders().getFirst(HEADER_USER_ID);
        if (idStr == null || idStr.isBlank()) {
            return null;
        }
        try {
            return UUID.fromString(idStr);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    public static List<String> getUserRoles(ServerWebExchange exchange) {
        String rolesStr = exchange.getRequest().getHeaders().getFirst(HEADER_USER_ROLES);
        if (rolesStr == null || rolesStr.isBlank()) {
            return Collections.emptyList();
        }
        return Arrays.stream(rolesStr.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }

    public static String getUserEmail(ServerWebExchange exchange) {
        return exchange.getRequest().getHeaders().getFirst(HEADER_USER_EMAIL);
    }

    public static boolean hasRole(ServerWebExchange exchange, String role) {
        return getUserRoles(exchange).contains(role);
    }
}
