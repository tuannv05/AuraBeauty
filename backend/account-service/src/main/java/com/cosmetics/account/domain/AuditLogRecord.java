package com.cosmetics.account.domain;

import java.time.Instant;
import java.util.Objects;

/**
 * Enterprise Audit Log Record for security auditing and compliance.
 * Pure Java 21 domain record immutable by design.
 */
public record AuditLogRecord(
        String logId,
        String actorId,
        Role actorRole,
        String action,
        String targetType,
        String targetId,
        String details,
        String ipAddress,
        Instant timestamp
) {
    public AuditLogRecord {
        Objects.requireNonNull(actorId, "actorId must not be null");
        Objects.requireNonNull(action, "action must not be null");
        if (timestamp == null) {
            timestamp = Instant.now();
        }
    }

    public static AuditLogRecord of(String actorId, Role actorRole, String action, String targetType, String targetId, String details, String ipAddress) {
        return new AuditLogRecord(null, actorId, actorRole, action, targetType, targetId, details, ipAddress, Instant.now());
    }
}
