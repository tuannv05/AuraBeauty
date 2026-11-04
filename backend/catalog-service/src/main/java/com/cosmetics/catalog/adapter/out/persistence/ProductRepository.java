package com.cosmetics.catalog.adapter.out.persistence;

import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface ProductRepository extends ReactiveMongoRepository<ProductDocument, String> {
    Flux<ProductDocument> findByStatus(String status);
    Flux<ProductDocument> findByShopId(UUID shopId);
    Flux<ProductDocument> findByCategoryAndStatus(String category, String status);

    @Query("{ 'status': ?1, $or: [ { 'categoryPath': { $regex: ?0, $options: 'i' } }, { 'category': { $regex: ?0, $options: 'i' } }, { 'subCategory': { $regex: ?0, $options: 'i' } } ] }")
    Flux<ProductDocument> findByCategoryHierarchyAndStatus(String category, String status);

    @Query("{ 'variants.skuCode': ?0 }")
    Mono<ProductDocument> findByVariantSkuCode(String skuCode);

    @Query("{ 'status': 'PUBLISHED', $or: [ " +
           "{ 'name': { $regex: ?0, $options: 'i' } }, " +
           "{ 'brand': { $regex: ?0, $options: 'i' } }, " +
           "{ 'category': { $regex: ?0, $options: 'i' } }, " +
           "{ 'subCategory': { $regex: ?0, $options: 'i' } }, " +
           "{ 'categoryPath': { $regex: ?0, $options: 'i' } }, " +
           "{ 'description': { $regex: ?0, $options: 'i' } }, " +
           "{ 'keyActiveGroups': { $regex: ?0, $options: 'i' } }, " +
           "{ 'ingredients.inciName': { $regex: ?0, $options: 'i' } }, " +
           "{ 'inciIngredients.inciName': { $regex: ?0, $options: 'i' } }, " +
           "{ 'variants.name': { $regex: ?0, $options: 'i' } } " +
           "] }")
    Flux<ProductDocument> searchPublished(String query);
}
