package com.cosmetics.payment.adapter.out.persistence;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.util.UUID;

public interface LedgerEntryRepository extends ReactiveCrudRepository<LedgerEntryEntity, UUID> {
    Flux<LedgerEntryEntity> findByTransactionId(UUID transactionId);
    Flux<LedgerEntryEntity> findAllByOrderByRecordedAtDesc();

    @Query("SELECT COALESCE(SUM(amount), 0) FROM ledger_entries WHERE account_credit = 'PLATFORM_REVENUE'")
    Mono<BigDecimal> sumPlatformRevenue();

    @Query("SELECT COALESCE(SUM(amount), 0) FROM ledger_entries WHERE account_credit = 'SELLER_PAYABLE'")
    Mono<BigDecimal> sumSellerPayable();
}
