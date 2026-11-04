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
  const text = `${name} ${cat} ${desc}`;

  // 1. CHĂM SÓC CƠ THỂ (BODY CARE)
  if (cat.includes('body') || cat.includes('cơ thể') || name.includes('sữa tắm') || name.includes('dưỡng thể') || name.includes('body lotion') || name.includes('body wash') || (name.includes('tẩy tế bào chết') && (name.includes('body') || name.includes('cơ thể') || name.includes('dove') || name.includes('cocoon body')))) {
    if (name.includes('tẩy tế bào chết') || name.includes('scrub') || name.includes('polish')) {
      return ['BODY_CARE', 'BODY_SCRUB', 'BODY_EXFOLIANT'];
    }
    if (name.includes('sữa tắm') || name.includes('shower') || name.includes('wash')) {
      return ['BODY_CARE', 'BODY_WASH', 'SHOWER_GEL'];
    }
    if (name.includes('dưỡng thể') || name.includes('lotion') || name.includes('body milk')) {
      return ['BODY_CARE', 'BODY_MOISTURIZER', 'BODY_LOTION'];
    }
    return ['BODY_CARE', 'BODY_TREATMENT', 'GENERAL_BODY'];
  }

  // 2. CHĂM SÓC TÓC & DA ĐẦU (HAIR CARE)
  if (cat.includes('hair') || cat.includes('tóc') || name.includes('dầu gội') || name.includes('dầu xả') || name.includes('ủ tóc') || name.includes('da đầu') || name.includes('shampoo') || name.includes('conditioner') || name.includes('hair mask') || name.includes('scalp')) {
    if (name.includes('dầu gội') || name.includes('shampoo')) {
      return ['HAIR_CARE', 'SHAMPOO', 'HAIR_CLEANSER'];
    }
    if (name.includes('dầu xả') || name.includes('ủ tóc') || name.includes('conditioner') || name.includes('hair mask')) {
      return ['HAIR_CARE', 'CONDITIONER', 'HAIR_TREATMENT'];
    }
    if (name.includes('da đầu') || name.includes('scalp')) {
      return ['HAIR_CARE', 'SCALP_CARE', 'SCALP_TREATMENT'];
    }
    if (name.includes('dầu dưỡng tóc') || name.includes('hair oil') || name.includes('serum tóc')) {
      return ['HAIR_CARE', 'HAIR_STYLING', 'HAIR_OIL'];
    }
    return ['HAIR_CARE', 'HAIR_TREATMENT', 'GENERAL_HAIR'];
  }

  // 3. NƯỚC HOA (PERFUME / FRAGRANCE)
  if (cat.includes('perfume') || cat.includes('nước hoa') || cat.includes('fragrance') || name.includes('nước hoa') || name.includes('eau de parfum') || name.includes('eau de toilette') || name.includes('body mist')) {
    if (name.includes('body mist') || name.includes('xịt thơm')) {
      return ['PERFUME', 'BODY_MIST', 'FRAGRANCE_MIST'];
    }
    if (name.includes('nam') || name.includes('pour homme')) {
      return ['PERFUME', 'MEN_PERFUME', 'EDP'];
    }
    return ['PERFUME', 'WOMEN_PERFUME', 'EDP'];
  }

  // 4. TRANG ĐIỂM (MAKEUP)
  // 4.1. Môi (Lip)
  if (cat === 'lipstick' || name.includes('son ') || name.includes('son kem') || name.includes('son thỏi') || name.includes('son bóng') || name.includes('son dưỡng') || name.includes('tint') || name.includes('lip')) {
    if (name.includes('son bóng') || name.includes('juicy') || name.includes('glowy tint') || name.includes('gloss')) {
      return ['MAKEUP', 'LIP', 'LIP_GLOSS'];
    }
    if (name.includes('son kem lì') || name.includes('velvet tint') || name.includes('matte ink') || name.includes('liquid lip')) {
      return ['MAKEUP', 'LIP', 'LIP_TINT'];
    }
    if (name.includes('son thỏi') || name.includes('matte lipstick')) {
      return ['MAKEUP', 'LIP', 'LIPSTICK'];
    }
    if (name.includes('son dưỡng') || name.includes('lip balm') || name.includes('lip glow')) {
      return ['MAKEUP', 'LIP', 'LIP_BALM'];
    }
    return ['MAKEUP', 'LIP', 'LIP_TINT'];
  }

  // 4.2. Mặt (Face Makeup)
  if (cat === 'blush' || name.includes('má hồng') || name.includes('blush')) {
    if (name.includes('lỏng') || name.includes('liquid') || name.includes('kem')) {
      return ['MAKEUP', 'FACE', 'LIQUID_BLUSH'];
    }
    return ['MAKEUP', 'FACE', 'POWDER_BLUSH'];
  }

  if (cat === 'foundation' || name.includes('kem nền') || name.includes('phấn nước') || name.includes('cushion') || name.includes('foundation') || name.includes('che khuyết điểm') || name.includes('phấn phủ')) {
    if (name.includes('phấn nước') || name.includes('cushion')) {
      return ['MAKEUP', 'FACE', 'CUSHION'];
    }
    if (name.includes('che khuyết điểm') || name.includes('concealer')) {
      return ['MAKEUP', 'FACE', 'CONCEALER'];
    }
    if (name.includes('phấn phủ') || name.includes('powder')) {
      return ['MAKEUP', 'FACE', 'SETTING_POWDER'];
    }
    return ['MAKEUP', 'FACE', 'LIQUID_FOUNDATION'];
  }

  // 4.3. Mắt (Eye Makeup)
  if (cat === 'eyeshadow' || name.includes('phấn mắt') || name.includes('nhũ mắt') || name.includes('eyeshadow') || name.includes('mascara') || name.includes('chuốt mi') || name.includes('kẻ mắt') || name.includes('eyeliner')) {
    if (name.includes('mascara') || name.includes('chuốt mi')) {
      return ['MAKEUP', 'EYE', 'MASCARA'];
    }
    if (name.includes('kẻ mắt') || name.includes('eyeliner')) {
      return ['MAKEUP', 'EYE', 'EYELINER'];
    }
    if (name.includes('nhũ mắt') || name.includes('liquid eye')) {
      return ['MAKEUP', 'EYE', 'LIQUID_EYESHADOW'];
    }
    return ['MAKEUP', 'EYE', 'EYESHADOW_PALETTE'];
  }

  // 5. CHĂM SÓC DA MẶT (SKINCARE)
  // 5.1. Làm sạch (Cleanser / Makeup Remover)
  if (cat === 'cleanser' || name.includes('sữa rửa mặt') || name.includes('tẩy trang') || name.includes('cleanser') || name.includes('micellar') || name.includes('cleansing')) {
    if (name.includes('tẩy trang') || name.includes('micellar') || name.includes('cleansing water') || name.includes('cleansing oil') || name.includes('sáp tẩy trang')) {
      return ['SKINCARE', 'CLEANSER', 'MICELLAR_WATER'];
    }
    if (name.includes('bọt') || name.includes('foam')) {
      return ['SKINCARE', 'CLEANSER', 'FOAM_CLEANSER'];
    }
    return ['SKINCARE', 'CLEANSER', 'GEL_CLEANSER'];
  }

  // 5.2. Tẩy tế bào chết mặt (Exfoliator / Scrub)
  if (name.includes('tẩy tế bào chết') || name.includes('tẩy da chết') || name.includes('bha') || name.includes('aha') || name.includes('pha') || name.includes('peel') || name.includes('exfoliant')) {
    return ['SKINCARE', 'FACE_SCRUB', 'CHEMICAL_PEEL'];
  }

  // 5.3. Nước hoa hồng / Cân bằng (Toner)
  if (cat === 'toner' || name.includes('toner') || name.includes('nước hoa hồng') || name.includes('nước cân bằng')) {
    return ['SKINCARE', 'TONER', 'HYDRATING_TONER'];
  }

  // 5.4. Serum / Tinh chất (Serum)
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

  // 5.5. Kem dưỡng ẩm (Moisturizer / Cream)
  if (cat === 'cream' || name.includes('kem dưỡng') || name.includes('cream') || name.includes('gel dưỡng') || name.includes('moisturizer')) {
    if (name.includes('gel') || name.includes('water gel')) {
      return ['SKINCARE', 'MOISTURIZER', 'GEL_CREAM'];
    }
    return ['SKINCARE', 'MOISTURIZER', 'REPAIR_CREAM'];
  }

  // 5.6. Chống nắng mặt (Sunscreen)
  if (cat === 'sunscreen' || name.includes('chống nắng') || name.includes('sunscreen') || name.includes('sun cream') || name.includes('sun fluid') || name.includes('anthelios')) {
    return ['SKINCARE', 'SUNSCREEN', 'FACIAL_SUNSCREEN'];
  }

  // 5.7. Mặt nạ (Mask)
  if (name.includes('mặt nạ') || name.includes('mask')) {
    if (name.includes('đất sét') || name.includes('clay')) {
      return ['SKINCARE', 'MASK', 'CLAY_MASK'];
    }
    return ['SKINCARE', 'MASK', 'SHEET_MASK'];
  }

  // Mặc định an toàn cho mỹ phẩm dưỡng da
  return ['SKINCARE', 'TREATMENT', 'GENERAL_SKINCARE'];
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

  // Ghi nhận category/subCategory thân thiện
  p.subCategory = subCategory;

  // WHITING-LISTING MATRIX:
  if (rootCategory === 'SKINCARE') {
    // Skincare: Xóa bỏ VTO
    p.vtoConfig = null;

    // Giữ các thuộc tính da mặt hợp lệ
    if (!Array.isArray(p.suitableSkinTypes) || p.suitableSkinTypes.length === 0) {
      p.suitableSkinTypes = ['NORMAL', 'COMBINATION', 'SENSITIVE'];
    }
    p.targetSkinTypes = p.suitableSkinTypes;
    if (!Array.isArray(p.skinConcerns)) p.skinConcerns = [];
    if (!Array.isArray(p.keyActiveGroups)) p.keyActiveGroups = [];
  } else if (rootCategory === 'MAKEUP') {
    // Makeup: Xóa bỏ thuộc tính da mặt
    delete p.suitableSkinTypes;
    delete p.targetSkinTypes;
    delete p.skinConcerns;
    delete p.concerns;
    p.keyActiveGroups = [];

    // Chỉ giữ VTO cho Lipstick, Blush, Foundation, Eyeshadow, Cushion
    const allowsVto = ['LIP', 'FACE', 'EYE'].includes(subCategory);
    if (!allowsVto || !p.vtoConfig || !p.vtoConfig.shades || p.vtoConfig.shades.length === 0) {
      if (allowsVto && p.variants && p.variants.length > 0) {
        // Tự động bảo lưu/xây dựng VTO nếu sản phẩm có sắc thái màu
        const vtoCategory = subCategory === 'LIP' ? 'LIPSTICK' : subCategory === 'EYE' ? 'EYESHADOW' : leafCategory === 'POWDER_BLUSH' || leafCategory === 'LIQUID_BLUSH' ? 'BLUSH' : 'FOUNDATION';
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
  } else if (rootCategory === 'BODY_CARE' || rootCategory === 'HAIR_CARE') {
    // Body & Hair: Xóa VTO và các thuộc tính da mặt
    p.vtoConfig = null;
    delete p.suitableSkinTypes;
    delete p.targetSkinTypes;
    delete p.skinConcerns;
    delete p.concerns;
    p.keyActiveGroups = [];
  } else if (rootCategory === 'PERFUME') {
    // Nước hoa: Xóa sạch da mặt & VTO
    p.vtoConfig = null;
    delete p.suitableSkinTypes;
    delete p.targetSkinTypes;
    delete p.skinConcerns;
    delete p.concerns;
    p.keyActiveGroups = [];
  }

  // Đảm bảo status chuẩn
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

    // Nạp danh sách đã chuẩn hóa từ seedProducts hoặc facets
    const sourceProducts = seedProducts.length > 0 ? seedProducts : JSON.parse(fs.readFileSync(PRODUCTS_FACETS_PATH, 'utf-8'));

    let updatedCount = 0;
    for (const p of sourceProducts) {
      const filter = { _id: p.id };
      const updateDoc = {
        $set: {
          categoryPath: p.categoryPath,
          subCategory: p.subCategory,
          vtoConfig: p.vtoConfig || null,
          suitableSkinTypes: p.suitableSkinTypes || [],
          targetSkinTypes: p.targetSkinTypes || [],
          skinConcerns: p.skinConcerns || [],
          keyActiveGroups: p.keyActiveGroups || []
        }
      };
      await col.updateOne(filter, updateDoc, { upsert: false });
      updatedCount++;
    }

    // Đảm bảo tạo MongoDB Index cho categoryPath để query cực nhanh
    await col.createIndex({ categoryPath: 1 });
    console.log(`✅ Đã cập nhật thành công ${updatedCount} bản ghi và tạo index { categoryPath: 1 } trong MongoDB!`);

    await client.close();
  } catch (err) {
    console.warn(`⚠️ Cảnh báo khi cập nhật MongoDB qua driver: ${err.message}. Sẽ chạy fallback qua mongosh nếu cần.`);
  }

  console.log('\n======================================================================');
  console.log('🎉 HOÀN THÀNH CHUẨN HÓA TOÀN BỘ DATASET VÀ CƠ SỞ DỮ LIỆU');
  console.log('======================================================================\n');
}

if (require.main === module) {
  sanitizeAll();
}

module.exports = { resolveCategoryPath, sanitizeProductAttributes, sanitizeAll };
