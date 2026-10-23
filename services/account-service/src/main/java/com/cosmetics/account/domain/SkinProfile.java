package com.cosmetics.account.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class SkinProfile {
    private UUID userId;
    private String skinType; // OILY, DRY, COMBINATION, SENSITIVE, NORMAL
    private List<String> concerns = new ArrayList<>();
    private List<String> allergies = new ArrayList<>();

    public SkinProfile() {}

    public SkinProfile(UUID userId, String skinType, List<String> concerns, List<String> allergies) {
        this.userId = userId;
        this.skinType = skinType;
        if (concerns != null) this.concerns = concerns;
        if (allergies != null) this.allergies = allergies;
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
