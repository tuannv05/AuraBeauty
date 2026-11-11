package com.cosmetics.catalog.adapter.out.persistence;

import io.quarkus.mongodb.panache.reactive.ReactivePanacheMongoRepositoryBase;
import io.smallrye.mutiny.converters.multi.MultiReactorConverters;
import io.smallrye.mutiny.converters.uni.UniReactorConverters;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@ApplicationScoped
public class ProductRepository {

    @ApplicationScoped
    public static class PanacheRepo implements ReactivePanacheMongoRepositoryBase<ProductDocument, String> {
    }

    private final PanacheRepo panacheRepo;

    @Inject
    public ProductRepository(PanacheRepo panacheRepo) {
        this.panacheRepo = panacheRepo;
    }

    public Flux<ProductDocument> findByStatus(String status) {
        return panacheRepo.find("status", status).stream()
                .convert().with(MultiReactorConverters.toFlux());
    }

    public Flux<ProductDocument> findByShopId(UUID shopId) {
        return panacheRepo.find("shopId", shopId).stream()
                .convert().with(MultiReactorConverters.toFlux());
    }

    public Flux<ProductDocument> findByCategoryAndStatus(String category, String status) {
        return panacheRepo.find("category = ?1 and status = ?2", category, status).stream()
                .convert().with(MultiReactorConverters.toFlux());
    }

    public Flux<ProductDocument> findByCategoryHierarchyAndStatus(String category, String status) {
        String query = "{ 'status': ?2, $or: [ { 'categoryPath': { $regex: ?1, $options: 'i' } }, { 'category': { $regex: ?1, $options: 'i' } }, { 'subCategory': { $regex: ?1, $options: 'i' } } ] }";
        return panacheRepo.find(query, category, status).stream()
                .convert().with(MultiReactorConverters.toFlux());
    }

    public Mono<ProductDocument> findByVariantSkuCode(String skuCode) {
        String query = "{ 'variants.skuCode': ?1 }";
        return panacheRepo.find(query, skuCode).firstResult()
                .convert().with(UniReactorConverters.toMono());
    }

    public Flux<ProductDocument> searchPublished(String query) {
        String mongoQuery = "{ 'status': 'PUBLISHED', $or: [ " +
           "{ 'name': { $regex: ?1, $options: 'i' } }, " +
           "{ 'brand': { $regex: ?1, $options: 'i' } }, " +
           "{ 'category': { $regex: ?1, $options: 'i' } }, " +
           "{ 'subCategory': { $regex: ?1, $options: 'i' } }, " +
           "{ 'categoryPath': { $regex: ?1, $options: 'i' } }, " +
           "{ 'description': { $regex: ?1, $options: 'i' } }, " +
           "{ 'keyActiveGroups': { $regex: ?1, $options: 'i' } }, " +
           "{ 'ingredients.inciName': { $regex: ?1, $options: 'i' } }, " +
           "{ 'inciIngredients.inciName': { $regex: ?1, $options: 'i' } }, " +
           "{ 'variants.name': { $regex: ?1, $options: 'i' } } " +
           "] }";
        return panacheRepo.find(mongoQuery, query).stream()
                .convert().with(MultiReactorConverters.toFlux());
    }

    public Mono<ProductDocument> save(ProductDocument doc) {
        if (doc.getId() == null) {
            doc.setId(UUID.randomUUID().toString());
            return panacheRepo.persist(doc)
                    .convert().with(UniReactorConverters.toMono());
        } else {
            return panacheRepo.persistOrUpdate(doc)
                    .convert().with(UniReactorConverters.toMono());
        }
    }

    public Flux<ProductDocument> saveAll(Iterable<ProductDocument> docs) {
        for (ProductDocument doc : docs) {
            if (doc.getId() == null) {
                doc.setId(UUID.randomUUID().toString());
            }
        }
        return panacheRepo.persist(docs)
                .convert().with(UniReactorConverters.toMono())
                .thenMany(Flux.fromIterable(docs));
    }

    public Mono<ProductDocument> findById(String id) {
        return panacheRepo.findById(id)
                .convert().with(UniReactorConverters.toMono());
    }

    public Mono<Long> count() {
        return panacheRepo.count()
                .convert().with(UniReactorConverters.toMono());
    }

    public Flux<ProductDocument> findAll() {
        return panacheRepo.findAll().stream()
                .convert().with(MultiReactorConverters.toFlux());
    }
}
