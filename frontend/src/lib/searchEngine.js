/**
 * Aura Beauty Mall - Smart Search Engine (Multi-Field & Token-Based Matching)
 * Handles Vietnamese text normalization, accent stripping, special characters, and ranking.
 */

// 1. Vietnamese Accent Stripping
export function removeVietnameseAccents(str = '') {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd');
}

// 2. Search Text Normalization
export function normalizeSearchText(str = '') {
  return removeVietnameseAccents(str)
    .toLowerCase()
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .trim();
}

// 3. Safe Regex Escaping
export function escapeRegex(str = '') {
  return String(str || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 4. Common Active Ingredients Synonyms & Vietnamese Keyword Mapping
export const ACTIVE_GROUP_SYNONYMS = {
  HYDRATION: [
    'ha', 'hyaluronic', 'hyaluronic acid', 'b5', 'panthenol',
    'ceramide', 'cap am', 'duong am', 'giu am', 'khoa am'
  ],
  EXFOLIATION: [
    'bha', 'aha', 'pha', 'lha', 'salicylic', 'salicylic acid',
    'glycolic', 'glycolic acid', 'lactic acid', 'tay da chet', 'tay te bao chet'
  ],
  BRIGHTENING: [
    'vitamin c', 'vit c', 'ascorbic', 'niacinamide', 'arbutin',
    'alpha arbutin', 'tranexamic acid', 'sang da', 'mo tham', 'trang da', 'deu mau da'
  ],
  ANTI_AGING: [
    'retinol', 'retinoid', 'retinal', 'peptide', 'peptides',
    'bakuchiol', 'collagen', 'chong lao hoa', 'tre hoa', 'cang bong'
  ],
  SOOTHING_BOTANICAL: [
    'rau ma', 'centella', 'diep ca', 'heartleaf', 'tram tra',
    'tea tree', 'hoa cuc', 'calendula', 'aloe', 'nha dam', 'lam diu', 'phuc hoi'
  ],
  UV_FILTERS: [
    'chong nang', 'kem chong nang', 'sunscreen', 'sunblock',
    'zinc oxide', 'titanium dioxide', 'mexoryl', 'tinosorb'
  ]
};

// 5. Build Comprehensive Search Haystack for a Product
export function getProductSearchHaystack(p) {
  if (!p) return { raw: '', normalized: '', nameNorm: '', brandNorm: '' };

  const inciTexts = (p.inciIngredients || []).map((i) => {
    if (!i) return '';
    if (typeof i === 'string') return i;
    return i.inciName || i.name || '';
  });

  const variantTexts = (p.variants || []).flatMap((v) => [
    v.name,
    v.skuCode,
    v.attributes?.Shade,
    v.attributes?.Color,
    v.attributes?.Finish
  ]).filter(Boolean);

  const shadeTexts = (p.vtoConfig?.shades || []).map((s) => s.shadeName).filter(Boolean);

  const activeSynonyms = (p.keyActiveGroups || []).flatMap((g) => ACTIVE_GROUP_SYNONYMS[g] || []);

  const concernsTexts = [
    ...(p.skinConcerns || []),
    ...(p.concerns || []),
    ...(p.targetSkinTypes || [])
  ];

  const rawParts = [
    p.name,
    p.title,
    p.brand,
    p.category,
    p.subCategory,
    ...(p.categoryPath || []),
    p.description,
    ...concernsTexts,
    ...(p.keyActiveGroups || []),
    ...activeSynonyms,
    ...inciTexts,
    ...variantTexts,
    ...shadeTexts
  ].filter(Boolean);

  const raw = rawParts.join(' ');
  const normalized = normalizeSearchText(raw);
  const nameNorm = normalizeSearchText(p.name || p.title || '');
  const brandNorm = normalizeSearchText(p.brand || '');

  return { raw, normalized, nameNorm, brandNorm };
}

// 6. Match Single Product Against Query (Exact + Token-Based)
export function matchProduct(product, rawQuery) {
  if (!rawQuery || !rawQuery.trim()) return { matched: true, score: 0 };
  const query = rawQuery.trim();
  const qNorm = normalizeSearchText(query);
  if (!qNorm) return { matched: true, score: 0 };

  const { normalized, nameNorm, brandNorm } = getProductSearchHaystack(product);

  // Priority 1: Exact or Substring match
  const isExactName = nameNorm === qNorm;
  const isSubstringName = nameNorm.includes(qNorm);
  const isBrandMatch = brandNorm.includes(qNorm);
  const isSubstringHaystack = normalized.includes(qNorm);

  // Priority 2: All-Tokens match
  const tokens = qNorm.split(' ').filter(Boolean);
  const allTokensInName = tokens.length > 0 && tokens.every((t) => nameNorm.includes(t));
  const allTokensInHaystack = tokens.length > 0 && tokens.every((t) => normalized.includes(t));

  const matched = isExactName || isSubstringName || isBrandMatch || isSubstringHaystack || allTokensInName || allTokensInHaystack;

  if (!matched) return { matched: false, score: 0 };

  // Calculate Ranking Score
  let score = 0;
  if (isExactName) score += 2000;
  if (isSubstringName) score += 1000;
  if (allTokensInName) score += 800;
  if (isBrandMatch) score += 500;
  if (isSubstringHaystack) score += 300;
  if (allTokensInHaystack) score += 200;

  // Popularity & Rating bonus
  score += Math.min(100, Math.round((product.soldCount || 0) / 100));
  score += Math.round((product.rating || 0) * 10);

  return { matched: true, score };
}

// 7. Search & Rank Entire Catalog
export function searchCatalogProducts(products = [], query = '') {
  if (!query || !query.trim()) return products;
  const matches = [];
  for (const p of products) {
    if (!p) continue;
    const res = matchProduct(p, query);
    if (res.matched) {
      matches.push({ product: p, score: res.score });
    }
  }
  matches.sort((a, b) => b.score - a.score);
  return matches.map((m) => m.product);
}
