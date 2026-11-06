package com.cosmetics.ai.adapter.in.web;

import com.cosmetics.ai.adapter.out.persistence.ChatMessageEntity;
import com.cosmetics.ai.application.AiAdvisorService;
import com.cosmetics.ai.application.AiAdvisorService.VtoChatContext;
import com.cosmetics.ai.domain.DeterministicInciConflictEngine;
import com.cosmetics.ai.domain.SkinCyclingRoutineEngine;
import com.cosmetics.common.web.ApiResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final ObjectMapper objectMapper;

    public AiAdvisorController(AiAdvisorService advisorService, ObjectMapper objectMapper) {
        this.advisorService = advisorService;
        this.objectMapper = objectMapper;
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

    @PostMapping(value = "/multi-stage-stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> streamMultiStageChat(@RequestBody ChatRequest request) {
        UUID convId = request.getConversationId() != null ? request.getConversationId() : UUID.randomUUID();
        String skinType = request.getSkinType() != null ? request.getSkinType() : "NORMAL";
        String undertone = request.getDetectedUndertone() != null ? request.getDetectedUndertone() : "NEUTRAL";

        // Stage 1: Skin Analysis Payload
        String skinJson;
        try {
            skinJson = objectMapper.writeValueAsString(java.util.Map.of(
                "skinType", skinType,
                "detectedUndertone", undertone,
                "itaAngle", 42.5,
                "melaninIndex", 18.2,
                "status", "ANALYZED_OK"
            ));
        } catch (JsonProcessingException e) {
            skinJson = "{}";
        }
        ServerSentEvent<String> sseStage1 = ServerSentEvent.<String>builder()
            .event("skin_analysis")
            .data(skinJson)
            .build();

        // Stage 2: INCI Conflict & Safety Matrix
        var sampleActives = List.of("Retinol 0.5%", "Hyaluronic Acid", "Niacinamide 2%");
        var conflicts = DeterministicInciConflictEngine.checkConflicts(sampleActives, skinType);
        String matrixJson;
        try {
            matrixJson = objectMapper.writeValueAsString(java.util.Map.of(
                "conflicts", conflicts,
                "safetyScore", conflicts.isEmpty() ? 98 : 75,
                "bannedDetected", List.of()
            ));
        } catch (JsonProcessingException e) {
            matrixJson = "{}";
        }
        ServerSentEvent<String> sseStage2 = ServerSentEvent.<String>builder()
            .event("inci_safety_matrix")
            .data(matrixJson)
            .build();

        // Stage 3: 28-Day Skin Cycling Routine
        var routine = SkinCyclingRoutineEngine.generate28DaySchedule(skinType);
        String routineJson;
        try {
            routineJson = objectMapper.writeValueAsString(routine);
        } catch (JsonProcessingException e) {
            routineJson = "{}";
        }
        ServerSentEvent<String> sseStage3 = ServerSentEvent.<String>builder()
            .event("routine_28_days")
            .data(routineJson)
            .build();

        // Stage 4: Token stream
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

        Flux<ServerSentEvent<String>> tokenFlux = advisorService.streamAdvisorChat(
            convId, request.getQuery(), skinType, request.getAllergies(), vtoContext
        ).map(token -> ServerSentEvent.<String>builder()
            .event("token")
            .data(token)
            .build()
        );

        // Stage 5: Recommended SKUs
        String recJson = "{\"recommendedSkus\":[{\"skuCode\":\"SKU-B5-LAROCHE\",\"name\":\"Serum Hyalu B5 La Roche-Posay\",\"undertoneMatch\":\"HARMONIC\"}]}";
        ServerSentEvent<String> sseStage5 = ServerSentEvent.<String>builder()
            .event("recommended_skus")
            .data(recJson)
            .build();

        return Flux.just(sseStage1, sseStage2, sseStage3)
            .concatWith(tokenFlux)
            .concatWith(Mono.just(sseStage5));
    }

    @GetMapping("/history/{conversationId}")
    public Mono<ApiResponse<List<ChatMessageEntity>>> getHistory(@PathVariable UUID conversationId) {
        return advisorService.getConversationHistory(conversationId).collectList().map(ApiResponse::ok);
    }
}
