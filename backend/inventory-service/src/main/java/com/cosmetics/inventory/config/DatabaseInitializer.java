package com.cosmetics.inventory.config;

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
        log.info("Initializing inventory_db database schema with Quarkus Reactive PgPool...");
        pgPool.query("""
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
                event_type VARCHAR(100),
                processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """).execute().subscribe().with(
            item -> log.info("inventory_db schema initialized successfully via Quarkus!"),
            failure -> log.warn("Note: DB schema creation skipped or already exists: {}", failure.getMessage())
        );
    }
}
