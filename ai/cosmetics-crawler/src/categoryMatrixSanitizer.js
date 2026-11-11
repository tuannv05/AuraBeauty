/**
 * ai/cosmetics-crawler/src/categoryMatrixSanitizer.js
 * Chuẩn hóa toàn diện ma trận phân cấp danh mục (categoryPath) và thanh lọc thuộc tính (Attribute Whitelisting).
 */

const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const PRODUCTS_FACETS_PATH = path.join(__dirname, '../output/products_facets_full.json');
const PRODUCTS_SEED_PATH = path.join(__dirname, '../../../backend/catalog-service/src/main/resources/products_seed.json');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const MONGO_DB = 'catalog_db';

/**
 * Suy luận categoryPath chuẩn [ROOT, SUB, LEAF] dựa trên tên, mô tả và category hiện tại
 */
function resolveCategoryPath(p) {
  const name = (p.name || '').toLowerCase();
  const cat = (p.category || '').toLowerCase();
  const desc = (p.description || '').toLowerCase();
  const sub = (p.subCategory || '').toLowerCase();
  const text = `${name} ${cat} ${sub} ${desc}`;

  // =========================================================================
  // 1. PHỤ KIỆN LÀM ĐẸP (BEAUTY_TOOLS) - Ưu tiên hàng đầu để không bị rơi vào skincare/makeup
  // =========================================================================
  if (
    cat.includes('phụ kiện') || cat.includes('beauty tool') || cat.includes('dụng cụ') ||
    sub.includes('kẹp bấm mi') || sub.includes('mút tán') || sub.includes('cọ trang điểm') ||
    sub.includes('dao cạo') || sub.includes('bông tẩy trang') || sub.includes('máy rửa mặt') ||
    sub.includes('máy đẩy tinh chất') || sub.includes('máy massage') ||
    name.includes('kẹp bấm mi') || name.includes('bấm mi') || name.includes('curler') ||
    name.includes('mút tán') || name.includes('bông mút') || name.includes('sponge') || name.includes('blender') ||
    name.includes('bộ cọ') || name.includes('cọ trang điểm') || name.includes('cọ nền') || name.includes('cọ phấn') || name.includes('brush') ||
    name.includes('dao cạo') || name.includes('tỉa mày') || name.includes('nhíp') || name.includes('eyebrow razor') ||
    name.includes('bông tẩy trang') || name.includes('silcot') || name.includes('cotton pad') ||
    name.includes('máy rửa mặt') || name.includes('foreo') || name.includes('t-sonic') ||
    name.includes('máy massage') || name.includes('nâng cơ') || name.includes('đẩy tinh chất') || name.includes('ems')
  ) {
    if (name.includes('bấm mi') || name.includes('curler')) {
      return ['BEAUTY_TOOLS', 'MAKEUP_ACCESSORIES', 'EYELASH_CURLER'];
    }
    if (name.includes('mút tán') || name.includes('bông mút') || name.includes('sponge') || name.includes('blender')) {
      return ['BEAUTY_TOOLS', 'MAKEUP_ACCESSORIES', 'MAKEUP_SPONGE'];
    }
    if (name.includes('cọ') || name.includes('brush')) {
      return ['BEAUTY_TOOLS', 'MAKEUP_ACCESSORIES', 'MAKEUP_BRUSH'];
    }
    if (name.includes('dao cạo') || name.includes('tỉa mày') || name.includes('nhíp') || name.includes('razor')) {
      return ['BEAUTY_TOOLS', 'MAKEUP_ACCESSORIES', 'EYEBROW_RAZOR'];
    }
    if (name.includes('bông tẩy trang') || name.includes('silcot') || name.includes('cotton pad')) {
      return ['BEAUTY_TOOLS', 'SKINCARE_TOOLS', 'COTTON_PAD'];
    }
    if (name.includes('máy rửa mặt') || name.includes('foreo') || name.includes('t-sonic')) {
      return ['BEAUTY_TOOLS', 'BEAUTY_DEVICES', 'FACIAL_CLEANSING_DEVICE'];
    }
    if (name.includes('máy massage') || name.includes('nâng cơ') || name.includes('đẩy tinh chất') || name.includes('ems')) {
      return ['BEAUTY_TOOLS', 'BEAUTY_DEVICES', 'MASSAGE_EMS_DEVICE'];
    }
    return ['BEAUTY_TOOLS', 'MAKEUP_ACCESSORIES', 'GENERAL_TOOL'];
  }

  // =========================================================================
  // 2. THỰC PHẨM CHỨC NĂNG (SUPPLEMENT)
  // =========================================================================
  if (
    cat.includes('thực phẩm chức năng') || cat.includes('supplement') || sub.includes('viên uống') ||
    name.includes('viên uống') || name.includes('nước uống collagen') || name.includes('collagen') ||
    name.includes('dhc') || name.includes('transino') || name.includes('blackmores') || name.includes('tinh dầu hoa anh thảo')
  ) {
    if (name.includes('collagen')) {
      return ['SUPPLEMENT', 'COLLAGEN', 'COLLAGEN_PEPTIDE'];
    }
    if (name.includes('trắng da') || name.includes('transino') || name.includes('glutathione')) {
      return ['SUPPLEMENT', 'SKIN_WHITENING', 'GLUTATHIONE_TRANSINO'];
    }
    if (name.includes('kẽm') || name.includes('zinc') || name.includes('trị mụn')) {
      return ['SUPPLEMENT', 'ACNE_DEFENSE', 'ZINC_GLUCONATE'];
    }
    if (name.includes('vitamin') || name.includes('rau củ')) {
      return ['SUPPLEMENT', 'MULTIVITAMIN', 'DAILY_VEGGIE'];
    }
    if (name.includes('cấp nước') || name.includes('hyaluronic')) {
      return ['SUPPLEMENT', 'HYDRATION', 'HYALURONIC_CERAMIDE'];
    }
    if (name.includes('chống nắng')) {
      return ['SUPPLEMENT', 'SUN_CARE', 'UV_PROTECTION_PILL'];
    }
    return ['SUPPLEMENT', 'DAILY_SUPPLEMENT', 'HEALTH'];
  }

  // =========================================================================
  // 3. NƯỚC HOA HỒNG (TONER) - Phải xử lý TRƯỚC NƯỚC HOA để tránh nhầm "nước hoa hồng" -> "nước hoa"
  // =========================================================================
  if (
    (name.includes('nước hoa hồng') || name.includes('toner') || name.includes('nước cân bằng') || cat === 'toner') &&
    !name.includes('nước hoa nữ') && !name.includes('eau de') && !name.includes('edp') && !name.includes('edt')
  ) {
    return ['SKINCARE', 'TONER', 'HYDRATING_TONER'];
  }

  // =========================================================================
  // 4. KEM NỀN (FOUNDATION) - Phải xử lý TRƯỚC LIP để tránh nhầm "tinted serum" -> "lip_tint"
  // =========================================================================
  if (
    name.includes('kem nền') || name.includes('foundation') || name.includes('tinted serum') ||
    name.includes('cushion') || name.includes('phấn nước') || cat === 'foundation'
  ) {
    if (name.includes('cushion') || name.includes('phấn nước')) {
      return ['MAKEUP', 'FACE', 'CUSHION'];
    }
    return ['MAKEUP', 'FACE', 'FOUNDATION'];
  }

  // =========================================================================
  // 5. CHĂM SÓC CƠ THỂ (BODY_CARE)
  // =========================================================================
  if (
    cat.includes('body') || cat.includes('cơ thể') ||
    name.includes('sữa tắm') || name.includes('dưỡng thể') || name.includes('body lotion') || name.includes('body wash') ||
    name.includes('muối tắm') || name.includes('khử mùi') || name.includes('lăn khử mùi') || name.includes('xit khử mùi') ||
    name.includes('kem triệt lông') || name.includes('tẩy lông') || name.includes('kem dưỡng da tay') || name.includes('gót chân') ||
    (name.includes('tẩy tế bào chết') && (name.includes('body') || name.includes('cơ thể') || name.includes('dove') || name.includes('cocoon body')))
  ) {
    if (name.includes('tẩy tế bào chết') || name.includes('scrub') || name.includes('polish')) {
      return ['BODY_CARE', 'BODY_SCRUB', 'BODY_EXFOLIANT'];
    }
    if (name.includes('sữa tắm') || name.includes('shower') || name.includes('wash')) {
      return ['BODY_CARE', 'BODY_WASH', 'SHOWER_GEL'];
    }
    if (name.includes('muối tắm')) {
      return ['BODY_CARE', 'BATH_SALT', 'EPSOM_SALT'];
    }
    if (name.includes('dưỡng thể') || name.includes('body lotion') || name.includes('body milk')) {
      return ['BODY_CARE', 'BODY_LOTION', 'MOISTURIZING_LOTION'];
    }
    if (name.includes('khử mùi') || name.includes('lăn')) {
      return ['BODY_CARE', 'DEODORANT', 'ROLL_ON'];
    }
    if (name.includes('tay') || name.includes('gót chân') || name.includes('hand cream')) {
      return ['BODY_CARE', 'HAND_FOOT_CARE', 'HAND_CREAM'];
    }
    if (name.includes('triệt lông') || name.includes('tẩy lông')) {
      return ['BODY_CARE', 'HAIR_REMOVAL', 'DEPILATORY_CREAM'];
    }
    return ['BODY_CARE', 'BODY_MOISTURIZER', 'BODY_LOTION'];
  }

  // =========================================================================
  // 6. CHĂM SÓC TÓC & DA ĐẦU (HAIR_CARE)
  // =========================================================================
  if (
    cat.includes('hair') || cat.includes('tóc') ||
    name.includes('dầu gội') || name.includes('dầu xả') || name.includes('ủ tóc') || name.includes('da đầu') ||
    name.includes('shampoo') || name.includes('conditioner') || name.includes('hair mask') || name.includes('scalp') ||
    name.includes('mọc tóc') || name.includes('nhuộm tóc') || name.includes('dưỡng tóc')
  ) {
    if (name.includes('dầu gội khô')) {
      return ['HAIR_CARE', 'DRY_SHAMPOO', 'VOLUMIZING_DRY_SHAMPOO'];
    }
    if (name.includes('dầu gội') || name.includes('shampoo')) {
      return ['HAIR_CARE', 'SHAMPOO', 'HAIR_CLEANSER'];
    }
    if (name.includes('dầu xả') || name.includes('conditioner')) {
      return ['HAIR_CARE', 'CONDITIONER', 'REPAIR_CONDITIONER'];
    }
    if (name.includes('ủ tóc') || name.includes('mặt nạ tóc') || name.includes('hair mask')) {
      return ['HAIR_CARE', 'HAIR_MASK', 'DEEP_TREATMENT'];
    }
    if (name.includes('mọc tóc') || name.includes('scalp')) {
      return ['HAIR_CARE', 'SCALP_TONIC', 'GROWTH_TONIC'];
    }
    if (name.includes('nhuộm tóc') || name.includes('foam color')) {
      return ['HAIR_CARE', 'HAIR_COLOR', 'BUBBLE_FOAM_COLOR'];
    }
    if (name.includes('dầu dưỡng tóc') || name.includes('hair oil') || name.includes('serum tóc')) {
      return ['HAIR_CARE', 'HAIR_OIL', 'ARGAN_HAIR_SERUM'];
    }
    return ['HAIR_CARE', 'HAIR_TREATMENT', 'GENERAL_HAIR'];
  }

  // =========================================================================
  // 7. NƯỚC HOA (PERFUME)
  // =========================================================================
  if (
    cat.includes('perfume') || cat.includes('nước hoa') || cat.includes('fragrance') ||
    name.includes('nước hoa') || name.includes('eau de parfum') || name.includes('eau de toilette') ||
    name.includes('body mist') || name.includes('vùng kín')
  ) {
    if (name.includes('vùng kín') || name.includes('foellie') || name.includes('dionel')) {
      return ['PERFUME', 'INTIMATE_PERFUME', 'SECRET_LOVE_OIL'];
    }
    if (name.includes('body mist') || name.includes('xịt thơm')) {
      return ['PERFUME', 'BODY_MIST', 'FRAGRANCE_MIST'];
    }
    if (name.includes('chiết') || name.includes('10ml')) {
      return ['PERFUME', 'DECANT_PERFUME', 'TRAVEL_SPRAY_10ML'];
    }
    if (name.includes('nam') || name.includes('pour homme') || name.includes('bleu de') || name.includes('sauvage')) {
      return ['PERFUME', 'MEN_PERFUME', 'EDP'];
    }
    if (name.includes('unisex') || name.includes('santal') || name.includes('another')) {
      return ['PERFUME', 'UNISEX_PERFUME', 'NICHE_EDP'];
    }
    return ['PERFUME', 'WOMEN_PERFUME', 'EDP'];
  }

  // =========================================================================
  // 8. TRANG ĐIỂM (MAKEUP)
  // =========================================================================
  if (
    cat.includes('makeup') || cat.includes('trang điểm') || cat === 'lipstick' || cat === 'blush' || cat === 'eyeshadow' ||
    name.includes('son ') || name.includes('son kem') || name.includes('son thỏi') || name.includes('son bóng') || name.includes('son dưỡng') || name.includes('tint') || name.includes('lip') ||
    name.includes('má hồng') || name.includes('blush') || name.includes('phấn mắt') || name.includes('eyeshadow') ||
    name.includes('kẻ mắt') || name.includes('eyeliner') || name.includes('mascara') || name.includes('chì kẻ mày') ||
    name.includes('phấn phủ') || name.includes('che khuyết điểm') || name.includes('concealer') || name.includes('highlight')
  ) {
    if (name.includes('son ') || name.includes('son thỏi') || name.includes('son kem') || name.includes('tint') || cat === 'lipstick') {
      if (name.includes('son bóng') || name.includes('gloss')) return ['MAKEUP', 'LIP', 'LIP_GLOSS'];
      if (name.includes('son dưỡng') || name.includes('lip balm')) return ['MAKEUP', 'LIP', 'LIP_BALM'];
      if (name.includes('tẩy tế bào chết môi') || name.includes('lip scrub')) return ['MAKEUP', 'LIP', 'LIP_SCRUB'];
      if (name.includes('son kem') || name.includes('tint')) return ['MAKEUP', 'LIP', 'LIP_TINT'];
      return ['MAKEUP', 'LIP', 'LIPSTICK'];
    }
    if (name.includes('má hồng') || cat === 'blush') {
      return ['MAKEUP', 'FACE', 'POWDER_BLUSH'];
    }
    if (name.includes('phấn mắt') || cat === 'eyeshadow') {
      return ['MAKEUP', 'EYE', 'EYESHADOW_PALETTE'];
    }
    if (name.includes('kẻ mắt') || name.includes('eyeliner')) {
      return ['MAKEUP', 'EYE', 'EYELINER'];
    }
    if (name.includes('mascara')) {
      return ['MAKEUP', 'EYE', 'MASCARA'];
    }
    if (name.includes('chì kẻ mày') || name.includes('định hình mày')) {
      return ['MAKEUP', 'EYE', 'EYEBROW_PENCIL'];
    }
    if (name.includes('che khuyết điểm') || name.includes('concealer')) {
      return ['MAKEUP', 'FACE', 'CONCEALER'];
    }
    if (name.includes('phấn phủ') || name.includes('powder')) {
      return ['MAKEUP', 'FACE', 'POWDER'];
    }
    if (name.includes('highlight') || name.includes('tạo khối')) {
      return ['MAKEUP', 'FACE', 'HIGHLIGHTER_CONTOUR'];
    }
    return ['MAKEUP', 'FACE', 'GENERAL_MAKEUP'];
  }

  // =========================================================================
  // 9. CHĂM SÓC DA MẶT (SKINCARE)
  // =========================================================================
  if (cat === 'cleanser' || name.includes('sữa rửa mặt') || name.includes('tẩy trang') || name.includes('micellar') || name.includes('cleansing')) {
    if (name.includes('tẩy trang') || name.includes('micellar') || name.includes('cleansing water') || name.includes('cleansing oil') || name.includes('sáp tẩy trang')) {
      return ['SKINCARE', 'CLEANSER', 'MICELLAR_WATER'];
    }
    if (name.includes('bọt') || name.includes('foam')) {
      return ['SKINCARE', 'CLEANSER', 'FOAM_CLEANSER'];
    }
    return ['SKINCARE', 'CLEANSER', 'GEL_CLEANSER'];
  }

  if (name.includes('tẩy tế bào chết') || name.includes('tẩy da chết') || name.includes('bha') || name.includes('aha') || name.includes('pha') || name.includes('peel') || name.includes('exfoliant')) {
    return ['SKINCARE', 'FACE_SCRUB', 'CHEMICAL_PEEL'];
  }

  if (cat === 'toner' || name.includes('toner') || name.includes('nước hoa hồng') || name.includes('nước cân bằng')) {
    return ['SKINCARE', 'TONER', 'HYDRATING_TONER'];
  }

  if (cat === 'serum' || name.includes('serum') || name.includes('tinh chất') || name.includes('ampoule')) {
    if (name.includes('mụn') || name.includes('acne') || name.includes('bha') || name.includes('tràm trà')) {
      return ['SKINCARE', 'SERUM', 'ACNE_SERUM'];
    }
    if (name.includes('sáng da') || name.includes('mờ thâm') || name.includes('vitamin c') || name.includes('niacinamide')) {
      return ['SKINCARE', 'SERUM', 'BRIGHTENING_SERUM'];
    }
    if (name.includes('b5') || name.includes('phục hồi') || name.includes('rau má') || name.includes('centella') || name.includes('panthenol')) {
      return ['SKINCARE', 'SERUM', 'RECOVERY_SERUM'];
    }
    return ['SKINCARE', 'SERUM', 'HYDRATING_SERUM'];
  }

  if (cat === 'cream' || name.includes('kem dưỡng') || name.includes('cream') || name.includes('gel dưỡng') || name.includes('moisturizer')) {
    if (name.includes('gel') || name.includes('water gel')) {
      return ['SKINCARE', 'MOISTURIZER', 'GEL_CREAM'];
    }
    return ['SKINCARE', 'MOISTURIZER', 'REPAIR_CREAM'];
  }

  if (cat === 'sunscreen' || name.includes('chống nắng') || name.includes('sunscreen') || name.includes('sun cream') || name.includes('sun fluid') || name.includes('anthelios')) {
    return ['SKINCARE', 'SUNSCREEN', 'FACIAL_SUNSCREEN'];
  }

  if (name.includes('mặt nạ') || name.includes('mask')) {
    if (name.includes('đất sét') || name.includes('clay')) {
      return ['SKINCARE', 'MASK', 'CLAY_MASK'];
    }
    return ['SKINCARE', 'MASK', 'SHEET_MASK'];
  }

  if (name.includes('xịt khoáng') || name.includes('mist')) {
    return ['SKINCARE', 'MIST', 'THERMAL_SPRING_WATER'];
  }

  if (name.includes('dầu dưỡng')) {
    return ['SKINCARE', 'FACIAL_OIL', 'SQUALANE_OIL'];
  }

  // Mặc định an toàn cho mỹ phẩm dưỡng da
  return ['SKINCARE', 'GENERAL_SKINCARE', 'DAILY_CARE'];
}

/**
 * Thanh lọc thuộc tính (Attribute Whitelisting) theo ma trận nghiệp vụ
 */
function sanitizeProductAttributes(p) {
  const catPath = resolveCategoryPath(p);
  p.categoryPath = catPath;

  const rootCategory = catPath[0];
  const subCategory = catPath[1];
  const leafCategory = catPath[2];

  // 1. NHÓM PHỤ KIỆN LÀM ĐẸP (BEAUTY_TOOLS)
  if (rootCategory === 'BEAUTY_TOOLS') {
    p.category = 'Phụ kiện làm đẹp';
    p.subCategory = leafCategory === 'EYELASH_CURLER' ? 'Kẹp bấm mi' :
                    leafCategory === 'MAKEUP_SPONGE' ? 'Mút tán nền' :
                    leafCategory === 'MAKEUP_BRUSH' ? 'Bộ cọ trang điểm' :
                    leafCategory === 'EYEBROW_RAZOR' ? 'Nhíp / Dao cạo mày' :
                    leafCategory === 'COTTON_PAD' ? 'Bông tẩy trang' :
                    leafCategory === 'FACIAL_CLEANSING_DEVICE' ? 'Máy rửa mặt sóng âm T-Sonic' :
                    leafCategory === 'MASSAGE_EMS_DEVICE' ? 'Máy đẩy tinh chất & Massage nâng cơ' : 'Phụ kiện làm đẹp';

    // Xóa bỏ hoàn toàn VTO
    p.vtoConfig = null;

    // Xóa sạch thuộc tính da liễu không liên quan
    p.suitableSkinTypes = [];
    p.targetSkinTypes = [];
    p.skinConcerns = [];
    p.keyActiveGroups = [];
  }

  // 2. NHÓM CHĂM SÓC DA MẶT (SKINCARE)
  else if (rootCategory === 'SKINCARE') {
    // Chuẩn hóa tên Category cha
    if (subCategory === 'CLEANSER') p.category = 'Cleanser';
    else if (subCategory === 'TONER') p.category = 'Toner';
    else if (subCategory === 'SERUM') p.category = 'Serum';
    else if (subCategory === 'MOISTURIZER') p.category = 'Cream';
    else if (subCategory === 'SUNSCREEN') p.category = 'Sunscreen';
    else if (!p.category || p.category === 'Nước hoa') p.category = 'Skincare';

    p.subCategory = subCategory;

    // Xóa bỏ hoàn toàn VTO
    p.vtoConfig = null;

    // Giữ các thuộc tính da mặt hợp lệ
    if (!Array.isArray(p.suitableSkinTypes) || p.suitableSkinTypes.length === 0) {
      p.suitableSkinTypes = ['NORMAL', 'COMBINATION', 'SENSITIVE'];
    }
    p.targetSkinTypes = p.suitableSkinTypes;
    if (!Array.isArray(p.skinConcerns)) p.skinConcerns = [];
    if (!Array.isArray(p.keyActiveGroups)) p.keyActiveGroups = [];
  }

  // 3. NHÓM TRANG ĐIỂM (MAKEUP)
  else if (rootCategory === 'MAKEUP') {
    if (subCategory === 'LIP') p.category = 'Lipstick';
    else if (subCategory === 'FACE' && (leafCategory === 'POWDER_BLUSH' || leafCategory === 'LIQUID_BLUSH')) p.category = 'Blush';
    else if (subCategory === 'FACE' && (leafCategory === 'FOUNDATION' || leafCategory === 'CUSHION')) p.category = 'Foundation';
    else if (subCategory === 'EYE' && leafCategory === 'EYESHADOW_PALETTE') p.category = 'Eyeshadow';
    else p.category = 'Trang điểm';

    p.subCategory = subCategory;

    // Xóa bỏ thuộc tính da mặt chuyên sâu
    p.suitableSkinTypes = [];
    p.targetSkinTypes = [];
    p.skinConcerns = [];
    p.keyActiveGroups = [];

    // Chỉ giữ VTO cho Lipstick, Blush, Foundation, Eyeshadow, Cushion
    const allowsVto = ['LIP', 'FACE', 'EYE'].includes(subCategory) &&
                      ['LIPSTICK', 'LIP_TINT', 'POWDER_BLUSH', 'LIQUID_BLUSH', 'FOUNDATION', 'CUSHION', 'EYESHADOW_PALETTE'].includes(leafCategory);

    if (!allowsVto || !p.vtoConfig || !p.vtoConfig.shades || p.vtoConfig.shades.length === 0) {
      if (allowsVto && p.variants && p.variants.length > 0) {
        const vtoCategory = subCategory === 'LIP' ? 'LIPSTICK' : subCategory === 'EYE' ? 'EYESHADOW' : (leafCategory.includes('BLUSH') ? 'BLUSH' : 'FOUNDATION');
        p.vtoConfig = {
          supported: true,
          category: vtoCategory,
          shades: p.variants.map((v, i) => ({
            skuCode: v.skuCode || `SKU-VTO-${i}`,
            shadeName: v.name || `Màu ${i + 1}`,
            hexColor: v.attributes?.Hex || v.attributes?.color || '#C72C48',
            finishType: 'MATTE',
            opacity: 0.85,
            glossiness: 0.1,
            shimmerIntensity: 0.0,
            bestUndertone: 'ALL'
          }))
        };
      } else {
        p.vtoConfig = null;
      }
    }
  }

  // 4. NHÓM BODY, HAIR, PERFUME, SUPPLEMENT
  else {
    if (rootCategory === 'BODY_CARE') p.category = 'Chăm sóc cơ thể';
    else if (rootCategory === 'HAIR_CARE') p.category = 'Chăm sóc tóc & Da đầu';
    else if (rootCategory === 'PERFUME') p.category = 'Nước hoa';
    else if (rootCategory === 'SUPPLEMENT') p.category = 'Thực phẩm chức năng';

    p.subCategory = subCategory;
    p.vtoConfig = null;
    p.suitableSkinTypes = [];
    p.targetSkinTypes = [];
    p.skinConcerns = [];
    p.keyActiveGroups = [];
  }

  if (!p.status) p.status = 'PUBLISHED';
  return p;
}

/**
 * Thực thi vệ sinh toàn bộ các file dataset và cơ sở dữ liệu MongoDB
 */
async function sanitizeAll() {
  console.log('\n======================================================================');
  console.log('🚀 BẮT ĐẦU CHUẨN HÓA CATEGORY MATRIX & ATTRIBUTE WHITELISTING');
  console.log('======================================================================\n');

  // 1. Chuẩn hóa products_facets_full.json
  let facetsCount = 0;
  if (fs.existsSync(PRODUCTS_FACETS_PATH)) {
    const raw = JSON.parse(fs.readFileSync(PRODUCTS_FACETS_PATH, 'utf-8'));
    const sanitized = raw.map(sanitizeProductAttributes);
    fs.writeFileSync(PRODUCTS_FACETS_PATH, JSON.stringify(sanitized, null, 2), 'utf-8');
    facetsCount = sanitized.length;
    console.log(`✅ [1/3] Đã chuẩn hóa in-place: ${PRODUCTS_FACETS_PATH} (${facetsCount} sản phẩm)`);
  }

  // 2. Chuẩn hóa products_seed.json
  let seedCount = 0;
  let seedProducts = [];
  if (fs.existsSync(PRODUCTS_SEED_PATH)) {
    const raw = JSON.parse(fs.readFileSync(PRODUCTS_SEED_PATH, 'utf-8'));
    seedProducts = raw.map(sanitizeProductAttributes);
    fs.writeFileSync(PRODUCTS_SEED_PATH, JSON.stringify(seedProducts, null, 2), 'utf-8');
    seedCount = seedProducts.length;
    console.log(`✅ [2/3] Đã chuẩn hóa in-place: ${PRODUCTS_SEED_PATH} (${seedCount} sản phẩm)`);
  }

  // 3. Đồng bộ hóa trực tiếp vào MongoDB catalog_db (collection products)
  console.log(`\n🔄 [3/3] Đang đồng bộ hóa dữ liệu chuẩn vào MongoDB [${MONGO_DB}.products]...`);
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(MONGO_DB);
    const col = db.collection('products');

    // Cập nhật tất cả các documents hiện có trong MongoDB
    const allMongoDocs = await col.find({}).toArray();
    console.log(`   - Tìm thấy ${allMongoDocs.length} bản ghi trong MongoDB 'products'`);

    let updatedCount = 0;
    for (const doc of allMongoDocs) {
      const sanitized = sanitizeProductAttributes(doc);
      await col.replaceOne(
        { _id: doc._id },
        { ...sanitized, _id: doc._id },
        { upsert: false }
      );
      updatedCount++;
    }

    // Đảm bảo tạo MongoDB Index cho categoryPath để query cực nhanh
    try {
      await col.createIndex({ categoryPath: 1 });
      await col.createIndex({ category: 1 });
    } catch (e) {
      // index already exists, safe to ignore
    }
    console.log(`✅ Đã cập nhật thành công ${updatedCount} bản ghi vào MongoDB!`);

    await client.close();
  } catch (err) {
    console.warn(`⚠️ Cảnh báo khi cập nhật MongoDB qua driver: ${err.message}.`);
  }

  console.log('\n======================================================================');
  console.log('🎉 HOÀN THÀNH CHUẨN HÓA TOÀN BỘ DATASET VÀ CƠ SỞ DỮ LIỆU');
  console.log('======================================================================\n');
}

if (require.main === module) {
  sanitizeAll();
}

module.exports = { resolveCategoryPath, sanitizeProductAttributes, sanitizeAll };
