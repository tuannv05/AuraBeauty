package com.cosmetics.catalog.domain.model;

import java.util.List;

public record VtoConfig(
    Boolean supported,
    MakeupCategory category,
    List<VtoShade> shades
) {
    public VtoConfig {
        if (supported == null) {
            supported = false;
        }
    }

    public enum MakeupCategory {
        LIPSTICK, BLUSH, FOUNDATION, EYESHADOW
    }

    public enum FinishType {
        MATTE, VELVET, SATIN, GLOSSY, SHIMMER, DEWY, GLOW, SEMI_MATTE
    }

    public enum UndertoneMatch {
        WARM, COOL, NEUTRAL, ALL
    }

    public record VtoShade(
        String skuCode,
        String shadeName,
        String hexColor,
        FinishType finishType,
        Double opacity,
        Double glossiness,
        Double shimmerIntensity,
        UndertoneMatch bestUndertone
    ) {
        public VtoShade {
            if (hexColor == null || !hexColor.matches("^#([A-Fa-f0-9]{6})$")) {
                hexColor = "#C72C48";
            }
            if (opacity == null || opacity <= 0.0 || opacity > 1.0) {
                opacity = 0.78;
            }
            if (glossiness == null) {
                glossiness = 0.0;
            }
            if (shimmerIntensity == null) {
                shimmerIntensity = 0.0;
            }
        }

        // Convenience constructor without shimmerIntensity (defaults to 0.0)
        public VtoShade(String skuCode, String shadeName, String hexColor, FinishType finishType, Double opacity, Double glossiness, UndertoneMatch bestUndertone) {
            this(skuCode, shadeName, hexColor, finishType, opacity, glossiness, 0.0, bestUndertone);
        }
    }
}
