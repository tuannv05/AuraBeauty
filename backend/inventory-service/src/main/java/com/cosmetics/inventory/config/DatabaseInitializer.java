package com.cosmetics.inventory.config;

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
            log.info("Initializing inventory_db database schema...");
            databaseClient.sql("""
                CREATE TABLE IF NOT EXISTS stock_items (
                    sku_code VARCHAR(100) PRIMARY KEY,
                    product_id VARCHAR(100) NOT NULL,
                    shop_id UUID NOT NULL,
                    on_hand INT NOT NULL DEFAULT 0,
                    reserved INT NOT NULL DEFAULT 0,
                    CONSTRAINT chk_stock_non_negative CHECK (reserved >= 0 AND reserved <= on_hand)
                );

                CREATE TABLE IF NOT EXISTS reservations (
                    id UUID PRIMARY KEY,
                    order_id UUID NOT NULL,
                    sku_code VARCHAR(100) NOT NULL,
                    quantity INT NOT NULL,
                    status VARCHAR(50) NOT NULL,
                    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
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
            .doOnSuccess(v -> log.info("inventory_db schema initialization completed."))
            .subscribe();
        };
    }
}
