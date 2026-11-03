// tools/cosmetics-crawler/generateFrontendCatalog.js
const fs = require('fs');
const path = require('path');

const CRAWLED_PATH = path.join(__dirname, 'output', 'products_catalog.json');
const API_JS_PATH = path.join(__dirname, '../../frontend/src/api.js');

const BRAND_ORIGINS = {
  'Romand': 'Hàn Quốc',
  'MAC': 'Mỹ',
  '3CE': 'Hàn Quốc',
  'Black Rouge': 'Hàn Quốc',
  'Bbia': 'Hàn Quốc',
  'Maybelline': 'Mỹ',
  'Dior': 'Pháp',
  'YSL': 'Pháp',
  'NARS': 'Mỹ',
  'Chanel': 'Pháp',
  'La Roche-Posay': 'Pháp',
  'Kiehl\'s': 'Mỹ',
  'Obagi': 'Mỹ',
  'SkinCeuticals': 'Mỹ',
  'Goodndoc': 'Hàn Quốc',
  'Torriden': 'Hàn Quốc',
  'I\'m From': 'Hàn Quốc',
  'Beauty of Joseon': 'Hàn Quốc',
  'Skin1004': 'Hàn Quốc',
  'The Ordinary': 'Canada',
  'Estee Lauder': 'Mỹ',
  'Olay': 'Mỹ',
  'Neutrogena': 'Mỹ',
  'L\'Oréal': 'Pháp',
  'CeraVe': 'Mỹ',
  'Bioderma': 'Pháp',
  'Simple': 'Anh',
  'Cosrx': 'Hàn Quốc',
  'Cetaphil': 'Canada',
  'SVR': 'Pháp',
  'Hada Labo': 'Nhật Bản',
  'Senka': 'Nhật Bản',
  'Kose': 'Nhật Bản',
  'Shu Uemura': 'Nhật Bản',
  'DHC': 'Nhật Bản',
  'Bifesta': 'Nhật Bản',
  'Anua': 'Hàn Quốc',
  'Innisfree': 'Hàn Quốc',
  'Clio': 'Hàn Quốc',
  'Espoir': 'Hàn Quốc',
  'Laneige': 'Hàn Quốc',
  'Canmake': 'Nhật Bản',
  'Rare Beauty': 'Mỹ',
  'Dasique': 'Hàn Quốc',
  'Jung Saem Mool': 'Hàn Quốc'
};

function main() {
  console.log('Loading crawled products from:', CRAWLED_PATH);
  const crawledProducts = JSON.parse(fs.readFileSync(CRAWLED_PATH, 'utf-8'));
  console.log(`Loaded ${crawledProducts.length} crawled products.`);

  // Transform each crawled product
  const formattedCrawled = crawledProducts.map((p, index) => {
    const brand = p.brand || 'Khác';
    const origin = BRAND_ORIGINS[brand] || 'Hàn Quốc';

    let category = p.category || 'Skincare';
    let subCategory = '';
    let concerns = [];

    if (category === 'Lipstick') {
      subCategory = 'Trang điểm môi & Son';
      concerns = ['Trang điểm', 'Dưỡng môi', 'Lâu trôi'];
    } else if (category === 'Skincare') {
      subCategory = 'Serum & Kem dưỡng';
      concerns = ['Dưỡng ẩm', 'Phục hồi', 'Lão hóa', 'Thâm nám'];
    } else if (category === 'Cleanser') {
      subCategory = 'Làm sạch sâu & Tẩy trang';
      concerns = ['Làm sạch', 'Lỗ chân lông', 'Mụn'];
    } else if (category === 'Foundation') {
      subCategory = 'Kem nền & Cushion';
      concerns = ['Che khuyết điểm', 'Kiềm dầu', 'Lâu trôi'];
    } else if (category === 'Blush') {
      subCategory = 'Phấn má hồng';
      concerns = ['Tươi tắn', 'Tự nhiên'];
    } else if (category === 'Eyeshadow') {
      subCategory = 'Bảng phấn mắt';
      concerns = ['Lấp lánh', 'Màu sắc'];
    } else {
      subCategory = category;
      concerns = ['Dưỡng ẩm', 'Phục hồi'];
    }

    const badges = [];
    if (index % 5 === 0) badges.push('Bán chạy');
    if (index % 3 === 0) badges.push(`-${15 + (index % 25)}%`);
    badges.push('Chính hãng');

    const rating = Number((4.6 + (index % 5) * 0.08).toFixed(1));
    const reviewCount = 85 + ((index * 37) % 450);
    const soldCount = 450 + ((index * 83) % 4500);

    const isFlashSale = (index % 7 === 0);
    const v0 = p.variants && p.variants[0];
    const basePrice = v0 ? v0.price : 200000;
    const baseOrig = v0 && v0.originalPrice ? v0.originalPrice : Math.round(basePrice * 1.25);
    const flashSalePrice = isFlashSale ? Math.round(basePrice * 0.8) : undefined;
    const flashSaleOriginal = isFlashSale ? baseOrig : undefined;

    const variants = (p.variants || []).map(v => ({
      sku: v.skuCode,
      skuCode: v.skuCode,
      title: v.name,
      name: v.name,
      price: v.price,
      originalPrice: v.originalPrice || Math.round(v.price * 1.25),
      attributes: v.attributes || {},
      inStock: true,
      stock: 100
    }));

    const ingredients = (p.ingredients || []).map(i => ({
      name: i.inciName,
      inciName: i.inciName,
      purpose: i.purpose,
      functionCategory: i.purpose,
      potentialIrritant: Boolean(i.potentialIrritant),
      comedogenicRating: i.comedogenicRating ?? 0,
      irritationRating: i.irritationRating ?? 0,
      safetyLevel: i.safetyLevel || 'SAFE',
      flagSensitive: Boolean(i.potentialIrritant)
    }));

    const skinTypes = p.suitableSkinTypes && p.suitableSkinTypes.length > 0 
      ? p.suitableSkinTypes 
      : ['NORMAL', 'DRY', 'OILY', 'COMBINATION'];

    return {
      id: p.id,
      shopId: p.shopId || '00000000-0000-0000-0000-000000000010',
      name: p.name,
      brand: brand,
      category: category,
      subCategory: subCategory,
      description: p.description,
      longDescription: p.description + ' Được nghiên cứu và kiểm định da liễu nghiêm ngặt, bảng thành phần minh bạch an toàn chuẩn quốc tế.',
      registrationNumber: p.registrationNo,
      origin: origin,
      targetSkinTypes: skinTypes,
      suitableSkinTypes: skinTypes,
      concerns: concerns,
      status: 'PUBLISHED',
      rating: rating,
      reviewCount: reviewCount,
      soldCount: soldCount,
      badges: badges,
      images: p.images && p.images.length > 0 ? p.images : [
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80'
      ],
      inStock: true,
      stockCount: 100,
      isFlashSale: isFlashSale,
      flashSalePrice: flashSalePrice,
      flashSaleOriginal: flashSaleOriginal,
      flashSaleSold: isFlashSale ? 35 : undefined,
      flashSaleTotal: isFlashSale ? 50 : undefined,
      inciIngredients: ingredients,
      ingredients: ingredients,
      variants: variants,
      vtoConfig: p.vtoConfig || null
    };
  });

  // Now read current frontend/src/api.js to preserve USER_ROLES, featured products, combos, vouchers, orders, etc.
  console.log('Reading current api.js...');
  const currentApiJs = fs.readFileSync(API_JS_PATH, 'utf-8');

  // Extract from beginning to `export const MOCK_PRODUCTS = [`
  const mockProductsIndex = currentApiJs.indexOf('export const MOCK_PRODUCTS = [');
  if (mockProductsIndex === -1) {
    throw new Error('Could not find export const MOCK_PRODUCTS in api.js');
  }

  const prefix = currentApiJs.slice(0, mockProductsIndex);

  // Extract the 20 featured items from current MOCK_PRODUCTS
  const combosIndex = currentApiJs.indexOf('// Combos Mock Catalog');
  if (combosIndex === -1) {
    throw new Error('Could not find // Combos Mock Catalog in api.js');
  }

  const suffix = currentApiJs.slice(combosIndex);

  // Extract current mock products JSON array string
  const mockProductsString = currentApiJs.slice(mockProductsIndex + 'export const MOCK_PRODUCTS = '.length, combosIndex).trim();
  // Strip trailing semicolon if any
  const cleanJsonString = mockProductsString.endsWith(';') ? mockProductsString.slice(0, -1) : mockProductsString;
  
  let existingProducts = [];
  try {
    existingProducts = eval(cleanJsonString);
    console.log(`Extracted ${existingProducts.length} initial products from api.js.`);
  } catch (err) {
    console.warn('Could not eval existing mock products, will keep only crawled products:', err.message);
  }

  // Merge: existing products first (so existing IDs like prod-001 stay intact), then all 130 crawled products
  // Also enrich existing products with both suitableSkinTypes and ingredients aliases
  const enrichedExisting = existingProducts.map(ep => ({
    ...ep,
    suitableSkinTypes: ep.suitableSkinTypes || ep.targetSkinTypes || ['NORMAL', 'DRY', 'OILY', 'COMBINATION'],
    targetSkinTypes: ep.targetSkinTypes || ep.suitableSkinTypes || ['NORMAL', 'DRY', 'OILY', 'COMBINATION'],
    ingredients: ep.ingredients || ep.inciIngredients || [],
    inciIngredients: ep.inciIngredients || ep.ingredients || [],
    variants: (ep.variants || []).map(v => ({
      ...v,
      skuCode: v.skuCode || v.sku,
      sku: v.sku || v.skuCode,
      name: v.name || v.title,
      title: v.title || v.name
    }))
  }));

  const allMergedProducts = [...enrichedExisting, ...formattedCrawled];
  console.log(`Total combined products: ${allMergedProducts.length}`);

  const newMockProductsJs = `export const MOCK_PRODUCTS = ${JSON.stringify(allMergedProducts, null, 2)};\n\n`;

  const newApiJsContent = prefix + newMockProductsJs + suffix;
  fs.writeFileSync(API_JS_PATH, newApiJsContent, 'utf-8');
  console.log(`✅ Successfully updated ${API_JS_PATH} with ${allMergedProducts.length} products!`);
}

main();
