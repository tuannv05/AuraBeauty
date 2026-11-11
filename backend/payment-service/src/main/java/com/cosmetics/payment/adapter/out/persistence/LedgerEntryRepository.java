package com.cosmetics.payment.adapter.out.persistence;

import io.smallrye.mutiny.converters.multi.MultiReactorConverters;
import io.smallrye.mutiny.converters.uni.UniReactorConverters;
import io.vertx.mutiny.pgclient.PgPool;
import io.vertx.mutiny.sqlclient.Row;
import io.vertx.mutiny.sqlclient.Tuple;
import jakarta.enterprise.context.ApplicationScoped;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

@ApplicationScoped
public class LedgerEntryRepository {
    private final PgPool pgPool;

    public LedgerEntryRepository(PgPool pgPool) {
        this.pgPool = pgPool;
    }

    public Flux<LedgerEntryEntity> findByTransactionId(UUID transactionId) {
        String sql = "SELECT id, transaction_id, account_debit, account_credit, amount, entry_type, note, recorded_at FROM ledger_entries WHERE transaction_id = $1";
        return pgPool.preparedQuery(sql)
                .execute(Tuple.of(transactionId))
                .onItem().transformToMulti(rows -> io.smallrye.mutiny.Multi.createFrom().iterable(rows))
                .map(this::toEntity)
                .convert().with(MultiReactorConverters.toFlux());
    }

    public Flux<LedgerEntryEntity> findAllByOrderByRecordedAtDesc() {
        String sql = "SELECT id, transaction_id, account_debit, account_credit, amount, entry_type, note, recorded_at FROM ledger_entries ORDER BY recorded_at DESC";
        return pgPool.query(sql)
                .execute()
                .onItem().transformToMulti(rows -> io.smallrye.mutiny.Multi.createFrom().iterable(rows))
                .map(this::toEntity)
                .convert().with(MultiReactorConverters.toFlux());
    }

    public Mono<BigDecimal> sumPlatformRevenue() {
        String sql = "SELECT COALESCE(SUM(amount), 0) as total FROM ledger_entries WHERE account_credit = 'PLATFORM_REVENUE'";
        return pgPool.query(sql)
                .execute()
                .map(rows -> {
                    var it = rows.iterator();
                    return it.hasNext() ? it.next().getBigDecimal("total") : BigDecimal.ZERO;
                })
                .convert().with(UniReactorConverters.toMono());
    }

    public Mono<BigDecimal> sumSellerPayable() {
        String sql = "SELECT COALESCE(SUM(amount), 0) as total FROM ledger_entries WHERE account_credit = 'SELLER_PAYABLE'";
        return pgPool.query(sql)
                .execute()
                .map(rows -> {
                    var it = rows.iterator();
                    return it.hasNext() ? it.next().getBigDecimal("total") : BigDecimal.ZERO;
                })
                .convert().with(UniReactorConverters.toMono());
    }

    public Mono<Long> count() {
        String sql = "SELECT COUNT(*) as count FROM ledger_entries";
        return pgPool.query(sql)
                .execute()
                .map(rows -> rows.iterator().next().getLong("count"))
                .convert().with(UniReactorConverters.toMono());
    }

    public Mono<LedgerEntryEntity> save(LedgerEntryEntity entry) {
        if (entry.getId() == null) {
            entry.setId(UUID.randomUUID());
        }
        String sql = """
            INSERT INTO ledger_entries (id, transaction_id, account_debit, account_credit, amount, entry_type, note, recorded_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (id) DO UPDATE SET
                transaction_id = EXCLUDED.transaction_id,
                account_debit = EXCLUDED.account_debit,
                account_credit = EXCLUDED.account_credit,
                amount = EXCLUDED.amount,
                entry_type = EXCLUDED.entry_type,
                note = EXCLUDED.note
        """;
        OffsetDateTime recorded = entry.getRecordedAt() != null ? entry.getRecordedAt().atOffset(ZoneOffset.UTC) : OffsetDateTime.now(ZoneOffset.UTC);

        return pgPool.preparedQuery(sql)
                .execute(Tuple.wrap(java.util.Arrays.asList(
                        entry.getId(),
                        entry.getTransactionId(),
                        entry.getAccountDebit(),
                        entry.getAccountCredit(),
                        entry.getAmount(),
                        entry.getEntryType(),
                        entry.getNote(),
                        recorded
                )))
                .map(rows -> entry)
                .convert().with(UniReactorConverters.toMono());
    }

    public Flux<LedgerEntryEntity> saveAll(Iterable<LedgerEntryEntity> entries) {
        return Flux.fromIterable(entries).flatMap(this::save);
    }

    private LedgerEntryEntity toEntity(Row row) {
        LedgerEntryEntity e = new LedgerEntryEntity();
        e.setId(row.getUUID("id"));
        e.setTransactionId(row.getUUID("transaction_id"));
        e.setAccountDebit(row.getString("account_debit"));
        e.setAccountCredit(row.getString("account_credit"));
        e.setAmount(row.getBigDecimal("amount"));
        e.setEntryType(row.getString("entry_type"));
        e.setNote(row.getString("note"));
        var recorded = row.getOffsetDateTime("recorded_at");
        if (recorded != null) e.setRecordedAt(recorded.toInstant());
        return e;
    }
}
