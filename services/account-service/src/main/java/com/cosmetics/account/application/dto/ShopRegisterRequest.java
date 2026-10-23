package com.cosmetics.account.application.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.UUID;

public class ShopRegisterRequest {
    @NotBlank(message = "Shop name is required")
    private String shopName;

    private String description;

    @NotBlank(message = "Business registration number is required")
    private String businessRegistrationNo;

    public ShopRegisterRequest() {}

    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getBusinessRegistrationNo() { return businessRegistrationNo; }
    public void setBusinessRegistrationNo(String businessRegistrationNo) { this.businessRegistrationNo = businessRegistrationNo; }
}
