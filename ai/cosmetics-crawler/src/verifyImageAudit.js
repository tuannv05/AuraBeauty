const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const products = JSON.parse(fs.readFileSync('ai/cosmetics-crawler/output/products_facets_full.json', 'utf8'));

console.log('=== BÁO CÁO KIỂM TOÁN HÌNH ẢNH SẢN PHẨM CHÍNH HÃNG 100% (SPEC-KIT QT-09) ===');
console.log('Tổng số sản phẩm:', products.length);

const mainPhotos = products.map(p => p.images[0]);
const uniqueMainPhotos = new Set(mainPhotos);
console.log('Ảnh bìa duy nhất (Unique Main Photos):', uniqueMainPhotos.size);

// Check SHA-256 hash uniqueness of main photos across products
const mainHashes = new Map();
let duplicateHashCount = 0;
mainPhotos.forEach((img, idx) => {
  const fullPath = path.join('frontend/public', img);
  if (fs.existsSync(fullPath)) {
    const buf = fs.readFileSync(fullPath);
    const hash = crypto.createHash('sha256').update(buf).digest('hex');
    if (mainHashes.has(hash)) {
      console.error(`CẢNH BÁO TRÙNG HASH ẢNH BÌA: ${products[idx].id} trùng với ${mainHashes.get(hash)}`);
      duplicateHashCount++;
    } else {
      mainHashes.set(hash, products[idx].id);
    }
  }
});
console.log('Số lượng ảnh bìa trùng SHA-256 hash giữa các sản phẩm:', duplicateHashCount);

// Check internal gallery clone count (within the same product)
let duplicateInsideGalleryCount = 0;
products.forEach(p => {
  const hashes = (p.images || []).map(img => {
    const fPath = path.join('frontend/public', img);
    if (fs.existsSync(fPath)) {
      return crypto.createHash('sha256').update(fs.readFileSync(fPath)).digest('hex');
    }
    return null;
  }).filter(Boolean);
  const uniqueHashes = new Set(hashes);
  if (uniqueHashes.size < (p.images || []).length) {
    console.error(`CẢNH BÁO TRÙNG ẢNH TRONG GALLERY: ${p.id} có ${p.images.length} ảnh nhưng chỉ có ${uniqueHashes.size} hash khác nhau`);
    duplicateInsideGalleryCount++;
  }
});
console.log('Số lượng sản phẩm bị trùng ảnh bên trong gallery (ảnh clone):', duplicateInsideGalleryCount);

let outside3To5 = 0;
let missingFiles = 0;
let invalidImageCount = 0;
let macroDonorFound = 0;

products.forEach(p => {
  if (!p.images || p.images.length < 3 || p.images.length > 5) {
    console.error(`CẢNH BÁO SỐ LƯỢNG ẢNH: ${p.id} có ${p.images ? p.images.length : 0} ảnh (yêu cầu từ 3 đến 5)`);
    outside3To5++;
  }
  p.images.forEach(img => {
    if (img.includes('macro-donor')) macroDonorFound++;
    const fullPath = path.join('frontend/public', img);
    if (!fs.existsSync(fullPath)) {
      console.error(`FILE THIẾU: ${p.id} -> ${fullPath}`);
      missingFiles++;
    } else {
      const stat = fs.statSync(fullPath);
      if (stat.size < 8192 || img.endsWith('.svg')) {
        console.error(`FILE KHÔNG HỢP LỆ (<8KB hoặc SVG): ${fullPath} (${stat.size} bytes)`);
        invalidImageCount++;
      }
    }
  });
});

console.log('Sản phẩm ngoài khoảng 3-5 ảnh:', outside3To5);
console.log('File ảnh bị thiếu trên ổ cứng:', missingFiles);
console.log('File ảnh không đạt chuẩn (<8KB hoặc SVG):', invalidImageCount);
console.log('File ảnh macro-donor generic còn sót lại:', macroDonorFound);

const passed = (
  products.length === 157 &&
  uniqueMainPhotos.size === 157 &&
  duplicateHashCount === 0 &&
  duplicateInsideGalleryCount === 0 &&
  outside3To5 === 0 &&
  missingFiles === 0 &&
  invalidImageCount === 0 &&
  macroDonorFound === 0
);

console.log('KẾT QUẢ KIỂM TOÁN:', passed ? '✅ 100% ĐẠT CHUẨN (VERIFIED CONVERGED)' : '❌ THẤT BẠI (FAILED)');

if (!passed) {
  process.exit(1);
}
