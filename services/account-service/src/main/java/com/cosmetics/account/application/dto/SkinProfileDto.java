package com.cosmetics.account.application.dto;

import java.util.List;
import java.util.UUID;

public class SkinProfileDto {
    private UUID userId;
    private String skinType; // OILY, DRY, COMBINATION, SENSITIVE, NORMAL
    private List<String> concerns;
    private List<String> allergies;

    public SkinProfileDto() {}
    public SkinProfileDto(UUID userId, String skinType, List<String> concerns, List<String> allergies) {
        this.userId = userId;
        this.skinType = skinType;
        this.concerns = concerns;
        this.allergies = allergies;
    }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getSkinType() { return skinType; }
    public void setSkinType(String skinType) { this.skinType = skinType; }
    public List<String> getConcerns() { return concerns; }
    public void setConcerns(List<String> concerns) { this.concerns = concerns; }
    public List<String> getAllergies() { return allergies; }
    public void setAllergies(List<String> allergies) { this.allergies = allergies; }
}
