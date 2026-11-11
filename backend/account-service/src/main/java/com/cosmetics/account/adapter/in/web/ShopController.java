package com.cosmetics.account.adapter.in.web;

import com.cosmetics.account.adapter.out.jwt.JwtTokenProvider;
import com.cosmetics.account.application.ShopService;
import com.cosmetics.account.application.dto.ShopRegisterRequest;
import com.cosmetics.account.application.dto.ShopResponseDto;
import com.cosmetics.common.web.ApiResponse;
import com.cosmetics.common.web.BusinessException;
import com.cosmetics.common.web.SecurityHeaderUtils;
import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.converters.uni.UniReactorConverters;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ShopController {
    private final ShopService shopService;
    private final JwtTokenProvider tokenProvider;

    public ShopController(ShopService shopService, JwtTokenProvider tokenProvider) {
        this.shopService = shopService;
        this.tokenProvider = tokenProvider;
    }

    private UUID resolveUserId(String userIdHeader, String authHeader) {
        UUID userId = SecurityHeaderUtils.parseUserId(userIdHeader);
        if (userId != null) return userId;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (tokenProvider.validateToken(token)) {
                return tokenProvider.getUserId(token);
            }
        }
        throw new BusinessException(401, "AUTH_REQUIRED", "Authentication required");
    }

    private void verifyAdminRole(String userRolesHeader, String authHeader) {
        if (userRolesHeader != null && Arrays.asList(userRolesHeader.split(",")).contains("ROLE_ADMIN")) {
            return;
        }
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (tokenProvider.validateToken(token) && tokenProvider.getRoles(token).contains("ROLE_ADMIN")) {
                return;
            }
        }
        throw new BusinessException(403, "FORBIDDEN", "Admin privileges required");
    }

    @POST
    @Path("/shops/register")
    public Uni<Response> registerShop(
            @Valid ShopRegisterRequest request,
            @HeaderParam("X-User-Id") String userIdHeader,
            @HeaderParam("Authorization") String authHeader
    ) {
        UUID userId = resolveUserId(userIdHeader, authHeader);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), shopService.registerShop(userId, request))
                .map(shop -> Response.status(Response.Status.CREATED).entity(ApiResponse.ok(shop)).build());
    }

    @GET
    @Path("/shops/my")
    public Uni<ApiResponse<List<ShopResponseDto>>> getMyShops(
            @HeaderParam("X-User-Id") String userIdHeader,
            @HeaderParam("Authorization") String authHeader
    ) {
        UUID userId = resolveUserId(userIdHeader, authHeader);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), shopService.getMyShops(userId).collectList())
                .map(ApiResponse::ok);
    }

    @GET
    @Path("/shops/{id}")
    public Uni<ApiResponse<ShopResponseDto>> getShopById(@PathParam("id") UUID id) {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), shopService.getShopById(id))
                .map(ApiResponse::ok);
    }

    @GET
    @Path("/admin/shops/pending")
    public Uni<ApiResponse<List<ShopResponseDto>>> getPendingShops(
            @HeaderParam("X-User-Roles") String userRolesHeader,
            @HeaderParam("Authorization") String authHeader
    ) {
        verifyAdminRole(userRolesHeader, authHeader);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), shopService.getPendingShops().collectList())
                .map(ApiResponse::ok);
    }

    @PUT
    @Path("/admin/shops/{id}/approve")
    public Uni<ApiResponse<ShopResponseDto>> approveShop(
            @PathParam("id") UUID id,
            @HeaderParam("X-User-Roles") String userRolesHeader,
            @HeaderParam("Authorization") String authHeader
    ) {
        verifyAdminRole(userRolesHeader, authHeader);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), shopService.approveShop(id))
                .map(ApiResponse::ok);
    }

    @PUT
    @Path("/admin/shops/{id}/reject")
    public Uni<ApiResponse<ShopResponseDto>> rejectShop(
            @PathParam("id") UUID id,
            @HeaderParam("X-User-Roles") String userRolesHeader,
            @HeaderParam("Authorization") String authHeader
    ) {
        verifyAdminRole(userRolesHeader, authHeader);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), shopService.rejectShop(id))
                .map(ApiResponse::ok);
    }
}
