package com.cosmetics.ai.adapter.in.web;

import com.cosmetics.ai.adapter.out.persistence.ChatMessageEntity;
import com.cosmetics.ai.application.AiAdvisorService;
import com.cosmetics.ai.application.AiAdvisorService.VtoChatContext;
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
        private String vtoShadeName;
        private String vtoHexColor;
        private String vtoFinishType;
        private String detectedUndertone;
        private String productId;
        private String productName;

        public ChatRequest() {}

        public UUID getConversationId() { return conversationId; }
        public void setConversationId(UUID conversationId) { this.conversationId = conversationId; }
        public String getQuery() { return query; }
        public void setQuery(String query) { this.query = query; }
        public String getSkinType() { return skinType; }
        public void setSkinType(String skinType) { this.skinType = skinType; }
        public List<String> getAllergies() { return allergies; }
        public void setAllergies(List<String> allergies) { this.allergies = allergies; }
        public String getVtoShadeName() { return vtoShadeName; }
        public void setVtoShadeName(String vtoShadeName) { this.vtoShadeName = vtoShadeName; }
        public String getVtoHexColor() { return vtoHexColor; }
        public void setVtoHexColor(String vtoHexColor) { this.vtoHexColor = vtoHexColor; }
        public String getVtoFinishType() { return vtoFinishType; }
        public void setVtoFinishType(String vtoFinishType) { this.vtoFinishType = vtoFinishType; }
        public String getDetectedUndertone() { return detectedUndertone; }
        public void setDetectedUndertone(String detectedUndertone) { this.detectedUndertone = detectedUndertone; }
        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
    }

    @GetMapping(value = "/chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> streamChatGet(
            @RequestParam(required = false) UUID conversationId,
            @RequestParam String q,
            @RequestParam(required = false) String skinType,
            @RequestParam(required = false) String allergies,
            @RequestParam(required = false) String vtoShadeName,
            @RequestParam(required = false) String vtoHexColor,
            @RequestParam(required = false) String vtoFinishType,
            @RequestParam(required = false) String detectedUndertone,
            @RequestParam(required = false) String productId,
            @RequestParam(required = false) String productName
    ) {
        UUID convId = conversationId != null ? conversationId : UUID.randomUUID();
        List<String> allergyList = (allergies != null && !allergies.isBlank())
                ? Arrays.stream(allergies.split(",")).map(String::trim).toList()
                : List.of();

        VtoChatContext vtoContext = null;
        if (vtoHexColor != null || vtoShadeName != null) {
            vtoContext = new VtoChatContext(vtoShadeName, vtoHexColor, vtoFinishType, detectedUndertone, productId, productName);
        }

        return advisorService.streamAdvisorChat(convId, q, skinType, allergyList, vtoContext)
                .map(token -> ServerSentEvent.<String>builder()
                        .event("message")
                        .data(token)
                        .build());
    }

    @PostMapping(value = "/chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> streamChatPost(@RequestBody ChatRequest request) {
        UUID convId = request.getConversationId() != null ? request.getConversationId() : UUID.randomUUID();
        VtoChatContext vtoContext = null;
        if (request.getVtoHexColor() != null || request.getVtoShadeName() != null) {
            vtoContext = new VtoChatContext(
                    request.getVtoShadeName(),
                    request.getVtoHexColor(),
                    request.getVtoFinishType(),
                    request.getDetectedUndertone(),
                    request.getProductId(),
                    request.getProductName()
            );
        }

        return advisorService.streamAdvisorChat(convId, request.getQuery(), request.getSkinType(), request.getAllergies(), vtoContext)
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
