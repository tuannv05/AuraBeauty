package com.cosmetics.catalog.domain;

public class Ingredient {
    private String inciName;
    private String purpose; // e.g. "Soothing", "Antioxidant", "Hydrating"
    private boolean potentialIrritant;

    public Ingredient() {}

    public Ingredient(String inciName, String purpose, boolean potentialIrritant) {
        this.inciName = inciName;
        this.purpose = purpose;
        this.potentialIrritant = potentialIrritant;
    }

    public String getInciName() { return inciName; }
    public void setInciName(String inciName) { this.inciName = inciName; }
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    public boolean isPotentialIrritant() { return potentialIrritant; }
    public void setPotentialIrritant(boolean potentialIrritant) { this.potentialIrritant = potentialIrritant; }
}
