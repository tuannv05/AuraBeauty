package com.cosmetics.account.adapter.out.persistence;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table("skin_profiles")
public class SkinProfileEntity {
    @Id
    @Column("user_id")
    private UUID userId;

    @Column("skin_type")
    private String skinType;

    @Column("concerns")
    private String concerns; // comma-separated

    @Column("allergies")
    private String allergies; // comma-separated INCI names

    public SkinProfileEntity() {}

    public SkinProfileEntity(UUID userId, String skinType, String concerns, String allergies) {
        this.userId = userId;
        this.skinType = skinType;
        this.concerns = concerns;
        this.allergies = allergies;
    }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getSkinType() { return skinType; }
    public void setSkinType(String skinType) { this.skinType = skinType; }
    public String getConcerns() { return concerns; }
    public void setConcerns(String concerns) { this.concerns = concerns; }
    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }
}
