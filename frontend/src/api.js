const API_BASE = '/api/v1';

export const USER_ROLES = {
  BUYER: { id: 'buyer-001', name: 'Nguyễn Văn Mua', role: 'BUYER', email: 'buyer@cosmetics.com' },
  SELLER: { id: 'seller-001', shopId: 'shop-001', name: 'Trần Thị Bán (Innisfree VN)', role: 'SELLER', email: 'seller@cosmetics.com' },
  ADMIN: { id: 'admin-001', name: 'Quản Trị Viên Sàn', role: 'ADMIN', email: 'admin@cosmetics.com' }
};

export function getAuthHeaders(user) {
  return {
    'Content-Type': 'application/json',
    'X-User-Id': user.id,
    'X-User-Role': user.role,
    'X-User-Email': user.email
  };
}

// 1. Catalog API
export async function fetchProducts(search = '', brand = '', skinType = '') {
  try {
    const params = new URLSearchParams();
    if (search) params.append('q', search);
    if (brand) params.append('brand', brand);
    if (skinType) params.append('skinType', skinType);
    const res = await fetch(`${API_BASE}/catalog/products?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      return data.data || [];
    }
  } catch (err) {
    console.warn('API error, using seed mock data:', err);
  }

  // Fallback seed products
  return [
    {
      id: 'prod-001',
      shopId: 'shop-001',
      name: 'Innisfree Green Tea Seed Hyaluronic Serum',
      brand: 'Innisfree',
      category: 'Serum',
      description: 'Tinh chất dưỡng ẩm chuyên sâu từ hạt trà xanh hữu cơ Jeju.',
      registrationNumber: 'CBMP-HN-2024-00123',
      targetSkinTypes: ['DRY', 'COMBINATION', 'SENSITIVE'],
      status: 'PUBLISHED',
      inciIngredients: [
        { name: 'Camellia Sinensis Leaf Extract', functionCategory: 'Antioxidant, Soothing', comedogenicRating: 0, irritationRating: 0, flagSensitive: false },
        { name: 'Sodium Hyaluronate', functionCategory: 'Humectant, Hydrating', comedogenicRating: 0, irritationRating: 0, flagSensitive: false },
        { name: 'Niacinamide', functionCategory: 'Brightening, Barrier Repair', comedogenicRating: 0, irritationRating: 0, flagSensitive: false },
        { name: 'Panthenol', functionCategory: 'Soothing, Provitamin B5', comedogenicRating: 0, irritationRating: 0, flagSensitive: false }
      ],
      variants: [
        { sku: 'INNI-GT-30ML', title: 'Chai 30ml', price: 350000, attributes: { volume: '30ml' } },
        { sku: 'INNI-GT-80ML', title: 'Chai 80ml', price: 650000, attributes: { volume: '80ml' } }
      ]
    },
    {
      id: 'prod-002',
      shopId: 'shop-001',
      name: 'La Roche-Posay Effaclar Duo+M Anti-Blemish',
      brand: 'La Roche-Posay',
      category: 'Treatment Cream',
      description: 'Kem dưỡng giảm mụn ngừa thâm mụn tái phát công thức Phylobioma.',
      registrationNumber: 'CBMP-HCM-2024-00567',
      targetSkinTypes: ['OILY', 'COMBINATION'],
      status: 'PUBLISHED',
      inciIngredients: [
        { name: 'Niacinamide', functionCategory: 'Anti-inflammatory', comedogenicRating: 0, irritationRating: 0, flagSensitive: false },
        { name: 'Salicylic Acid', functionCategory: 'BHA Exfoliant, Acne Care', comedogenicRating: 0, irritationRating: 1, flagSensitive: false },
        { name: 'Zinc PCA', functionCategory: 'Sebum Regulator', comedogenicRating: 0, irritationRating: 0, flagSensitive: false },
        { name: 'Aqua Posae Filiformis', functionCategory: 'Microbiome Balance', comedogenicRating: 0, irritationRating: 0, flagSensitive: false }
      ],
      variants: [
        { sku: 'LRP-DUO-40ML', title: 'Tuýp 40ml', price: 420000, attributes: { volume: '40ml' } }
      ]
    },
    {
      id: 'prod-003',
      shopId: 'shop-002',
      name: 'Cosrx Advanced Snail 96 Mucin Power Essence',
      brand: 'Cosrx',
      category: 'Essence',
      description: 'Tinh chất ốc sên 96% phục hồi tái tạo da căng mướt đàn hồi.',
      registrationNumber: 'CBMP-HN-2024-00890',
      targetSkinTypes: ['DRY', 'NORMAL', 'SENSITIVE'],
      status: 'PUBLISHED',
      inciIngredients: [
        { name: 'Snail Secretion Filtrate', functionCategory: 'Skin Repair, Elasticity', comedogenicRating: 0, irritationRating: 0, flagSensitive: false },
        { name: 'Betaine', functionCategory: 'Humectant', comedogenicRating: 0, irritationRating: 0, flagSensitive: false },
        { name: 'Sodium Hyaluronate', functionCategory: 'Deep Hydration', comedogenicRating: 0, irritationRating: 0, flagSensitive: false },
        { name: 'Allantoin', functionCategory: 'Skin Soothing', comedogenicRating: 0, irritationRating: 0, flagSensitive: false }
      ],
      variants: [
        { sku: 'COSRX-SNAIL-100ML', title: 'Chai 100ml', price: 320000, attributes: { volume: '100ml' } }
      ]
    }
  ];
}

// 2. Order API
export async function placeOrder(user, items, address) {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(user),
      body: JSON.stringify({
        shippingAddress: address || '123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
        items: items.map(i => ({
          productId: i.productId,
          variantSku: i.variantSku,
          shopId: i.shopId,
          productName: i.productName,
          variantTitle: i.variantTitle,
          unitPrice: i.price,
          quantity: i.quantity
        }))
      })
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('PlaceOrder backend unreachable, returning simulated order result', err);
  }

  // Simulated Split-order response for demonstration
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shopGroup = {};
  items.forEach(i => {
    if (!shopGroup[i.shopId]) shopGroup[i.shopId] = [];
    shopGroup[i.shopId].push(i);
  });

  return {
    success: true,
    data: {
      orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      status: 'PAID',
      totalAmount: total,
      subOrders: Object.keys(shopGroup).map(shopId => ({
        subOrderId: 'SUB-' + Math.floor(1000 + Math.random() * 9000),
        shopId: shopId,
        status: 'CONFIRMED',
        subTotal: shopGroup[shopId].reduce((s, it) => s + it.price * it.quantity, 0),
        items: shopGroup[shopId]
      }))
    }
  };
}

// 3. AI Advisor Stream Chat
export async function streamAdvisorChat(question, skinProfile, onChunk, onComplete, onError) {
  try {
    const response = await fetch(`${API_BASE}/ai/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, skinProfile })
    });

    if (!response.body) {
      throw new Error('ReadableStream not supported');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });
      const lines = text.split('\n');
      for (const line of lines) {
        if (line.startsWith('data:')) {
          const chunk = line.replace('data:', '').trim();
          if (chunk) {
            accumulated += chunk + ' ';
            onChunk(accumulated);
          }
        }
      }
    }
    onComplete(accumulated);
  } catch (err) {
    console.warn('Streaming error, falling back to simulated RAG generation:', err);
    // Simulated intelligent RAG analysis response
    const mockAdvice = `[AI Tư Vấn Mỹ Phẩm - RAG + INCI Analysis]:
Dựa trên hồ sơ da của bạn (${skinProfile?.skinType || 'Da hỗn hợp/nhạy cảm'}) và câu hỏi "${question}":

1. Phân tích thành phần INCI:
- Các sản phẩm chứa Niacinamide, Camellia Sinensis (Trà xanh Jeju) và Hyaluronic Acid rất thích hợp để củng cố hàng rào bảo vệ da và kiểm soát bã nhờn mà không gây bít tắc lỗ chân lông (Comedogenic rating = 0).
- Tránh các nồng độ cồn khô hoặc hương liệu nồng nếu bạn đang có tiền sử kích ứng.

2. Sản phẩm đề xuất từ gian hàng đã kiểm duyệt:
- Innisfree Green Tea Seed Hyaluronic Serum (Số CBMP: CBMP-HN-2024-00123)
- Cosrx Advanced Snail 96 Mucin Power Essence (Số CBMP: CBMP-HN-2024-00890)

3. Lưu ý an toàn: Hãy test thử sản phẩm ở vùng da quai hàm trong 24 giờ trước khi dùng toàn mặt!`;
    
    let current = '';
    const words = mockAdvice.split(' ');
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < words.length) {
        current += words[idx] + ' ';
        onChunk(current);
        idx++;
      } else {
        clearInterval(interval);
        onComplete(current);
      }
    }, 40);
  }
}
