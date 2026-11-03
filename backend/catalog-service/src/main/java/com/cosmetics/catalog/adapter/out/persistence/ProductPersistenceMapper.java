package com.cosmetics.catalog.adapter.out.persistence;

import com.cosmetics.catalog.domain.Ingredient;
import com.cosmetics.catalog.domain.Product;
import com.cosmetics.catalog.domain.ProductStatus;
import com.cosmetics.catalog.domain.Variant;

import java.util.ArrayList;
import java.util.List;

public final class ProductPersistenceMapper {

    private ProductPersistenceMapper() {}

    public static Product toDomain(ProductDocument doc) {
        if (doc == null) return null;

        Product product = new Product();
        product.setId(doc.getId());
        product.setShopId(doc.getShopId());
        product.setName(doc.getName());
        product.setBrand(doc.getBrand());
        product.setDescription(doc.getDescription());
        product.setCategory(doc.getCategory());
        product.setRegistrationNo(doc.getRegistrationNo());
        product.setSuitableSkinTypes(doc.getSuitableSkinTypes() != null ? new ArrayList<>(doc.getSuitableSkinTypes()) : new ArrayList<>());
        product.setSkinConcerns(doc.getSkinConcerns() != null ? new ArrayList<>(doc.getSkinConcerns()) : new ArrayList<>());
        product.setKeyActiveGroups(doc.getKeyActiveGroups() != null ? new ArrayList<>(doc.getKeyActiveGroups()) : new ArrayList<>());
        product.setSafetyEthicsBadges(doc.getSafetyEthicsBadges() != null ? new ArrayList<>(doc.getSafetyEthicsBadges()) : new ArrayList<>());
        product.setFormulationTexture(doc.getFormulationTexture());
        product.setOriginCountry(doc.getOriginCountry());
        product.setPriceRangeBucket(doc.getPriceRangeBucket());
        product.setVolumeSpec(doc.getVolumeSpec());
        product.setImages(doc.getImages() != null ? new ArrayList<>(doc.getImages()) : new ArrayList<>());
        product.setVtoConfig(doc.getVtoConfig());

        if (doc.getStatus() != null) {
            try {
                product.setStatus(ProductStatus.valueOf(doc.getStatus()));
            } catch (IllegalArgumentException e) {
                product.setStatus(ProductStatus.DRAFT);
            }
        }

        if (doc.getIngredients() != null) {
            List<Ingredient> ingredients = doc.getIngredients().stream()
                    .map(i -> new Ingredient(i.getInciName(), i.getPurpose(), i.isPotentialIrritant()))
                    .toList();
            product.setIngredients(new ArrayList<>(ingredients));
        }

        if (doc.getVariants() != null) {
            List<Variant> variants = doc.getVariants().stream()
                    .map(v -> {
                        Variant variant = new Variant(v.getSkuCode(), v.getName(), v.getPrice(), v.getOriginalPrice());
                        if (v.getAttributes() != null) {
                            variant.setAttributes(v.getAttributes());
                        }
                        return variant;
                    })
                    .toList();
            product.setVariants(new ArrayList<>(variants));
        }

        product.setCreatedAt(doc.getCreatedAt());
        product.setUpdatedAt(doc.getUpdatedAt());
        return product;
    }

    public static ProductDocument toDocument(Product domain) {
        if (domain == null) return null;

        ProductDocument doc = new ProductDocument();
        doc.setId(domain.getId());
        doc.setShopId(domain.getShopId());
        doc.setName(domain.getName());
        doc.setBrand(domain.getBrand());
        doc.setDescription(domain.getDescription());
        doc.setCategory(domain.getCategory());
        doc.setRegistrationNo(domain.getRegistrationNo());
        doc.setSuitableSkinTypes(domain.getSuitableSkinTypes() != null ? new ArrayList<>(domain.getSuitableSkinTypes()) : new ArrayList<>());
        doc.setSkinConcerns(domain.getSkinConcerns() != null ? new ArrayList<>(domain.getSkinConcerns()) : new ArrayList<>());
        doc.setKeyActiveGroups(domain.getKeyActiveGroups() != null ? new ArrayList<>(domain.getKeyActiveGroups()) : new ArrayList<>());
        doc.setSafetyEthicsBadges(domain.getSafetyEthicsBadges() != null ? new ArrayList<>(domain.getSafetyEthicsBadges()) : new ArrayList<>());
        doc.setFormulationTexture(domain.getFormulationTexture());
        doc.setOriginCountry(domain.getOriginCountry());
        doc.setPriceRangeBucket(domain.getPriceRangeBucket());
        doc.setVolumeSpec(domain.getVolumeSpec());
        doc.setImages(domain.getImages() != null ? new ArrayList<>(domain.getImages()) : new ArrayList<>());
        doc.setVtoConfig(domain.getVtoConfig());
        doc.setStatus(domain.getStatus() != null ? domain.getStatus().name() : ProductStatus.DRAFT.name());

        if (domain.getIngredients() != null) {
            List<ProductDocument.IngredientSubDoc> subDocs = domain.getIngredients().stream()
                    .map(i -> new ProductDocument.IngredientSubDoc(i.getInciName(), i.getPurpose(), i.isPotentialIrritant()))
                    .toList();
            doc.setIngredients(new ArrayList<>(subDocs));
        }

        if (domain.getVariants() != null) {
            List<ProductDocument.VariantSubDoc> subDocs = domain.getVariants().stream()
                    .map(v -> new ProductDocument.VariantSubDoc(v.getSkuCode(), v.getName(), v.getPrice(), v.getOriginalPrice(), v.getAttributes()))
                    .toList();
            doc.setVariants(new ArrayList<>(subDocs));
        }

        doc.setCreatedAt(domain.getCreatedAt());
        doc.setUpdatedAt(domain.getUpdatedAt());
        return doc;
    }
}
