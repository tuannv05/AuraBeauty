package com.cosmetics.ai.domain;

import java.util.ArrayList;
import java.util.List;

/**
 * 28-Day Clinical Skin Cycling Routine Engine.
 * Generates structured 4-night cycles over a full 28-day skin renewal period.
 */
public final class SkinCyclingRoutineEngine {

    public record DailyRoutine(
        int dayNumber,
        int cycleNumber,
        String phaseName,
        String nightTheme,
        String morningFocus,
        String eveningFocus,
        List<String> recommendedActiveSteps
    ) {}

    public record RoutineSchedule(
        String targetSkinType,
        int totalDays,
        int completedCycles,
        List<DailyRoutine> dailyRoutines
    ) {}

    private SkinCyclingRoutineEngine() {}

    public static RoutineSchedule generate28DaySchedule(String skinType) {
        String safeSkinType = (skinType != null && !skinType.isBlank()) ? skinType.toUpperCase() : "NORMAL";
        List<DailyRoutine> routines = new ArrayList<>();

        for (int day = 1; day <= 28; day++) {
            int cycle = ((day - 1) / 4) + 1;
            int nightInCycle = ((day - 1) % 4) + 1;

            DailyRoutine daily = switch (nightInCycle) {
                case 1 -> new DailyRoutine(
                    day,
                    cycle,
                    "PHASE 1: TẨY TẾ BÀO CHẾT (EXFOLIATION)",
                    "Làm sạch sâu & Thông thoáng lỗ chân lông (AHA/BHA)",
                    "Sữa rửa mặt dịu nhẹ + Serum HA + Kem chống nắng SPF 50+ PA++++ (Bắt buộc)",
                    "Làm sạch kép + Toner cân bằng + Serum tẩy tế bào chết hóa học + Kem khóa ẩm B5",
                    List.of("Salicylic Acid 2% (BHA) hoặc Glycolic Acid 5% (AHA)", "Panthenol B5 Soothing Cream")
                );
                case 2 -> new DailyRoutine(
                    day,
                    cycle,
                    "PHASE 2: TÁI TẠO BIỂU BÌ (RETINOID)",
                    "Kích thích sinh Collagen & Tăng sinh tế bào mới",
                    "Rửa mặt nước mát + Vitamin C / Niacinamide + Dưỡng ẩm nhẹ + Chống nắng",
                    "Rửa mặt nhẹ nhàng + Đệm ẩm HA + Serum Retinol 0.1-0.3% (Sandwich technique) + Kem Ceramide phục hồi",
                    List.of("Retinol bọc vi nang hoặc Granactive Retinoid", "Multi-Ceramide Barrier Balm")
                );
                case 3 -> new DailyRoutine(
                    day,
                    cycle,
                    "PHASE 3: PHỤC HỒI CHUYÊN SÂU 1 (RECOVERY)",
                    "Tái thiết lập màng Lipid & Cân bằng hệ vi sinh da",
                    "Làm sạch dịu nhẹ + Dưỡng ẩm Hyaluronic Acid + Chống nắng phổ rộng",
                    "Toner làm dịu (Rau má Centella) + Serum B5/Peptide + Kem dưỡng phục hồi sâu",
                    List.of("Centella Asiatica Extract", "Madecassoside", "Panthenol 5%")
                );
                default -> new DailyRoutine(
                    day,
                    cycle,
                    "PHASE 4: CỦNG CỐ HÀNG RÀO BẢO VỆ 2 (BARRIER NOURISHMENT)",
                    "Cấp nước tầng sâu & Khóa ẩm toàn diện",
                    "Làm sạch nhẹ nhàng + Serum HA + Kem dưỡng ẩm dịu da + Chống nắng",
                    "Toner dưỡng ẩm + Serum Niacinamide 2-5% + Kem dưỡng khóa ẩm chuyên sâu",
                    List.of("Hyaluronic Acid đa phân tử", "Niacinamide 2%", "Squalane Oil")
                );
            };

            routines.add(daily);
        }

        return new RoutineSchedule(safeSkinType, 28, 7, List.copyOf(routines));
    }
}
