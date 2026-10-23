package com.cosmetics.catalog.config;

import com.cosmetics.catalog.adapter.out.messaging.CatalogEventPublisher;
import com.cosmetics.catalog.adapter.out.persistence.ProductDocument;
import com.cosmetics.catalog.adapter.out.persistence.ProductRepository;
import com.cosmetics.common.events.payloads.ProductPublishedPayload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@Configuration
public class CatalogDataSeeder {
    private static final Logger log = LoggerFactory.getLogger(CatalogDataSeeder.class);

    @Bean
    public ApplicationRunner seedCatalog(ProductRepository productRepository, CatalogEventPublisher publisher) {
        return args -> {
            productRepository.count()
                    .flatMap(count -> {
                        if (count > 0) {
                            log.info("Catalog already contains {} products, skipping seed.", count);
                            return Mono.empty();
                        }
                        log.info("Seeding 100+ realistic cosmetics products with INCI ingredients...");
                        List<ProductDocument> list = buildProducts();
                        return productRepository.saveAll(list)
                                .flatMap(p -> {
                                    ProductPublishedPayload payload = new ProductPublishedPayload();
                                    payload.setProductId(p.getId());
                                    payload.setShopId(p.getShopId());
                                    payload.setName(p.getName());
                                    payload.setBrand(p.getBrand());
                                    payload.setDescription(p.getDescription());
                                    payload.setCategory(p.getCategory());
                                    payload.setRegistrationNo(p.getRegistrationNo());
                                    payload.setSuitableSkinTypes(p.getSuitableSkinTypes());
                                    payload.setIngredientInciNames(p.getIngredients().stream().map(ProductDocument.IngredientSubDoc::getInciName).toList());
                                    payload.setVariants(p.getVariants().stream()
                                            .map(v -> new ProductPublishedPayload.VariantDto(v.getSkuCode(), v.getName(), v.getPrice()))
                                            .toList());
                                    return publisher.publishProductPublished(payload).thenReturn(p);
                                })
                                .then();
                    })
                    .doOnSuccess(v -> log.info("Catalog seeding finished successfully."))
                    .subscribe();
        };
    }

    private List<ProductDocument> buildProducts() {
        List<ProductDocument> products = new ArrayList<>();
        UUID anuaShopId = UUID.fromString("00000000-0000-0000-0000-000000000010");
        UUID generalShopId = UUID.fromString("00000000-0000-0000-0000-000000000020");

        String[] brands = {
                "Anua", "Beauty of Joseon", "COSRX", "Skin1004", "La Roche-Posay",
                "Paula's Choice", "The Ordinary", "CeraVe", "Torriden", "Round Lab",
                "Innisfree", "Laneige", "Klairs", "Some By Mi", "I'm From"
        };

        String[] categories = {"Toner", "Serum", "Cream", "Sunscreen", "Cleanser"};

        String[][] ingredientsTemplates = {
                {"Houttuynia Cordata Extract", "Soothing anti-inflammatory", "false"},
                {"Centella Asiatica Extract", "Wound healing and barrier repair", "false"},
                {"Niacinamide", "Pore tightening and brightening", "false"},
                {"Hyaluronic Acid", "Deep hydration humectant", "false"},
                {"Salicylic Acid", "BHA pore exfoliation", "true"},
                {"Ceramide NP", "Skin lipid barrier strengthener", "false"},
                {"Retinol", "Collagen renewal anti-aging", "true"},
                {"Madecassoside", "Centella active soothing agent", "false"},
                {"Panthenol", "Pro-vitamin B5 skin recovery", "false"},
                {"Melaleuca Alternifolia (Tea Tree) Leaf Oil", "Antimicrobial acne control", "true"},
                {"Zinc PCA", "Sebum regulation", "false"},
                {"Glycerin", "Moisture retention", "false"},
                {"Squalane", "Non-comedogenic emollient", "false"},
                {"Ascorbic Acid", "Vitamin C antioxidant brighten", "true"},
                {"Snail Secretion Filtrate", "Cellular repair and elasticity", "false"}
        };

        String[] skinTypes = {"OILY", "DRY", "SENSITIVE", "COMBINATION", "NORMAL"};

        int index = 1;
        for (String brand : brands) {
            for (String category : categories) {
                for (int variantType = 1; variantType <= 2; variantType++) {
                    ProductDocument p = new ProductDocument();
                    p.setId("PROD-" + String.format("%03d", index));
                    p.setShopId(brand.equals("Anua") ? anuaShopId : generalShopId);
                    p.setBrand(brand);
                    p.setCategory(category);
                    p.setName(brand + " " + category + " Special " + (variantType == 1 ? "Daily Care" : "Advanced Pro"));
                    p.setDescription("Sản phẩm " + category + " chuyên sâu từ thương hiệu " + brand + ", giúp phục hồi và cân bằng làn da tối ưu.");
                    p.setRegistrationNo("CBMP-" + (100000 + index) + "/24/CBMP-QLD");
                    p.setStatus("PUBLISHED");
                    p.setCreatedAt(Instant.now());
                    p.setUpdatedAt(Instant.now());

                    List<String> suitableSkins = new ArrayList<>();
                    suitableSkins.add(skinTypes[(index) % skinTypes.length]);
                    suitableSkins.add(skinTypes[(index + 1) % skinTypes.length]);
                    p.setSuitableSkinTypes(suitableSkins);

                    List<ProductDocument.IngredientSubDoc> ingList = new ArrayList<>();
                    for (int k = 0; k < 5; k++) {
                        int templateIdx = (index + k) % ingredientsTemplates.length;
                        String[] t = ingredientsTemplates[templateIdx];
                        ingList.add(new ProductDocument.IngredientSubDoc(t[0], t[1], Boolean.parseBoolean(t[2])));
                    }
                    p.setIngredients(ingList);

                    List<ProductDocument.VariantSubDoc> varList = new ArrayList<>();
                    String sku1 = "SKU-" + String.format("%03d", index) + "-50ML";
                    BigDecimal price1 = BigDecimal.valueOf(150000L + (index * 2000L));
                    varList.add(new ProductDocument.VariantSubDoc(sku1, "50ml", price1, price1.add(BigDecimal.valueOf(50000L)), Map.of("volume", "50ml")));

                    String sku2 = "SKU-" + String.format("%03d", index) + "-150ML";
                    BigDecimal price2 = price1.multiply(BigDecimal.valueOf(2.2)).setScale(0, java.math.RoundingMode.HALF_UP);
                    varList.add(new ProductDocument.VariantSubDoc(sku2, "150ml", price2, price2.add(BigDecimal.valueOf(80000L)), Map.of("volume", "150ml")));
                    p.setVariants(varList);

                    p.setImages(List.of("https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500"));

                    products.add(p);
                    index++;
                    if (products.size() >= 120) break;
                }
                if (products.size() >= 120) break;
            }
            if (products.size() >= 120) break;
        }

        return products;
    }
}
