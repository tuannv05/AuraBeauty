package com.cosmetics.ai.application;

import com.cosmetics.ai.adapter.out.persistence.ChatMessageEntity;
import com.cosmetics.ai.adapter.out.persistence.ChatMessageRepository;
import com.cosmetics.ai.adapter.out.persistence.VectorStoreRepository;
import com.cosmetics.ai.domain.KnowledgeChunk;
import com.cosmetics.common.events.payloads.ProductPublishedPayload;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.*;

@Service
public class AiAdvisorService {
    private static final Logger log = LoggerFactory.getLogger(AiAdvisorService.class);

    private final VectorStoreRepository vectorStoreRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final EmbeddingModelService embeddingModelService;
    private final ObjectMapper objectMapper;

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
        float[] queryEmbedding = embeddingModelService.generateEmbedding(query);

        // 1. Save user question
        UUID userMsgId = UUID.randomUUID();
        Mono<ChatMessageEntity> saveUserMsg = chatMessageRepository.save(new ChatMessageEntity(userMsgId, conversationId, "USER", query, ""));

        // 2. Retrieve Top-K chunks via pgvector R2DBC
        return saveUserMsg.thenMany(
                vectorStoreRepository.findTopKSimilar(queryEmbedding, 4).collectList()
                        .flatMapMany(chunks -> generateStreamResponse(conversationId, query, skinType, allergies, chunks))
        );
    }

    private Flux<String> generateStreamResponse(UUID conversationId, String query, String skinType, List<String> allergies, List<KnowledgeChunk> chunks) {
        StringBuilder fullAnswer = new StringBuilder();
        List<String> citations = new ArrayList<>();

        // Check allergies
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

        List<String> tokens = new ArrayList<>();
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

        for (String t : tokens) {
            fullAnswer.append(t);
        }

        // Save assistant response at end of stream
        String citationStr = String.join(",", citations);
        ChatMessageEntity assistantMsg = new ChatMessageEntity(UUID.randomUUID(), conversationId, "ASSISTANT", fullAnswer.toString(), citationStr);

        return Flux.fromIterable(tokens)
                .delayElements(Duration.ofMillis(80)) // Streaming SSE effect
                .doOnComplete(() -> chatMessageRepository.save(assistantMsg).subscribe());
    }

    public Flux<ChatMessageEntity> getConversationHistory(UUID conversationId) {
        return chatMessageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
    }
}
