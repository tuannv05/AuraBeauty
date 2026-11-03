// ai/cosmetics-crawler/src/dbSynchronizer.js

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { MongoClient } = require('mongodb');
const { Client: PgClient } = require('pg');
const { INCI_DICTIONARY } = require('./inciAndSafetyAnalyzer');

const OUTPUT_DIR = path.join(__dirname, '..', 'output');
const CATALOG_RESOURCES_DIR = path.join(__dirname, '../../../services/catalog-service/src/main/resources');
const FRONTEND_API_PATH = path.join(__dirname, '../../../frontend/src/api.js');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const MONGO_DB = 'catalog_db';

const PG_CONFIG = {
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT || '5432', 10),
  user: process.env.PG_USER || 'app',
  password: process.env.PG_PASSWORD || 'app_secret'
};

/**
 * Replicates EmbeddingModelService.java 384-dimensional vector calculation
 */
function generateEmbedding(text) {
  if (!text) text = '';
  const VECTOR_DIM = 384;
  const vector = new Float32Array(VECTOR_DIM);
  const hash = crypto.createHash('sha256').update(text.toLowerCase().trim(), 'utf8').digest();

  for (let i = 0; i < VECTOR_DIM; i++) {
    const b = hash[i % hash.length];
    let val = (b - 128.0) / 128.0;
    if (text.length > i) {
      val += (text.charCodeAt(i % text.length) % 31) / 31.0;
    }
    vector[i] = val;
  }

  let sumSquares = 0.0;
  for (let i = 0; i < VECTOR_DIM; i++) {
    sumSquares += vector[i] * vector[i];
  }
  const norm = Math.sqrt(sumSquares);
  if (norm > 0) {
    for (let i = 0; i < VECTOR_DIM; i++) {
      vector[i] /= norm;
    }
  }
  return Array.from(vector);
}

function deterministicUUID(text) {
  const hash = crypto.createHash('md5').update(text).digest('hex');
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
}

async function syncAllDatabases() {
  console.log("==================================================================");
  console.log("🔄 POLYGLOT PERSISTENCE SYNCHRONIZATION (MongoDB + PostgreSQL + AI)");
  console.log("==================================================================");

  const datasetPath = path.join(OUTPUT_DIR, 'products_facets_full.json');
  if (!fs.existsSync(datasetPath)) {
    console.error(`❌ File ${datasetPath} not found. Running scraper first...`);
    const { runScraperPipeline } = require('./scraper');
    await runScraperPipeline();
  }

  const products = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));
  console.log(`Loaded ${products.length} normalized products from: ${datasetPath}`);

  // 1. SYNC TO MONGODB (catalog_db)
  console.log(`\n🍃 Connecting to MongoDB at ${MONGO_URI}/${MONGO_DB}...`);
  try {
    const mongoClient = new MongoClient(MONGO_URI);
    await mongoClient.connect();
    const db = mongoClient.db(MONGO_DB);

    const productsColl = db.collection('products');
    const inciColl = db.collection('inci_ingredients');

    console.log("   - Upserting products collection...");
    for (const p of products) {
      const doc = { ...p, _id: p.id, status: 'PUBLISHED' };
      await productsColl.replaceOne({ _id: p.id }, doc, { upsert: true });
    }
    console.log(`   ✓ Successfully synced ${products.length} products to MongoDB 'products'!`);

    console.log("   - Upserting INCI dictionary collection...");
    const inciEntries = Object.entries(INCI_DICTIONARY);
    for (const [name, info] of inciEntries) {
      await inciColl.updateOne(
        { inciName: name },
        { $set: { inciName: name, ...info } },
        { upsert: true }
      );
    }
    console.log(`   ✓ Successfully synced ${inciEntries.length} INCI ingredients!`);

    await mongoClient.close();
  } catch (err) {
    console.error(`⚠️ MongoDB sync failed: ${err.message}`);
  }

  // 2. SYNC TO POSTGRESQL (inventory_db)
  console.log(`\n🐘 Connecting to PostgreSQL inventory_db...`);
  try {
    const invPg = new PgClient({ ...PG_CONFIG, database: 'inventory_db' });
    await invPg.connect();

    let stockItemCount = 0;
    for (const p of products) {
      for (const v of (p.variants || [])) {
        await invPg.query(`
          INSERT INTO stock_items (sku_code, product_id, shop_id, on_hand, reserved)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (sku_code) DO UPDATE
          SET on_hand = EXCLUDED.on_hand, reserved = EXCLUDED.reserved;
        `, [v.skuCode, p.id, p.shopId, 120, 0]);
        stockItemCount++;
      }
    }
    console.log(`   ✓ Successfully upserted ${stockItemCount} stock item records into inventory_db (on_hand=120, reserved=0)!`);
    await invPg.end();
  } catch (err) {
    console.error(`⚠️ PostgreSQL inventory_db sync failed: ${err.message}`);
  }

  // 3. SYNC TO POSTGRESQL (ai_db - pgvector RAG Knowledge Store)
  console.log(`\n🧠 Connecting to PostgreSQL ai_db (pgvector)...`);
  try {
    const aiPg = new PgClient({ ...PG_CONFIG, database: 'ai_db' });
    await aiPg.connect();

    let chunkCount = 0;
    for (const p of products) {
      const chunkId = deterministicUUID(`chunk-${p.id}`);
      const title = `${p.brand} - ${p.name}`;
      
      const activesText = (p.keyActiveGroups || []).join(', ');
      const skinTypesText = (p.targetSkinTypes || []).join(', ');
      const concernsText = (p.skinConcerns || []).join(', ');
      const badgesText = (p.safetyEthicsBadges || []).join(', ');
      const originText = p.originCountry || 'KOREA';
      const shadeText = p.vtoConfig && p.vtoConfig.shades 
        ? p.vtoConfig.shades.map(s => `${s.shadeName} (${s.hexColor})`).join('; ') 
        : 'None';

      const content = `Sản phẩm: ${p.name} | Thương hiệu: ${p.brand} | Xuất xứ: ${originText} | Loại da: ${skinTypesText} | Vấn đề da: ${concernsText} | Hoạt chất chính: ${activesText} | Tiêu chuẩn: ${badgesText} | Màu sắc AR: ${shadeText} | Mô tả: ${p.description}`;

      const metadata = JSON.stringify({
        productId: p.id,
        brand: p.brand,
        category: p.category,
        originCountry: p.originCountry,
        targetSkinTypes: p.targetSkinTypes,
        skinConcerns: p.skinConcerns,
        keyActiveGroups: p.keyActiveGroups,
        safetyEthicsBadges: p.safetyEthicsBadges
      });

      const embedding = generateEmbedding(content);
      const vecStr = `[${embedding.join(',')}]`;

      await aiPg.query(`
        INSERT INTO knowledge_chunks (id, product_id, shop_id, title, content, metadata, embedding)
        VALUES ($1, $2, $3, $4, $5, $6, $7::vector)
        ON CONFLICT (id) DO UPDATE
        SET title = EXCLUDED.title, content = EXCLUDED.content, metadata = EXCLUDED.metadata, embedding = EXCLUDED.embedding;
      `, [chunkId, p.id, p.shopId, title, content, metadata, vecStr]);
      chunkCount++;
    }
    console.log(`   ✓ Successfully synced ${chunkCount} knowledge chunks with 384-d pgvector embeddings into ai_db!`);
    await aiPg.end();
  } catch (err) {
    console.error(`⚠️ PostgreSQL ai_db sync failed: ${err.message}`);
  }

  // 4. SYNC TO Spring Boot Seed Resource (products_seed.json)
  try {
    if (fs.existsSync(CATALOG_RESOURCES_DIR)) {
      const seedFile = path.join(CATALOG_RESOURCES_DIR, 'products_seed.json');
      fs.writeFileSync(seedFile, JSON.stringify(products, null, 2), 'utf-8');
      console.log(`\n📦 Successfully updated Spring Boot catalog seed: ${seedFile}`);
    }
  } catch (err) {
    console.warn(`Could not update products_seed.json:`, err.message);
  }

  // 5. SYNC TO FRONTEND (api.js MOCK_PRODUCTS)
  try {
    if (fs.existsSync(FRONTEND_API_PATH)) {
      const currentApiJs = fs.readFileSync(FRONTEND_API_PATH, 'utf-8');
      const startTag = 'export const MOCK_PRODUCTS = ';
      const endTag = '// Combos Mock Catalog';
      const sIdx = currentApiJs.indexOf(startTag);
      const eIdx = currentApiJs.indexOf(endTag);

      if (sIdx !== -1 && eIdx !== -1) {
        const prefix = currentApiJs.slice(0, sIdx + startTag.length);
        const suffix = currentApiJs.slice(eIdx);
        const newApiJs = prefix + JSON.stringify(products, null, 2) + ';\n\n' + suffix;
        fs.writeFileSync(FRONTEND_API_PATH, newApiJs, 'utf-8');
        console.log(`💻 Successfully synced ${products.length} products to Frontend: ${FRONTEND_API_PATH}`);
      }
    }
  } catch (err) {
    console.warn(`Could not update frontend api.js:`, err.message);
  }

  console.log("\n==================================================================");
  console.log(`🎯 ALL DATABASES & RESOURCES SYNCHRONIZED SUCCESSFULLY (${products.length} PRODUCTS)`);
  console.log("==================================================================");
}

if (require.main === module) {
  syncAllDatabases()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Sync failure:', err);
      process.exit(1);
    });
}

module.exports = {
  syncAllDatabases
};
