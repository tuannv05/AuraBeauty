const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const data = require('../output/products_facets_full.json');
const hashes = new Set();
let missing = 0, badCount = 0;

for (const p of data) {
  const imgs = Array.isArray(p.images) && p.images.length ? p.images : [p.imageUrl || p.image].filter(Boolean);
  if (imgs.length < 1 || imgs.length > 5) {
    console.error(`Over limit or empty images: ${p.id} has ${imgs.length} images`);
    badCount++;
  }
  const mainImg = imgs[0];
  const localPath = path.join('frontend/public', mainImg.replace(/^https?:\/\/[^/]+/, ''));
  if (!fs.existsSync(localPath)) {
    console.error(`Missing file: ${p.id} -> ${localPath}`);
    missing++;
    continue;
  }
  const buf = fs.readFileSync(localPath);
  if (buf.length < 8000 || mainImg.endsWith('.svg')) {
    console.error(`Invalid file (<8KB or SVG): ${p.id} -> ${localPath} (${buf.length} bytes)`);
    badCount++;
  }
  const md5 = crypto.createHash('md5').update(buf).digest('hex');
  if (hashes.has(md5)) {
    console.error(`Duplicate main image hash: ${p.id} -> ${mainImg}`);
  }
  hashes.add(md5);
}

const summary = {
  totalProducts: data.length,
  uniqueMainImageHashes: hashes.size,
  missingFiles: missing,
  invalidOrOverLimit: badCount
};

console.log('=== KẾT QUẢ KIỂM TRA ĐỒ THỊ TÊN - NGUỒN ẢNH (SPEC-KIT QT-11) ===');
console.log(JSON.stringify(summary, null, 2));

if (missing > 0 || badCount > 0 || hashes.size !== data.length) {
  console.error('❌ KIỂM TRA THẤT BẠI!');
  process.exit(1);
} else {
  console.log('✅ 100% ĐẠT CHUẨN (VERIFIED CONVERGED)!');
}
