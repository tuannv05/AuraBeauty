const fs = require('fs');
const path = require('path');

const seed = JSON.parse(fs.readFileSync('backend/catalog-service/src/main/resources/products_seed.json', 'utf8'));

console.log('=== FULL CATALOG PRODUCT LISTING (157 PRODUCTS) ===');

seed.forEach((p, idx) => {
  const mainImg = (p.images && p.images[0]) || p.image;
  console.log(`${idx + 1}. [${p.id}] ${p.brand} | ${p.name} | ${mainImg}`);
});
