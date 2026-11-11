package com.cosmetics.account.adapter.in.web;

import com.cosmetics.account.adapter.out.jwt.JwtTokenProvider;
import com.cosmetics.account.application.UserService;
import com.cosmetics.account.application.dto.AddressDto;
import com.cosmetics.account.application.dto.ChangePasswordRequest;
import com.cosmetics.account.application.dto.SkinProfileDto;
import com.cosmetics.account.application.dto.UpdateProfileRequest;
import com.cosmetics.account.application.dto.UserProfileDto;
import com.cosmetics.common.web.ApiResponse;
import com.cosmetics.common.web.BusinessException;
import com.cosmetics.common.web.SecurityHeaderUtils;
import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.converters.uni.UniReactorConverters;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.UUID;

@Path("/api/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserController {
    private final UserService userService;
    private final JwtTokenProvider tokenProvider;

    public UserController(UserService userService, JwtTokenProvider tokenProvider) {
        this.userService = userService;
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
        throw new BusinessException(401, "AUTH_REQUIRED", "Yêu cầu đăng nhập tài khoản");
    }

    @GET
    @Path("/me")
    public Uni<ApiResponse<UserProfileDto>> getMyProfile(
            @HeaderParam("X-User-Id") String userIdHeader,
            @HeaderParam("Authorization") String authHeader
    ) {
        UUID userId = resolveUserId(userIdHeader, authHeader);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), userService.getProfile(userId))
                .map(ApiResponse::ok);
    }

    @PUT
    @Path("/profile")
    public Uni<ApiResponse<UserProfileDto>> updateProfile(
            @Valid UpdateProfileRequest request,
            @HeaderParam("X-User-Id") String userIdHeader,
            @HeaderParam("Authorization") String authHeader
    ) {
        UUID userId = resolveUserId(userIdHeader, authHeader);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), userService.updateProfile(userId, request))
                .map(ApiResponse::ok);
    }

    @PUT
    @Path("/change-password")
    public Uni<ApiResponse<String>> changePassword(
            @Valid ChangePasswordRequest request,
            @HeaderParam("X-User-Id") String userIdHeader,
            @HeaderParam("Authorization") String authHeader
    ) {
        UUID userId = resolveUserId(userIdHeader, authHeader);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), userService.changePassword(userId, request))
                .map(v -> ApiResponse.ok("Đổi mật khẩu thành công"));
    }

    @GET
    @Path("/skin-profile")
    public Uni<ApiResponse<SkinProfileDto>> getSkinProfile(
            @HeaderParam("X-User-Id") String userIdHeader,
            @HeaderParam("Authorization") String authHeader
    ) {
        UUID userId = resolveUserId(userIdHeader, authHeader);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), userService.getSkinProfile(userId))
                .map(ApiResponse::ok);
    }

    @PUT
    @Path("/skin-profile")
    public Uni<ApiResponse<SkinProfileDto>> updateSkinProfile(
            SkinProfileDto dto,
            @HeaderParam("X-User-Id") String userIdHeader,
            @HeaderParam("Authorization") String authHeader
    ) {
        UUID userId = resolveUserId(userIdHeader, authHeader);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), userService.updateSkinProfile(userId, dto))
                .map(ApiResponse::ok);
    }

    // Address Book Endpoints
    @GET
    @Path("/addresses")
    public Uni<ApiResponse<List<AddressDto>>> getAddresses(
            @HeaderParam("X-User-Id") String userIdHeader,
            @HeaderParam("Authorization") String authHeader
    ) {
        UUID userId = resolveUserId(userIdHeader, authHeader);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), userService.getAddresses(userId).collectList())
                .map(ApiResponse::ok);
    }

    @POST
    @Path("/addresses")
    public Uni<Response> addAddress(
            AddressDto dto,
            @HeaderParam("X-User-Id") String userIdHeader,
            @HeaderParam("Authorization") String authHeader
    ) {
        UUID userId = resolveUserId(userIdHeader, authHeader);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), userService.addAddress(userId, dto))
                .map(addr -> Response.status(Response.Status.CREATED).entity(ApiResponse.ok(addr)).build());
    }

    @DELETE
    @Path("/addresses/{id}")
    public Uni<ApiResponse<String>> deleteAddress(
            @PathParam("id") UUID id,
            @HeaderParam("X-User-Id") String userIdHeader,
            @HeaderParam("Authorization") String authHeader
    ) {
        UUID userId = resolveUserId(userIdHeader, authHeader);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), userService.deleteAddress(userId, id))
                .map(v -> ApiResponse.ok("Đã xóa địa chỉ thành công"));
    }

    @PUT
    @Path("/addresses/{id}/default")
    public Uni<ApiResponse<AddressDto>> setDefaultAddress(
            @PathParam("id") UUID id,
            @HeaderParam("X-User-Id") String userIdHeader,
            @HeaderParam("Authorization") String authHeader
    ) {
        UUID userId = resolveUserId(userIdHeader, authHeader);
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), userService.setDefaultAddress(userId, id))
                .map(ApiResponse::ok);
    }
}
