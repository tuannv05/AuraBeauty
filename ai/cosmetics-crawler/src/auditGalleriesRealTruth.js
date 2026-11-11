const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const seed = JSON.parse(fs.readFileSync('backend/catalog-service/src/main/resources/products_seed.json', 'utf8'));
const files = fs.readdirSync('frontend/public/products');

console.log('--- AUDITING 157 PRODUCTS FOR EXACT REAL IMAGES ---');

let summary = {
  total: seed.length,
  hasRealPackshot: 0,
  hasRealVariants: 0,
  exactImagesPerProduct: {}
};

seed.forEach(p => {
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
  } else if (p.id.startsWith('PROD-CRW-')) {
    const pNum = parseInt(p.id.replace('PROD-CRW-', ''), 10);
    // Find hero packshot
    const heroFile = files.find(f => f === `${p.id}.webp` || f === `${p.id}.jpg` || f === `${p.id}.png`);
    if (heroFile) {
      realImgs.push(`/products/${heroFile}`);
    }
    // Find authentic variant files for this product
    const variantFiles = files.filter(f => f.startsWith(`SKU-CRW-${pNum}-`));
    // Sort to keep deterministic order
    variantFiles.sort();
    variantFiles.forEach(vf => {
      realImgs.push(`/products/${vf}`);
    });
  }

  // Cap at 5 images max
  if (realImgs.length > 5) {
    realImgs = realImgs.slice(0, 5);
  }

  const count = realImgs.length;
  summary.exactImagesPerProduct[count] = (summary.exactImagesPerProduct[count] || 0) + 1;
  if (count > 0) summary.hasRealPackshot++;
  if (count > 1) summary.hasRealVariants++;
});

console.log('Summary:', summary);
