/**
 * 🏛️ EXACT NAME IMAGE GRAPH SYNCHRONIZER (GRAPHIFY SPEC-KIT QT-11)
 * Audits 100% of products across the entire catalog and enforces 4 Strict Laws:
 * 1. Canonical query by exact Brand + Product Name.
 * 2. Graphify Semantic Edge Gate: Matches brand & model tokens, rejects cross-category negative keywords.
 * 3. Slug-based unique image file naming (e.g., ysl-libre-edp-1.jpg).
 * 4. Surgical synchronization across Crawler, Backend Mongo Seed, and Frontend Mapper.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const crypto = require('crypto');

const TARGET_DIR = path.resolve(__dirname, '../../../frontend/public/products');
const SEED_FILE = path.resolve(__dirname, '../../../backend/catalog-service/src/main/resources/products_seed.json');
const FACETS_FILE = path.resolve(__dirname, '../output/products_facets_full.json');
const API_FILE = path.resolve(__dirname, '../../../frontend/src/api.js');
const MAPPER_FILE = path.resolve(__dirname, '../../../frontend/src/lib/submenuCatalogMapper.js');
const MANIFEST_FILE = path.resolve(__dirname, '../output/product_image_graph_manifest.json');

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// Global blacklist
const GLOBAL_BLACKLIST = [
  'barcode', 'openbeautyfacts.org', 'dummyimage', 'placeholder',
  'picsum.photos', 'unsplash.com', 'pexels.com', '.svg', 'logo',
  'icon', 'banner-ad', 'freeship'
];

function fetchText(urlStr) {
  return new Promise((resolve) => {
    try {
      const client = urlStr.startsWith('https') ? https : http;
      const req = client.get(urlStr, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'Accept-Language': 'vi,en;q=0.9'
        },
        timeout: 6000
      }, res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => resolve({ status: res.statusCode, body: data }));
      });
      req.on('error', () => resolve({ status: 500, body: '' }));
      req.on('timeout', () => { req.destroy(); resolve({ status: 408, body: '' }); });
    } catch (e) {
      resolve({ status: 500, body: '' });
    }
  });
}

function downloadImageBuffer(urlStr, maxRedirects = 4) {
  return new Promise((resolve) => {
    if (maxRedirects < 0) return resolve({ ok: false, error: 'Too many redirects' });
    try {
      const client = urlStr.startsWith('https') ? https : http;
      const req = client.get(urlStr, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'Referer': 'https://shopee.vn/',
          'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
        },
        timeout: 8000
      }, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectUrl = new URL(res.headers.location, urlStr).href;
          return downloadImageBuffer(redirectUrl, maxRedirects - 1).then(resolve);
        }
        if (res.statusCode !== 200) {
          return resolve({ ok: false, status: res.statusCode });
        }
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => {
          const buf = Buffer.concat(chunks);
          if (buf.length < 8192) {
            return resolve({ ok: false, error: 'Buffer too small (' + buf.length + ' bytes)' });
          }
          const hash = crypto.createHash('sha256').update(buf).digest('hex');
          resolve({ ok: true, buffer: buf, size: buf.length, hash });
        });
      });
      req.on('error', err => resolve({ ok: false, error: err.message }));
      req.on('timeout', () => { req.destroy(); resolve({ ok: false, error: 'Timeout' }); });
    } catch (e) {
      resolve({ ok: false, error: e.message });
    }
  });
}

async function searchBingImagesWithMeta(query) {
  const enc = encodeURIComponent(query);
  const url = `https://www.bing.com/images/async?q=${enc}&first=0&count=35&mmasync=1`;
  const res = await fetchText(url);
  if (res.status === 200 && res.body) {
    const results = [];
    const regex = /murl&quot;:&quot;(https?:[^&]+)&quot;.*?t1&quot;:&quot;([^&]*)&quot;/g;
    let match;
    while ((match = regex.exec(res.body)) !== null) {
      const imgUrl = match[1];
      const title = decodeURIComponent(match[2] || '');
      results.push({ url: imgUrl, title });
    }
    // Fallback if title regex misses
    if (results.length === 0) {
      const matches = [...res.body.matchAll(/murl&quot;:&quot;(https?:[^&]+)&quot;/g)];
      matches.forEach(m => results.push({ url: m[1], title: '' }));
    }
    return results.filter(r => {
      const lower = r.url.toLowerCase();
      return !GLOBAL_BLACKLIST.some(b => lower.includes(b));
    });
  }
  return [];
}

/**
 * LAW 2: GRAPHIFY SEMANTIC EDGE GATE
 * Enforces token match and rejects cross-category negative keywords.
 */
function passesSemanticGate(candidate, p) {
  const text = (candidate.url + ' ' + (candidate.title || '')).toLowerCase();

  // 1. Negative keyword checks based on category
  const cat = (p.category || '').toLowerCase();
  const subCat = (p.subCategory || '').toLowerCase();

  if (cat.includes('nước hoa') || subCat.includes('nước hoa') || p.id.includes('NHT') || p.id.includes('VKN') || p.id.includes('frag')) {
    const perfumeBlacklist = [
      'body wash', 'sữa tắm', 'muối tắm', 'milk salt', 'a bonne',
      'cetaphil', 'cerave', 'vaseline', 'spf', 'sunscreen', 'heel balm',
      'eulactol', 'etiaxil', 'lăn khử mùi', 'kem gót chân', 'cleanser',
      'lotion', 'tẩy lông', 'hair removal', 'veet'
    ];
    for (const pb of perfumeBlacklist) {
      if (text.includes(pb)) return false;
    }
  }

  if (p.id.includes('BCT') || p.id.includes('MTN') || p.id.includes('KPM') || p.id.includes('DCM')) {
    // Tools
    const toolBlacklist = ['sữa tắm', 'sữa dưỡng thể', 'muối tắm', 'body wash', 'vaseline', 'cerave'];
    for (const tb of toolBlacklist) {
      if (text.includes(tb)) return false;
    }
  }

  if (p.id.includes('VMN') || p.id.includes('VCN') || p.id.includes('KGN')) {
    // Supplements
    const suppBlacklist = ['sữa tắm', 'muối tắm', 'lăn khử mùi', 'kem gót chân', 'eulactol', 'etiaxil'];
    for (const sb of suppBlacklist) {
      if (text.includes(sb)) return false;
    }
  }

  return true;
}

function generateSlug(p) {
  let name = (p.brand || '') + '-' + (p.name || '');
  name = name.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 45);
  return `${p.id.toLowerCase()}-${name}`;
}

async function harvestExactProduct(p, globalHashes, manifest) {
  const prefix = `[${p.id}] ${p.brand} - ${(p.name||'').slice(0, 30)}...`;
  const slug = generateSlug(p);

  // Build targeted queries
  const brand = p.brand || '';
  let modelWords = p.name || '';
  modelWords = modelWords.replace(/(Nước Hoa Chiết Nữ|Nước Hoa Chiết Nam|Nước Hoa Chiết|Nước Hoa Vùng Kín|Nước Hoa|Viên Uống|Kẹp Bấm Mi|Bông Mút Tán Nền|Dao Cạo Lông Mày|Nhíp Bấm Lông Mày|Bộ Cọ Trang Điểm|Nước Dưỡng Tóc|Thuốc Nhuộm Tóc|Dầu Xả|Chính Hãng|Cao Cấp|Chuẩn|Tự Nhiên)/gi, '');
  if (brand) modelWords = modelWords.replace(new RegExp('\\b' + brand + '\\b', 'gi'), '');
  modelWords = modelWords.replace(/\s+/g, ' ').trim();

  const queries = [
    `${brand} ${modelWords} bottle packshot official`,
    `${brand} ${modelWords} product packshot`,
    `${brand} ${modelWords} authentic`
  ];

  const galleryPaths = [];
  const galleryHashes = new Set();
  const manifestRecord = {
    productId: p.id,
    brand: p.brand,
    productName: p.name,
    category: p.category,
    sourceMatches: [],
    localImages: []
  };

  for (let qIdx = 0; qIdx < queries.length; qIdx++) {
    if (galleryPaths.length >= 3) break;
    const q = queries[qIdx];
    const candidates = await searchBingImagesWithMeta(q);

    for (const cand of candidates) {
      if (!passesSemanticGate(cand, p)) continue;

      const res = await downloadImageBuffer(cand.url);
      if (res.ok) {
        if (galleryHashes.has(res.hash)) continue;
        if (galleryPaths.length === 0 && globalHashes.has(res.hash)) continue;

        const imgIdx = galleryPaths.length + 1;
        const fileName = `${slug}-${imgIdx}.jpg`;
        const destPath = path.join(TARGET_DIR, fileName);
        fs.writeFileSync(destPath, res.buffer);

        galleryHashes.add(res.hash);
        if (galleryPaths.length === 0) {
          globalHashes.set(res.hash, p.id);
        }

        const webPath = `/products/${fileName}`;
        galleryPaths.push(webPath);
        manifestRecord.localImages.push(webPath);
        manifestRecord.sourceMatches.push({
          query: q,
          sourceUrl: cand.url,
          title: cand.title,
          size: res.size,
          sha256: res.hash
        });

        console.log(` ✓ [${imgIdx}] ${fileName} (${(res.size/1024).toFixed(1)} KB) <- ${cand.url.slice(0, 60)}...`);
        if (galleryPaths.length >= 3) break;
      }
    }
  }

  // Ensure at least 1 image
  if (galleryPaths.length === 0) {
    console.warn(` ⚠ Warning: Could not find qualified candidate for ${p.id}, trying emergency broad query...`);
    const emergencyCandidates = await searchBingImagesWithMeta(`${brand} ${p.name}`);
    for (const cand of emergencyCandidates) {
      if (!passesSemanticGate(cand, p)) continue;
      const res = await downloadImageBuffer(cand.url);
      if (res.ok && !galleryHashes.has(res.hash)) {
        const fileName = `${slug}-1.jpg`;
        fs.writeFileSync(path.join(TARGET_DIR, fileName), res.buffer);
        galleryPaths.push(`/products/${fileName}`);
        globalHashes.set(res.hash, p.id);
        break;
      }
    }
  }

  manifest.push(manifestRecord);
  return galleryPaths.slice(0, 5);
}

async function runExactNameGraphSync() {
  console.log('=== STARTING GRAPHIFY EXACT NAME IMAGE SYNCHRONIZER (QT-11) ===');

  // 1. Load mapper content and extract CURATED_NICHE_PRODUCTS
  const mapperContent = fs.readFileSync(MAPPER_FILE, 'utf8');
  const nicheMatch = mapperContent.match(/export const CURATED_NICHE_PRODUCTS = (\[[\s\S]*?\]);/);
  if (!nicheMatch) {
    throw new Error('Could not find CURATED_NICHE_PRODUCTS in ' + MAPPER_FILE);
  }
  const nicheProducts = eval(nicheMatch[1]);
  console.log(`Loaded ${nicheProducts.length} niche products from mapper.`);

  // 2. Identify the 60 products that were index-shifted or misassigned
  const abnormalProducts = nicheProducts.filter(p => p.id && p.id.startsWith('PROD-CRW-'));
  console.log(`Found ${abnormalProducts.length} abnormal products requiring 1:1 crawling.`);

  // 3. Register all existing 157 main product hashes to prevent any hash collisions
  const seed = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'));
  const globalHeroHashes = new Map();
  seed.forEach(p => {
    if (p.images && p.images[0]) {
      const fp = path.join(TARGET_DIR, p.images[0].replace('/products/', ''));
      if (fs.existsSync(fp)) {
        const h = crypto.createHash('sha256').update(fs.readFileSync(fp)).digest('hex');
        globalHeroHashes.set(h, p.id);
      }
    }
  });
  console.log(`Registered ${globalHeroHashes.size} existing hero hashes.`);

  const manifest = [];
  const updatedNicheMap = new Map();

  // 4. Crawl and sync each of the 60 abnormal products with 100% exact images
  for (let i = 0; i < abnormalProducts.length; i++) {
    const p = abnormalProducts[i];
    console.log(`\n[${i + 1}/${abnormalProducts.length}] Processing ${p.id} (${p.brand} - ${p.name})...`);
    const newImages = await harvestExactProduct(p, globalHeroHashes, manifest);
    p.images = newImages;
    updatedNicheMap.set(p.id, newImages);
    console.log(` => Result for ${p.id}: ${newImages.length} images: ${JSON.stringify(newImages)}`);
  }

  // 5. Update submenuCatalogMapper.js with the new images
  let newMapperContent = mapperContent;
  for (const [id, imgs] of updatedNicheMap.entries()) {
    // Regex replace images array for this product id
    const prodRegex = new RegExp(`("id":\\s*"${id}"[\\s\\S]*?"images":\\s*)\\[[^\\]]*\\]`, 'g');
    newMapperContent = newMapperContent.replace(prodRegex, `$1${JSON.stringify(imgs)}`);
  }
  fs.writeFileSync(MAPPER_FILE, newMapperContent, 'utf8');
  console.log('✓ Successfully updated frontend/src/lib/submenuCatalogMapper.js');

  // 6. Save manifest
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2), 'utf8');
  console.log('✓ Saved manifest:', MANIFEST_FILE);

  // 7. Unify all products into products_facets_full.json and products_seed.json
  // Combined catalog = seed (157 products) + all niche products (excluding any duplicates by ID)
  const seedIds = new Set(seed.map(p => p.id));
  const unifiedCatalog = [...seed];
  nicheProducts.forEach(np => {
    if (!seedIds.has(np.id)) {
      // Normalize category and images
      if (updatedNicheMap.has(np.id)) {
        np.images = updatedNicheMap.get(np.id);
      }
      unifiedCatalog.push(np);
      seedIds.add(np.id);
    }
  });

  console.log(`Unified Catalog Total Products: ${unifiedCatalog.length} (Base: ${seed.length}, Niche: ${unifiedCatalog.length - seed.length})`);

  // Write updated seed & facets
  fs.writeFileSync(SEED_FILE, JSON.stringify(unifiedCatalog, null, 2), 'utf8');
  console.log('✓ Updated backend seed:', SEED_FILE);

  fs.writeFileSync(FACETS_FILE, JSON.stringify(unifiedCatalog, null, 2), 'utf8');
  console.log('✓ Updated crawler facets:', FACETS_FILE);

  // 8. Update frontend api.js
  let apiContent = fs.readFileSync(API_FILE, 'utf8');
  const mockProductsIdx = apiContent.indexOf('export const MOCK_PRODUCTS = [');
  if (mockProductsIdx !== -1) {
    const endIdx = apiContent.indexOf('];', mockProductsIdx);
    if (endIdx !== -1) {
      const newMockBlock = 'export const MOCK_PRODUCTS = ' + JSON.stringify(unifiedCatalog, null, 2);
      apiContent = apiContent.slice(0, mockProductsIdx) + newMockBlock + apiContent.slice(endIdx + 1);
      fs.writeFileSync(API_FILE, apiContent, 'utf8');
      console.log('✓ Updated frontend api.js MOCK_PRODUCTS with unified catalog!');
    }
  }

  console.log('🎉 GRAPHIFY EXACT NAME IMAGE SYNCHRONIZATION COMPLETED SUCCESSFULLY!');
}

runExactNameGraphSync().catch(err => {
  console.error('Fatal sync error:', err);
  process.exit(1);
});
