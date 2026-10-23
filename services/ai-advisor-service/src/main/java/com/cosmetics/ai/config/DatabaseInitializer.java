package com.cosmetics.ai.config;

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
            log.info("Initializing ai_db pgvector schema...");
            databaseClient.sql("""
                CREATE EXTENSION IF NOT EXISTS vector;

                CREATE TABLE IF NOT EXISTS knowledge_chunks (
                    id UUID PRIMARY KEY,
                    product_id VARCHAR(100) NOT NULL,
                    shop_id UUID NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    content TEXT NOT NULL,
                    metadata TEXT,
                    embedding vector(384)
                );

                CREATE TABLE IF NOT EXISTS chat_messages (
                    id UUID PRIMARY KEY,
                    conversation_id UUID NOT NULL,
                    role VARCHAR(50) NOT NULL,
                    content TEXT NOT NULL,
                    citations VARCHAR(255),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );

                CREATE INDEX IF NOT EXISTS idx_chunks_hnsw ON knowledge_chunks USING hnsw (embedding vector_cosine_ops);
            """).fetch().rowsUpdated()
            .doOnSuccess(v -> log.info("ai_db schema initialization completed."))
            .subscribe();
        };
    }
}
