package com.cosmetics.account.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

@Configuration
public class DatabaseInitializer {
    private static final Logger log = LoggerFactory.getLogger(DatabaseInitializer.class);

    @Bean
    public ApplicationRunner initDatabase(DatabaseClient databaseClient, PasswordEncoder passwordEncoder) {
        return args -> {
            log.info("Initializing account_db database schema and default seed data...");
            databaseClient.sql("""
                CREATE TABLE IF NOT EXISTS users (
                    id UUID PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    full_name VARCHAR(255) NOT NULL,
                    phone VARCHAR(50),
                    roles VARCHAR(255) NOT NULL,
                    status VARCHAR(50) NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS shops (
                    id UUID PRIMARY KEY,
                    owner_id UUID NOT NULL,
                    shop_name VARCHAR(255) UNIQUE NOT NULL,
                    description TEXT,
                    status VARCHAR(50) NOT NULL,
                    business_registration_no VARCHAR(100),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS skin_profiles (
                    user_id UUID PRIMARY KEY,
                    skin_type VARCHAR(50) NOT NULL,
                    concerns TEXT,
                    allergies TEXT,
                    skin_tone_hex VARCHAR(10) DEFAULT '#E8C6A8',
                    skin_undertone VARCHAR(20) DEFAULT 'NEUTRAL',
                    ita_angle DOUBLE PRECISION DEFAULT 32.0
                );

                ALTER TABLE skin_profiles
                    ADD COLUMN IF NOT EXISTS skin_tone_hex VARCHAR(10) DEFAULT '#E8C6A8',
                    ADD COLUMN IF NOT EXISTS skin_undertone VARCHAR(20) DEFAULT 'NEUTRAL',
                    ADD COLUMN IF NOT EXISTS ita_angle DOUBLE PRECISION DEFAULT 32.0;

                CREATE TABLE IF NOT EXISTS user_addresses (
                    id UUID PRIMARY KEY,
                    user_id UUID NOT NULL,
                    recipient_name VARCHAR(255) NOT NULL,
                    phone VARCHAR(50) NOT NULL,
                    province VARCHAR(100) NOT NULL,
                    district VARCHAR(100) NOT NULL,
                    ward VARCHAR(100) NOT NULL,
                    street_address TEXT NOT NULL,
                    is_default BOOLEAN DEFAULT FALSE,
                    label VARCHAR(50) DEFAULT 'HOME',
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
            .then(databaseClient.sql("SELECT COUNT(*) as count FROM users").fetch().one())
            .flatMap(res -> {
                long count = ((Number) res.get("count")).longValue();
                if (count == 0) {
                    log.info("Seeding default Admin, Seller, and Buyer accounts...");
                    String adminPass = passwordEncoder.encode("admin123456");
                    String sellerPass = passwordEncoder.encode("seller123456");
                    String buyerPass = passwordEncoder.encode("buyer123456");

                    UUID adminId = UUID.fromString("00000000-0000-0000-0000-000000000001");
                    UUID sellerId = UUID.fromString("00000000-0000-0000-0000-000000000002");
                    UUID buyerId = UUID.fromString("00000000-0000-0000-0000-000000000003");
                    UUID shopId = UUID.fromString("00000000-0000-0000-0000-000000000010");

                    return databaseClient.sql("""
                        INSERT INTO users (id, email, password_hash, full_name, phone, roles, status)
                        VALUES 
                        (:adminId, 'admin@cosmetics.com', :adminPass, 'System Administrator', '0900000001', 'ROLE_ADMIN,ROLE_BUYER', 'ACTIVE'),
                        (:sellerId, 'seller@cosmetics.com', :sellerPass, 'Official Anua Seller', '0900000002', 'ROLE_SELLER,ROLE_BUYER', 'ACTIVE'),
                        (:buyerId, 'buyer@cosmetics.com', :buyerPass, 'Nguyen Van Buyer', '0900000003', 'ROLE_BUYER', 'ACTIVE')
                        ON CONFLICT (email) DO NOTHING
                    """)
                    .bind("adminId", adminId)
                    .bind("adminPass", adminPass)
                    .bind("sellerId", sellerId)
                    .bind("sellerPass", sellerPass)
                    .bind("buyerId", buyerId)
                    .bind("buyerPass", buyerPass)
                    .fetch().rowsUpdated()
                    .then(databaseClient.sql("""
                        INSERT INTO shops (id, owner_id, shop_name, description, status, business_registration_no)
                        VALUES
                        (:shopId, :sellerId, 'Anua Official Store', 'Gian hàng mỹ phẩm chính hãng Anua Hàn Quốc', 'APPROVED', 'DKKD-987654321')
                        ON CONFLICT (shop_name) DO NOTHING
                    """)
                    .bind("shopId", shopId)
                    .bind("sellerId", sellerId)
                    .fetch().rowsUpdated());
                }
                return reactor.core.publisher.Mono.empty();
            })
            .doOnSuccess(v -> log.info("account_db initialization completed successfully."))
            .subscribe();
        };
    }
}
