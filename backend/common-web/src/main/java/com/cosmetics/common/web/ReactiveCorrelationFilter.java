package com.cosmetics.common.web;

import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.UUID;

/**
 * Enterprise Reactive Correlation WebFilter.
 * Automatically propagates X-Correlation-Id across Spring WebFlux reactive pipelines and response headers.
 */
@Component
public class ReactiveCorrelationFilter implements WebFilter, Ordered {

    public static final String CORRELATION_ID_KEY = "CORRELATION_ID";

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String correlationId = exchange.getRequest().getHeaders().getFirst(SecurityHeaderUtils.HEADER_CORRELATION_ID);
        if (correlationId == null || correlationId.isBlank()) {
            correlationId = UUID.randomUUID().toString();
        }

        final String finalCorrelationId = correlationId;

        // Gán vào response header để client theo dõi
        exchange.getResponse().getHeaders().set(SecurityHeaderUtils.HEADER_CORRELATION_ID, finalCorrelationId);

        return chain.filter(exchange)
            .contextWrite(context -> context.put(CORRELATION_ID_KEY, finalCorrelationId));
    }
}
