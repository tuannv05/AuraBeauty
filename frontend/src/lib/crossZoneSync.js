// ============================================================================
// CROSS-ZONE STATE & EVENT SYNCHRONIZATION BUS (SELLER ↔ BUYER ↔ ADMIN)
// Aura Beauty Mall Platform - Multi-tenant Isolation & Reactive Sync
// ============================================================================

const STORAGE_KEYS = {
  PRODUCTS: 'aura_sync_products',
  ORDERS: 'aura_sync_orders',
  DISPUTES: 'aura_sync_disputes',
  FINANCE: 'aura_sync_finance',
  MARKETING: 'aura_sync_marketing',
  SHOP_SETTINGS: 'aura_sync_shop_settings',
  NOTIFICATIONS: 'aura_sync_notifications'
};

const SYNC_EVENT = 'aura:cross-zone-sync';

// Default Demo Shops
export const DEMO_SHOPS = [
  {
    id: '00000000-0000-0000-0000-000000000010',
    slug: 'innisfree-official',
    name: 'Innisfree Official Store Vietnam',
    brand: 'Innisfree',
    isMall: true,
    logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&auto=format&fit=crop&q=80',
    cbmpLicense: '19820/24/CBMP-QLD',
    address: 'Kho Tổng KCN Tân Bình, TP. Hồ Chí Minh',
    hotline: '1900 6868',
    rating: 4.9,
    followers: 128400,
    vacationMode: false
  },
  {
    id: '00000000-0000-0000-0000-000000000020',
    slug: 'larocheposay-official',
    name: 'La Roche-Posay Dược Mỹ Phẩm Pháp',
    brand: 'La Roche-Posay',
    isMall: true,
    logo: 'https://images.unsplash.com/photo-1556228722-d0b7b15a6390?w=100&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200&auto=format&fit=crop&q=80',
    cbmpLicense: '21045/24/CBMP-QLD',
    address: 'Kho Dược Mỹ Phẩm Long Hậu, Cần Giuộc, Long An',
    hotline: '1800 5454',
    rating: 4.95,
    followers: 245000,
    vacationMode: false
  },
  {
    id: '00000000-0000-0000-0000-000000000030',
    slug: 'anua-official',
    name: 'Anua Official Store Korea',
    brand: 'Anua',
    isMall: true,
    logo: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=100&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1512290900672-1f02e6a0ee37?w=1200&auto=format&fit=crop&q=80',
    cbmpLicense: 'CBMP-100005/24/CBMP-QLD',
    address: 'Kho Ngoại Quan Cát Lái, TP. Thủ Đức, TP. HCM',
    hotline: '1900 7878',
    rating: 4.88,
    followers: 95400,
    vacationMode: false
  }
];

// Helper to safely load JSON
function loadStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(`[CrossZoneSync] Failed to read ${key}:`, e);
  }
  return fallback;
}

// Helper to safely save JSON and broadcast
function saveStorage(key, data, broadcastDetail = {}) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key, ...broadcastDetail, timestamp: Date.now() } }));
    }
  } catch (e) {
    console.warn(`[CrossZoneSync] Failed to save ${key}:`, e);
  }
}

// Initial Mock Orders
const DEFAULT_ORDERS = [
  {
    subOrderId: 'SUB-ORD-882341-S01',
    masterOrderId: 'ORD-882341',
    shopId: '00000000-0000-0000-0000-000000000010',
    shopName: 'Innisfree Official Store Vietnam',
    buyerName: 'Nguyễn Văn Mua',
    buyerPhone: '0901234567',
    shippingAddress: 'Tòa nhà Landmark 81, Quận Bình Thạnh, TP. Hồ Chí Minh',
    items: [
      {
        productId: 'prod-001',
        skuCode: 'INNI-GT-80ML',
        productName: 'Innisfree Green Tea Seed Hyaluronic Serum',
        variantTitle: 'Chai 80ml (Fullsize)',
        batchNo: 'LOT-202410-01',
        expDate: '2027-10-15',
        unitPrice: 620000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&auto=format&fit=crop&q=80'
      }
    ],
    carrier: 'Giao Hàng Tiết Kiệm (GHTK)',
    trackingCode: 'GHTK-SG-88234101',
    shippingMethod: 'EXPRESS_2H',
    shippingFee: 0,
    totalAmount: 620000,
    discountAmount: 0,
    commissionAmount: 62000, // 10%
    sellerAmount: 558000,    // 90%
    status: 'PENDING_CONFIRMATION', // 'PENDING_CONFIRMATION' | 'PROCESSING' | 'SHIPPING' | 'DELIVERED' | 'COMPLETED' | 'RETURN_REQUESTED' | 'CANCELLED'
    createdAt: '11/11/2026 14:20',
    slaDeadline: '12/11/2026 14:20'
  },
  {
    subOrderId: 'SUB-ORD-882342-S01',
    masterOrderId: 'ORD-882342',
    shopId: '00000000-0000-0000-0000-000000000010',
    shopName: 'Innisfree Official Store Vietnam',
    buyerName: 'Trần Thị Thu Hà',
    buyerPhone: '0988776655',
    shippingAddress: '24 Đường số 7, KDC Him Lam, Quận 7, TP. Hồ Chí Minh',
    items: [
      {
        productId: 'prod-002',
        skuCode: 'INNI-CB-50ML',
        productName: 'Innisfree Cherry Blossom Glow Jelly Cream',
        variantTitle: 'Hũ 50ml',
        batchNo: 'LOT-202409-12',
        expDate: '2027-09-01',
        unitPrice: 480000,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&auto=format&fit=crop&q=80'
      }
    ],
    carrier: 'Shopee Xpress (SPX)',
    trackingCode: 'SPX-VN-88234202',
    shippingMethod: 'STANDARD',
    shippingFee: 22000,
    totalAmount: 960000,
    discountAmount: 20000,
    commissionAmount: 94000,
    sellerAmount: 846000,
    status: 'PROCESSING', // Chờ lấy hàng
    createdAt: '11/11/2026 11:30',
    slaDeadline: '12/11/2026 18:00'
  },
  {
    subOrderId: 'SUB-ORD-882343-S01',
    masterOrderId: 'ORD-882343',
    shopId: '00000000-0000-0000-0000-000000000010',
    shopName: 'Innisfree Official Store Vietnam',
    buyerName: 'Phạm Minh Quân',
    buyerPhone: '0912348899',
    shippingAddress: 'Tầng 12, Keangnam Landmark 72, Nam Từ Liêm, Hà Nội',
    items: [
      {
        productId: 'prod-001',
        skuCode: 'INNI-GT-30ML',
        productName: 'Innisfree Green Tea Seed Hyaluronic Serum',
        variantTitle: 'Chai 30ml (Minisize)',
        batchNo: 'LOT-202410-02',
        expDate: '2027-10-20',
        unitPrice: 350000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&auto=format&fit=crop&q=80'
      }
    ],
    carrier: 'Giao Hàng Nhanh (GHN)',
    trackingCode: 'GHN-HN-88234303',
    shippingMethod: 'EXPRESS_2H',
    shippingFee: 0,
    totalAmount: 350000,
    discountAmount: 0,
    commissionAmount: 35000,
    sellerAmount: 315000,
    status: 'SHIPPING',
    createdAt: '10/11/2026 09:15',
    slaDeadline: '11/11/2026 21:00'
  },
  {
    subOrderId: 'SUB-ORD-882340-S01',
    masterOrderId: 'ORD-882340',
    shopId: '00000000-0000-0000-0000-000000000010',
    shopName: 'Innisfree Official Store Vietnam',
    buyerName: 'Vũ Thảo Vy',
    buyerPhone: '0933221144',
    shippingAddress: '45 Lê Duẩn, Quận Hải Châu, Đà Nẵng',
    items: [
      {
        productId: 'prod-001',
        skuCode: 'INNI-GT-80ML',
        productName: 'Innisfree Green Tea Seed Hyaluronic Serum',
        variantTitle: 'Chai 80ml (Fullsize)',
        batchNo: 'LOT-202408-04',
        expDate: '2027-08-10',
        unitPrice: 620000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&auto=format&fit=crop&q=80'
      }
    ],
    carrier: 'Giao Hàng Tiết Kiệm (GHTK)',
    trackingCode: 'GHTK-DN-88234000',
    shippingMethod: 'STANDARD',
    shippingFee: 0,
    totalAmount: 620000,
    discountAmount: 0,
    commissionAmount: 62000,
    sellerAmount: 558000,
    status: 'DELIVERED',
    createdAt: '08/11/2026 15:40',
    slaDeadline: 'Hoàn tất'
  },
  {
    subOrderId: 'SUB-ORD-882339-S01',
    masterOrderId: 'ORD-882339',
    shopId: '00000000-0000-0000-0000-000000000010',
    shopName: 'Innisfree Official Store Vietnam',
    buyerName: 'Lê Hoàng Yến',
    buyerPhone: '0977889900',
    shippingAddress: '88 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh',
    items: [
      {
        productId: 'prod-002',
        skuCode: 'INNI-CB-50ML',
        productName: 'Innisfree Cherry Blossom Glow Jelly Cream',
        variantTitle: 'Hũ 50ml',
        batchNo: 'LOT-202409-12',
        expDate: '2027-09-01',
        unitPrice: 480000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&auto=format&fit=crop&q=80'
      }
    ],
    carrier: 'Giao Hàng Tiết Kiệm (GHTK)',
    trackingCode: 'GHTK-SG-88233909',
    shippingMethod: 'STANDARD',
    shippingFee: 0,
    totalAmount: 480000,
    discountAmount: 0,
    commissionAmount: 48000,
    sellerAmount: 432000,
    status: 'RETURN_REQUESTED',
    returnReason: 'Hộp bị móp rách niêm phong trong quá trình vận chuyển',
    returnEvidence: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500',
    createdAt: '09/11/2026 10:10',
    slaDeadline: 'Chờ xử lý khiếu nại'
  }
];

// Initial Mock Disputes
const DEFAULT_DISPUTES = [
  {
    disputeId: 'DISP-2026-001',
    subOrderId: 'SUB-ORD-882339-S01',
    orderId: 'ORD-882339',
    shopId: '00000000-0000-0000-0000-000000000010',
    shopName: 'Innisfree Official Store Vietnam',
    buyerEmail: 'hoangyen.le@gmail.com',
    buyerName: 'Lê Hoàng Yến',
    amount: 480000,
    reason: 'Hộp bị móp rách niêm phong trong quá trình vận chuyển',
    evidenceMedia: 'Ảnh chụp kiện hàng biến dạng + tem vỡ niêm phong',
    status: 'ARBITRATION_PENDING', // 'ARBITRATION_PENDING' | 'REFUNDED_TO_BUYER' | 'SETTLED_TO_SELLER'
    createdAt: '09/11/2026 16:30'
  }
];

// Initial Mock Financials
const DEFAULT_FINANCE = {
  escrowHolding: 2410000,
  totalRevenueAccumulated: 89450000,
  sellerPayableBalance: 46250000,
  pendingWithdrawRequests: [
    {
      id: 'WDR-901',
      shopId: '00000000-0000-0000-0000-000000000010',
      shopName: 'Innisfree Official Store Vietnam',
      amount: 15000000,
      bank: 'Vietcombank - CN Tân Định - STK: 0071001234567 (Amorepacific VN)',
      status: 'PENDING_APPROVAL',
      createdAt: '11/11/2026 10:00'
    }
  ]
};

// Initial Mock Marketing
const DEFAULT_MARKETING = {
  vouchers: [
    {
      code: 'INNI10K',
      title: 'Giảm 10K đơn từ 200K',
      discountType: 'FIXED',
      discountValue: 10000,
      minSpend: 200000,
      usageLimit: 500,
      usedCount: 142,
      startDate: '01/11/2026',
      endDate: '30/11/2026',
      status: 'ACTIVE'
    },
    {
      code: 'AURAOFFICIAL',
      title: 'Mã Mall Giảm 15% Tối đa 50K',
      discountType: 'PERCENT',
      discountValue: 15,
      maxDiscount: 50000,
      minSpend: 350000,
      usageLimit: 1000,
      usedCount: 680,
      startDate: '05/11/2026',
      endDate: '25/11/2026',
      status: 'ACTIVE'
    }
  ],
  flashSales: [
    {
      id: 'FS-01',
      timeSlot: '12:00 - 14:00 Hôm nay',
      skuCode: 'INNI-GT-80ML',
      flashPrice: 520000,
      originalPrice: 620000,
      stockAllocation: 50,
      soldCount: 38,
      status: 'RUNNING'
    }
  ],
  displayAds: [
    {
      id: 'AD-01',
      keyword: 'serum phục hồi da',
      matchType: 'BROAD',
      bidPrice: 2500,
      dailyBudget: 200000,
      clicks: 430,
      cpc: 2150,
      spent: 924500,
      gmv: 12400000,
      roas: '13.4x',
      status: 'ACTIVE'
    }
  ]
};

// ============================================================================
// CORE API EXPORTS
// ============================================================================

export const crossZoneSync = {
  // Subscribe to changes
  subscribe(callback) {
    if (typeof window === 'undefined') return () => {};
    const handler = (e) => callback(e.detail);
    window.addEventListener(SYNC_EVENT, handler);
    return () => window.removeEventListener(SYNC_EVENT, handler);
  },

  // 1. ORDERS API
  getOrders(shopId) {
    const list = loadStorage(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    return shopId ? list.filter(o => o.shopId === shopId) : list;
  },

  addOrder(orderData) {
    const list = loadStorage(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    const updated = [orderData, ...list];
    saveStorage(STORAGE_KEYS.ORDERS, updated, { action: 'ORDER_CREATED', orderId: orderData.subOrderId });
    return orderData;
  },

  updateOrderStatus(subOrderId, newStatus, extra = {}) {
    const list = loadStorage(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    const updated = list.map(o => {
      if (o.subOrderId === subOrderId) {
        return { ...o, status: newStatus, ...extra, updatedAt: new Date().toISOString() };
      }
      return o;
    });
    saveStorage(STORAGE_KEYS.ORDERS, updated, { action: 'ORDER_STATUS_CHANGED', subOrderId, newStatus });

    // Auto ledger settlement if completed
    if (newStatus === 'COMPLETED' || newStatus === 'DELIVERED') {
      const order = list.find(o => o.subOrderId === subOrderId);
      if (order) {
        this.settleOrderFinance(order);
      }
    }
    return updated;
  },

  massShipOrders(subOrderIds, carrier = 'Giao Hàng Tiết Kiệm (GHTK)') {
    const list = loadStorage(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    const updated = list.map(o => {
      if (subOrderIds.includes(o.subOrderId) && (o.status === 'PENDING_CONFIRMATION' || o.status === 'PROCESSING')) {
        return {
          ...o,
          status: 'SHIPPING',
          carrier,
          trackingCode: `${carrier.includes('GHTK') ? 'GHTK' : 'SPX'}-${Math.floor(100000 + Math.random() * 900000)}`,
          shippedAt: new Date().toISOString()
        };
      }
      return o;
    });
    saveStorage(STORAGE_KEYS.ORDERS, updated, { action: 'MASS_SHIPPED', count: subOrderIds.length });
    return updated;
  },

  // 2. RETURN / REFUND & DISPUTES
  requestReturnRefund(subOrderId, reason, evidence) {
    this.updateOrderStatus(subOrderId, 'RETURN_REQUESTED', { returnReason: reason, returnEvidence: evidence });
    const orders = this.getOrders();
    const order = orders.find(o => o.subOrderId === subOrderId);
    if (order) {
      const disputes = loadStorage(STORAGE_KEYS.DISPUTES, DEFAULT_DISPUTES);
      const newDispute = {
        disputeId: `DISP-${Date.now().toString().slice(-4)}`,
        subOrderId,
        orderId: order.masterOrderId,
        shopId: order.shopId,
        shopName: order.shopName,
        buyerEmail: order.buyerName ? `${order.buyerName.toLowerCase().replace(/\s+/g, '')}@gmail.com` : 'buyer@cosmetics.com',
        buyerName: order.buyerName,
        amount: order.totalAmount,
        reason,
        evidenceMedia: evidence,
        status: 'ARBITRATION_PENDING',
        createdAt: 'Vừa xong'
      };
      saveStorage(STORAGE_KEYS.DISPUTES, [newDispute, ...disputes], { action: 'DISPUTE_RAISED' });
    }
  },

  getDisputes(shopId) {
    const list = loadStorage(STORAGE_KEYS.DISPUTES, DEFAULT_DISPUTES);
    return shopId ? list.filter(d => d.shopId === shopId) : list;
  },

  resolveDispute(disputeId, decision) { // 'REFUNDED_TO_BUYER' | 'SETTLED_TO_SELLER'
    const disputes = loadStorage(STORAGE_KEYS.DISPUTES, DEFAULT_DISPUTES);
    let target = null;
    const updated = disputes.map(d => {
      if (d.disputeId === disputeId) {
        target = d;
        return { ...d, status: decision, resolvedAt: new Date().toISOString() };
      }
      return d;
    });
    saveStorage(STORAGE_KEYS.DISPUTES, updated, { action: 'DISPUTE_RESOLVED', disputeId, decision });

    if (target) {
      if (decision === 'REFUNDED_TO_BUYER') {
        this.updateOrderStatus(target.subOrderId, 'REFUNDED');
      } else {
        this.updateOrderStatus(target.subOrderId, 'COMPLETED');
      }
    }
  },

  // 3. FINANCIALS & ESCROW (10% COMMISSION / 90% SELLER)
  getFinance() {
    return loadStorage(STORAGE_KEYS.FINANCE, DEFAULT_FINANCE);
  },

  settleOrderFinance(order) {
    const fin = this.getFinance();
    const commission = order.commissionAmount || Math.round(order.totalAmount * 0.1);
    const sellerNet = order.sellerAmount || (order.totalAmount - commission);

    const updated = {
      ...fin,
      escrowHolding: Math.max(0, fin.escrowHolding - order.totalAmount),
      totalRevenueAccumulated: fin.totalRevenueAccumulated + commission,
      sellerPayableBalance: fin.sellerPayableBalance + sellerNet
    };
    saveStorage(STORAGE_KEYS.FINANCE, updated, { action: 'ESCROW_SETTLED', orderId: order.subOrderId });
  },

  requestWithdrawal(shopId, shopName, amount, bankInfo) {
    const fin = this.getFinance();
    const newReq = {
      id: `WDR-${Math.floor(100 + Math.random() * 900)}`,
      shopId,
      shopName,
      amount: Number(amount),
      bank: bankInfo,
      status: 'PENDING_APPROVAL',
      createdAt: 'Vừa xong'
    };
    const updated = {
      ...fin,
      sellerPayableBalance: Math.max(0, fin.sellerPayableBalance - amount),
      pendingWithdrawRequests: [newReq, ...fin.pendingWithdrawRequests]
    };
    saveStorage(STORAGE_KEYS.FINANCE, updated, { action: 'WITHDRAWAL_REQUESTED', amount });
    return newReq;
  },

  approveWithdrawal(withdrawId) {
    const fin = this.getFinance();
    const updatedReqs = fin.pendingWithdrawRequests.map(r => {
      if (r.id === withdrawId) return { ...r, status: 'APPROVED', approvedAt: new Date().toISOString() };
      return r;
    });
    const updated = { ...fin, pendingWithdrawRequests: updatedReqs };
    saveStorage(STORAGE_KEYS.FINANCE, updated, { action: 'WITHDRAWAL_APPROVED', withdrawId });
  },

  // 4. MARKETING (VOUCHERS & FLASH SALES)
  getMarketing() {
    return loadStorage(STORAGE_KEYS.MARKETING, DEFAULT_MARKETING);
  },

  addVoucher(voucherData) {
    const mkt = this.getMarketing();
    const updated = {
      ...mkt,
      vouchers: [voucherData, ...mkt.vouchers]
    };
    saveStorage(STORAGE_KEYS.MARKETING, updated, { action: 'VOUCHER_ADDED', code: voucherData.code });
    return voucherData;
  },

  toggleVoucher(code) {
    const mkt = this.getMarketing();
    const updatedVouchers = mkt.vouchers.map(v => {
      if (v.code === code) return { ...v, status: v.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' };
      return v;
    });
    const updated = { ...mkt, vouchers: updatedVouchers };
    saveStorage(STORAGE_KEYS.MARKETING, updated, { action: 'VOUCHER_TOGGLED', code });
  },

  // 5. SHOP SETTINGS & VACATION MODE
  getShopSettings(shopId) {
    const settings = loadStorage(STORAGE_KEYS.SHOP_SETTINGS, {});
    return settings[shopId] || {
      vacationMode: false,
      autoReply: true,
      autoReplyMessage: 'Chào bạn, Shop hiện đang trực chat! Chuyên viên tư vấn da liễu sẽ phản hồi bạn trong 5 phút.',
      shippingChannels: {
        express2h: true,
        standard: true,
        economy: true
      },
      warehouses: [
        { id: 'WH-01', name: 'Kho Tổng KCN Tân Bình (TP.HCM)', isDefault: true, address: 'Lô 12, Đường số 3, KCN Tân Bình, Tây Thạnh, Tân Phú, TP. HCM' },
        { id: 'WH-02', name: 'Kho Bắc Ninh (Hà Nội & Miền Bắc)', isDefault: false, address: 'Kho Ngoại quan VSIP Bắc Ninh, Phù Chẩn, Từ Sơn, Bắc Ninh' }
      ]
    };
  },

  updateShopSettings(shopId, newSettings) {
    const allSettings = loadStorage(STORAGE_KEYS.SHOP_SETTINGS, {});
    allSettings[shopId] = { ...(allSettings[shopId] || {}), ...newSettings, updatedAt: new Date().toISOString() };
    saveStorage(STORAGE_KEYS.SHOP_SETTINGS, allSettings, { action: 'SHOP_SETTINGS_UPDATED', shopId });
    return allSettings[shopId];
  }
};
