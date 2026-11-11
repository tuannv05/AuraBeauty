package com.cosmetics.ai.config;

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
        log.info("Initializing ai_db pgvector schema with Quarkus Reactive PgPool...");
        pgPool.query("""
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
        """).execute().subscribe().with(
            rows -> log.info("ai_db pgvector schema initialized successfully via Quarkus!"),
            err -> log.error("Failed to initialize ai_db schema: ", err)
        );
    }
}
