package com.cosmetics.common.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.support.WebExchangeBindException;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(BusinessException.class)
    public Mono<ResponseEntity<ProblemDetail>> handleBusinessException(BusinessException ex, org.springframework.web.server.ServerWebExchange exchange) {
        String correlationId = SecurityHeaderUtils.getCorrelationId(exchange);
        log.warn("Business error [{}]: {} (Correlation: {})", ex.getErrorCode(), ex.getMessage(), correlationId);
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(ex.getStatus(), ex.getMessage());
        problem.setTitle("Business Rule Violation");
        problem.setType(URI.create("urn:error:" + ex.getErrorCode().toLowerCase()));
        problem.setProperty("errorCode", ex.getErrorCode());
        problem.setProperty("correlationId", correlationId != null ? correlationId : "N/A");
        problem.setProperty("timestamp", Instant.now());
        return Mono.just(ResponseEntity.status(ex.getStatus()).body(problem));
    }

    @ExceptionHandler(WebExchangeBindException.class)
    public Mono<ResponseEntity<ProblemDetail>> handleValidationException(WebExchangeBindException ex, org.springframework.web.server.ServerWebExchange exchange) {
        String correlationId = SecurityHeaderUtils.getCorrelationId(exchange);
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getFieldErrors().forEach(err -> fieldErrors.put(err.getField(), err.getDefaultMessage()));

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Validation failed for request fields");
        problem.setTitle("Validation Error");
        problem.setType(URI.create("urn:error:validation"));
        problem.setProperty("errorCode", "VALIDATION_FAILED");
        problem.setProperty("correlationId", correlationId != null ? correlationId : "N/A");
        problem.setProperty("invalidFields", fieldErrors);
        problem.setProperty("timestamp", Instant.now());
        return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problem));
    }

    @ExceptionHandler(Exception.class)
    public Mono<ResponseEntity<ProblemDetail>> handleGenericException(Exception ex, org.springframework.web.server.ServerWebExchange exchange) {
        String correlationId = SecurityHeaderUtils.getCorrelationId(exchange);
        log.error("Unhandled internal server error (Correlation: {}): ", correlationId, ex);
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred. Please contact system support.");
        problem.setTitle("Internal Server Error");
        problem.setType(URI.create("urn:error:internal"));
        problem.setProperty("errorCode", "INTERNAL_SERVER_ERROR");
        problem.setProperty("correlationId", correlationId != null ? correlationId : "N/A");
        problem.setProperty("timestamp", Instant.now());
        return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(problem));
    }
}
