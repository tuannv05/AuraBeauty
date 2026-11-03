// tools/cosmetics-crawler/exporterAndImporter.js
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const { Client: PgClient } = require('pg');
const { INCI_DICTIONARY } = require('./inciEnricher');

const OUTPUT_DIR = path.join(__dirname, 'output');
const CATALOG_RESOURCES_DIR = path.join(__dirname, '../../services/catalog-service/src/main/resources');

// Database Connection Configs
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const MONGO_DB = 'catalog_db';

const PG_CONFIG = {
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT || '5432', 10),
  user: process.env.PG_USER || 'app',
  password: process.env.PG_PASSWORD || 'app_secret'
};

const VENDOR_SHOPS = [
  { id: "00000000-0000-0000-0000-000000000010", ownerId: "00000000-0000-0000-0000-000000000002", name: "Anua Official Store", code: "SHOP-ANUA-OFFICIAL", desc: "Gian hàng mỹ phẩm chính hãng Anua Hàn Quốc" },
  { id: "00000000-0000-0000-0000-000000000020", ownerId: "00000000-0000-0000-0000-000000000002", name: "L'Oréal Paris Official Mall", code: "SHOP-LOREAL-VN", desc: "Gian hàng chính hãng tập đoàn L'Oréal Paris tại Việt Nam" },
  { id: "00000000-0000-0000-0000-000000000030", ownerId: "00000000-0000-0000-0000-000000000002", name: "Hasaki Beauty & Clinic", code: "SHOP-HASAKI-OFFICIAL", desc: "Chuỗi phân phối mỹ phẩm chính hãng Hasaki Beauty & Clinic" },
  { id: "00000000-0000-0000-0000-000000000040", ownerId: "00000000-0000-0000-0000-000000000002", name: "Guardian Flagship Store", code: "SHOP-GUARDIAN-MALL", desc: "Hệ thống bán lẻ sức khỏe & sắc đẹp Guardian Flagship" },
  { id: "00000000-0000-0000-0000-000000000050", ownerId: "00000000-0000-0000-0000-000000000002", name: "K-Beauty Lab Official", code: "SHOP-KBEAUTY-LAB", desc: "Phân phối mỹ phẩm nội địa Hàn Quốc chính hãng K-Beauty Lab" },
  { id: "00000000-0000-0000-0000-000000000060", ownerId: "00000000-0000-0000-0000-000000000002", name: "Cocoon Vietnam Flagship", code: "SHOP-COCOON-VN", desc: "Thương hiệu mỹ phẩm 100% thuần chay Cocoon Việt Nam" }
];

/**
 * Exports products, INCI dictionary, and SQL seed files.
 */
async function exportArtifacts(products) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // 1. Export products_catalog.json
  const catalogPath = path.join(OUTPUT_DIR, 'products_catalog.json');
  fs.writeFileSync(catalogPath, JSON.stringify(products, null, 2), 'utf-8');
  console.log(`📁 Exported ${products.length} products to: ${catalogPath}`);

  // 2. Export inci_dictionary.json
  const inciPath = path.join(OUTPUT_DIR, 'inci_dictionary.json');
  fs.writeFileSync(inciPath, JSON.stringify(INCI_DICTIONARY, null, 2), 'utf-8');
  console.log(`📁 Exported ${INCI_DICTIONARY.length} INCI ingredients to: ${inciPath}`);

  // 3. Export inventory_seed.sql
  const inventoryRows = [];
  products.forEach(p => {
    p.variants.forEach(v => {
      inventoryRows.push({
        skuCode: v.skuCode,
        productId: p.id,
        shopId: p.shopId,
        onHand: 100,
        reserved: 0
      });
    });
  });

  const sqlStatements = [
    "-- Generated Inventory Seed SQL for inventory_db",
    "CREATE TABLE IF NOT EXISTS stock_items (",
    "    sku_code VARCHAR(100) PRIMARY KEY,",
    "    product_id VARCHAR(100) NOT NULL,",
    "    shop_id UUID NOT NULL,",
    "    on_hand INT NOT NULL DEFAULT 0,",
    "    reserved INT NOT NULL DEFAULT 0,",
    "    CONSTRAINT chk_stock_non_negative CHECK (reserved >= 0 AND reserved <= on_hand)",
    ");\n"
  ];

  inventoryRows.forEach(r => {
    sqlStatements.push(
      `INSERT INTO stock_items (sku_code, product_id, shop_id, on_hand, reserved) ` +
      `VALUES ('${r.skuCode}', '${r.productId}', '${r.shopId}', ${r.onHand}, ${r.reserved}) ` +
      `ON CONFLICT (sku_code) DO UPDATE SET on_hand = EXCLUDED.on_hand, reserved = EXCLUDED.reserved;`
    );
  });

  const sqlPath = path.join(OUTPUT_DIR, 'inventory_seed.sql');
  fs.writeFileSync(sqlPath, sqlStatements.join('\n'), 'utf-8');
  console.log(`📁 Exported ${inventoryRows.length} stock item records to: ${sqlPath}`);

  // 4. Sync dataset into services/catalog-service/src/main/resources/products_seed.json
  try {
    if (fs.existsSync(CATALOG_RESOURCES_DIR)) {
      const springSeedPath = path.join(CATALOG_RESOURCES_DIR, 'products_seed.json');
      fs.writeFileSync(springSeedPath, JSON.stringify(products, null, 2), 'utf-8');
      console.log(`🔄 Synced products seed to Spring Boot resources: ${springSeedPath}`);
    }
  } catch (err) {
    console.warn(`Could not sync to Spring Boot resources directory:`, err.message);
  }
}

/**
 * Direct importer targeting MongoDB & PostgreSQL instances.
 */
async function importDatabase() {
  console.log("==================================================================");
  console.log("📥 DIRECT IMPORT TO MONGODB & POSTGRESQL (DOCKER / LOCALHOST)");
  console.log("==================================================================");

  const catalogPath = path.join(OUTPUT_DIR, 'products_catalog.json');
  if (!fs.existsSync(catalogPath)) {
    console.error(`❌ File ${catalogPath} not found! Please run 'npm run crawl' first.`);
    process.exit(1);
  }

  const products = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
  console.log(`Loaded ${products.length} products from disk.`);

  // 1. IMPORT TO MONGODB (catalog_db)
  console.log(`\n🍃 Connecting to MongoDB at ${MONGO_URI}/${MONGO_DB}...`);
  try {
    const mongoClient = new MongoClient(MONGO_URI);
    await mongoClient.connect();
    const db = mongoClient.db(MONGO_DB);

    const productsColl = db.collection('products');
    const inciColl = db.collection('inci_ingredients');

    console.log("   - Upserting products collection...");
    let productUpsertCount = 0;
    for (const p of products) {
      await productsColl.updateOne(
        { id: p.id },
        { $set: p },
        { upsert: true }
      );
      productUpsertCount++;
    }
    console.log(`   ✓ Successfully upserted ${productUpsertCount} products into MongoDB 'products' collection!`);

    console.log("   - Upserting INCI dictionary collection...");
    let inciUpsertCount = 0;
    for (const inci of INCI_DICTIONARY) {
      await inciColl.updateOne(
        { inciName: inci.inciName },
        { $set: inci },
        { upsert: true }
      );
      inciUpsertCount++;
    }
    console.log(`   ✓ Successfully upserted ${inciUpsertCount} ingredients into MongoDB 'inci_ingredients' collection!`);

    await mongoClient.close();
  } catch (err) {
    console.error(`⚠️ MongoDB import failed: ${err.message}`);
  }

  // 2. IMPORT TO POSTGRESQL (account_db - Shops)
  console.log(`\n🐘 Connecting to PostgreSQL account_db...`);
  try {
    const accountPg = new PgClient({ ...PG_CONFIG, database: 'account_db' });
    await accountPg.connect();

    for (const shop of VENDOR_SHOPS) {
      await accountPg.query(`
        INSERT INTO shops (id, owner_id, shop_name, description, status, business_registration_no)
        VALUES ($1, $2, $3, $4, 'APPROVED', $5)
        ON CONFLICT (shop_name) DO UPDATE 
        SET description = EXCLUDED.description,
            status = 'APPROVED';
      `, [shop.id, shop.ownerId, shop.name, shop.desc, `DKKD-${shop.code}`]);
    }
    console.log(`   ✓ Ensured all ${VENDOR_SHOPS.length} vendor shops exist in account_db!`);
    await accountPg.end();
  } catch (err) {
    console.warn(`⚠️ account_db shop sync warning: ${err.message}`);
  }

  // 3. IMPORT TO POSTGRESQL (inventory_db - Stock Items)
  console.log(`\n🐘 Connecting to PostgreSQL inventory_db...`);
  try {
    const inventoryPg = new PgClient({ ...PG_CONFIG, database: 'inventory_db' });
    await inventoryPg.connect();

    // Ensure stock_items table exists
    await inventoryPg.query(`
      CREATE TABLE IF NOT EXISTS stock_items (
          sku_code VARCHAR(100) PRIMARY KEY,
          product_id VARCHAR(100) NOT NULL,
          shop_id UUID NOT NULL,
          on_hand INT NOT NULL DEFAULT 0,
          reserved INT NOT NULL DEFAULT 0,
          CONSTRAINT chk_stock_non_negative CHECK (reserved >= 0 AND reserved <= on_hand)
      );
    `);

    let stockItemCount = 0;
    for (const p of products) {
      for (const v of p.variants) {
        await inventoryPg.query(`
          INSERT INTO stock_items (sku_code, product_id, shop_id, on_hand, reserved)
          VALUES ($1, $2, $3, 100, 0)
          ON CONFLICT (sku_code) DO UPDATE
          SET on_hand = EXCLUDED.on_hand;
        `, [v.skuCode, p.id, p.shopId]);
        stockItemCount++;
      }
    }
    console.log(`   ✓ Successfully upserted ${stockItemCount} stock items (initial on_hand = 100) into inventory_db!`);
    await inventoryPg.end();
  } catch (err) {
    console.error(`⚠️ inventory_db import failed: ${err.message}`);
  }

  // 4. IMPORT TO POSTGRESQL (ai_db - Knowledge Chunks for RAG)
  console.log(`\n🐘 Connecting to PostgreSQL ai_db (Knowledge Chunks for AI Advisor)...`);
  try {
    const aiPg = new PgClient({ ...PG_CONFIG, database: 'ai_db' });
    await aiPg.connect();

    let chunkCount = 0;
    for (const p of products) {
      const title = `${p.brand} - ${p.name}`;
      const skinTypesStr = (p.suitableSkinTypes || []).join(', ');
      const ingredientsStr = (p.ingredients || []).map(i => `${i.inciName} (${i.purpose})`).join('; ');
      const content = `Sản phẩm: ${p.name}. Thương hiệu: ${p.brand}. Danh mục: ${p.category}. ` +
                      `Công dụng: ${p.description}. ` +
                      `Loại da phù hợp: ${skinTypesStr}. ` +
                      `Bảng thành phần INCI chính: ${ingredientsStr}. ` +
                      (p.vtoConfig ? `Có hỗ trợ thử màu thực tế ảo AR Virtual Try-On cho ${p.vtoConfig.category}.` : '');

      const metadata = JSON.stringify({
        productId: p.id,
        shopId: p.shopId,
        brand: p.brand,
        category: p.category,
        suitableSkinTypes: p.suitableSkinTypes
      });

      // Insert chunk (embedding can be computed by Spring Boot AI service or left null for text search)
      await aiPg.query(`
        INSERT INTO knowledge_chunks (id, product_id, shop_id, title, content, metadata)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5);
      `, [p.id, p.shopId, title, content, metadata]);
      chunkCount++;
    }
    console.log(`   ✓ Synced ${chunkCount} product knowledge chunks to ai_db for RAG AI Advisor!`);
    await aiPg.end();
  } catch (err) {
    console.warn(`⚠️ ai_db knowledge chunk sync warning: ${err.message}`);
  }

  console.log("\n==================================================================");
  console.log("✨ ALL DATABASES SYNCHRONIZED AND READY FOR MULTI-VENDOR USE!");
  console.log("==================================================================");
}

if (process.argv.includes('--import')) {
  importDatabase().catch(err => {
    console.error("Import error:", err);
    process.exit(1);
  });
}

module.exports = {
  exportArtifacts,
  importDatabase
};
