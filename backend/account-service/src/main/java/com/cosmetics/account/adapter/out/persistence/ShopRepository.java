package com.cosmetics.account.adapter.out.persistence;

import io.smallrye.mutiny.converters.multi.MultiReactorConverters;
import io.smallrye.mutiny.converters.uni.UniReactorConverters;
import io.vertx.mutiny.pgclient.PgPool;
import io.vertx.mutiny.sqlclient.Row;
import io.vertx.mutiny.sqlclient.Tuple;
import jakarta.enterprise.context.ApplicationScoped;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

@ApplicationScoped
public class ShopRepository {
    private final PgPool pgPool;

    public ShopRepository(PgPool pgPool) {
        this.pgPool = pgPool;
    }

    public Flux<ShopEntity> findByOwnerId(UUID ownerId) {
        String sql = "SELECT id, owner_id, shop_name, description, status, business_registration_no, created_at, updated_at FROM shops WHERE owner_id = $1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(ownerId))
                .onItem().transformToMulti(rows -> io.smallrye.mutiny.Multi.createFrom().iterable(rows))
                .map(this::toEntity)
                .convert().with(MultiReactorConverters.toFlux());
    }

    public Flux<ShopEntity> findByStatus(String status) {
        String sql = "SELECT id, owner_id, shop_name, description, status, business_registration_no, created_at, updated_at FROM shops WHERE status = $1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(status))
                .onItem().transformToMulti(rows -> io.smallrye.mutiny.Multi.createFrom().iterable(rows))
                .map(this::toEntity)
                .convert().with(MultiReactorConverters.toFlux());
    }

    public Mono<Boolean> existsByShopName(String shopName) {
        String sql = "SELECT 1 FROM shops WHERE LOWER(shop_name) = LOWER($1) LIMIT 1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(shopName))
                .map(rows -> rows.iterator().hasNext())
                .convert().with(UniReactorConverters.toMono());
    }

    public Mono<ShopEntity> findById(UUID id) {
        String sql = "SELECT id, owner_id, shop_name, description, status, business_registration_no, created_at, updated_at FROM shops WHERE id = $1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(id))
                .map(rows -> {
                    var it = rows.iterator();
                    return it.hasNext() ? toEntity(it.next()) : null;
                })
                .convert().with(UniReactorConverters.toMono());
    }

    public Mono<ShopEntity> save(ShopEntity shop) {
        if (shop.getId() == null) {
            shop.setId(UUID.randomUUID());
        }
        String sql = """
            INSERT INTO shops (id, owner_id, shop_name, description, status, business_registration_no, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (id) DO UPDATE SET
                owner_id = EXCLUDED.owner_id,
                shop_name = EXCLUDED.shop_name,
                description = EXCLUDED.description,
                status = EXCLUDED.status,
                business_registration_no = EXCLUDED.business_registration_no,
                updated_at = EXCLUDED.updated_at
        """;
        OffsetDateTime created = shop.getCreatedAt() != null ? shop.getCreatedAt().atOffset(ZoneOffset.UTC) : OffsetDateTime.now(ZoneOffset.UTC);
        OffsetDateTime updated = shop.getUpdatedAt() != null ? shop.getUpdatedAt().atOffset(ZoneOffset.UTC) : OffsetDateTime.now(ZoneOffset.UTC);

        return pgPool.preparedQuery(sql)
                .execute(Tuple.wrap(java.util.Arrays.asList(
                        shop.getId(),
                        shop.getOwnerId(),
                        shop.getShopName(),
                        shop.getDescription(),
                        shop.getStatus(),
                        shop.getBusinessRegistrationNo(),
                        created,
                        updated
                )))
                .map(rows -> shop)
                .convert().with(UniReactorConverters.toMono());
    }

    private ShopEntity toEntity(Row row) {
        ShopEntity s = new ShopEntity();
        s.setId(row.getUUID("id"));
        s.setOwnerId(row.getUUID("owner_id"));
        s.setShopName(row.getString("shop_name"));
        s.setDescription(row.getString("description"));
        s.setStatus(row.getString("status"));
        s.setBusinessRegistrationNo(row.getString("business_registration_no"));
        var created = row.getOffsetDateTime("created_at");
        if (created != null) s.setCreatedAt(created.toInstant());
        var updated = row.getOffsetDateTime("updated_at");
        if (updated != null) s.setUpdatedAt(updated.toInstant());
        return s;
    }
}
