package com.cosmetics.catalog.adapter.in.web;

import com.cosmetics.catalog.adapter.out.persistence.ProductDocument;
import com.cosmetics.catalog.application.ProductService;
import com.cosmetics.common.web.ApiResponse;
import com.cosmetics.common.web.SecurityHeaderUtils;
import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.converters.uni.UniReactorConverters;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.UUID;

@Path("/api/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @POST
    public Uni<Response> createDraft(
            ProductDocument product,
            @HeaderParam("X-User-Id") String userIdHeader
    ) {
        UUID userId = SecurityHeaderUtils.parseUserId(userIdHeader);
        if (product.getShopId() == null && userId != null) {
            product.setShopId(userId);
        }
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), productService.createDraft(product))
                .map(doc -> Response.status(Response.Status.CREATED).entity(ApiResponse.ok(doc)).build());
    }

    @PUT
    @Path("/{id}/submit")
    public Uni<ApiResponse<ProductDocument>> submitForReview(
            @PathParam("id") String id,
            @HeaderParam("X-User-Id") String userIdHeader
    ) {
        UUID userId = SecurityHeaderUtils.parseUserId(userIdHeader);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), productService.submitForReview(id, userId))
                .map(ApiResponse::ok);
    }

    @PUT
    @Path("/admin/{id}/approve")
    public Uni<ApiResponse<ProductDocument>> approveProduct(@PathParam("id") String id) {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), productService.approveProduct(id))
                .map(ApiResponse::ok);
    }

    @PUT
    @Path("/admin/{id}/reject")
    public Uni<ApiResponse<ProductDocument>> rejectProduct(
            @PathParam("id") String id,
            @QueryParam("reason") @DefaultValue("Violates policy") String reason
    ) {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), productService.rejectProduct(id, reason))
                .map(ApiResponse::ok);
    }

    @GET
    public Uni<ApiResponse<List<ProductDocument>>> search(
            @QueryParam("q") String q,
            @QueryParam("keyword") String keyword,
            @QueryParam("search") String search,
            @QueryParam("category") String category,
            @QueryParam("skinType") String skinType,
            @QueryParam("concern") String concern,
            @QueryParam("activeGroup") String activeGroup,
            @QueryParam("badge") String badge,
            @QueryParam("texture") String texture,
            @QueryParam("origin") String origin,
            @QueryParam("priceBucket") String priceBucket
    ) {
        String effectiveQuery = (q != null && !q.isBlank()) ? q : ((keyword != null && !keyword.isBlank()) ? keyword : search);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(),
                productService.search(effectiveQuery, category, skinType, concern, activeGroup, badge, texture, origin, priceBucket).collectList())
                .map(ApiResponse::ok);
    }

    @GET
    @Path("/{id}")
    public Uni<ApiResponse<ProductDocument>> getById(@PathParam("id") String id) {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), productService.getById(id))
                .map(ApiResponse::ok);
    }

    @GET
    @Path("/shop/{shopId}")
    public Uni<ApiResponse<List<ProductDocument>>> getByShopId(@PathParam("shopId") UUID shopId) {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), productService.getByShopId(shopId).collectList())
                .map(ApiResponse::ok);
    }

    @GET
    @Path("/sku/{skuCode}")
    public Uni<ApiResponse<ProductDocument.VariantSubDoc>> getBySku(@PathParam("skuCode") String skuCode) {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), productService.getVariantBySku(skuCode))
                .map(ApiResponse::ok);
    }
}
