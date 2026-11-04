const fs = require('fs');
const path = require('path');
const { MongoClient } = require('../node_modules/mongodb');

async function syncSeed() {
  const seedPath = path.resolve(__dirname, '../../../backend/catalog-service/src/main/resources/products_seed.json');
  const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  const lip = seed.find(x => x.name.includes('Lip On Lip'));
  if (!lip) {
    console.error('Lip On Lip not found in seed');
    return;
  }

  // Ensure images array includes PROD-LIPONLIP-STUDIO.jpg
  if (!lip.images.includes('/products/PROD-LIPONLIP-STUDIO.jpg')) {
    lip.images.splice(1, 0, '/products/PROD-LIPONLIP-STUDIO.jpg');
  }

  // Update seed file with enriched images and crawled INCI ingredients
  lip.ingredients = 'Isononyl Isononanoate, Triisostearin, Diisostearyl Malate, C10-30 Cholesterol/Lanosterol Esters, Synthetic Wax, Microcrystalline Wax, Ozokerite, Olea Europaea (Olive) Fruit Oil, Polybutene, Butyrospermum Parkii (Shea) Butter, Dextrin Isostearate, Pentylene Glycol, Soluble Collagen, Tocopheryl Acetate, Alumina, Isopropyl Myristate, Isopropyl Titanium Triisostearate, Polyhydroxystearic Acid, Propylene Carbonate, Sodium Citrate, Stearalkonium Hectorite, Water, BHT, Citric Acid, Phenoxyethanol, [+/- CI 15850, CI 16035, CI 42090, CI 45370, CI 47005, CI 77491, CI 77891]';
  lip.description = 'Son thỏi trang điểm dưỡng môi chất son satin bóng nhẹ, dưỡng ẩm vượt trội với hệ dưỡng Ultra Moist (chứa hơn 50% thành phần dưỡng gồm dầu Olive, bơ hạt mỡ và Collagen hòa tan), lên màu chuẩn xác và giữ màu lâu phai.';

  fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2), 'utf8');
  console.log('✓ Updated products_seed.json with official crawl data');

  // Also update MongoDB catalog_db.products
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const col = client.db('catalog_db').collection('products');
  const res = await col.updateOne({ id: lip.id }, { $set: lip }, { upsert: true });
  console.log(`✓ Synchronized with MongoDB: matched=${res.matchedCount}, modified=${res.modifiedCount}, upserted=${res.upsertedCount}`);
  
  // Verify from Mongo
  const check = await col.findOne({ id: lip.id });
  console.log('Verified Mongo product:', check.name, check.images);

  await client.close();
}

syncSeed().catch(console.error);
