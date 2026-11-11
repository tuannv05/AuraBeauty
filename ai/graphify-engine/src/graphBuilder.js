/**
 * COSMETICS & INCI KNOWLEDGE GRAPH BUILDER (Graphify Engine)
 * Reads all 157 products, maps INCI actives, skin types, concerns, synergies & conflicts.
 * Generates an Enterprise-grade Knowledge Graph compliant with Graphify-Labs architecture.
 */

const fs = require('fs');
const path = require('path');

const SEED_FILE = path.resolve(__dirname, '../../../backend/catalog-service/src/main/resources/products_seed.json');
const OUTPUT_DIR = path.resolve(__dirname, '../output');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'cosmetics_knowledge_graph.json');
const FRONTEND_COPY_FILE = path.resolve(__dirname, '../../../frontend/src/features/graphify/cosmetics_knowledge_graph.json');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 1. Clinical Dermatology Actives Taxonomy
const KEY_ACTIVES_DEFINITIONS = [
  {
    id: 'ING:NIACINAMIDE',
    label: 'Niacinamide (Vitamin B3)',
    category: 'BRIGHTENING_BARRIER',
    keywords: ['niacinamide', 'nicotinamide', 'vitamin b3'],
    comedogenic: 0,
    irritation: 0,
    color: '#3B82F6',
    description: 'Kháng viêm, kiểm soát bã nhờn, làm sáng mờ thâm và củng cố hàng rào ceramide tự nhiên.'
  },
  {
    id: 'ING:RETINOL',
    label: 'Retinol / Retinoids',
    category: 'ANTI_AGING',
    keywords: ['retinol', 'retinal', 'tretinoin', 'adapalene', 'hydroxypinacolone retinoate'],
    comedogenic: 0,
    irritation: 2,
    color: '#8B5CF6',
    description: 'Dẫn xuất Vitamin A tái tạo tế bào, tăng sinh collagen, mờ nếp nhăn và cải thiện kết cấu da.'
  },
  {
    id: 'ING:SALICYLIC_ACID',
    label: 'Salicylic Acid (BHA)',
    category: 'EXFOLIANT',
    keywords: ['salicylic acid', 'betaine salicylate', 'bha'],
    comedogenic: 0,
    irritation: 1,
    color: '#EC4899',
    description: 'Acid tan trong dầu len lỏi vào lỗ chân lông, dọn sạch bã nhờn, tẩy tế bào chết và trị mụn ẩn.'
  },
  {
    id: 'ING:HYALURONIC_ACID',
    label: 'Hyaluronic Acid (HA)',
    category: 'HYDRATION',
    keywords: ['hyaluronic acid', 'sodium hyaluronate', 'hydrolyzed hyaluronic acid'],
    comedogenic: 0,
    irritation: 0,
    color: '#06B6D4',
    description: 'Chất hút ẩm siêu việt, giữ nước gấp 1000 lần trọng lượng phân tử, làm căng mọng da.'
  },
  {
    id: 'ING:PANTHENOL_B5',
    label: 'Panthenol (Vitamin B5)',
    category: 'SOOTHING_REPAIR',
    keywords: ['panthenol', 'dexpanthenol', 'vitamin b5'],
    comedogenic: 0,
    irritation: 0,
    color: '#10B981',
    description: 'Phục hồi lớp màng lipid, làm dịu kích ứng, giảm mẩn đỏ và tăng tốc độ lành vết thương.'
  },
  {
    id: 'ING:CENTELLA',
    label: 'Centella Asiatica (Rau má)',
    category: 'SOOTHING_REPAIR',
    keywords: ['centella asiatica', 'madecassoside', 'asiaticoside', 'asiatic acid'],
    comedogenic: 0,
    irritation: 0,
    color: '#14B8A6',
    description: 'Chiết xuất thảo dược rau má kháng viêm mạnh mẽ, thanh lọc làn da mụn nhạy cảm.'
  },
  {
    id: 'ING:VITAMIN_C',
    label: 'Vitamin C (L-Ascorbic Acid / Derivatives)',
    category: 'ANTIOXIDANT',
    keywords: ['ascorbic acid', 'ethyl ascorbic acid', 'ascorbyl glucoside', 'vitamin c'],
    comedogenic: 0,
    irritation: 1,
    color: '#F59E0B',
    description: 'Chống oxy hóa vô hiệu hóa gốc tự do, tăng đề kháng cho da trước tia UV và làm mờ thâm nám.'
  },
  {
    id: 'ING:CERAMIDE',
    label: 'Ceramides (NP/AP/EOP)',
    category: 'BARRIER_LIPID',
    keywords: ['ceramide np', 'ceramide ap', 'ceramide eop', 'ceramides'],
    comedogenic: 0,
    irritation: 0,
    color: '#6366F1',
    description: 'Chất vữa sinh học gắn kết tế bào sừng, ngăn ngừa mất nước qua biểu bì (TEWL).'
  },
  {
    id: 'ING:ZINC_OXIDE',
    label: 'Zinc Oxide / Zinc PCA',
    category: 'SUNSCREEN_MINERAL',
    keywords: ['zinc oxide', 'zinc pca'],
    comedogenic: 0,
    irritation: 0,
    color: '#64748B',
    description: 'Màng lọc khoáng vô cơ bảo vệ phổ rộng UVA/UVB và hỗ trợ kháng khuẩn kiềm dầu.'
  },
  {
    id: 'ING:PEPTIDES',
    label: 'Peptides Complex',
    category: 'ANTI_AGING',
    keywords: ['peptide', 'copper tripeptide', 'palmitoyl tripeptide', 'oligopeptide'],
    comedogenic: 0,
    irritation: 0,
    color: '#A855F7',
    description: 'Chuỗi acid amin phát tín hiệu kích hoạt tái sinh collagen, săn chắc cơ mặt.'
  }
];

// 2. Clinical Synergy Pairs (Green #10B981)
const CLINICAL_SYNERGIES = [
  {
    source: 'ING:NIACINAMIDE',
    target: 'ING:SALICYLIC_ACID',
    relationship: 'SYNERGY_WITH',
    color: '#10B981',
    description: 'Niacinamide làm dịu da và củng cố hàng rào ẩm trong khi BHA làm sạch sâu lỗ chân lông, giảm tối đa châm chích.'
  },
  {
    source: 'ING:HYALURONIC_ACID',
    target: 'ING:PANTHENOL_B5',
    relationship: 'SYNERGY_WITH',
    color: '#10B981',
    description: 'Bộ đôi cấp nước tầng sâu HA + khóa ẩm phục hồi B5 tạo màng bảo vệ kép căng bóng mịn màng.'
  },
  {
    source: 'ING:VITAMIN_C',
    target: 'ING:ZINC_OXIDE',
    relationship: 'SYNERGY_WITH',
    color: '#10B981',
    description: 'Dùng Vitamin C trước kem chống nắng Zinc Oxide tăng gấp đôi khả năng bảo vệ trước gốc tự do và tia cực tím.'
  },
  {
    source: 'ING:RETINOL',
    target: 'ING:CERAMIDE',
    relationship: 'SYNERGY_WITH',
    color: '#10B981',
    description: 'Ceramides đệm ẩm sinh học, triệt tiêu phản ứng bong tróc rát đỏ khi bắt đầu dùng Retinoids.'
  },
  {
    source: 'ING:CENTELLA',
    target: 'ING:PANTHENOL_B5',
    relationship: 'SYNERGY_WITH',
    color: '#10B981',
    description: 'Rau má Madecassoside kết hợp B5 làm dịu tức thì 80% mẩn đỏ và phục hồi hàng rào da tổn thương sau 48h.'
  },
  {
    source: 'ING:RETINOL',
    target: 'ING:PEPTIDES',
    relationship: 'SYNERGY_WITH',
    color: '#10B981',
    description: 'Cặp đôi vàng chống lão hóa: Retinol kích thích thay mới tế bào, Peptides tái tạo cấu trúc ma trận collagen.'
  }
];

// 3. Clinical Conflict Pairs (Red #EF4444)
const CLINICAL_CONFLICTS = [
  {
    source: 'ING:RETINOL',
    target: 'ING:SALICYLIC_ACID',
    relationship: 'CONFLICTS_WITH',
    color: '#EF4444',
    description: 'NGUY HIỂM: Dùng chung cùng buổi làm mỏng sừng quá mức, gây đỏ rát, châm chích và suy yếu màng bảo vệ da.'
  },
  {
    source: 'ING:RETINOL',
    target: 'ING:VITAMIN_C',
    relationship: 'CONFLICTS_WITH',
    color: '#EF4444',
    description: 'XUNG ĐỘT pH: Vitamin C cần môi trường acid (pH < 3.5), Retinol hoạt động tối ưu ở pH trung tính (5.5 - 6.5). Nên tách: C sáng, Retinol tối.'
  },
  {
    source: 'ING:SALICYLIC_ACID',
    target: 'ING:VITAMIN_C',
    relationship: 'CONFLICTS_WITH',
    color: '#EF4444',
    description: 'CẢNH BÁO: Cả hai đều có tính acid cao, dùng đồng thời dễ gây kích ứng quá tải trên da nhạy cảm.'
  },
  {
    source: 'ING:PEPTIDES',
    target: 'ING:SALICYLIC_ACID',
    relationship: 'CONFLICTS_WITH',
    color: '#EF4444',
    description: 'Acid mạnh làm biến tính chuỗi peptide, bẻ gãy liên kết sinh học và làm mất tác dụng chống lão hóa.'
  }
];

// 4. Skin Types Taxonomy
const SKIN_TYPES = [
  { id: 'SKIN_TYPE:OILY', label: 'Da Dầu', color: '#0EA5E9', desc: 'Đổ dầu vùng chữ T và hai bên má, dễ bít tắc lỗ chân lông.' },
  { id: 'SKIN_TYPE:DRY', label: 'Da Khô', color: '#F97316', desc: 'Thiếu ẩm, dễ khô căng, bong tróc nứt nẻ khi gặp lạnh.' },
  { id: 'SKIN_TYPE:COMBINATION', label: 'Da Hỗn Hợp', color: '#8B5CF6', desc: 'Dầu vùng chữ T (trán, mũi, cằm) nhưng khô hai bên má.' },
  { id: 'SKIN_TYPE:SENSITIVE', label: 'Da Nhạy Cảm', color: '#EF4444', desc: 'Rất dễ mẩn đỏ, ngứa rát khi tiếp xúc mỹ phẩm lạ hoặc thời tiết.' },
  { id: 'SKIN_TYPE:NORMAL', label: 'Da Thường', color: '#10B981', desc: 'Khỏe mạnh, cân bằng độ ẩm và bã nhờn lý tưởng.' }
];

// 5. Skin Concerns Taxonomy
const SKIN_CONCERNS = [
  { id: 'CONCERN:ACNE', label: 'Mụn Ẩn & Mụn Viêm', color: '#E11D48', targetActives: ['ING:SALICYLIC_ACID', 'ING:NIACINAMIDE', 'ING:CENTELLA'] },
  { id: 'CONCERN:PORES', label: 'Lỗ Chân Lông To', color: '#D97706', targetActives: ['ING:NIACINAMIDE', 'ING:SALICYLIC_ACID'] },
  { id: 'CONCERN:PIGMENTATION', label: 'Thâm Đỏ / Thâm Nâu (PIE/PIH)', color: '#7C3AED', targetActives: ['ING:VITAMIN_C', 'ING:NIACINAMIDE', 'ING:RETINOL'] },
  { id: 'CONCERN:AGING', label: 'Lão Hóa & Nếp Nhăn', color: '#4F46E5', targetActives: ['ING:RETINOL', 'ING:PEPTIDES', 'ING:CERAMIDE'] },
  { id: 'CONCERN:DEHYDRATION', label: 'Khô Ráp & Mất Nước', color: '#0284C7', targetActives: ['ING:HYALURONIC_ACID', 'ING:PANTHENOL_B5', 'ING:CERAMIDE'] },
  { id: 'CONCERN:REDNESS', label: 'Mẩn Đỏ & Hàng Rào Yếu', color: '#059669', targetActives: ['ING:PANTHENOL_B5', 'ING:CENTELLA', 'ING:CERAMIDE'] }
];

// 6. Main Builder Function
function buildCosmeticsKnowledgeGraph() {
  console.log('Loading seed products from:', SEED_FILE);
  const products = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'));
  console.log(`Analyzing ${products.length} products...`);

  const nodes = [];
  const edges = [];
  const nodeMap = new Map();

  function addNode(n) {
    if (!nodeMap.has(n.id)) {
      nodeMap.set(n.id, n);
      nodes.push(n);
    }
  }

  function addEdge(e) {
    // Avoid exact duplicate edges
    const exists = edges.some(existing => 
      existing.source === e.source && 
      existing.target === e.target && 
      existing.relationship === e.relationship
    );
    if (!exists) {
      edges.push(e);
    }
  }

  // 1. Add Skin Types
  SKIN_TYPES.forEach(st => {
    addNode({
      id: st.id,
      label: st.label,
      type: 'SKIN_TYPE',
      category: 'SKIN_TYPE',
      color: st.color,
      val: 20,
      description: st.desc
    });
  });

  // 2. Add Skin Concerns
  SKIN_CONCERNS.forEach(sc => {
    addNode({
      id: sc.id,
      label: sc.label,
      type: 'SKIN_CONCERN',
      category: 'SKIN_CONCERN',
      color: sc.color,
      val: 22,
      description: `Vấn đề da mục tiêu: ${sc.label}`
    });

    // Link Concern -> Target Actives
    sc.targetActives.forEach(activeId => {
      addEdge({
        source: activeId,
        target: sc.id,
        relationship: 'TREATS_CONCERN',
        color: '#6366F1',
        description: `Hoạt chất điều trị hiệu quả vấn đề ${sc.label}`
      });
    });
  });

  // 3. Add Key Active Ingredients
  KEY_ACTIVES_DEFINITIONS.forEach(act => {
    addNode({
      id: act.id,
      label: act.label,
      type: 'INGREDIENT',
      category: act.category,
      color: act.color,
      val: 26,
      comedogenicRating: act.comedogenic,
      irritationRating: act.irritation,
      description: act.description
    });
  });

  // 4. Add Synergies & Conflicts
  CLINICAL_SYNERGIES.forEach(s => addEdge(s));
  CLINICAL_CONFLICTS.forEach(c => addEdge(c));

  // 5. Add Products & Extracted Relationships
  const brandsSet = new Set();

  products.forEach(p => {
    const pNodeId = `PRODUCT:${p.id}`;
    addNode({
      id: pNodeId,
      rawId: p.id,
      label: p.name,
      type: 'PRODUCT',
      category: p.category || 'Mỹ phẩm',
      brand: p.brand,
      price: p.price,
      image: (p.images && p.images[0]) || p.image,
      images: p.images || [p.image],
      rating: p.rating || 4.8,
      cbmpNumber: p.registrationNumber || p.registrationNo || 'CBMP-QLD',
      color: '#F43F5E',
      val: 18,
      inStock: p.inStock !== false
    });

    // Brand node & edge
    if (p.brand) {
      const bNodeId = `BRAND:${p.brand.toUpperCase().replace(/\s+/g, '_')}`;
      if (!brandsSet.has(bNodeId)) {
        brandsSet.add(bNodeId);
        addNode({
          id: bNodeId,
          label: p.brand,
          type: 'BRAND',
          category: 'BRAND',
          color: '#475569',
          val: 16,
          description: `Thương hiệu mỹ phẩm chính hãng ${p.brand}`
        });
      }
      addEdge({
        source: pNodeId,
        target: bNodeId,
        relationship: 'MANUFACTURED_BY',
        color: '#94A3B8',
        description: `Sản phẩm thuộc thương hiệu ${p.brand}`
      });
    }

    // Match Inci Ingredients
    const incis = p.inciIngredients || [];
    const allIngredientsText = incis.map(i => (typeof i === 'string' ? i : i.inciName || '')).join(' ').toLowerCase() + ' ' + (p.description || '').toLowerCase() + ' ' + (p.name || '').toLowerCase();

    let matchedActives = 0;
    KEY_ACTIVES_DEFINITIONS.forEach(active => {
      const isMatched = active.keywords.some(kw => allIngredientsText.includes(kw));
      if (isMatched) {
        matchedActives++;
        addEdge({
          source: pNodeId,
          target: active.id,
          relationship: 'CONTAINS_ACTIVE',
          color: active.color,
          description: `Sản phẩm chứa hoạt chất ${active.label}`
        });

        // Infer product treats concern based on active
        SKIN_CONCERNS.forEach(sc => {
          if (sc.targetActives.includes(active.id)) {
            addEdge({
              source: pNodeId,
              target: sc.id,
              relationship: 'TREATS_CONCERN',
              color: '#F43F5E',
              description: `Giải quyết vấn đề ${sc.label} nhờ chứa ${active.label}`
            });
          }
        });
      }
    });

    // Infer Skin Type compatibility
    const targetTypes = p.targetSkinTypes || [];
    if (targetTypes.includes('OILY') || allIngredientsText.includes('da dầu') || allIngredientsText.includes('kiềm dầu')) {
      addEdge({ source: pNodeId, target: 'SKIN_TYPE:OILY', relationship: 'SUITABLE_FOR', color: '#0EA5E9', description: 'Phù hợp cho da dầu' });
    }
    if (targetTypes.includes('DRY') || allIngredientsText.includes('da khô') || allIngredientsText.includes('cấp ẩm')) {
      addEdge({ source: pNodeId, target: 'SKIN_TYPE:DRY', relationship: 'SUITABLE_FOR', color: '#F97316', description: 'Phù hợp cho da khô' });
    }
    if (targetTypes.includes('SENSITIVE') || allIngredientsText.includes('da nhạy cảm') || allIngredientsText.includes('dịu nhẹ')) {
      addEdge({ source: pNodeId, target: 'SKIN_TYPE:SENSITIVE', relationship: 'SUITABLE_FOR', color: '#EF4444', description: 'An toàn cho da nhạy cảm' });
    }
  });

  const knowledgeGraph = {
    metadata: {
      generatedAt: new Date().toISOString(),
      totalProducts: products.length,
      totalNodes: nodes.length,
      totalEdges: edges.length,
      version: '2.0.0',
      standard: 'Graphify-Labs Clean-room Architecture'
    },
    taxonomy: {
      activeDefinitions: KEY_ACTIVES_DEFINITIONS,
      synergies: CLINICAL_SYNERGIES,
      conflicts: CLINICAL_CONFLICTS,
      skinTypes: SKIN_TYPES,
      skinConcerns: SKIN_CONCERNS
    },
    nodes,
    edges
  };

  console.log('--- KNOWLEDGE GRAPH GENERATED SUCCESSFULLY ---');
  console.log(`Total Nodes: ${nodes.length}`);
  console.log(`Total Edges: ${edges.length}`);
  console.log(`- Products: ${nodes.filter(n => n.type === 'PRODUCT').length}`);
  console.log(`- Ingredients: ${nodes.filter(n => n.type === 'INGREDIENT').length}`);
  console.log(`- Brands: ${nodes.filter(n => n.type === 'BRAND').length}`);
  console.log(`- Skin Types: ${nodes.filter(n => n.type === 'SKIN_TYPE').length}`);
  console.log(`- Skin Concerns: ${nodes.filter(n => n.type === 'SKIN_CONCERN').length}`);
  console.log(`- Synergy Edges: ${edges.filter(e => e.relationship === 'SYNERGY_WITH').length}`);
  console.log(`- Conflict Edges: ${edges.filter(e => e.relationship === 'CONFLICTS_WITH').length}`);

  // Write output
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(knowledgeGraph, null, 2), 'utf8');
  console.log('Saved to:', OUTPUT_FILE);

  // Copy to frontend for zero-latency client-side rendering
  const frontendDir = path.dirname(FRONTEND_COPY_FILE);
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }
  fs.writeFileSync(FRONTEND_COPY_FILE, JSON.stringify(knowledgeGraph, null, 2), 'utf8');
  console.log('Copied to frontend:', FRONTEND_COPY_FILE);

  return knowledgeGraph;
}

if (require.main === module) {
  buildCosmeticsKnowledgeGraph();
}

module.exports = { buildCosmeticsKnowledgeGraph };
