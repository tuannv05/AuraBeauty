package com.cosmetics.ai.adapter.in.web;

import com.cosmetics.ai.adapter.out.persistence.ChatMessageEntity;
import com.cosmetics.ai.application.AiAdvisorService;
import com.cosmetics.ai.application.AiAdvisorService.VtoChatContext;
import com.cosmetics.ai.domain.DeterministicInciConflictEngine;
import com.cosmetics.ai.domain.SkinCyclingRoutineEngine;
import com.cosmetics.ai.domain.model.graph.KnowledgeGraphDto;
import com.cosmetics.ai.domain.model.graph.SkinRoutineGraphAnalysis;
import com.cosmetics.common.web.ApiResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.smallrye.mutiny.Multi;
import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.converters.multi.MultiReactorConverters;
import io.smallrye.mutiny.converters.uni.UniReactorConverters;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.sse.OutboundSseEvent;
import jakarta.ws.rs.sse.Sse;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Path("/api/advisor")
@ApplicationScoped
public class AiAdvisorController {
    private final AiAdvisorService advisorService;
    private final ObjectMapper objectMapper;

    @Context
    Sse sse;

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

    @GET
    @Path("/chat")
    @Produces(MediaType.SERVER_SENT_EVENTS)
    public Multi<OutboundSseEvent> streamChatGet(
            @QueryParam("conversationId") UUID conversationId,
            @QueryParam("q") String q,
            @QueryParam("skinType") String skinType,
            @QueryParam("allergies") String allergies,
            @QueryParam("vtoShadeName") String vtoShadeName,
            @QueryParam("vtoHexColor") String vtoHexColor,
            @QueryParam("vtoFinishType") String vtoFinishType,
            @QueryParam("detectedUndertone") String detectedUndertone,
            @QueryParam("productId") String productId,
            @QueryParam("productName") String productName
    ) {
        UUID convId = conversationId != null ? conversationId : UUID.randomUUID();
        List<String> allergyList = (allergies != null && !allergies.isBlank())
                ? Arrays.stream(allergies.split(",")).map(String::trim).toList()
                : List.of();

        VtoChatContext vtoContext = null;
        if (vtoHexColor != null || vtoShadeName != null) {
            vtoContext = new VtoChatContext(vtoShadeName, vtoHexColor, vtoFinishType, detectedUndertone, productId, productName);
        }

        return Multi.createFrom().converter(
                MultiReactorConverters.fromFlux(),
                advisorService.streamAdvisorChat(convId, q, skinType, allergyList, vtoContext)
        ).map(token -> sse.newEventBuilder().name("message").data(token).build());
    }

    @POST
    @Path("/chat")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.SERVER_SENT_EVENTS)
    public Multi<OutboundSseEvent> streamChatPost(ChatRequest request) {
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

        return Multi.createFrom().converter(
                MultiReactorConverters.fromFlux(),
                advisorService.streamAdvisorChat(convId, request.getQuery(), request.getSkinType(), request.getAllergies(), vtoContext)
        ).map(token -> sse.newEventBuilder().name("message").data(token).build());
    }

    @POST
    @Path("/multi-stage-stream")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.SERVER_SENT_EVENTS)
    public Multi<OutboundSseEvent> streamMultiStageChat(ChatRequest request) {
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
        OutboundSseEvent sseStage1 = sse.newEventBuilder().name("skin_analysis").data(skinJson).build();

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
        OutboundSseEvent sseStage2 = sse.newEventBuilder().name("inci_safety_matrix").data(matrixJson).build();

        // Stage 3: 28-Day Skin Cycling Routine
        var routine = SkinCyclingRoutineEngine.generate28DaySchedule(skinType);
        String routineJson;
        try {
            routineJson = objectMapper.writeValueAsString(routine);
        } catch (JsonProcessingException e) {
            routineJson = "{}";
        }
        OutboundSseEvent sseStage3 = sse.newEventBuilder().name("routine_28_days").data(routineJson).build();

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

        // Graphify Knowledge Graph Insights Event
        String targetProdId = request.getProductId() != null ? request.getProductId() : "PROD-CRW-001";
        Uni<OutboundSseEvent> sseGraphInsight = Uni.createFrom().converter(
                UniReactorConverters.fromMono(),
                advisorService.getProductEgoGraph(targetProdId)
        ).map(graph -> {
            try {
                return sse.newEventBuilder().name("graph_insight").data(objectMapper.writeValueAsString(graph)).build();
            } catch (JsonProcessingException e) {
                return sse.newEventBuilder().name("graph_insight").data("{}").build();
            }
        });

        Multi<OutboundSseEvent> tokenMulti = Multi.createFrom().converter(
                MultiReactorConverters.fromFlux(),
                advisorService.streamAdvisorChat(convId, request.getQuery(), skinType, request.getAllergies(), vtoContext)
        ).map(token -> sse.newEventBuilder().name("token").data(token).build());

        // Stage 5: Recommended SKUs
        String recJson = "{\"recommendedSkus\":[{\"skuCode\":\"SKU-B5-LAROCHE\",\"name\":\"Serum Hyalu B5 La Roche-Posay\",\"undertoneMatch\":\"HARMONIC\"}]}";
        OutboundSseEvent sseStage5 = sse.newEventBuilder().name("recommended_skus").data(recJson).build();

        return Multi.createBy().concatenating().streams(
                Multi.createFrom().items(sseStage1, sseStage2, sseStage3),
                sseGraphInsight.toMulti(),
                tokenMulti,
                Multi.createFrom().item(sseStage5)
        );
    }

    public static class RoutineCheckRequest {
        private List<String> productIds;
        private String skinType;

        public RoutineCheckRequest() {}
        public RoutineCheckRequest(List<String> productIds, String skinType) {
            this.productIds = productIds;
            this.skinType = skinType;
        }

        public List<String> getProductIds() { return productIds; }
        public void setProductIds(List<String> productIds) { this.productIds = productIds; }
        public String getSkinType() { return skinType; }
        public void setSkinType(String skinType) { this.skinType = skinType; }
    }

    @GET
    @Path("/graph/product/{productId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Uni<ApiResponse<KnowledgeGraphDto>> getProductEgoGraph(@PathParam("productId") String productId) {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), advisorService.getProductEgoGraph(productId))
                .map(ApiResponse::ok);
    }

    @POST
    @Path("/graph/routine-check")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Uni<ApiResponse<SkinRoutineGraphAnalysis>> checkRoutineCompatibility(RoutineCheckRequest request) {
        List<String> pids = request.getProductIds() != null ? request.getProductIds() : List.of();
        String st = request.getSkinType() != null ? request.getSkinType() : "NORMAL";
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), advisorService.checkRoutineCompatibility(pids, st))
                .map(ApiResponse::ok);
    }

    @GET
    @Path("/graph/full-cosmetics")
    @Produces(MediaType.APPLICATION_JSON)
    public Uni<ApiResponse<KnowledgeGraphDto>> getFullCosmeticsGraph() {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), advisorService.getFullCosmeticsGraph())
                .map(ApiResponse::ok);
    }

    @GET
    @Path("/history/{conversationId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Uni<ApiResponse<List<ChatMessageEntity>>> getHistory(@PathParam("conversationId") UUID conversationId) {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), advisorService.getConversationHistory(conversationId).collectList())
                .map(ApiResponse::ok);
    }
}
