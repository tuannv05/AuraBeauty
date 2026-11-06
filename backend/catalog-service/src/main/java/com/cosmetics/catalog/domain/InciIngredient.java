package com.cosmetics.catalog.domain;

/**
 * Rich INCI (International Nomenclature Cosmetic Ingredient) Domain Model.
 * Pure Java 21 Record.
 */
public record InciIngredient(
    String inciName,
    String vietnameseName,
    String cosmeticPurpose,
    int comedogenicRating, // 0 to 5 (0: Không bít tắc, 5: Bít tắc rất mạnh)
    int irritationRating,   // 0 to 5 (0: Lành tính, 5: Kích ứng cao)
    boolean isPregnancySafe,
    boolean isAlcoholFree,
    boolean isBanned
) {
    public InciIngredient {
        if (inciName == null || inciName.isBlank()) {
            throw new IllegalArgumentException("INCI name cannot be blank");
        }
        if (comedogenicRating < 0 || comedogenicRating > 5) {
            throw new IllegalArgumentException("Comedogenic rating must be between 0 and 5");
        }
        if (irritationRating < 0 || irritationRating > 5) {
            throw new IllegalArgumentException("Irritation rating must be between 0 and 5");
        }
    }

    public static InciIngredient ofSafe(String inciName, String viName, String purpose) {
        return new InciIngredient(inciName, viName, purpose, 0, 0, true, true, false);
    }
}
