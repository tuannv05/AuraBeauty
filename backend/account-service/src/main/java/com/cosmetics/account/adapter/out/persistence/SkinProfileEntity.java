package com.cosmetics.account.adapter.out.persistence;

import java.util.UUID;

public class SkinProfileEntity {
    private UUID userId;
    private String skinType;
    private String concerns; // comma-separated
    private String allergies; // comma-separated INCI names
    private String skinToneHex;
    private String skinUndertone;
    private Double itaAngle;

    public SkinProfileEntity() {}

    public SkinProfileEntity(UUID userId, String skinType, String concerns, String allergies) {
        this(userId, skinType, concerns, allergies, "#E8C6A8", "NEUTRAL", 32.0);
    }

    public SkinProfileEntity(UUID userId, String skinType, String concerns, String allergies,
                             String skinToneHex, String skinUndertone, Double itaAngle) {
        this.userId = userId;
        this.skinType = skinType;
        this.concerns = concerns;
        this.allergies = allergies;
        this.skinToneHex = skinToneHex != null ? skinToneHex : "#E8C6A8";
        this.skinUndertone = skinUndertone != null ? skinUndertone : "NEUTRAL";
        this.itaAngle = itaAngle != null ? itaAngle : 32.0;
    }

    public UUID getId() {
        return userId;
    }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getSkinType() { return skinType; }
    public void setSkinType(String skinType) { this.skinType = skinType; }
    public String getConcerns() { return concerns; }
    public void setConcerns(String concerns) { this.concerns = concerns; }
    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }
    public String getSkinToneHex() { return skinToneHex; }
    public void setSkinToneHex(String skinToneHex) { this.skinToneHex = skinToneHex; }
    public String getSkinUndertone() { return skinUndertone; }
    public void setSkinUndertone(String skinUndertone) { this.skinUndertone = skinUndertone; }
    public Double getItaAngle() { return itaAngle; }
    public void setItaAngle(Double itaAngle) { this.itaAngle = itaAngle; }
}
