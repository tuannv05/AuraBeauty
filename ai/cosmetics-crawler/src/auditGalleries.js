const fs = require('fs');
const path = require('path');

const apiFile = path.resolve(__dirname, '../../../frontend/src/api.js');
const productsDir = path.resolve(__dirname, '../../../frontend/public/products');

const content = fs.readFileSync(apiFile, 'utf8');
const match = content.match(/export const MOCK_PRODUCTS = (\[[\s\S]*?\n\]);/);

if (!match) {
  console.error('Cannot find MOCK_PRODUCTS in api.js');
  process.exit(1);
}

const prods = eval(match[1]);
const allFiles = new Set(fs.readdirSync(productsDir));

let countAlreadyGe3 = 0;
let canAssembleGe3 = 0;
let needFetchOrGenerate = 0;

const needsWork = [];

prods.forEach((p, idx) => {
  const existingInImages = (p.images || []).filter(img => allFiles.has(img.replace('/products/', '')));
  if (existingInImages.length >= 3) {
    countAlreadyGe3++;
    return;
  }

  // Look for SKU-CRW- or variants or other files in folder
  const candidateFiles = new Set(existingInImages);
  
  // 1. Check variants
  if (p.variants && Array.isArray(p.variants)) {
    p.variants.forEach(v => {
      if (v.image && allFiles.has(v.image.replace('/products/', ''))) {
        candidateFiles.add(v.image.replace('/products/', ''));
      }
    });
  }

  // 2. Check SKU-CRW pattern by product ID number
  const numMatch = p.id.match(/\d+/);
  if (numMatch) {
    const num = parseInt(numMatch[0]);
    // check SKU-CRW-{num}-01..05 or STD
    ['01', '02', '03', '04', '05', 'STD', '19C', '21N', '23W'].forEach(suffix => {
      ['.jpg', '.png', '.webp'].forEach(ext => {
        const fn = `SKU-CRW-${num}-${suffix}${ext}`;
        if (allFiles.has(fn)) {
          candidateFiles.add(fn);
        }
      });
    });
  }

  // 3. Check niche- pattern
  if (p.id.startsWith('niche-')) {
    const prefix = p.id;
    allFiles.forEach(f => {
      if (f.startsWith(prefix) && (f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp'))) {
        candidateFiles.add(f);
      }
    });
  }

  if (candidateFiles.size >= 3) {
    canAssembleGe3++;
  } else {
    needFetchOrGenerate++;
    needsWork.push({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      currentCount: candidateFiles.size,
      candidates: Array.from(candidateFiles)
    });
  }
});

console.log('=== AUDIT REPORT ===');
console.log('Total Products:', prods.length);
console.log('Products already having >= 3 images:', countAlreadyGe3);
console.log('Products having matching files in folder (total >= 3):', canAssembleGe3);
console.log('Products needing external download or texture generation:', needFetchOrGenerate);
console.log('\nSample products needing work:');
needsWork.slice(0, 10).forEach(w => {
  console.log(`- [${w.id}] ${w.brand}: ${w.name} (has ${w.currentCount} files)`);
});
