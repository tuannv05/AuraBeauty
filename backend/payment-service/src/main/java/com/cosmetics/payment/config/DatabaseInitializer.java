package com.cosmetics.payment.config;

import io.quarkus.runtime.StartupEvent;
import io.vertx.mutiny.pgclient.PgPool;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ApplicationScoped
public class DatabaseInitializer {
    private static final Logger log = LoggerFactory.getLogger(DatabaseInitializer.class);

    void onStart(@Observes StartupEvent ev, PgPool pgPool) {
        log.info("Initializing payment_db database schema with Quarkus Reactive PgPool...");
        pgPool.query("""
            CREATE TABLE IF NOT EXISTS payments (
                id UUID PRIMARY KEY,
                order_id UUID UNIQUE NOT NULL,
                buyer_id UUID NOT NULL,
                amount NUMERIC(15, 2) NOT NULL,
                payment_method VARCHAR(50) NOT NULL,
                status VARCHAR(50) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS ledger_entries (
                id UUID PRIMARY KEY,
                transaction_id UUID NOT NULL,
                account_debit VARCHAR(100) NOT NULL,
                account_credit VARCHAR(100) NOT NULL,
                amount NUMERIC(15, 2) NOT NULL,
                entry_type VARCHAR(100) NOT NULL,
                note TEXT,
                recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS outbox_messages (
                id UUID PRIMARY KEY,
                aggregate_type VARCHAR(100) NOT NULL,
                aggregate_id VARCHAR(100) NOT NULL,
                event_type VARCHAR(100) NOT NULL,
                topic VARCHAR(100) NOT NULL,
                payload TEXT NOT NULL,
                status VARCHAR(50) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                sent_at TIMESTAMP WITH TIME ZONE
            );

            CREATE TABLE IF NOT EXISTS processed_events (
                event_id UUID PRIMARY KEY,
                event_type VARCHAR(100) NOT NULL,
                processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """).execute().subscribe().with(
            rows -> log.info("payment_db schema initialized successfully via Quarkus!"),
            err -> log.error("Failed to initialize payment_db schema: ", err)
        );
    }
}
