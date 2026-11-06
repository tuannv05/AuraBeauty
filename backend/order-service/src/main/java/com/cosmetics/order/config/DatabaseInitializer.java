package com.cosmetics.order.config;

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
            log.info("Initializing order_db database schema...");
            databaseClient.sql("""
                CREATE TABLE IF NOT EXISTS orders (
                    id UUID PRIMARY KEY,
                    buyer_id UUID NOT NULL,
                    status VARCHAR(50) NOT NULL,
                    total_amount NUMERIC(15, 2) NOT NULL,
                    recipient_name VARCHAR(255),
                    recipient_phone VARCHAR(50),
                    shipping_address TEXT,
                    payment_method VARCHAR(50) DEFAULT 'COD',
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );

                ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'COD';

                CREATE TABLE IF NOT EXISTS sub_orders (
                    id UUID PRIMARY KEY,
                    order_id UUID NOT NULL,
                    shop_id UUID NOT NULL,
                    status VARCHAR(50) NOT NULL,
                    sub_total NUMERIC(15, 2) NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS order_lines (
                    id UUID PRIMARY KEY,
                    sub_order_id UUID NOT NULL,
                    sku_code VARCHAR(100) NOT NULL,
                    product_name VARCHAR(255) NOT NULL,
                    quantity INT NOT NULL,
                    unit_price NUMERIC(15, 2) NOT NULL,
                    line_total NUMERIC(15, 2) NOT NULL
                );

                CREATE TABLE IF NOT EXISTS cart_items (
                    id UUID PRIMARY KEY,
                    buyer_id UUID NOT NULL,
                    shop_id UUID NOT NULL,
                    sku_code VARCHAR(100) NOT NULL,
                    product_name VARCHAR(255) NOT NULL,
                    shop_name VARCHAR(255),
                    quantity INT NOT NULL,
                    unit_price NUMERIC(15, 2) NOT NULL
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
            .doOnSuccess(v -> log.info("order_db schema initialization completed."))
            .subscribe();
        };
    }
}
