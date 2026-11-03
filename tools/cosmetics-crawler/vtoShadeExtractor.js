// tools/cosmetics-crawler/vtoShadeExtractor.js

/**
 * Standard shade palettes for Virtual Try-On (AR) categorized by makeup type.
 */
const SHADE_PALETTES = {
  LIPSTICK: [
    {
      skuCodeSuffix: "01",
      shadeName: "Ruby Matte (Đỏ Ruby Cổ Điển)",
      hexColor: "#9B111E",
      finishType: "MATTE",
      opacity: 0.85,
      glossiness: 0.05,
      shimmerIntensity: 0.0,
      bestUndertone: "ALL"
    },
    {
      skuCodeSuffix: "02",
      shadeName: "Brick Velvet (Đỏ Gạch Nhung)",
      hexColor: "#B84A39",
      finishType: "VELVET",
      opacity: 0.82,
      glossiness: 0.15,
      shimmerIntensity: 0.0,
      bestUndertone: "WARM"
    },
    {
      skuCodeSuffix: "03",
      shadeName: "Peach Gloss (Cam Đào Căng Mọng)",
      hexColor: "#E06D77",
      finishType: "GLOSSY",
      opacity: 0.75,
      glossiness: 0.85,
      shimmerIntensity: 0.2,
      bestUndertone: "WARM"
    },
    {
      skuCodeSuffix: "04",
      shadeName: "Berry Plum (Hồng Mận MLBB)",
      hexColor: "#722F37",
      finishType: "SATIN",
      opacity: 0.82,
      glossiness: 0.40,
      shimmerIntensity: 0.0,
      bestUndertone: "COOL"
    },
    {
      skuCodeSuffix: "05",
      shadeName: "Coral Sunshine (Cam San Hô)",
      hexColor: "#E8614D",
      finishType: "MATTE",
      opacity: 0.80,
      glossiness: 0.10,
      shimmerIntensity: 0.0,
      bestUndertone: "WARM"
    },
    {
      skuCodeSuffix: "06",
      shadeName: "Rosiental (Hoa Hồng Khô Khí Chất)",
      hexColor: "#C84B56",
      finishType: "VELVET",
      opacity: 0.82,
      glossiness: 0.20,
      shimmerIntensity: 0.0,
      bestUndertone: "ALL"
    },
    {
      skuCodeSuffix: "07",
      shadeName: "Chili Pepper (Đỏ Đất Trầm Á Đông)",
      hexColor: "#A73A2B",
      finishType: "MATTE",
      opacity: 0.84,
      glossiness: 0.08,
      shimmerIntensity: 0.0,
      bestUndertone: "WARM"
    },
    {
      skuCodeSuffix: "08",
      shadeName: "Mauve Cashmere (Cánh Hồng Trà Sữa)",
      hexColor: "#B26E77",
      finishType: "SATIN",
      opacity: 0.78,
      glossiness: 0.35,
      shimmerIntensity: 0.0,
      bestUndertone: "COOL"
    }
  ],
  BLUSH: [
    {
      skuCodeSuffix: "01",
      shadeName: "Coral Sunset (Cam San Hô Hoàng Hôn)",
      hexColor: "#F28482",
      finishType: "MATTE",
      opacity: 0.38,
      glossiness: 0.0,
      shimmerIntensity: 0.0,
      bestUndertone: "WARM"
    },
    {
      skuCodeSuffix: "02",
      shadeName: "Baby Pink (Hồng Phấn Đào Ngây Thơ)",
      hexColor: "#F4978E",
      finishType: "SATIN",
      opacity: 0.35,
      glossiness: 0.15,
      shimmerIntensity: 0.1,
      bestUndertone: "COOL"
    },
    {
      skuCodeSuffix: "03",
      shadeName: "Warm Terracotta (Cam Đất Á Đông)",
      hexColor: "#CD6A51",
      finishType: "MATTE",
      opacity: 0.34,
      glossiness: 0.0,
      shimmerIntensity: 0.0,
      bestUndertone: "WARM"
    },
    {
      skuCodeSuffix: "04",
      shadeName: "Berry Veil (Hồng Tím Trong Trẻo)",
      hexColor: "#E28B9D",
      finishType: "SATIN",
      opacity: 0.32,
      glossiness: 0.10,
      shimmerIntensity: 0.0,
      bestUndertone: "COOL"
    }
  ],
  FOUNDATION: [
    {
      skuCodeSuffix: "19C",
      shadeName: "19C Porcelain (Sáng Trắng Hồng)",
      hexColor: "#F7E1D7",
      finishType: "SATIN",
      opacity: 0.28,
      glossiness: 0.15,
      shimmerIntensity: 0.0,
      bestUndertone: "COOL"
    },
    {
      skuCodeSuffix: "21N",
      shadeName: "21N Ivory (Sáng Tự Nhiên)",
      hexColor: "#F3D6C6",
      finishType: "SATIN",
      opacity: 0.28,
      glossiness: 0.10,
      shimmerIntensity: 0.0,
      bestUndertone: "NEUTRAL"
    },
    {
      skuCodeSuffix: "23W",
      shadeName: "23W Sand (Tự Nhiên Da Châu Á)",
      hexColor: "#E5B899",
      finishType: "MATTE",
      opacity: 0.32,
      glossiness: 0.0,
      shimmerIntensity: 0.0,
      bestUndertone: "WARM"
    },
    {
      skuCodeSuffix: "25N",
      shadeName: "25N Honey (Ấm Bánh Mật)",
      hexColor: "#D8A47F",
      finishType: "SATIN",
      opacity: 0.30,
      glossiness: 0.10,
      shimmerIntensity: 0.0,
      bestUndertone: "WARM"
    }
  ],
  EYESHADOW: [
    {
      skuCodeSuffix: "01",
      shadeName: "01 Bronze Gold (Đồng Ánh Kim)",
      hexColor: "#A66E4E",
      finishType: "SHIMMER",
      opacity: 0.50,
      glossiness: 0.30,
      shimmerIntensity: 0.85,
      bestUndertone: "WARM"
    },
    {
      skuCodeSuffix: "02",
      shadeName: "02 Dusty Rose (Hồng Khô Trầm)",
      hexColor: "#C48B9F",
      finishType: "MATTE",
      opacity: 0.50,
      glossiness: 0.0,
      shimmerIntensity: 0.0,
      bestUndertone: "COOL"
    },
    {
      skuCodeSuffix: "03",
      shadeName: "03 Champagne Glow (Champagne Lấp Lánh)",
      hexColor: "#D4AF37",
      finishType: "SHIMMER",
      opacity: 0.45,
      glossiness: 0.40,
      shimmerIntensity: 0.90,
      bestUndertone: "ALL"
    },
    {
      skuCodeSuffix: "04",
      shadeName: "04 Espresso Matte (Nâu Cà Phê)",
      hexColor: "#5C3A21",
      finishType: "MATTE",
      opacity: 0.52,
      glossiness: 0.0,
      shimmerIntensity: 0.0,
      bestUndertone: "WARM"
    }
  ]
};

/**
 * Extracts or generates VTO configuration for a product.
 * Returns null if the category is not makeup (e.g. Cleanser, Skincare).
 */
function extractVtoConfig(productCategory, productSkuPrefix = "SKU") {
  if (!productCategory) return null;

  const catUpper = productCategory.toUpperCase();
  let categoryEnum = null;

  if (catUpper.includes("LIPSTICK") || catUpper.includes("SON")) {
    categoryEnum = "LIPSTICK";
  } else if (catUpper.includes("BLUSH") || catUpper.includes("MÁ")) {
    categoryEnum = "BLUSH";
  } else if (catUpper.includes("FOUNDATION") || catUpper.includes("NỀN") || catUpper.includes("CUSHION")) {
    categoryEnum = "FOUNDATION";
  } else if (catUpper.includes("EYESHADOW") || catUpper.includes("MẮT")) {
    categoryEnum = "EYESHADOW";
  }

  if (!categoryEnum) return null;

  const palette = SHADE_PALETTES[categoryEnum];
  // Select 3 to 5 shades
  const count = categoryEnum === "LIPSTICK" ? 4 : 3;
  const shades = palette.slice(0, count).map(p => ({
    skuCode: `${productSkuPrefix}-${p.skuCodeSuffix}`,
    shadeName: p.shadeName,
    hexColor: p.hexColor,
    finishType: p.finishType,
    opacity: p.opacity,
    glossiness: p.glossiness,
    shimmerIntensity: p.shimmerIntensity,
    bestUndertone: p.bestUndertone
  }));

  return {
    supported: true,
    category: categoryEnum,
    shades
  };
}

module.exports = {
  SHADE_PALETTES,
  extractVtoConfig
};
