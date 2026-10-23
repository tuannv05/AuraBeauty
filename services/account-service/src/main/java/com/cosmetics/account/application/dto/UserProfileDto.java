package com.cosmetics.account.application.dto;

import java.util.List;
import java.util.UUID;

public class UserProfileDto {
    private UUID id;
    private String email;
    private String fullName;
    private String phone;
    private List<String> roles;
    private String status;

    public UserProfileDto() {}

    public UserProfileDto(UUID id, String email, String fullName, String phone, List<String> roles, String status) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.phone = phone;
        this.roles = roles;
        this.status = status;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
