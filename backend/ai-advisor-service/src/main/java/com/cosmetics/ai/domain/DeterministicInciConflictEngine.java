package com.cosmetics.ai.domain;

import java.util.*;

/**
 * Deterministic INCI Conflict & Safety Engine.
 * Provides hard-coded clinical dermatological rules to protect buyers from hazardous active combinations.
 */
public final class DeterministicInciConflictEngine {

    public enum ActiveGroup {
        RETINOID,
        DIRECT_ACID,
        PURE_VITAMIN_C,
        BENZOYL_PEROXIDE,
        COPPER_PEPTIDE,
        SOOTHING_BARRIER
    }

    public record InciConflict(
        String active1,
        String active2,
        String severity, // HIGH, MEDIUM, LOW
        String reasonVi,
        String suggestionVi
    ) {}

    private DeterministicInciConflictEngine() {}

    public static Set<ActiveGroup> classifyActives(List<String> ingredients) {
        if (ingredients == null || ingredients.isEmpty()) return EnumSet.noneOf(ActiveGroup.class);
        Set<ActiveGroup> groups = EnumSet.noneOf(ActiveGroup.class);

        for (String raw : ingredients) {
            if (raw == null) continue;
            String upper = raw.toUpperCase(Locale.ROOT);
            if (upper.contains("RETINOL") || upper.contains("RETINAL") || upper.contains("TRETINOIN") || upper.contains("ADAPALENE")) {
                groups.add(ActiveGroup.RETINOID);
            }
            if (upper.contains("AHA") || upper.contains("BHA") || upper.contains("GLYCOLIC") || upper.contains("SALICYLIC") || upper.contains("LACTIC")) {
                groups.add(ActiveGroup.DIRECT_ACID);
            }
            if (upper.contains("ASCORBIC ACID") || upper.contains("L-ASCORBIC")) {
                groups.add(ActiveGroup.PURE_VITAMIN_C);
            }
            if (upper.contains("BENZOYL PEROXIDE")) {
                groups.add(ActiveGroup.BENZOYL_PEROXIDE);
            }
            if (upper.contains("COPPER TRIPEPTIDE") || upper.contains("COPPER PEPTIDE")) {
                groups.add(ActiveGroup.COPPER_PEPTIDE);
            }
            if (upper.contains("PANTHENOL") || upper.contains("CERAMIDE") || upper.contains("CENTELLA") || upper.contains("HYALURONIC")) {
                groups.add(ActiveGroup.SOOTHING_BARRIER);
            }
        }
        return groups;
    }

    public static List<InciConflict> checkConflicts(List<String> ingredients, String skinType) {
        Set<ActiveGroup> groups = classifyActives(ingredients);
        List<InciConflict> conflicts = new ArrayList<>();

        boolean isSensitive = "SENSITIVE".equalsIgnoreCase(skinType);

        if (groups.contains(ActiveGroup.RETINOID) && groups.contains(ActiveGroup.DIRECT_ACID)) {
            conflicts.add(new InciConflict(
                "Retinoid",
                "AHA/BHA (Direct Acid)",
                isSensitive ? "HIGH" : "MEDIUM",
                "Dễ làm quá tải hàng rào bảo vệ da, gây đỏ rát, bong tróc biểu bì nghiêm trọng.",
                "Nên giãn cách chu kỳ: Dùng AHA/BHA vào Đêm 1, Retinoid vào Đêm 2 (Skin Cycling 4 đêm)."
            ));
        }

        if (groups.contains(ActiveGroup.RETINOID) && groups.contains(ActiveGroup.BENZOYL_PEROXIDE)) {
            conflicts.add(new InciConflict(
                "Retinoid",
                "Benzoyl Peroxide",
                "HIGH",
                "Benzoyl Peroxide có tính oxy hóa mạnh, có thể làm bất hoạt phân tử Retinol và tăng gấp đôi độ kích ứng.",
                "Sử dụng Benzoyl Peroxide vào buổi sáng (hoặc chấm mụn điểm) và dùng Retinoid vào buổi tối."
            ));
        }

        if (groups.contains(ActiveGroup.PURE_VITAMIN_C) && groups.contains(ActiveGroup.DIRECT_ACID)) {
            conflicts.add(new InciConflict(
                "Vitamin C (L-AA)",
                "AHA/BHA (Direct Acid)",
                isSensitive ? "HIGH" : "LOW",
                "Độ pH quá thấp (pH < 3.5) có thể gây châm chích và đỏ da, đặc biệt với làn da nhạy cảm.",
                "Dùng Vitamin C buổi sáng để chống oxy hóa, dùng AHA/BHA vào chu kỳ dưỡng ban đêm."
            ));
        }

        if (groups.contains(ActiveGroup.COPPER_PEPTIDE) && (groups.contains(ActiveGroup.DIRECT_ACID) || groups.contains(ActiveGroup.PURE_VITAMIN_C))) {
            conflicts.add(new InciConflict(
                "Copper Peptide",
                "Acid / Vitamin C nguyên chất",
                "MEDIUM",
                "Acid mạnh làm phá vỡ liên kết peptide đồng, làm mất hoạt tính sinh học tái tạo tế bào.",
                "Tách riêng peptide đồng sang routine phục hồi độc lập."
            ));
        }

        return Collections.unmodifiableList(conflicts);
    }
}
