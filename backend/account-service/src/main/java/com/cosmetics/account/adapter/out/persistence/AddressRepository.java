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
public class AddressRepository {
    private final PgPool pgPool;

    public AddressRepository(PgPool pgPool) {
        this.pgPool = pgPool;
    }

    public Flux<AddressEntity> findAllByUserIdOrderByCreatedAtDesc(UUID userId) {
        String sql = "SELECT id, user_id, recipient_name, phone, province, district, ward, street_address, is_default, label, created_at FROM user_addresses WHERE user_id = $1 ORDER BY created_at DESC";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(userId))
                .onItem().transformToMulti(rows -> io.smallrye.mutiny.Multi.createFrom().iterable(rows))
                .map(this::toEntity)
                .convert().with(MultiReactorConverters.toFlux());
    }

    public Mono<AddressEntity> findByUserIdAndIsDefaultTrue(UUID userId) {
        String sql = "SELECT id, user_id, recipient_name, phone, province, district, ward, street_address, is_default, label, created_at FROM user_addresses WHERE user_id = $1 AND is_default = TRUE LIMIT 1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(userId))
                .map(rows -> {
                    var it = rows.iterator();
                    return it.hasNext() ? toEntity(it.next()) : null;
                })
                .convert().with(UniReactorConverters.toMono());
    }

    public Mono<AddressEntity> findById(UUID id) {
        String sql = "SELECT id, user_id, recipient_name, phone, province, district, ward, street_address, is_default, label, created_at FROM user_addresses WHERE id = $1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(id))
                .map(rows -> {
                    var it = rows.iterator();
                    return it.hasNext() ? toEntity(it.next()) : null;
                })
                .convert().with(UniReactorConverters.toMono());
    }

    public Mono<AddressEntity> save(AddressEntity address) {
        if (address.getId() == null) {
            address.setId(UUID.randomUUID());
        }
        String sql = """
            INSERT INTO user_addresses (id, user_id, recipient_name, phone, province, district, ward, street_address, is_default, label, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            ON CONFLICT (id) DO UPDATE SET
                user_id = EXCLUDED.user_id,
                recipient_name = EXCLUDED.recipient_name,
                phone = EXCLUDED.phone,
                province = EXCLUDED.province,
                district = EXCLUDED.district,
                ward = EXCLUDED.ward,
                street_address = EXCLUDED.street_address,
                is_default = EXCLUDED.is_default,
                label = EXCLUDED.label
        """;
        OffsetDateTime created = address.getCreatedAt() != null ? address.getCreatedAt().atOffset(ZoneOffset.UTC) : OffsetDateTime.now(ZoneOffset.UTC);

        return pgPool.preparedQuery(sql)
                .execute(Tuple.wrap(java.util.Arrays.asList(
                        address.getId(),
                        address.getUserId(),
                        address.getRecipientName(),
                        address.getPhone(),
                        address.getProvince(),
                        address.getDistrict(),
                        address.getWard(),
                        address.getStreetAddress(),
                        Boolean.TRUE.equals(address.getIsDefault()),
                        address.getLabel() != null ? address.getLabel() : "HOME",
                        created
                )))
                .map(rows -> address)
                .convert().with(UniReactorConverters.toMono());
    }

    public Mono<Void> delete(AddressEntity address) {
        return deleteById(address.getId());
    }

    public Mono<Void> deleteById(UUID id) {
        String sql = "DELETE FROM user_addresses WHERE id = $1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(id))
                .replaceWithVoid()
                .convert().with(UniReactorConverters.toMono());
    }

    private AddressEntity toEntity(Row row) {
        AddressEntity a = new AddressEntity();
        a.setId(row.getUUID("id"));
        a.setUserId(row.getUUID("user_id"));
        a.setRecipientName(row.getString("recipient_name"));
        a.setPhone(row.getString("phone"));
        a.setProvince(row.getString("province"));
        a.setDistrict(row.getString("district"));
        a.setWard(row.getString("ward"));
        a.setStreetAddress(row.getString("street_address"));
        a.setIsDefault(row.getBoolean("is_default"));
        a.setLabel(row.getString("label"));
        var created = row.getOffsetDateTime("created_at");
        if (created != null) a.setCreatedAt(created.toInstant());
        return a;
    }
}
