package com.cosmetics.account.adapter.out.persistence;

import io.smallrye.mutiny.converters.uni.UniReactorConverters;
import io.vertx.mutiny.pgclient.PgPool;
import io.vertx.mutiny.sqlclient.Row;
import io.vertx.mutiny.sqlclient.Tuple;
import jakarta.enterprise.context.ApplicationScoped;
import reactor.core.publisher.Mono;

import java.util.UUID;

@ApplicationScoped
public class SkinProfileRepository {
    private final PgPool pgPool;

    public SkinProfileRepository(PgPool pgPool) {
        this.pgPool = pgPool;
    }

    public Mono<SkinProfileEntity> findById(UUID userId) {
        String sql = "SELECT user_id, skin_type, concerns, allergies, skin_tone_hex, skin_undertone, ita_angle FROM skin_profiles WHERE user_id = $1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(userId))
                .map(rows -> {
                    var it = rows.iterator();
                    return it.hasNext() ? toEntity(it.next()) : null;
                })
                .convert().with(UniReactorConverters.toMono());
    }

    public Mono<SkinProfileEntity> save(SkinProfileEntity entity) {
        String sql = """
            INSERT INTO skin_profiles (user_id, skin_type, concerns, allergies, skin_tone_hex, skin_undertone, ita_angle)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (user_id) DO UPDATE SET
                skin_type = EXCLUDED.skin_type,
                concerns = EXCLUDED.concerns,
                allergies = EXCLUDED.allergies,
                skin_tone_hex = EXCLUDED.skin_tone_hex,
                skin_undertone = EXCLUDED.skin_undertone,
                ita_angle = EXCLUDED.ita_angle
        """;
        return pgPool.preparedQuery(sql)
                .execute(Tuple.wrap(java.util.Arrays.asList(
                        entity.getUserId(),
                        entity.getSkinType(),
                        entity.getConcerns(),
                        entity.getAllergies(),
                        entity.getSkinToneHex(),
                        entity.getSkinUndertone(),
                        entity.getItaAngle()
                )))
                .map(rows -> entity)
                .convert().with(UniReactorConverters.toMono());
    }

    private SkinProfileEntity toEntity(Row row) {
        SkinProfileEntity s = new SkinProfileEntity();
        s.setUserId(row.getUUID("user_id"));
        s.setSkinType(row.getString("skin_type"));
        s.setConcerns(row.getString("concerns"));
        s.setAllergies(row.getString("allergies"));
        s.setSkinToneHex(row.getString("skin_tone_hex"));
        s.setSkinUndertone(row.getString("skin_undertone"));
        s.setItaAngle(row.getDouble("ita_angle"));
        return s;
    }
}
