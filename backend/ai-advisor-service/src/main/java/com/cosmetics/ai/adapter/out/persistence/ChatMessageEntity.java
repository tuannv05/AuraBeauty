package com.cosmetics.ai.adapter.out.persistence;

import java.time.Instant;
import java.util.UUID;

public class ChatMessageEntity {
    private UUID id;
    private UUID conversationId;
    private String role; // USER, ASSISTANT
    private String content;
    private String citations;
    private Instant createdAt;

    public ChatMessageEntity() {}

    public ChatMessageEntity(UUID id, UUID conversationId, String role, String content, String citations) {
        this.id = id != null ? id : UUID.randomUUID();
        this.conversationId = conversationId;
        this.role = role;
        this.content = content;
        this.citations = citations;
        this.createdAt = Instant.now();
    }

    public ChatMessageEntity(UUID id, UUID conversationId, String role, String content, String citations, Instant createdAt) {
        this.id = id != null ? id : UUID.randomUUID();
        this.conversationId = conversationId;
        this.role = role;
        this.content = content;
        this.citations = citations;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getConversationId() { return conversationId; }
    public void setConversationId(UUID conversationId) { this.conversationId = conversationId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCitations() { return citations; }
    public void setCitations(String citations) { this.citations = citations; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
