package com.cosmetics.catalog.domain;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

/**
 * Rich Domain Specification for Cosmetic Safety & Regulatory Standards (CBMP - Bộ Y Tế).
 * Pure Java 21 - Zero Spring / DB dependencies.
 */
public final class CosmeticSafetySpecification {

    // Chuẩn định dạng Số Công Bố Mỹ Phẩm Việt Nam: VD 19820/24/CBMP-QLD hoặc 001234/23/CBMP-HCM
    private static final Pattern CBMP_PATTERN = Pattern.compile("^\\d{4,6}/\\d{2}/CBMP-[A-Z]{2,4}$");

    // Danh mục các hoạt chất cấm tuyệt đối theo Phụ lục Hiệp định Mỹ phẩm ASEAN (CBMP Blacklist)
    private static final List<String> BANNED_SUBSTANCES = List.of(
        "CORTICOID",
        "DEXAMETHASONE",
        "CLOBETASOL",
        "HYDROQUINONE",
        "MERCURY",
        "THỦY NGÂN",
        "ISOBUTYLPARABEN",
        "PHENYLPARABEN",
        "BENZYLPARABEN",
        "PENTYLPARABEN"
    );

    private CosmeticSafetySpecification() {}

    /**
     * Kiểm tra tính hợp lệ của số công bố mỹ phẩm (CBMP) do Cục Quản Lý Dược cấp.
     */
    public static boolean isValidCbmp(String registrationNo) {
        if (registrationNo == null || registrationNo.isBlank()) {
            return false;
        }
        return CBMP_PATTERN.matcher(registrationNo.trim().toUpperCase(Locale.ROOT)).matches();
    }

    /**
     * Rà soát danh sách thành phần INCI để phát hiện các chất cấm theo tiêu chuẩn CBMP.
     */
    public static List<String> detectBannedSubstances(List<String> ingredientNames) {
        if (ingredientNames == null || ingredientNames.isEmpty()) {
            return Collections.emptyList();
        }
        List<String> detected = new ArrayList<>();
        for (String rawName : ingredientNames) {
            if (rawName == null) continue;
            String upper = rawName.trim().toUpperCase(Locale.ROOT);
            for (String banned : BANNED_SUBSTANCES) {
                if (upper.contains(banned)) {
                    detected.add(banned);
                }
            }
        }
        return Collections.unmodifiableList(detected);
    }

    /**
     * Kiểm tra xung đột hoạt chất nồng độ cao trên nền da nhạy cảm.
     */
    public static boolean hasSevereActiveConflict(List<String> actives, String skinType) {
        if (actives == null || actives.size() < 2) return false;
        boolean hasRetinoid = false;
        boolean hasStrongAcid = false;

        for (String act : actives) {
            if (act == null) continue;
            String norm = act.toUpperCase(Locale.ROOT);
            if (norm.contains("RETINOL") || norm.contains("TRETINOIN") || norm.contains("ADAPALENE")) {
                hasRetinoid = true;
            }
            if (norm.contains("AHA") || norm.contains("BHA") || norm.contains("GLYCOLIC") || norm.contains("SALICYLIC")) {
                hasStrongAcid = true;
            }
        }

        // Nếu da SENSITIVE và dùng đồng thời Retinoids + AHA/BHA nồng độ cao -> Xung đột nghiêm trọng
        return hasRetinoid && hasStrongAcid && "SENSITIVE".equalsIgnoreCase(skinType);
    }
}
