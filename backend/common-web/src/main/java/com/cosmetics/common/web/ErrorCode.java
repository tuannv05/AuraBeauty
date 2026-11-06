package com.cosmetics.common.web;

import org.springframework.http.HttpStatus;

/**
 * Standardized Domain & Platform Error Codes (E1 - E5).
 * Compliant with RFC 9457 HTTP Problem Details.
 */
public enum ErrorCode {
    E1_FORBIDDEN_ACCESS(
        "E1_FORBIDDEN_ACCESS",
        HttpStatus.FORBIDDEN,
        "Không có quyền thao tác trên tài nguyên hoặc vi phạm phân vùng dữ liệu gian hàng"
    ),
    E2_RESOURCE_NOT_FOUND(
        "E2_RESOURCE_NOT_FOUND",
        HttpStatus.NOT_FOUND,
        "Không tìm thấy tài nguyên hoặc đối tượng được yêu cầu"
    ),
    E3_DOMAIN_INVARIANT_VIOLATION(
        "E3_DOMAIN_INVARIANT_VIOLATION",
        HttpStatus.UNPROCESSABLE_ENTITY,
        "Vi phạm luật bất biến nghiệp vụ (mã CBMP không hợp lệ, chứa chất cấm hoặc sai lệch sổ cái)"
    ),
    E4_CONCURRENCY_OR_STOCK_CONFLICT(
        "E4_CONCURRENCY_OR_STOCK_CONFLICT",
        HttpStatus.CONFLICT,
        "Xung đột giữ kho nguyên tử CAS hoặc lô hàng FEFO cận date dưới 6 tháng"
    ),
    E5_DUPLICATE_IDEMPOTENT_REQUEST(
        "E5_DUPLICATE_IDEMPOTENT_REQUEST",
        HttpStatus.OK,
        "Yêu cầu hoặc sự kiện trùng lặp đã được hệ thống xử lý an toàn trước đó"
    );

    private final String code;
    private final HttpStatus httpStatus;
    private final String defaultMessage;

    ErrorCode(String code, HttpStatus httpStatus, String defaultMessage) {
        this.code = code;
        this.httpStatus = httpStatus;
        this.defaultMessage = defaultMessage;
    }

    public String getCode() { return code; }
    public HttpStatus getHttpStatus() { return httpStatus; }
    public String getDefaultMessage() { return defaultMessage; }

    public BusinessException toException(String customDetail) {
        return new BusinessException(httpStatus, code, customDetail != null ? customDetail : defaultMessage);
    }
}
