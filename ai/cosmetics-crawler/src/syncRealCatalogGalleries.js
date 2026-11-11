const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SEED_FILE = path.resolve(__dirname, '../../../backend/catalog-service/src/main/resources/products_seed.json');
const FACETS_FILE = path.resolve(__dirname, '../output/products_facets_full.json');
const API_FILE = path.resolve(__dirname, '../../../frontend/src/api.js');
const PUBLIC_PRODUCTS_DIR = path.resolve(__dirname, '../../../frontend/public/products');

const files = fs.readdirSync(PUBLIC_PRODUCTS_DIR);
const seed = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'));

console.log('--- STARTING 100% EXACT PRODUCT TRUTH SYNCHRONIZATION ---');
console.log('Total products in seed:', seed.length);

const updatedSeed = [];
const mainImageHashes = new Map();
let duplicateMainCount = 0;

for (const p of seed) {
  let realImgs = [];

  if (p.id === 'PROD-DOVE-EXFOLIATING-POMEGRANATE') {
    realImgs = [
      '/products/dove-pomegranate-main.jpg',
      '/products/dove-pomegranate-cream-texture.jpg',
      '/products/dove-pomegranate-swatch.jpg',
      '/products/dove-pomegranate-back-label.jpg',
      '/products/dove-pomegranate-top-lid.jpg'
    ];
  } else if (p.id === 'PROD-WAKEMAKE-BLURRING') {
    realImgs = [
      '/products/PROD-WAKEMAKE-BLURRING.jpg',
      '/products/SKU-WAKEMAKE-01.jpg',
      '/products/SKU-WAKEMAKE-02.jpg',
      '/products/SKU-WAKEMAKE-03.jpg',
      '/products/SKU-WAKEMAKE-04.jpg'
    ];
  } else if (p.id === 'PROD-LIP-ON-LIP') {
    realImgs = [
      '/products/PROD-LIPONLIP.jpg',
      '/products/SKU-LIPONLIP-01.jpg',
      '/products/SKU-LIPONLIP-02.jpg',
      '/products/SKU-LIPONLIP-03.jpg',
      '/products/SKU-LIPONLIP-04.jpg'
    ];
  } else if (p.id === 'PROD-CRW-085') {
    realImgs = ['/products/PROD-CRW-085.webp'];
  } else if (p.id === 'PROD-CRW-150') {
    realImgs = ['/products/PROD-CRW-150.webp'];
  } else if (p.id.startsWith('PROD-CRW-')) {
    const pNum = parseInt(p.id.replace('PROD-CRW-', ''), 10);
    // 1. Primary packshot
    const heroFile = files.find(f => f === `${p.id}.webp` || f === `${p.id}.jpg` || f === `${p.id}.png`);
    if (heroFile) {
      realImgs.push(`/products/${heroFile}`);
    } else {
      // Fallback to existing first image if valid
      if (p.images && p.images[0] && !p.images[0].includes('macro-donor')) {
        realImgs.push(p.images[0]);
      }
    }
    // 2. Real variant images
    const variantFiles = files.filter(f => f.startsWith(`SKU-CRW-${pNum}-`));
    variantFiles.sort();
    for (const vf of variantFiles) {
      const vPath = `/products/${vf}`;
      if (!realImgs.includes(vPath)) {
        realImgs.push(vPath);
      }
    }
  } else {
    // Non-CRW products
    const heroFile = files.find(f => f === `${p.id}.webp` || f === `${p.id}.jpg` || f === `${p.id}.png`);
    if (heroFile) {
      realImgs.push(`/products/${heroFile}`);
    } else if (p.images && p.images[0]) {
      realImgs.push(p.images[0]);
    }
  }

  // Filter out any macro-donor or SVG or empty
  realImgs = realImgs.filter(img => 
    img && 
    !img.includes('macro-donor') && 
    !img.endsWith('.svg') &&
    !img.includes('packshot-default')
  );

  // Eliminate duplicates within same product
  realImgs = Array.from(new Set(realImgs));

  // Cap at 5 images max
  if (realImgs.length > 5) {
    realImgs = realImgs.slice(0, 5);
  }

  // Verify at least 1 image
  if (realImgs.length === 0) {
    throw new Error(`Product ${p.id} has 0 valid images!`);
  }

  // Verify file existence and size
  for (const img of realImgs) {
    const rel = img.replace(/^\//, '');
    const fullPath = path.join(PUBLIC_PRODUCTS_DIR, path.basename(rel));
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File does not exist: ${fullPath} for product ${p.id}`);
    }
    const stat = fs.statSync(fullPath);
    if (stat.size < 8192) {
      throw new Error(`File too small (< 8KB): ${fullPath} (${stat.size} bytes)`);
    }
  }

  // Check main image hash uniqueness
  const mainImgRel = realImgs[0].replace(/^\//, '');
  const mainImgFull = path.join(PUBLIC_PRODUCTS_DIR, path.basename(mainImgRel));
  const mainImgBuf = fs.readFileSync(mainImgFull);
  const hash = crypto.createHash('sha256').update(mainImgBuf).digest('hex');

  if (mainImageHashes.has(hash)) {
    console.error(`DUPLICATE MAIN IMAGE HASH: ${p.id} vs ${mainImageHashes.get(hash)}`);
    duplicateMainCount++;
  } else {
    mainImageHashes.set(hash, p.id);
  }

  // Clone product and assign images
  const updatedP = {
    ...p,
    images: realImgs,
    image: realImgs[0]
  };
  if (updatedP.imageUrl) {
    updatedP.imageUrl = realImgs[0];
  }

  // If variants exist, ensure variant images are valid
  if (updatedP.variants && updatedP.variants.length > 0) {
    updatedP.variants = updatedP.variants.map((v, vIdx) => {
      const vImg = (v.image && fs.existsSync(path.join(PUBLIC_PRODUCTS_DIR, path.basename(v.image))))
        ? v.image
        : (realImgs[vIdx + 1] || realImgs[0]);
      return {
        ...v,
        image: vImg
      };
    });
  }

  updatedSeed.push(updatedP);
}

console.log('Audit complete.');
console.log('Total products processed:', updatedSeed.length);
console.log('Unique main image content hashes:', mainImageHashes.size);
console.log('Duplicate main image count:', duplicateMainCount);

if (duplicateMainCount > 0) {
  throw new Error('Aborting: duplicate main images detected!');
}

// 1. Write updated products_seed.json
fs.writeFileSync(SEED_FILE, JSON.stringify(updatedSeed, null, 2), 'utf8');
console.log('Successfully written:', SEED_FILE);

// 2. Write updated products_facets_full.json
fs.writeFileSync(FACETS_FILE, JSON.stringify(updatedSeed, null, 2), 'utf8');
console.log('Successfully written:', FACETS_FILE);

// 3. Write updated frontend/src/api.js
const apiContent = fs.readFileSync(API_FILE, 'utf8');
const exportRegex = /export const MOCK_PRODUCTS = \[[\s\S]*?\n\];/;
const newExport = `export const MOCK_PRODUCTS = ${JSON.stringify(updatedSeed, null, 2)};`;

if (!exportRegex.test(apiContent)) {
  throw new Error('Could not find MOCK_PRODUCTS export in frontend/src/api.js');
}

const updatedApiContent = apiContent.replace(exportRegex, newExport);
fs.writeFileSync(API_FILE, updatedApiContent, 'utf8');
console.log('Successfully updated:', API_FILE);

console.log('--- 100% EXACT PRODUCT TRUTH SYNCHRONIZATION COMPLETED ---');
