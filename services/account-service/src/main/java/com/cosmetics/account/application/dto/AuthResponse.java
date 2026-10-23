package com.cosmetics.account.application.dto;

import java.util.List;
import java.util.UUID;

public class AuthResponse {
    private UUID userId;
    private String email;
    private String fullName;
    private List<String> roles;
    private String accessToken;
    private String refreshToken;

    public AuthResponse() {}

    public AuthResponse(UUID userId, String email, String fullName, List<String> roles, String accessToken, String refreshToken) {
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.roles = roles;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }
    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
}
