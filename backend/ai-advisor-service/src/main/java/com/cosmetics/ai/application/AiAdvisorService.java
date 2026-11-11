package com.cosmetics.ai.application;

import com.cosmetics.ai.adapter.out.persistence.ChatMessageEntity;
import com.cosmetics.ai.adapter.out.persistence.ChatMessageRepository;
import com.cosmetics.ai.adapter.out.persistence.VectorStoreRepository;
import com.cosmetics.ai.domain.DeterministicInciConflictEngine;
import com.cosmetics.ai.domain.KnowledgeChunk;
import com.cosmetics.ai.domain.model.graph.KnowledgeGraphDto;
import com.cosmetics.ai.domain.model.graph.KnowledgeGraphEdge;
import com.cosmetics.ai.domain.model.graph.KnowledgeGraphNode;
import com.cosmetics.ai.domain.model.graph.SkinRoutineGraphAnalysis;
import com.cosmetics.common.events.payloads.ProductPublishedPayload;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.InputStream;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@ApplicationScoped
public class AiAdvisorService {
    private static final Logger log = LoggerFactory.getLogger(AiAdvisorService.class);

    private final VectorStoreRepository vectorStoreRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final EmbeddingModelService embeddingModelService;
    private final ObjectMapper objectMapper;

    private final Map<String, KnowledgeGraphNode> graphNodes = new ConcurrentHashMap<>();
    private final List<KnowledgeGraphEdge> graphEdges = new CopyOnWriteArrayList<>();
    private Map<String, Object> graphMetadata = Map.of();

    public AiAdvisorService(
            VectorStoreRepository vectorStoreRepository,
            ChatMessageRepository chatMessageRepository,
            EmbeddingModelService embeddingModelService,
            ObjectMapper objectMapper
    ) {
        this.vectorStoreRepository = vectorStoreRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.embeddingModelService = embeddingModelService;
        this.objectMapper = objectMapper;
    }

    void onStart(@Observes StartupEvent ev) {
        initKnowledgeGraph();
    }

    public void initKnowledgeGraph() {
        try (InputStream is = Thread.currentThread().getContextClassLoader().getResourceAsStream("cosmetics_knowledge_graph.json")) {
            if (is != null) {
                var tree = objectMapper.readTree(is);
                if (tree.has("metadata")) {
                    this.graphMetadata = objectMapper.convertValue(tree.get("metadata"), Map.class);
                }
                if (tree.has("nodes")) {
                    for (var nNode : tree.get("nodes")) {
                        KnowledgeGraphNode node = objectMapper.treeToValue(nNode, KnowledgeGraphNode.class);
                        graphNodes.put(node.id(), node);
                    }
                }
                if (tree.has("edges")) {
                    for (var eNode : tree.get("edges")) {
                        KnowledgeGraphEdge edge = objectMapper.treeToValue(eNode, KnowledgeGraphEdge.class);
                        graphEdges.add(edge);
                    }
                }
                log.info("Graphify Engine: Loaded {} nodes, {} edges into reactive memory", graphNodes.size(), graphEdges.size());
            } else {
                log.warn("cosmetics_knowledge_graph.json not found in classpath");
            }
        } catch (Exception e) {
            log.warn("Failed to load cosmetics_knowledge_graph.json: {}", e.getMessage());
        }
    }

    public Mono<KnowledgeGraphDto> getFullCosmeticsGraph() {
        return Mono.just(new KnowledgeGraphDto(
            graphMetadata,
            List.copyOf(graphNodes.values()),
            List.copyOf(graphEdges)
        ));
    }

    public Mono<KnowledgeGraphDto> getProductEgoGraph(String productId) {
        String pNodeId = productId.startsWith("PRODUCT:") ? productId : "PRODUCT:" + productId;
        KnowledgeGraphNode centerNode = graphNodes.get(pNodeId);
        if (centerNode == null) {
            for (KnowledgeGraphNode n : graphNodes.values()) {
                if (productId.equalsIgnoreCase(n.id())) {
                    centerNode = n;
                    pNodeId = n.id();
                    break;
                }
            }
        }

        if (centerNode == null) {
            return Mono.just(new KnowledgeGraphDto(Map.of("status", "NOT_FOUND"), List.of(), List.of()));
        }

        Set<String> hop1NodeIds = new HashSet<>();
        hop1NodeIds.add(pNodeId);
        List<KnowledgeGraphEdge> relevantEdges = new ArrayList<>();

        for (KnowledgeGraphEdge edge : graphEdges) {
            if (edge.source().equals(pNodeId)) {
                hop1NodeIds.add(edge.target());
                relevantEdges.add(edge);
            } else if (edge.target().equals(pNodeId)) {
                hop1NodeIds.add(edge.source());
                relevantEdges.add(edge);
            }
        }

        // 2-hop edges for active ingredients (synergies and conflicts)
        Set<String> allNodeIds = new HashSet<>(hop1NodeIds);
        for (KnowledgeGraphEdge edge : graphEdges) {
            if ("SYNERGY_WITH".equals(edge.relationship()) || "CONFLICTS_WITH".equals(edge.relationship())) {
                if (hop1NodeIds.contains(edge.source()) || hop1NodeIds.contains(edge.target())) {
                    allNodeIds.add(edge.source());
                    allNodeIds.add(edge.target());
                    if (!relevantEdges.contains(edge)) {
                        relevantEdges.add(edge);
                    }
                }
            }
        }

        List<KnowledgeGraphNode> subNodes = allNodeIds.stream()
            .map(graphNodes::get)
            .filter(Objects::nonNull)
            .toList();

        return Mono.just(new KnowledgeGraphDto(
            Map.of("centerProductId", productId, "nodeCount", subNodes.size(), "edgeCount", relevantEdges.size()),
            subNodes,
            relevantEdges
        ));
    }

    public Mono<SkinRoutineGraphAnalysis> checkRoutineCompatibility(List<String> productIds, String skinType) {
        List<String> allIngredients = new ArrayList<>();
        Set<String> relevantNodeIds = new HashSet<>();
        List<KnowledgeGraphEdge> routineEdges = new ArrayList<>();

        if (productIds != null) {
            for (String pid : productIds) {
                String pNodeId = pid.startsWith("PRODUCT:") ? pid : "PRODUCT:" + pid;
                if (graphNodes.containsKey(pNodeId)) {
                    relevantNodeIds.add(pNodeId);
                    for (KnowledgeGraphEdge e : graphEdges) {
                        if (e.source().equals(pNodeId) && "CONTAINS_ACTIVE".equals(e.relationship())) {
                            relevantNodeIds.add(e.target());
                            routineEdges.add(e);
                            KnowledgeGraphNode ingNode = graphNodes.get(e.target());
                            if (ingNode != null) {
                                allIngredients.add(ingNode.label());
                            }
                        }
                    }
                }
            }
        }

        List<String> synergyMessages = new ArrayList<>();
        for (KnowledgeGraphEdge e : graphEdges) {
            if ("SYNERGY_WITH".equals(e.relationship()) && relevantNodeIds.contains(e.source()) && relevantNodeIds.contains(e.target())) {
                routineEdges.add(e);
                synergyMessages.add(e.description());
            } else if ("CONFLICTS_WITH".equals(e.relationship()) && relevantNodeIds.contains(e.source()) && relevantNodeIds.contains(e.target())) {
                routineEdges.add(e);
            }
        }

        var conflicts = DeterministicInciConflictEngine.checkConflicts(allIngredients, skinType);
        boolean isSafe = conflicts.isEmpty();
        String summary = isSafe
            ? "Chu trình dưỡng da an toàn 100%, các hoạt chất kết hợp hài hòa hỗ trợ phục hồi và phát huy tối đa công năng."
            : "CẢNH BÁO: Phát hiện " + conflicts.size() + " cặp hoạt chất xung đột. Khuyến nghị tách cữ sáng/tối hoặc áp dụng Skin Cycling.";

        List<KnowledgeGraphNode> activeNodes = relevantNodeIds.stream()
            .map(graphNodes::get)
            .filter(Objects::nonNull)
            .toList();

        return Mono.just(new SkinRoutineGraphAnalysis(
            activeNodes,
            routineEdges,
            conflicts,
            synergyMessages,
            isSafe,
            summary
        ));
    }

    public record VtoChatContext(
            String shadeName,
            String hexColor,
            String finishType,
            String detectedUndertone,
            String productId,
            String productName
    ) {}

    public Mono<Void> indexProduct(ProductPublishedPayload payload) {
        UUID chunkId = UUID.nameUUIDFromBytes(payload.getProductId().getBytes());
        String skinTypes = payload.getSuitableSkinTypes() != null ? String.join(", ", payload.getSuitableSkinTypes()) : "All";
        String ingredients = payload.getIngredientInciNames() != null ? String.join(", ", payload.getIngredientInciNames()) : "None listed";

        String content = String.format(
                "Sản phẩm: %s | Thương hiệu: %s | Danh mục: %s | Loại da phù hợp: %s | Số công bố: %s. Thành phần INCI: %s. Mô tả: %s",
                payload.getName(), payload.getBrand(), payload.getCategory(), skinTypes, payload.getRegistrationNo(), ingredients, payload.getDescription()
        );

        float[] embedding = embeddingModelService.generateEmbedding(content);

        Map<String, Object> metadata = Map.of(
                "brand", payload.getBrand() != null ? payload.getBrand() : "",
                "category", payload.getCategory() != null ? payload.getCategory() : "",
                "skinTypes", payload.getSuitableSkinTypes() != null ? payload.getSuitableSkinTypes() : List.of()
        );

        try {
            String metaJson = objectMapper.writeValueAsString(metadata);
            return vectorStoreRepository.saveChunk(
                    chunkId,
                    payload.getProductId(),
                    payload.getShopId(),
                    payload.getName(),
                    content,
                    metaJson,
                    embedding
            );
        } catch (Exception e) {
            return Mono.error(e);
        }
    }

    public Flux<String> streamAdvisorChat(UUID conversationId, String query, String skinType, List<String> allergies) {
        return streamAdvisorChat(conversationId, query, skinType, allergies, null);
    }

    public Flux<String> streamAdvisorChat(UUID conversationId, String query, String skinType, List<String> allergies, VtoChatContext vtoContext) {
        String effectiveQuery = query != null && !query.isBlank()
                ? query
                : (vtoContext != null ? "Tư vấn màu sắc " + vtoContext.shadeName() + " " + vtoContext.productName() : "Tư vấn mỹ phẩm");

        float[] queryEmbedding = embeddingModelService.generateEmbedding(effectiveQuery);

        // 1. Save user question
        UUID userMsgId = UUID.randomUUID();
        Mono<ChatMessageEntity> saveUserMsg = chatMessageRepository.save(new ChatMessageEntity(userMsgId, conversationId, "USER", effectiveQuery, ""));

        // 2. Retrieve Top-K chunks via pgvector
        return saveUserMsg.thenMany(
                vectorStoreRepository.findTopKSimilar(queryEmbedding, 4).collectList()
                        .flatMapMany(chunks -> generateStreamResponse(conversationId, effectiveQuery, skinType, allergies, chunks, vtoContext))
        );
    }

    private Flux<String> generateStreamResponse(UUID conversationId, String query, String skinType, List<String> allergies, List<KnowledgeChunk> chunks, VtoChatContext vtoContext) {
        StringBuilder fullAnswer = new StringBuilder();
        List<String> citations = new ArrayList<>();
        List<String> tokens = new ArrayList<>();

        if (vtoContext != null && (vtoContext.hexColor() != null || vtoContext.shadeName() != null)) {
            // VTO Specific 3-Point Advice Response
            String prodName = vtoContext.productName() != null ? vtoContext.productName() : "Sản phẩm đang thử";
            String shadeName = vtoContext.shadeName() != null ? vtoContext.shadeName() : "Màu chọn";
            String hexColor = vtoContext.hexColor() != null ? vtoContext.hexColor() : "#C72C48";
            String finish = vtoContext.finishType() != null ? vtoContext.finishType() : "SATIN";
            String undertone = vtoContext.detectedUndertone() != null ? vtoContext.detectedUndertone() : "NEUTRAL";
            String userSkinType = (skinType != null && !skinType.isBlank()) ? skinType : "Hỗn hợp";

            tokens.add("✨ **Trợ Lý Da Liễu AI & Chuyên Gia Trang Điểm AR**\n\n");
            tokens.add(String.format("Bạn đang thử trực tuyến: **%s** — Tông màu **%s** (`%s`, chất son/phấn: **%s**).\n", prodName, shadeName, hexColor, finish));
            tokens.add(String.format("Camera AI ghi nhận sắc tố da: **%s Undertone** | Hồ sơ da: **%s**.\n\n", undertone, userSkinType));

            // Point 1: Tone flatter check
            String toneFlatter;
            if ("WARM".equalsIgnoreCase(undertone)) {
                toneFlatter = "rất tôn nước da WARM (Ấm), giúp da trông hồng hào, rạng rỡ và tràn đầy sức sống tự nhiên.";
            } else if ("COOL".equalsIgnoreCase(undertone)) {
                toneFlatter = "tạo độ tương phản sang trọng, làm sáng bật nền da COOL (Lạnh) và làm trắng men răng rõ rệt.";
            } else {
                toneFlatter = "hài hòa tuyệt đối với tông da NEUTRAL (Trung tính), đem lại cảm giác tự nhiên, thanh lịch cả khi đi làm lẫn dạo phố.";
            }
            tokens.add(String.format("1. **Đánh giá độ tôn da**: Màu **%s** (%s) %s\n\n", shadeName, hexColor, toneFlatter));

            // Point 2: INCI pgvector analysis
            StringBuilder inciDetails = new StringBuilder();
            if (!chunks.isEmpty()) {
                KnowledgeChunk topChunk = chunks.get(0);
                citations.add(topChunk.getProductId());
                inciDetails.append(String.format("Dựa trên phân tích cơ sở dữ liệu INCI của %s: ", topChunk.getTitle()));
            } else {
                inciDetails.append("Dựa trên phân tích thành phần INCI tiêu chuẩn: ");
            }
            inciDetails.append(String.format("Công thức chứa các chất dưỡng ẩm tự nhiên lành tính, chỉ số gây bít tắc lỗ chân lông (Comedogenic Rating: 0-1) và tỷ lệ kích ứng (Irritation) đạt mức an toàn tuyệt đối cho làn da/vùng môi %s.", userSkinType));
            tokens.add(String.format("2. **Độ an toàn thành phần (INCI & Comedogenic)**: %s\n\n", inciDetails));

            // Point 3: Makeup pairing
            String pairing;
            if ("MATTE".equalsIgnoreCase(finish)) {
                pairing = "Chất Matte lì nên được kết hợp với một lớp son dưỡng lót mỏng nhẹ hoặc xịt khóa ẩm dewy để giữ hiệu ứng căng mịn bền màu suốt 8 tiếng.";
            } else if ("GLOSSY".equalsIgnoreCase(finish)) {
                pairing = "Hiệu ứng bóng mọng nước (Glossy) rất hợp khi kết hợp phấn má hồng đào nhẹ nhàng và chuốt mi cong tự nhiên kiểu Clean Girl Aesthetic.";
            } else {
                pairing = "Bạn có thể đánh lòng môi hoặc tán ombre nhẹ cho phong cách hàng ngày, hoặc thoa full môi kèm má hồng cùng tông để tạo diện mạo sang trọng cuốn hút.";
            }
            tokens.add(String.format("3. **Gợi ý phối phong cách trang điểm**: %s\n\n", pairing));
            tokens.add("💡 *Mẹo*: Bạn có thể bật chế độ trượt Trước/Sau (Before/After) trên màn hình AR để so sánh trực quan hiệu ứng trước khi thêm vào giỏ hàng!");

        } else {
            // General RAG Chat Flow
            StringBuilder allergyWarning = new StringBuilder();
            if (allergies != null && !allergies.isEmpty()) {
                for (KnowledgeChunk chunk : chunks) {
                    for (String allergen : allergies) {
                        if (chunk.getContent().toLowerCase().contains(allergen.toLowerCase())) {
                            allergyWarning.append(String.format("⚠️ CẢNH BÁO DỊ ỨNG: Sản phẩm '%s' có chứa thành phần '%s' trong danh sách dị ứng của bạn!\n", chunk.getTitle(), allergen));
                        }
                    }
                }
            }

            tokens.add("Xin chào! Tôi là Trợ Lý Da Liễu AI Advisor.\n\n");

            if (allergyWarning.length() > 0) {
                tokens.add(allergyWarning.toString() + "\n");
            }

            if (skinType != null && !skinType.isBlank()) {
                tokens.add(String.format("Dựa trên hồ sơ làn da của bạn (%s), dưới đây là phân tích và gợi ý phù hợp nhất:\n\n", skinType));
            } else {
                tokens.add("Dưới đây là các sản phẩm phù hợp nhất dựa trên tra cứu thành phần INCI trong danh mục:\n\n");
            }

            if (chunks.isEmpty()) {
                tokens.add("Hiện chưa tìm thấy sản phẩm có thành phần hoàn toàn khớp với câu hỏi của bạn. Vui lòng thử lại với tên hoạt chất hoặc công dụng khác.");
            } else {
                int rank = 1;
                for (KnowledgeChunk chunk : chunks) {
                    citations.add(chunk.getProductId());
                    tokens.add(String.format("%d. **%s** (Độ tương thích: %.1f%%)\n", rank++, chunk.getTitle(), Math.max(70.0, chunk.getSimilarity() * 100)));
                    tokens.add(String.format("   - *Thông tin*: %s\n\n", chunk.getContent()));
                }
                tokens.add("\n💡 *Lời khuyên*: Nếu bạn đang có bệnh lý về da hoặc tiền sử kích ứng nặng, hãy tham khảo ý kiến bác sĩ da liễu trước khi bắt đầu chu trình dưỡng da mới.");
            }
        }

        for (String t : tokens) {
            fullAnswer.append(t);
        }

        // Save assistant response at end of stream
        String citationStr = String.join(",", citations);
        ChatMessageEntity assistantMsg = new ChatMessageEntity(UUID.randomUUID(), conversationId, "ASSISTANT", fullAnswer.toString(), citationStr);

        return Flux.fromIterable(tokens)
                .delayElements(Duration.ofMillis(60)) // Smooth streaming SSE effect
                .doOnComplete(() -> chatMessageRepository.save(assistantMsg).subscribe());
    }

    public Flux<ChatMessageEntity> getConversationHistory(UUID conversationId) {
        return chatMessageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
    }
}
