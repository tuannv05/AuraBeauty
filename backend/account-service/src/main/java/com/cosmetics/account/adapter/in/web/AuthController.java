package com.cosmetics.account.adapter.in.web;

import com.cosmetics.account.application.AuthService;
import com.cosmetics.account.application.dto.AuthResponse;
import com.cosmetics.account.application.dto.LoginRequest;
import com.cosmetics.account.application.dto.RefreshTokenRequest;
import com.cosmetics.account.application.dto.RegisterRequest;
import com.cosmetics.common.web.ApiResponse;
import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.converters.uni.UniReactorConverters;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @POST
    @Path("/register")
    public Uni<Response> register(@Valid RegisterRequest request) {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), authService.register(request))
                .map(res -> Response.status(Response.Status.CREATED).entity(ApiResponse.ok(res)).build());
    }

    @POST
    @Path("/login")
    public Uni<ApiResponse<AuthResponse>> login(@Valid LoginRequest request) {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), authService.login(request))
                .map(ApiResponse::ok);
    }

    @POST
    @Path("/refresh")
    public Uni<ApiResponse<AuthResponse>> refresh(@Valid RefreshTokenRequest request) {
        return Uni.createFrom().converter(UniReactorConverters.fromMono(), authService.refreshToken(request.getRefreshToken()))
                .map(ApiResponse::ok);
    }
}
