package com.cosmetics.catalog.config;

import com.cosmetics.catalog.adapter.out.messaging.CatalogEventPublisher;
import com.cosmetics.catalog.adapter.out.persistence.ProductDocument;
import com.cosmetics.catalog.adapter.out.persistence.ProductRepository;
import com.cosmetics.catalog.domain.model.VtoConfig;
import com.cosmetics.common.events.payloads.ProductPublishedPayload;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.InputStream;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@ApplicationScoped
public class CatalogDataSeeder {
    private static final Logger log = LoggerFactory.getLogger(CatalogDataSeeder.class);

    void onStart(@Observes StartupEvent ev, ProductRepository productRepository, CatalogEventPublisher publisher, ObjectMapper objectMapper) {
        productRepository.count()
                .flatMap(count -> {
                    if (count > 0) {
                        log.info("Catalog already contains {} products, checking VTO update...", count);
                        return updateExistingProductsWithVto(productRepository);
                    }
                    log.info("Seeding 130+ realistic cosmetics products with INCI ingredients and VTO...");
                    List<ProductDocument> list = loadSeedProducts(objectMapper);
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
    }

    private List<ProductDocument> loadSeedProducts(ObjectMapper objectMapper) {
        try {
            InputStream is = Thread.currentThread().getContextClassLoader().getResourceAsStream("products_seed.json");
            if (is != null) {
                try (is) {
                    List<ProductDocument> docs = objectMapper.readValue(is, new TypeReference<List<ProductDocument>>() {});
                    log.info("Loaded {} products from products_seed.json", docs.size());
                    return docs;
                }
            }
        } catch (Exception e) {
            log.warn("Failed to load products_seed.json, falling back to programmatic buildProducts(): {}", e.getMessage());
        }
        return buildProducts();
    }

    private Mono<Void> updateExistingProductsWithVto(ProductRepository productRepository) {
        return productRepository.findAll()
                .filter(p -> p.getCategory() != null && (
                        p.getCategory().equalsIgnoreCase("Lipstick") ||
                        p.getCategory().equalsIgnoreCase("Blush") ||
                        p.getCategory().equalsIgnoreCase("Foundation") ||
                        p.getCategory().equalsIgnoreCase("Eyeshadow")
                ))
                .count()
                .flatMap(makeupCount -> {
                    if (makeupCount < 10) {
                        log.info("Seeding dedicated makeup products with full VTO configs (current count: {})...", makeupCount);
                        List<ProductDocument> makeupProducts = buildMakeupProducts();
                        return productRepository.saveAll(makeupProducts).then();
                    }
                    return Mono.empty();
                });
    }

    private List<ProductDocument> buildMakeupProducts() {
        List<ProductDocument> list = new ArrayList<>();
        UUID anuaShopId = UUID.fromString("00000000-0000-0000-0000-000000000010");
        UUID generalShopId = UUID.fromString("00000000-0000-0000-0000-000000000020");

        String[] makeupBrands = {"Romand", "Innisfree", "Laneige", "Aura Cosmetics"};

        int idx = 200;
        for (String brand : makeupBrands) {
            // Lipstick
            ProductDocument lip = new ProductDocument();
            lip.setId("PROD-VTO-" + (idx++));
            lip.setShopId(generalShopId);
            lip.setBrand(brand);
            lip.setCategory("Lipstick");
            lip.setName(brand + " Velvet Lip Tint & Matte Lipstick");
            lip.setDescription("Son lì nhung mịn màng, chuẩn màu thực tế ảo AR, giàu dưỡng chất không khô môi.");
            lip.setRegistrationNo("CBMP-VTO-" + idx + "/24/CBMP-QLD");
            lip.setStatus("PUBLISHED");
            lip.setCreatedAt(Instant.now());
            lip.setUpdatedAt(Instant.now());
            lip.setVtoConfig(buildLipstickVto());
            lip.setCategoryPath(List.of("MAKEUP", "LIP", "LIPSTICK"));
            lip.setSuitableSkinTypes(List.of("ALL", "OILY", "DRY", "COMBINATION", "SENSITIVE"));
            lip.setImages(List.of("https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500"));
            lip.setVariants(List.of(
                    new ProductDocument.VariantSubDoc("LIP-01", "01 Ruby Matte", BigDecimal.valueOf(290000), BigDecimal.valueOf(350000), Map.of("color", "Ruby Matte")),
                    new ProductDocument.VariantSubDoc("LIP-02", "02 Brick Velvet", BigDecimal.valueOf(290000), BigDecimal.valueOf(350000), Map.of("color", "Brick Velvet")),
                    new ProductDocument.VariantSubDoc("LIP-03", "03 Peach Gloss", BigDecimal.valueOf(290000), BigDecimal.valueOf(350000), Map.of("color", "Peach Gloss")),
                    new ProductDocument.VariantSubDoc("LIP-04", "04 Berry Plum", BigDecimal.valueOf(290000), BigDecimal.valueOf(350000), Map.of("color", "Berry Plum"))
            ));
            list.add(lip);

            // Blush
            ProductDocument blush = new ProductDocument();
            blush.setId("PROD-VTO-" + (idx++));
            blush.setShopId(generalShopId);
            blush.setBrand(brand);
            blush.setCategory("Blush");
            blush.setName(brand + " Soft Glow Blush Palette");
            blush.setDescription("Phấn má hồng mịn nhẹ, tạo hiệu ứng ửng hồng tự nhiên chuẩn phong cách Hàn Quốc.");
            blush.setRegistrationNo("CBMP-VTO-" + idx + "/24/CBMP-QLD");
            blush.setStatus("PUBLISHED");
            blush.setCreatedAt(Instant.now());
            blush.setUpdatedAt(Instant.now());
            blush.setVtoConfig(buildBlushVto());
            blush.setCategoryPath(List.of("MAKEUP", "FACE", "POWDER_BLUSH"));
            blush.setSuitableSkinTypes(List.of("ALL"));
            blush.setImages(List.of("https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500"));
            blush.setVariants(List.of(
                    new ProductDocument.VariantSubDoc("BLUSH-01", "01 Coral Sunset", BigDecimal.valueOf(240000), BigDecimal.valueOf(300000), Map.of("color", "Coral Sunset")),
                    new ProductDocument.VariantSubDoc("BLUSH-02", "02 Baby Pink", BigDecimal.valueOf(240000), BigDecimal.valueOf(300000), Map.of("color", "Baby Pink"))
            ));
            list.add(blush);

            // Foundation
            ProductDocument fnd = new ProductDocument();
            fnd.setId("PROD-VTO-" + (idx++));
            fnd.setShopId(generalShopId);
            fnd.setBrand(brand);
            fnd.setCategory("Foundation");
            fnd.setName(brand + " Perfect Cover Cushion Foundation SPF50+");
            fnd.setDescription("Kem nền che phủ hoàn hảo, mỏng nhẹ tự nhiên, kiểm soát dầu suốt 12 giờ.");
            fnd.setRegistrationNo("CBMP-VTO-" + idx + "/24/CBMP-QLD");
            fnd.setStatus("PUBLISHED");
            fnd.setCreatedAt(Instant.now());
            fnd.setUpdatedAt(Instant.now());
            fnd.setVtoConfig(buildFoundationVto());
            fnd.setCategoryPath(List.of("MAKEUP", "FACE", "FOUNDATION"));
            fnd.setSuitableSkinTypes(List.of("OILY", "COMBINATION", "DRY"));
            fnd.setImages(List.of("https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500"));
            fnd.setVariants(List.of(
                    new ProductDocument.VariantSubDoc("FND-21N", "21N Ivory", BigDecimal.valueOf(450000), BigDecimal.valueOf(520000), Map.of("color", "21N Ivory")),
                    new ProductDocument.VariantSubDoc("FND-23W", "23W Sand", BigDecimal.valueOf(450000), BigDecimal.valueOf(520000), Map.of("color", "23W Sand"))
            ));
            list.add(fnd);

            // Eyeshadow
            ProductDocument eye = new ProductDocument();
            eye.setId("PROD-VTO-" + (idx++));
            eye.setShopId(generalShopId);
            eye.setBrand(brand);
            eye.setCategory("Eyeshadow");
            eye.setName(brand + " Shimmer & Matte Eyeshadow Quad");
            eye.setDescription("Bảng phấn mắt 4 ô kết hợp chất lì velvet và nhũ bắt sáng shimmer lấp lánh.");
            eye.setRegistrationNo("CBMP-VTO-" + idx + "/24/CBMP-QLD");
            eye.setStatus("PUBLISHED");
            eye.setCreatedAt(Instant.now());
            eye.setUpdatedAt(Instant.now());
            eye.setVtoConfig(buildEyeshadowVto());
            eye.setCategoryPath(List.of("MAKEUP", "EYE", "EYESHADOW_PALETTE"));
            eye.setSuitableSkinTypes(List.of("ALL"));
            eye.setImages(List.of("https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500"));
            eye.setVariants(List.of(
                    new ProductDocument.VariantSubDoc("EYE-01", "01 Bronze Gold", BigDecimal.valueOf(320000), BigDecimal.valueOf(390000), Map.of("color", "Bronze Gold")),
                    new ProductDocument.VariantSubDoc("EYE-02", "02 Dusty Rose", BigDecimal.valueOf(320000), BigDecimal.valueOf(390000), Map.of("color", "Dusty Rose"))
            ));
            list.add(eye);
        }

        return list;
    }

    private static void assignVtoConfigIfApplicable(ProductDocument p) {
        String cat = p.getCategory() != null ? p.getCategory().toLowerCase() : "";
        if (cat.contains("lipstick") || cat.contains("son")) {
            p.setVtoConfig(buildLipstickVto());
        } else if (cat.contains("blush") || cat.contains("má")) {
            p.setVtoConfig(buildBlushVto());
        } else if (cat.contains("foundation") || cat.contains("nền")) {
            p.setVtoConfig(buildFoundationVto());
        } else if (cat.contains("eyeshadow") || cat.contains("mắt")) {
            p.setVtoConfig(buildEyeshadowVto());
        }
    }

    private static VtoConfig buildLipstickVto() {
        return new VtoConfig(true, VtoConfig.MakeupCategory.LIPSTICK, List.of(
                new VtoConfig.VtoShade("01", "Ruby Matte", "#9B111E", VtoConfig.FinishType.MATTE, 0.82, 0.05, 0.0, VtoConfig.UndertoneMatch.ALL),
                new VtoConfig.VtoShade("02", "Brick Velvet", "#B84A39", VtoConfig.FinishType.VELVET, 0.78, 0.15, 0.0, VtoConfig.UndertoneMatch.WARM),
                new VtoConfig.VtoShade("03", "Peach Gloss", "#E06D77", VtoConfig.FinishType.GLOSSY, 0.68, 0.85, 0.0, VtoConfig.UndertoneMatch.WARM),
                new VtoConfig.VtoShade("04", "Berry Plum", "#722F37", VtoConfig.FinishType.SATIN, 0.80, 0.40, 0.0, VtoConfig.UndertoneMatch.COOL)
        ));
    }

    private static VtoConfig buildBlushVto() {
        return new VtoConfig(true, VtoConfig.MakeupCategory.BLUSH, List.of(
                new VtoConfig.VtoShade("01", "Coral Sunset", "#F28482", VtoConfig.FinishType.MATTE, 0.35, 0.05, 0.0, VtoConfig.UndertoneMatch.WARM),
                new VtoConfig.VtoShade("02", "Baby Pink", "#F4978E", VtoConfig.FinishType.SATIN, 0.32, 0.20, 0.0, VtoConfig.UndertoneMatch.COOL)
        ));
    }

    private static VtoConfig buildFoundationVto() {
        return new VtoConfig(true, VtoConfig.MakeupCategory.FOUNDATION, List.of(
                new VtoConfig.VtoShade("21N", "21N Ivory", "#F3D6C6", VtoConfig.FinishType.SATIN, 0.30, 0.25, 0.0, VtoConfig.UndertoneMatch.COOL),
                new VtoConfig.VtoShade("23W", "23W Sand", "#E5B899", VtoConfig.FinishType.MATTE, 0.35, 0.05, 0.0, VtoConfig.UndertoneMatch.WARM)
        ));
    }

    private static VtoConfig buildEyeshadowVto() {
        return new VtoConfig(true, VtoConfig.MakeupCategory.EYESHADOW, List.of(
                new VtoConfig.VtoShade("01", "Bronze Gold", "#A66E4E", VtoConfig.FinishType.SHIMMER, 0.45, 0.30, 0.8, VtoConfig.UndertoneMatch.WARM),
                new VtoConfig.VtoShade("02", "Dusty Rose", "#C48B9F", VtoConfig.FinishType.MATTE, 0.45, 0.05, 0.0, VtoConfig.UndertoneMatch.COOL)
        ));
    }

    private List<ProductDocument> buildProducts() {
        List<ProductDocument> products = new ArrayList<>();
        UUID anuaShopId = UUID.fromString("00000000-0000-0000-0000-000000000010");
        UUID generalShopId = UUID.fromString("00000000-0000-0000-0000-000000000020");

        String[] brands = {
                "Anua", "Beauty of Joseon", "COSRX", "Skin1004", "La Roche-Posay",
                "Paula's Choice", "The Ordinary", "CeraVe", "Torriden", "Round Lab",
                "Innisfree", "Laneige", "Klairs", "Some By Mi", "Romand"
        };

        String[] categories = {"Toner", "Serum", "Cream", "Sunscreen", "Cleanser", "Lipstick", "Blush", "Foundation", "Eyeshadow"};

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

                    assignVtoConfigIfApplicable(p);

                    if ("Toner".equals(category)) p.setCategoryPath(List.of("SKINCARE", "TONER", "HYDRATING_TONER"));
                    else if ("Serum".equals(category)) p.setCategoryPath(List.of("SKINCARE", "SERUM", "REPAIR_SERUM"));
                    else if ("Cream".equals(category)) p.setCategoryPath(List.of("SKINCARE", "MOISTURIZER", "REPAIR_CREAM"));
                    else if ("Sunscreen".equals(category)) p.setCategoryPath(List.of("SKINCARE", "SUNSCREEN", "FACIAL_SUNSCREEN"));
                    else if ("Cleanser".equals(category)) p.setCategoryPath(List.of("SKINCARE", "CLEANSER", "GEL_CLEANSER"));
                    else if ("Lipstick".equals(category)) p.setCategoryPath(List.of("MAKEUP", "LIP", "LIPSTICK"));
                    else if ("Blush".equals(category)) p.setCategoryPath(List.of("MAKEUP", "FACE", "POWDER_BLUSH"));
                    else if ("Foundation".equals(category)) p.setCategoryPath(List.of("MAKEUP", "FACE", "FOUNDATION"));
                    else if ("Eyeshadow".equals(category)) p.setCategoryPath(List.of("MAKEUP", "EYE", "EYESHADOW_PALETTE"));

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
                    if (p.getVtoConfig() != null && p.getVtoConfig().shades() != null) {
                        for (VtoConfig.VtoShade s : p.getVtoConfig().shades()) {
                            BigDecimal vPrice = BigDecimal.valueOf(180000L + (index * 1000L));
                            varList.add(new ProductDocument.VariantSubDoc(
                                    "SKU-" + String.format("%03d", index) + "-" + s.skuCode(),
                                    s.shadeName(),
                                    vPrice,
                                    vPrice.add(BigDecimal.valueOf(40000L)),
                                    Map.of("color", s.hexColor(), "finish", s.finishType().name())
                            ));
                        }
                    } else {
                        String sku1 = "SKU-" + String.format("%03d", index) + "-50ML";
                        BigDecimal price1 = BigDecimal.valueOf(150000L + (index * 2000L));
                        varList.add(new ProductDocument.VariantSubDoc(sku1, "50ml", price1, price1.add(BigDecimal.valueOf(50000L)), Map.of("volume", "50ml")));

                        String sku2 = "SKU-" + String.format("%03d", index) + "-150ML";
                        BigDecimal price2 = price1.multiply(BigDecimal.valueOf(2.2)).setScale(0, java.math.RoundingMode.HALF_UP);
                        varList.add(new ProductDocument.VariantSubDoc(sku2, "150ml", price2, price2.add(BigDecimal.valueOf(80000L)), Map.of("volume", "150ml")));
                    }
                    p.setVariants(varList);

                    p.setImages(List.of("https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500"));

                    products.add(p);
                    index++;
                    if (products.size() >= 135) break;
                }
                if (products.size() >= 135) break;
            }
            if (products.size() >= 135) break;
        }

        return products;
    }
}
