package com.cosmetics.account.adapter.out.persistence;

import io.smallrye.mutiny.converters.uni.UniReactorConverters;
import io.vertx.mutiny.pgclient.PgPool;
import io.vertx.mutiny.sqlclient.Row;
import io.vertx.mutiny.sqlclient.Tuple;
import jakarta.enterprise.context.ApplicationScoped;
import reactor.core.publisher.Mono;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

@ApplicationScoped
public class UserRepository {
    private final PgPool pgPool;

    public UserRepository(PgPool pgPool) {
        this.pgPool = pgPool;
    }

    public Mono<UserEntity> findByEmail(String email) {
        String sql = "SELECT id, email, password_hash, full_name, phone, roles, status, created_at, updated_at FROM users WHERE LOWER(email) = LOWER($1)";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(email))
                .map(rows -> {
                    var it = rows.iterator();
                    return it.hasNext() ? toEntity(it.next()) : null;
                })
                .convert().with(UniReactorConverters.toMono());
    }

    public Mono<Boolean> existsByEmail(String email) {
        String sql = "SELECT 1 FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(email))
                .map(rows -> rows.iterator().hasNext())
                .convert().with(UniReactorConverters.toMono());
    }

    public Mono<UserEntity> findById(UUID id) {
        String sql = "SELECT id, email, password_hash, full_name, phone, roles, status, created_at, updated_at FROM users WHERE id = $1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(id))
                .map(rows -> {
                    var it = rows.iterator();
                    return it.hasNext() ? toEntity(it.next()) : null;
                })
                .convert().with(UniReactorConverters.toMono());
    }

    public Mono<UserEntity> save(UserEntity user) {
        if (user.getId() == null) {
            user.setId(UUID.randomUUID());
        }
        String sql = """
            INSERT INTO users (id, email, password_hash, full_name, phone, roles, status, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (id) DO UPDATE SET
                email = EXCLUDED.email,
                password_hash = EXCLUDED.password_hash,
                full_name = EXCLUDED.full_name,
                phone = EXCLUDED.phone,
                roles = EXCLUDED.roles,
                status = EXCLUDED.status,
                updated_at = EXCLUDED.updated_at
        """;
        OffsetDateTime created = user.getCreatedAt() != null ? user.getCreatedAt().atOffset(ZoneOffset.UTC) : OffsetDateTime.now(ZoneOffset.UTC);
        OffsetDateTime updated = user.getUpdatedAt() != null ? user.getUpdatedAt().atOffset(ZoneOffset.UTC) : OffsetDateTime.now(ZoneOffset.UTC);

        return pgPool.preparedQuery(sql)
                .execute(Tuple.wrap(java.util.Arrays.asList(
                        user.getId(),
                        user.getEmail(),
                        user.getPasswordHash(),
                        user.getFullName(),
                        user.getPhone(),
                        user.getRoles(),
                        user.getStatus(),
                        created,
                        updated
                )))
                .map(rows -> user)
                .convert().with(UniReactorConverters.toMono());
    }

    private UserEntity toEntity(Row row) {
        UserEntity u = new UserEntity();
        u.setId(row.getUUID("id"));
        u.setEmail(row.getString("email"));
        u.setPasswordHash(row.getString("password_hash"));
        u.setFullName(row.getString("full_name"));
        u.setPhone(row.getString("phone"));
        u.setRoles(row.getString("roles"));
        u.setStatus(row.getString("status"));
        var created = row.getOffsetDateTime("created_at");
        if (created != null) u.setCreatedAt(created.toInstant());
        var updated = row.getOffsetDateTime("updated_at");
        if (updated != null) u.setUpdatedAt(updated.toInstant());
        return u;
    }
}
