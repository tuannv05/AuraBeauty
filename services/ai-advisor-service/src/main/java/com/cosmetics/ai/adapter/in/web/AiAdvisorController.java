package com.cosmetics.ai.adapter.in.web;

import com.cosmetics.ai.adapter.out.persistence.ChatMessageEntity;
import com.cosmetics.ai.application.AiAdvisorService;
import com.cosmetics.common.web.ApiResponse;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/advisor")
public class AiAdvisorController {
    private final AiAdvisorService advisorService;

    public AiAdvisorController(AiAdvisorService advisorService) {
        this.advisorService = advisorService;
    }

    public static class ChatRequest {
        private UUID conversationId;
        private String query;
        private String skinType;
        private List<String> allergies;

        public ChatRequest() {}

        public UUID getConversationId() { return conversationId; }
        public void setConversationId(UUID conversationId) { this.conversationId = conversationId; }
        public String getQuery() { return query; }
        public void setQuery(String query) { this.query = query; }
        public String getSkinType() { return skinType; }
        public void setSkinType(String skinType) { this.skinType = skinType; }
        public List<String> getAllergies() { return allergies; }
        public void setAllergies(List<String> allergies) { this.allergies = allergies; }
    }

    @GetMapping(value = "/chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> streamChatGet(
            @RequestParam(required = false) UUID conversationId,
            @RequestParam String q,
            @RequestParam(required = false) String skinType,
            @RequestParam(required = false) String allergies
    ) {
        UUID convId = conversationId != null ? conversationId : UUID.randomUUID();
        List<String> allergyList = (allergies != null && !allergies.isBlank())
                ? Arrays.stream(allergies.split(",")).map(String::trim).toList()
                : List.of();

        return advisorService.streamAdvisorChat(convId, q, skinType, allergyList)
                .map(token -> ServerSentEvent.<String>builder()
                        .event("message")
                        .data(token)
                        .build());
    }

    @PostMapping(value = "/chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> streamChatPost(@RequestBody ChatRequest request) {
        UUID convId = request.getConversationId() != null ? request.getConversationId() : UUID.randomUUID();
        return advisorService.streamAdvisorChat(convId, request.getQuery(), request.getSkinType(), request.getAllergies())
                .map(token -> ServerSentEvent.<String>builder()
                        .event("message")
                        .data(token)
                        .build());
    }

    @GetMapping("/history/{conversationId}")
    public Mono<ApiResponse<List<ChatMessageEntity>>> getHistory(@PathVariable UUID conversationId) {
        return advisorService.getConversationHistory(conversationId).collectList().map(ApiResponse::ok);
    }
}
