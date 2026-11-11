package com.cosmetics.gateway;

import com.cosmetics.gateway.filter.JwtValidator;
import io.jsonwebtoken.Claims;
import io.quarkus.runtime.StartupEvent;
import io.vertx.core.Vertx;
import io.vertx.core.http.*;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@ApplicationScoped
public class GatewayRouter {
    private static final Logger log = LoggerFactory.getLogger(GatewayRouter.class);

    private final JwtValidator jwtValidator;
    private HttpClient httpClient;

    public GatewayRouter(JwtValidator jwtValidator) {
        this.jwtValidator = jwtValidator;
    }

    void init(@Observes StartupEvent ev, Router router, Vertx vertx) {
        this.httpClient = vertx.createHttpClient(new HttpClientOptions()
                .setKeepAlive(true)
                .setMaxPoolSize(100)
                .setConnectTimeout(10000)
                .setIdleTimeout(60));

        router.route("/api/*").handler(BodyHandler.create());
        router.route("/api/*").handler(this::handleApiRequest);
        log.info("API Gateway routes initialized on Vert.x router successfully!");
    }

    private void handleApiRequest(RoutingContext rc) {
        HttpServerRequest serverReq = rc.request();
        HttpServerResponse serverResp = rc.response();
        String path = serverReq.path();

        // 1. CORS Preflight
        if (serverReq.method() == HttpMethod.OPTIONS) {
            addCorsHeaders(serverReq, serverResp);
            serverResp.setStatusCode(204).end();
            return;
        }

        addCorsHeaders(serverReq, serverResp);

        // 2. Correlation ID
        String correlationId = serverReq.getHeader("X-Correlation-Id");
        if (correlationId == null || correlationId.isBlank()) {
            correlationId = UUID.randomUUID().toString();
        }
        serverResp.putHeader("X-Correlation-Id", correlationId);

        // 3. Authentication & Authorization
        String userId = null;
        String email = null;
        String roles = "";

        boolean isPublicPrefix = path.startsWith("/api/auth/") || path.startsWith("/api/advisor/");
        boolean isPublicGet = serverReq.method() == HttpMethod.GET &&
                (path.startsWith("/api/products") || path.startsWith("/api/shops") || path.startsWith("/api/advisor"));

        String authHeader = serverReq.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            Claims claims = jwtValidator.parseClaims(token);
            if (claims != null) {
                userId = claims.getSubject();
                email = claims.get("email", String.class);
                Object rolesObj = claims.get("roles");
                if (rolesObj instanceof List<?> list) {
                    roles = String.join(",", list.stream().map(Object::toString).toList());
                }
            } else if (!isPublicPrefix && !isPublicGet) {
                serverResp.setStatusCode(401)
                        .putHeader("Content-Type", "application/json")
                        .end("{\"status\":401,\"error\":\"UNAUTHORIZED\",\"message\":\"Invalid JWT token\"}");
                return;
            }
        } else if (!isPublicPrefix && !isPublicGet) {
            serverResp.setStatusCode(401)
                    .putHeader("Content-Type", "application/json")
                    .end("{\"status\":401,\"error\":\"UNAUTHORIZED\",\"message\":\"Missing or invalid Authorization header\"}");
            return;
        }

        // 4. Resolve Target Port
        int targetPort = resolveTargetPort(path);
        if (targetPort <= 0) {
            serverResp.setStatusCode(404)
                    .putHeader("Content-Type", "application/json")
                    .end("{\"status\":404,\"error\":\"NOT_FOUND\",\"message\":\"No service found for path " + path + "\"}");
            return;
        }

        // 5. Proxy forwarding
        final String finalCorrId = correlationId;
        final String finalUserId = userId;
        final String finalEmail = email;
        final String finalRoles = roles;

        httpClient.request(serverReq.method(), targetPort, "localhost", serverReq.uri())
                .onSuccess(clientReq -> {
                    // Copy request headers
                    for (Map.Entry<String, String> header : serverReq.headers()) {
                        String key = header.getKey();
                        if (!"host".equalsIgnoreCase(key) && !"content-length".equalsIgnoreCase(key)) {
                            clientReq.headers().add(key, header.getValue());
                        }
                    }
                    clientReq.headers().set("Host", "localhost:" + targetPort);
                    clientReq.headers().set("X-Correlation-Id", finalCorrId);
                    if (finalUserId != null) clientReq.headers().set("X-User-Id", finalUserId);
                    if (finalEmail != null) clientReq.headers().set("X-User-Email", finalEmail);
                    if (!finalRoles.isEmpty()) clientReq.headers().set("X-User-Roles", finalRoles);

                    // Hook response handler
                    clientReq.response().onSuccess(clientResp -> {
                        serverResp.setStatusCode(clientResp.statusCode());
                        serverResp.setChunked(true);
                        for (Map.Entry<String, String> header : clientResp.headers()) {
                            String key = header.getKey();
                            if (!"transfer-encoding".equalsIgnoreCase(key) && !"content-length".equalsIgnoreCase(key)) {
                                serverResp.headers().add(key, header.getValue());
                            }
                        }
                        serverResp.headers().set("X-Correlation-Id", finalCorrId);
                        addCorsHeaders(serverReq, serverResp);

                        clientResp.pipeTo(serverResp).onFailure(err -> {
                            log.warn("Response pipe broken for {}: {}", path, err.getMessage());
                        });
                    }).onFailure(err -> {
                        log.error("Failed to receive response from target {}: {}", path, err.getMessage());
                        if (!serverResp.ended()) {
                            serverResp.setStatusCode(502).end("Bad Gateway: " + err.getMessage());
                        }
                    });

                    // Forward body
                    if (serverReq.method() == HttpMethod.GET || serverReq.method() == HttpMethod.HEAD) {
                        clientReq.end();
                    } else {
                        io.vertx.core.buffer.Buffer body = rc.body().buffer();
                        if (body != null && body.length() > 0) {
                            clientReq.end(body);
                        } else {
                            clientReq.end();
                        }
                    }
                })
                .onFailure(err -> {
                    log.error("Connection failed to port {}: {}", targetPort, err.getMessage());
                    if (!serverResp.ended()) {
                        serverResp.setStatusCode(503).end("Service Unavailable on port " + targetPort);
                    }
                });
    }

    private int resolveTargetPort(String path) {
        if (path.startsWith("/api/auth") || path.startsWith("/api/users") || path.startsWith("/api/v1/accounts") || path.startsWith("/api/shops") || path.startsWith("/api/admin/shops")) {
            return 8081; // account-service
        } else if (path.startsWith("/api/products")) {
            return 8082; // catalog-service
        } else if (path.startsWith("/api/inventory")) {
            return 8083; // inventory-service
        } else if (path.startsWith("/api/cart") || path.startsWith("/api/orders")) {
            return 8084; // order-service
        } else if (path.startsWith("/api/payments") || path.startsWith("/api/ledger")) {
            return 8085; // payment-service
        } else if (path.startsWith("/api/advisor")) {
            return 8086; // ai-advisor-service
        }
        return -1;
    }

    private void addCorsHeaders(HttpServerRequest req, HttpServerResponse resp) {
        String origin = req.getHeader("Origin");
        resp.putHeader("Access-Control-Allow-Origin", origin != null ? origin : "*");
        resp.putHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
        resp.putHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, X-Requested-With, X-Correlation-Id, X-User-Id, X-Buyer-Id");
        resp.putHeader("Access-Control-Allow-Credentials", "true");
        resp.putHeader("Access-Control-Max-Age", "3600");
    }
}
