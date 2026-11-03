package com.cosmetics.payment.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.r2dbc.core.DatabaseClient;

@Configuration
public class DatabaseInitializer {
    private static final Logger log = LoggerFactory.getLogger(DatabaseInitializer.class);

    @Bean
    public ApplicationRunner initDatabase(DatabaseClient databaseClient) {
        return args -> {
            log.info("Initializing payment_db database schema...");
            databaseClient.sql("""
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
            """).fetch().rowsUpdated()
            .doOnSuccess(v -> log.info("payment_db schema initialization completed."))
            .subscribe();
        };
    }
}
