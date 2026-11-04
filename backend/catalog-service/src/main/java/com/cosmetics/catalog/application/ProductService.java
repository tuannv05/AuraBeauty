package com.cosmetics.catalog.application;

import com.cosmetics.catalog.adapter.out.messaging.CatalogEventPublisher;
import com.cosmetics.catalog.adapter.out.persistence.ProductDocument;
import com.cosmetics.catalog.adapter.out.persistence.ProductRepository;
import com.cosmetics.common.events.payloads.ProductPublishedPayload;
import com.cosmetics.common.web.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CatalogEventPublisher eventPublisher;

    public ProductService(ProductRepository productRepository, CatalogEventPublisher eventPublisher) {
        this.productRepository = productRepository;
        this.eventPublisher = eventPublisher;
    }

    public Mono<ProductDocument> createDraft(ProductDocument doc) {
        doc.setStatus("DRAFT");
        doc.setCreatedAt(Instant.now());
        doc.setUpdatedAt(Instant.now());
        return productRepository.save(doc);
    }

    public Mono<ProductDocument> submitForReview(String productId, UUID shopId) {
        return productRepository.findById(productId)
                .switchIfEmpty(Mono.error(new BusinessException(HttpStatus.NOT_FOUND, "PRODUCT_001", "Product not found")))
                .flatMap(product -> {
                    if (shopId != null && !shopId.equals(product.getShopId())) {
                        return Mono.error(new BusinessException(HttpStatus.FORBIDDEN, "FORBIDDEN", "You do not own this product"));
                    }
                    if (product.getVariants() == null || product.getVariants().isEmpty()) {
                        return Mono.error(new BusinessException(HttpStatus.BAD_REQUEST, "PRODUCT_002", "Product must have at least one variant"));
                    }
                    if (product.getRegistrationNo() == null || product.getRegistrationNo().isBlank()) {
                        return Mono.error(new BusinessException(HttpStatus.BAD_REQUEST, "PRODUCT_003", "Registration No. is required"));
                    }
                    product.setStatus("SUBMITTED");
                    product.setUpdatedAt(Instant.now());
                    return productRepository.save(product);
                });
    }

    public Mono<ProductDocument> approveProduct(String productId) {
        return productRepository.findById(productId)
                .switchIfEmpty(Mono.error(new BusinessException(HttpStatus.NOT_FOUND, "PRODUCT_001", "Product not found")))
                .flatMap(product -> {
                    if (!"SUBMITTED".equals(product.getStatus()) && !"DRAFT".equals(product.getStatus())) {
                        return Mono.error(new BusinessException(HttpStatus.BAD_REQUEST, "PRODUCT_004", "Product is not ready for approval"));
                    }
                    product.setStatus("PUBLISHED");
                    product.setUpdatedAt(Instant.now());
                    return productRepository.save(product)
                            .flatMap(saved -> {
                                ProductPublishedPayload payload = new ProductPublishedPayload();
                                payload.setProductId(saved.getId());
                                payload.setShopId(saved.getShopId());
                                payload.setName(saved.getName());
                                payload.setBrand(saved.getBrand());
                                payload.setDescription(saved.getDescription());
                                payload.setCategory(saved.getCategory());
                                payload.setRegistrationNo(saved.getRegistrationNo());
                                payload.setSuitableSkinTypes(saved.getSuitableSkinTypes());
                                if (saved.getIngredients() != null) {
                                    payload.setIngredientInciNames(saved.getIngredients().stream().map(ProductDocument.IngredientSubDoc::getInciName).toList());
                                }
                                if (saved.getVariants() != null) {
                                    payload.setVariants(saved.getVariants().stream()
                                            .map(v -> new ProductPublishedPayload.VariantDto(v.getSkuCode(), v.getName(), v.getPrice()))
                                            .toList());
                                }
                                return eventPublisher.publishProductPublished(payload).thenReturn(saved);
                            });
                });
    }

    public Mono<ProductDocument> rejectProduct(String productId, String reason) {
        return productRepository.findById(productId)
                .switchIfEmpty(Mono.error(new BusinessException(HttpStatus.NOT_FOUND, "PRODUCT_001", "Product not found")))
                .flatMap(product -> {
                    product.setStatus("REJECTED");
                    product.setUpdatedAt(Instant.now());
                    return productRepository.save(product);
                });
    }

    public Flux<ProductDocument> search(String query, String category, String skinType) {
        return search(query, category, skinType, null, null, null, null, null, null);
    }

    public Flux<ProductDocument> search(String query, String category, String skinType,
                                        String concern, String activeGroup, String badge,
                                        String texture, String origin, String priceBucket) {
        Flux<ProductDocument> flux;
        if (query != null && !query.isBlank()) {
            String safeQuery = Pattern.quote(query.trim());
            flux = productRepository.searchPublished(safeQuery);
        } else if (category != null && !category.isBlank()) {
            String safeCategory = Pattern.quote(category.trim());
            flux = productRepository.findByCategoryHierarchyAndStatus(safeCategory, "PUBLISHED");
        } else {
            flux = productRepository.findByStatus("PUBLISHED");
        }

        return flux
                .filter(p -> category == null || category.isBlank() || matchesCategory(p, category))
                .filter(p -> skinType == null || skinType.isBlank() || (p.getSuitableSkinTypes() != null && p.getSuitableSkinTypes().contains(skinType.toUpperCase())))
                .filter(p -> concern == null || concern.isBlank() || (p.getSkinConcerns() != null && p.getSkinConcerns().contains(concern.toUpperCase())))
                .filter(p -> activeGroup == null || activeGroup.isBlank() || (p.getKeyActiveGroups() != null && p.getKeyActiveGroups().contains(activeGroup.toUpperCase())))
                .filter(p -> badge == null || badge.isBlank() || (p.getSafetyEthicsBadges() != null && p.getSafetyEthicsBadges().contains(badge.toUpperCase())))
                .filter(p -> texture == null || texture.isBlank() || texture.equalsIgnoreCase(p.getFormulationTexture()))
                .filter(p -> origin == null || origin.isBlank() || origin.equalsIgnoreCase(p.getOriginCountry()))
                .filter(p -> priceBucket == null || priceBucket.isBlank() || priceBucket.equalsIgnoreCase(p.getPriceRangeBucket()));
    }

    public Mono<ProductDocument> getById(String id) {
        return productRepository.findById(id)
                .switchIfEmpty(Mono.error(new BusinessException(HttpStatus.NOT_FOUND, "PRODUCT_001", "Product not found")));
    }

    public Flux<ProductDocument> getByShopId(UUID shopId) {
        return productRepository.findByShopId(shopId);
    }

    public Mono<ProductDocument.VariantSubDoc> getVariantBySku(String skuCode) {
        return productRepository.findByVariantSkuCode(skuCode)
                .flatMap(p -> {
                    if (p.getVariants() != null) {
                        for (ProductDocument.VariantSubDoc v : p.getVariants()) {
                            if (skuCode.equals(v.getSkuCode())) {
                                return Mono.just(v);
                            }
                        }
                    }
                    return Mono.empty();
                })
                .switchIfEmpty(Mono.error(new BusinessException(HttpStatus.NOT_FOUND, "SKU_NOT_FOUND", "SKU variant not found: " + skuCode)));
    }

    private boolean matchesCategory(ProductDocument p, String category) {
        if (category == null || category.isBlank()) return true;
        String clean = category.trim();
        if (p.getCategory() != null && p.getCategory().equalsIgnoreCase(clean)) {
            return true;
        }
        if (p.getSubCategory() != null && p.getSubCategory().equalsIgnoreCase(clean)) {
            return true;
        }
        if (p.getCategoryPath() != null) {
            for (String path : p.getCategoryPath()) {
                if (path.equalsIgnoreCase(clean)) {
                    return true;
                }
            }
        }
        return false;
    }
}
