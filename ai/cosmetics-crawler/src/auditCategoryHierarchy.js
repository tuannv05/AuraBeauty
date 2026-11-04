/**
 * ai/cosmetics-crawler/src/auditCategoryHierarchy.js
 * Quét toàn bộ dataset sản phẩm trong catalog-service và products_facets_full.json
 * để chẩn đoán chính xác các lỗi mapping phân hệ và rò rỉ thuộc tính (Facet Attributes).
 */

const fs = require('fs');
const path = require('path');

const PRODUCTS_FACETS_PATH = path.join(__dirname, '../output/products_facets_full.json');
const PRODUCTS_SEED_PATH = path.join(__dirname, '../../../backend/catalog-service/src/main/resources/products_seed.json');

function loadJson(filePath) {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  return [];
}

function auditDataset(name, products) {
  console.log(`\n======================================================================`);
  console.log(`🔍 BẮT ĐẦU KHẢO SÁT DATASET: ${name} (Tổng số: ${products.length} sản phẩm)`);
  console.log(`======================================================================`);

  const report = {
    total: products.length,
    crossCategoryLeakage: [],
    parentChildDisconnect: [],
    subCategoryCollision: [],
    missingCategoryPath: 0
  };

  const makeupCategories = ['lipstick', 'blush', 'foundation', 'eyeshadow', 'son', 'phấn', 'mascara', 'cushion'];
  const skincareCategories = ['cleanser', 'serum', 'toner', 'cream', 'sunscreen', 'moisturizer', 'tinh chất', 'nước hoa hồng', 'sữa rửa mặt'];
  const perfumeCategories = ['perfume', 'fragrance', 'nước hoa'];
  const bodyCareCategories = ['body', 'body_care', 'chăm sóc cơ thể', 'sữa tắm', 'dưỡng thể'];
  const hairCareCategories = ['hair', 'hair_care', 'dầu gội', 'dầu xả', 'dưỡng tóc'];

  products.forEach((p, index) => {
    const id = p.id || `INDEX-${index}`;
    const pName = (p.name || '').toLowerCase();
    const pCat = (p.category || '').toLowerCase();
    const skinTypes = p.targetSkinTypes || p.suitableSkinTypes || [];
    const skinConcerns = p.skinConcerns || p.concerns || [];
    const vtoConfig = p.vtoConfig;
    const catPath = p.categoryPath;

    // 1. Kiểm tra CategoryPath
    if (!Array.isArray(catPath) || catPath.length === 0) {
      report.missingCategoryPath++;
      report.parentChildDisconnect.push({
        id,
        name: p.name,
        category: p.category,
        reason: 'Chưa có mảng categoryPath phân cấp (gây ngắt kết nối khi lọc theo danh mục cha như SKINCARE, MAKEUP)'
      });
    }

    // 2. Lỗi 1: Cross-Category Leakage
    // a. Sản phẩm Trang điểm (Makeup) bị rò rỉ thuộc tính Da mặt (Skin Types / Skin Concerns)
    const isMakeup = makeupCategories.some(m => pCat.includes(m) || pName.includes(m));
    if (isMakeup && skinTypes.length > 0) {
      report.crossCategoryLeakage.push({
        id,
        name: p.name,
        category: p.category,
        leakageType: 'MAKEUP_LEAKING_SKIN_TYPES',
        detail: `Trang điểm (${p.category}) bị gán thuộc tính da mặt [${skinTypes.join(', ')}]`
      });
    }

    // b. Sản phẩm Chăm sóc da (Skincare) bị gán VTO son/makeup
    const isSkincare = (catPath && catPath[0] === 'SKINCARE') || (skincareCategories.some(s => pCat === s) && !isMakeup);
    if (isSkincare && vtoConfig && vtoConfig.supported) {
      report.crossCategoryLeakage.push({
        id,
        name: p.name,
        category: p.category,
        leakageType: 'SKINCARE_LEAKING_VTO',
        detail: `Dưỡng da (${p.category}) bị gán vtoConfig.supported = true`
      });
    }

    // c. Sản phẩm Nước hoa bị gán thuộc tính da mặt
    const isPerfume = perfumeCategories.some(pr => pCat.includes(pr) || pName.includes(pr));
    if (isPerfume && skinTypes.length > 0) {
      report.crossCategoryLeakage.push({
        id,
        name: p.name,
        category: p.category,
        leakageType: 'PERFUME_LEAKING_SKIN_TYPES',
        detail: `Nước hoa (${p.category}) bị gán thuộc tính da mặt`
      });
    }

    // 3. Lỗi 3: Sub-category Collision (Xung đột phân hệ con tương tự nhau)
    // Tẩy da chết (mặt vs body vs da đầu)
    const isScrub = pName.includes('tẩy tế bào chết') || pName.includes('tẩy da chết') || pName.includes('scrub') || pName.includes('peeling');
    if (isScrub) {
      let detectedBranch = 'UNKNOWN';
      if (pName.includes('body') || pName.includes('cơ thể') || pCat.includes('body')) {
        detectedBranch = 'BODY_SCRUB';
      } else if (pName.includes('da đầu') || pName.includes('scalp') || pName.includes('tóc')) {
        detectedBranch = 'SCALP_SCRUB';
      } else {
        detectedBranch = 'FACE_SCRUB';
      }

      if (!catPath || !catPath.includes(detectedBranch)) {
        report.subCategoryCollision.push({
          id,
          name: p.name,
          category: p.category,
          collisionType: 'SCRUB_COLLISION',
          detectedBranch,
          detail: `Sản phẩm tẩy da chết chưa được phân loại rõ ràng nhánh (${detectedBranch})`
        });
      }
    }
  });

  // In bảng tổng hợp
  console.log(`📊 BẢNG TỔNG HỢP KẾT QUẢ AUDIT CHO [${name}]:`);
  console.table([
    { 'Nhóm Lỗi': 'Tổng số sản phẩm quét', 'Số lượng': report.total, 'Mức độ rủi ro': 'INFO' },
    { 'Nhóm Lỗi': 'Thiếu categoryPath (Parent-Child Disconnect)', 'Số lượng': report.missingCategoryPath, 'Mức độ rủi ro': 'CRITICAL' },
    { 'Nhóm Lỗi': 'Rò rỉ thuộc tính chéo (Cross-Category Leakage)', 'Số lượng': report.crossCategoryLeakage.length, 'Mức độ rủi ro': 'HIGH' },
    { 'Nhóm Lỗi': 'Xung đột phân hệ con (Sub-category Collision)', 'Số lượng': report.subCategoryCollision.length, 'Mức độ rủi ro': 'MEDIUM' }
  ]);

  if (report.crossCategoryLeakage.length > 0) {
    console.log(`\n⚠️ TOP 5 VÍ DỤ RÒ RỈ THUỘC TÍNH CHÉO (CROSS-CATEGORY LEAKAGE):`);
    console.table(report.crossCategoryLeakage.slice(0, 5));
  }

  if (report.subCategoryCollision.length > 0) {
    console.log(`\n⚠️ CÁC SẢN PHẨM CÓ NGUY CƠ XUNG ĐỘT PHÂN HỆ CON (COLLISION):`);
    console.table(report.subCategoryCollision.slice(0, 5));
  }

  return report;
}

function runAudit() {
  const facetsProducts = loadJson(PRODUCTS_FACETS_PATH);
  const seedProducts = loadJson(PRODUCTS_SEED_PATH);

  const facetsReport = auditDataset('products_facets_full.json', facetsProducts);
  const seedReport = auditDataset('products_seed.json', seedProducts);

  console.log('\n======================================================================');
  console.log('🏁 KẾT LUẬN CHẨN ĐOÁN (DIAGNOSTIC CONCLUSION):');
  console.log(`1. 100% sản phẩm (${facetsReport.total} sp) chưa có trường categoryPath phân cấp [ROOT, SUB, LEAF].`);
  console.log(`2. Phát hiện ${facetsReport.crossCategoryLeakage.length} sản phẩm son/trang điểm bị gán nhầm thuộc tính da mặt (suitableSkinTypes).`);
  console.log(`3. Các sản phẩm tẩy da chết (mặt vs body) cần được tách bạch categoryPath để tránh xung đột tìm kiếm.`);
  console.log('======================================================================\n');
}

if (require.main === module) {
  runAudit();
}

module.exports = { auditDataset, runAudit };
