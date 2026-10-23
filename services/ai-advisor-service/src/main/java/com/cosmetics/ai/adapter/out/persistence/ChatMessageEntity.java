package com.cosmetics.ai.adapter.out.persistence;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

@Table("chat_messages")
public class ChatMessageEntity {
    @Id
    private UUID id;

    @Column("conversation_id")
    private UUID conversationId;

    @Column("role")
    private String role; // USER, ASSISTANT

    @Column("content")
    private String content;

    @Column("citations")
    private String citations;

    @Column("created_at")
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
