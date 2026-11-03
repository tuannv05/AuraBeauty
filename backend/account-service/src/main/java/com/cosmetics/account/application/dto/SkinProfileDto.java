package com.cosmetics.account.application.dto;

import java.util.List;
import java.util.UUID;

public class SkinProfileDto {
    private UUID userId;
    private String skinType; // OILY, DRY, COMBINATION, SENSITIVE, NORMAL
    private List<String> concerns;
    private List<String> allergies;
    private String skinToneHex;
    private String skinUndertone;
    private Double itaAngle;

    public SkinProfileDto() {}

    public SkinProfileDto(UUID userId, String skinType, List<String> concerns, List<String> allergies) {
        this(userId, skinType, concerns, allergies, "#E8C6A8", "NEUTRAL", 32.0);
    }

    public SkinProfileDto(UUID userId, String skinType, List<String> concerns, List<String> allergies,
                          String skinToneHex, String skinUndertone, Double itaAngle) {
        this.userId = userId;
        this.skinType = skinType;
        this.concerns = concerns;
        this.allergies = allergies;
        this.skinToneHex = skinToneHex;
        this.skinUndertone = skinUndertone;
        this.itaAngle = itaAngle;
    }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getSkinType() { return skinType; }
    public void setSkinType(String skinType) { this.skinType = skinType; }
    public List<String> getConcerns() { return concerns; }
    public void setConcerns(List<String> concerns) { this.concerns = concerns; }
    public List<String> getAllergies() { return allergies; }
    public void setAllergies(List<String> allergies) { this.allergies = allergies; }
    public String getSkinToneHex() { return skinToneHex; }
    public void setSkinToneHex(String skinToneHex) { this.skinToneHex = skinToneHex; }
    public String getSkinUndertone() { return skinUndertone; }
    public void setSkinUndertone(String skinUndertone) { this.skinUndertone = skinUndertone; }
    public Double getItaAngle() { return itaAngle; }
    public void setItaAngle(Double itaAngle) { this.itaAngle = itaAngle; }
}
