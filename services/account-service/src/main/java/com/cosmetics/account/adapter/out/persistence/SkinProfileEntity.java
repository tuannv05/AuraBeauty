package com.cosmetics.account.adapter.out.persistence;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table("skin_profiles")
public class SkinProfileEntity implements Persistable<UUID> {
    @Id
    @Column("user_id")
    private UUID userId;

    @Column("skin_type")
    private String skinType;

    @Column("concerns")
    private String concerns; // comma-separated

    @Column("allergies")
    private String allergies; // comma-separated INCI names

    @Column("skin_tone_hex")
    private String skinToneHex;

    @Column("skin_undertone")
    private String skinUndertone;

    @Column("ita_angle")
    private Double itaAngle;

    @Transient
    private boolean isNewEntry = false;

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

    @Override
    public UUID getId() {
        return userId;
    }

    @Override
    public boolean isNew() {
        return isNewEntry;
    }

    public void setNewEntry(boolean newEntry) {
        this.isNewEntry = newEntry;
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
