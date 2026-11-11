package com.cosmetics.common.web;

import org.springframework.http.HttpStatus;

public class BusinessException extends RuntimeException {
    private final HttpStatus status;
    private final String errorCode;

    public BusinessException(HttpStatus status, String errorCode, String message) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }

    public BusinessException(int statusCode, String errorCode, String message) {
        super(message);
        HttpStatus resolved = HttpStatus.resolve(statusCode);
        this.status = resolved != null ? resolved : HttpStatus.BAD_REQUEST;
        this.errorCode = errorCode;
    }

    public BusinessException(String errorCode, String message) {
        super(message);
        this.status = HttpStatus.BAD_REQUEST;
        this.errorCode = errorCode;
    }

    public HttpStatus getStatus() { return status; }
    public int getStatusCode() { return status != null ? status.value() : 400; }
    public String getErrorCode() { return errorCode; }
}
