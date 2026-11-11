import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, ShoppingCart, Store, ArrowRightLeft, FileSpreadsheet,
  CheckCircle2, Clock, Sparkles, Plus, Search, ArrowUpRight,
  DollarSign, Package, Layers, Download, RefreshCw, X, Check, Users, FileText
} from 'lucide-react';

// ============================================================================
// DỮ LIỆU KHỞI TẠO BÁN SỈ (B2B WHOLESALE MOCK DATA)
// ============================================================================
const INITIAL_ORDERS = [
  {
    id: 'WS-2024-001',
    partnerName: 'Aura Beauty Spa Hà Nội',
    tier: 'Tier 3 (VIP Partner)',
    discount: '45%',
    itemsCount: 240,
    totalAmount: 98500000,
    stage: 'INQUIRY',
    createdAt: 'Hôm nay, 09:30',
    contactPerson: 'Ms. Trâm Anh (Quản lý thu mua)',
    notes: 'Đặt gộp Serum Trà Xanh 80ml + Kem Cherry Blossom 50ml phục vụ chuỗi Spa'
  },
  {
    id: 'WS-2024-002',
    partnerName: 'Hệ thống Salon Thảo Điền Q2',
    tier: 'Tier 2 (Gold)',
    discount: '38%',
    itemsCount: 85,
    totalAmount: 36200000,
    stage: 'INQUIRY',
    createdAt: 'Hôm nay, 11:15',
    contactPerson: 'Mr. Tuấn Kiệt',
    notes: 'Yêu cầu kiểm tra date lô mới nhất 2024'
  },
  {
    id: 'WS-2024-003',
    partnerName: 'Guardian Beauty Mall Đà Nẵng',
    tier: 'Tier 3 (VIP Partner)',
    discount: '45%',
    itemsCount: 350,
    totalAmount: 142000000,
    stage: 'APPROVED',
    createdAt: 'Hôm qua, 14:20',
    contactPerson: 'Ms. Hà My',
    notes: 'Đã nhận cọc 30% (42.600.000 ₫). Giữ kho nguyên tử CAS.'
  },
  {
    id: 'WS-2024-004',
    partnerName: 'Chuỗi Mỹ Phẩm Hasaki Center',
    tier: 'Tier 3 (VIP Partner)',
    discount: '45%',
    itemsCount: 500,
    totalAmount: 215000000,
    stage: 'APPROVED',
    createdAt: '2 ngày trước',
    contactPerson: 'Mr. Hoàng Long',
    notes: 'Đơn định kỳ hàng tháng cho 8 chi nhánh'
  },
  {
    id: 'WS-2024-005',
    partnerName: 'Vân Beauty Clinic Hải Phòng',
    tier: 'Tier 1 (Silver)',
    discount: '30%',
    itemsCount: 45,
    totalAmount: 19800000,
    stage: 'APPROVED',
    createdAt: '3 ngày trước',
    contactPerson: 'Bác sĩ Vân',
    notes: 'Bổ sung mặt nạ đất sét và kem phục hồi da sau liệu trình'
  },
  {
    id: 'WS-2024-006',
    partnerName: 'Cosmetic Lounge Landmark 81',
    tier: 'Tier 2 (Gold)',
    discount: '38%',
    itemsCount: 120,
    totalAmount: 54600000,
    stage: 'FULFILLMENT',
    createdAt: '4 ngày trước',
    contactPerson: 'Ms. Kim Ngân',
    notes: 'Đang đóng gói pallet thùng carton 3 lớp, xuất kho FEFO Lot 2024'
  },
  {
    id: 'WS-2024-007',
    partnerName: 'An Nhiên Wellness & Spa Cần Thơ',
    tier: 'Tier 1 (Silver)',
    discount: '30%',
    itemsCount: 60,
    totalAmount: 26400000,
    stage: 'FULFILLMENT',
    createdAt: '4 ngày trước',
    contactPerson: 'Chị Mai',
    notes: 'Giao chành xe Phương Trang Cần Thơ'
  },
  {
    id: 'WS-2024-008',
    partnerName: 'Sài Gòn Cosmetics Hub Q1',
    tier: 'Tier 3 (VIP Partner)',
    discount: '45%',
    itemsCount: 280,
    totalAmount: 118000000,
    stage: 'INVOICED',
    createdAt: '6 ngày trước',
    contactPerson: 'Anh Khoa',
    notes: 'Đã xuất hóa đơn điện tử VAT. Hạn thanh toán Net 30 (còn 24 ngày).'
  },
  {
    id: 'WS-2024-009',
    partnerName: 'Linh Đan Skincare Boutique',
    tier: 'Tier 2 (Gold)',
    discount: '38%',
    itemsCount: 95,
    totalAmount: 41200000,
    stage: 'INVOICED',
    createdAt: '8 ngày trước',
    contactPerson: 'Ms. Linh Đan',
    notes: 'Đã bàn giao vận chuyển Viettel Post B2B. Net 30.'
  },
  {
    id: 'WS-2024-010',
    partnerName: 'Hệ thống Seoul Spa Nha Trang',
    tier: 'Tier 2 (Gold)',
    discount: '38%',
    itemsCount: 110,
    totalAmount: 48900000,
    stage: 'DELIVERED',
    createdAt: '12 ngày trước',
    contactPerson: 'Anh Hùng',
    notes: 'Đã ký nhận biên bản bàn giao và chuyển khoản tất toán đủ 100%.'
  }
];

const WHOLESALE_TIERS_CATALOG = [
  {
    id: 'WS-CAT-01',
    name: 'Innisfree Green Tea Seed Hyaluronic Serum 80ml',
    sku: 'INNI-GT-80ML',
    retailPrice: 620000,
    moq: 10,
    tier1: { qty: '10 - 49', price: 434000, discount: '30%' },
    tier2: { qty: '50 - 199', price: 384400, discount: '38%' },
    tier3: { qty: '≥ 200', price: 341000, discount: '45%' },
    stockB2B: 1250,
    lotDate: 'LOT-2024-IN01 (HSD: 2027)'
  },
  {
    id: 'WS-CAT-02',
    name: 'Innisfree Cherry Blossom Glow Jelly Cream 50ml',
    sku: 'INNI-CB-50ML',
    retailPrice: 480000,
    moq: 10,
    tier1: { qty: '10 - 49', price: 336000, discount: '30%' },
    tier2: { qty: '50 - 199', price: 297600, discount: '38%' },
    tier3: { qty: '≥ 200', price: 264000, discount: '45%' },
    stockB2B: 840,
    lotDate: 'LOT-2024-CB02 (HSD: 2027)'
  },
  {
    id: 'WS-CAT-03',
    name: 'Innisfree Super Volcanic Pore Clay Mask 2X 100ml',
    sku: 'INNI-VM-100ML',
    retailPrice: 340000,
    moq: 15,
    tier1: { qty: '15 - 49', price: 238000, discount: '30%' },
    tier2: { qty: '50 - 199', price: 210800, discount: '38%' },
    tier3: { qty: '≥ 200', price: 187000, discount: '45%' },
    stockB2B: 2100,
    lotDate: 'LOT-2024-VM03 (HSD: 2027)'
  },
  {
    id: 'WS-CAT-04',
    name: 'Innisfree Tone Up No Sebum Sunscreen EX SPF50+ 50ml',
    sku: 'INNI-SUN-50ML',
    retailPrice: 380000,
    moq: 20,
    tier1: { qty: '20 - 49', price: 266000, discount: '30%' },
    tier2: { qty: '50 - 199', price: 235600, discount: '38%' },
    tier3: { qty: '≥ 200', price: 209000, discount: '45%' },
    stockB2B: 1600,
    lotDate: 'LOT-2024-SUN01 (HSD: 2027)'
  }
];

const WHOLESALE_PARTNERS = [
  {
    id: 'P-01',
    name: 'Aura Beauty Spa Hà Nội',
    category: 'Chuỗi Thẩm Mỹ Viện / Spa',
    tier: 'Tier 3 (VIP)',
    creditLimit: 300000000,
    currentReceivable: 98500000,
    paymentTerms: 'Net 30 (30 ngày kể từ hóa đơn)',
    creditRating: 'AAA (Xuất sắc)',
    phone: '0912 345 678',
    city: 'Hà Nội'
  },
  {
    id: 'P-02',
    name: 'Hệ thống Salon Thảo Điền Q2',
    category: 'Salon Chăm Sóc Da Cao Cấp',
    tier: 'Tier 2 (Gold)',
    creditLimit: 150000000,
    currentReceivable: 36200000,
    paymentTerms: 'Net 30',
    creditRating: 'AA (Tốt)',
    phone: '0908 888 999',
    city: 'TP. Hồ Chí Minh'
  },
  {
    id: 'P-03',
    name: 'Guardian Beauty Mall Đà Nẵng',
    category: 'Đại Lý Bán Lẻ & Chuỗi Cửa Hàng',
    tier: 'Tier 3 (VIP)',
    creditLimit: 500000000,
    currentReceivable: 142000000,
    paymentTerms: 'Net 45',
    creditRating: 'AAA (Xuất sắc)',
    phone: '0236 3888 999',
    city: 'Đà Nẵng'
  },
  {
    id: 'P-04',
    name: 'Cosmetic Lounge Landmark 81',
    category: 'Showroom B2B',
    tier: 'Tier 2 (Gold)',
    creditLimit: 200000000,
    currentReceivable: 54600000,
    paymentTerms: 'Net 30',
    creditRating: 'AAA',
    phone: '0977 123 456',
    city: 'TP. Hồ Chí Minh'
  }
];

// CÁC CHẶNG CỦA PIPELINE BOARD
const PIPELINE_STAGES = [
  { key: 'INQUIRY', label: '1. Báo Giá & Tiếp Nhận', bg: '#fffbeb', border: '#fef3c7', text: '#b45309' },
  { key: 'APPROVED', label: '2. Đã Chốt & Nhận Cọc', bg: '#eff6ff', border: '#dbeafe', text: '#1d4ed8' },
  { key: 'FULFILLMENT', label: '3. Soạn Hàng & FEFO', bg: '#faf5ff', border: '#f3e8ff', text: '#7e22ce' },
  { key: 'INVOICED', label: '4. Đã Xuất HĐ / Net 30', bg: '#fff1f2', border: '#ffe4e6', text: '#e11d48' },
  { key: 'DELIVERED', label: '5. Hoàn Tất Bàn Giao', bg: '#ecfdf5', border: '#d1fae5', text: '#047857' }
];

export default function WholesaleDashboard({ onSwitchChannel, onAddToast }) {
  const [activeChannel, setActiveChannel] = useState('wholesale');
  const [subTab, setSubTab] = useState('pipeline');
  const [timeRange, setTimeRange] = useState('30d');

  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newOrderForm, setNewOrderForm] = useState({
    partnerName: 'Aura Beauty Spa Hà Nội',
    productId: 'WS-CAT-01',
    quantity: 50,
    paymentTerms: 'NET_30',
    notes: ''
  });

  const totalWholesaleRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.totalAmount, 0);
  }, [orders]);

  const totalOutstandingReceivables = useMemo(() => {
    return orders
      .filter(o => o.stage === 'INVOICED' || o.stage === 'APPROVED')
      .reduce((sum, o) => sum + o.totalAmount, 0);
  }, [orders]);

  const avgOrderValue = useMemo(() => {
    return orders.length ? Math.round(totalWholesaleRevenue / orders.length) : 0;
  }, [totalWholesaleRevenue, orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      return o.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
             o.id.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [orders, searchQuery]);

  const handleMoveStage = (orderId, direction) => {
    const stageOrder = ['INQUIRY', 'APPROVED', 'FULFILLMENT', 'INVOICED', 'DELIVERED'];
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const currentIndex = stageOrder.indexOf(o.stage);
      const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
      if (nextIndex < 0 || nextIndex >= stageOrder.length) return o;
      const nextStage = stageOrder[nextIndex];
      if (onAddToast) {
        onAddToast({
          type: 'success',
          message: `Đơn sỉ ${o.id} đã chuyển sang chặng "${PIPELINE_STAGES.find(s => s.key === nextStage)?.label}"`
        });
      }
      return { ...o, stage: nextStage };
    }));
  };

  const handleCreateOrder = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const catalogItem = WHOLESALE_TIERS_CATALOG.find(c => c.id === newOrderForm.productId) || WHOLESALE_TIERS_CATALOG[0];
      const qty = parseInt(newOrderForm.quantity) || 50;
      let unitPrice = catalogItem.tier1.price;
      let discount = '30%';
      let tier = 'Tier 1';
      if (qty >= 200) {
        unitPrice = catalogItem.tier3.price;
        discount = '45%';
        tier = 'Tier 3 (VIP)';
      } else if (qty >= 50) {
        unitPrice = catalogItem.tier2.price;
        discount = '38%';
        tier = 'Tier 2 (Gold)';
      }

      const total = unitPrice * qty;
      const newOrder = {
        id: `WS-2024-${String(orders.length + 1).padStart(3, '0')}`,
        partnerName: newOrderForm.partnerName,
        tier: tier,
        discount: discount,
        itemsCount: qty,
        totalAmount: total,
        stage: 'INQUIRY',
        createdAt: 'Vừa tạo tức thì',
        contactPerson: 'Người phụ trách thu mua',
        notes: newOrderForm.notes || `Đơn tạo thủ công: ${catalogItem.name} (x${qty})`
      };

      setOrders(prev => [newOrder, ...prev]);
      setIsSubmitting(false);
      setIsCreateModalOpen(false);
      if (onAddToast) {
        onAddToast({
          type: 'success',
          message: `Đã tạo thành công đơn bán sỉ ${newOrder.id} (${total.toLocaleString('vi-VN')} ₫)`
        });
      }
    }, 500);
  };

  // Glass card style helper
  const glassCardStyle = {
    background: 'rgba(255, 255, 255, 0.78)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.9)',
    borderRadius: '24px',
    boxShadow: '0 8px 30px rgba(15, 23, 42, 0.04)',
    padding: '22px'
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '80vh', fontFamily: 'inherit' }}>
      
      {/* 1. CHANNEL SWITCHER & HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '22px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#fff1f2',
              color: '#e11d48',
              fontSize: '11px',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '9999px',
              border: '1px solid #ffe4e6'
            }}>
              <Sparkles size={12} /> Lumelle Multi-Channel Architecture
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>• B2B Wholesale Engine</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>
            Quản Trị Kênh Bán Hàng <span style={{ color: '#e11d48' }}>&</span> Đường Ống Bán Sỉ
          </h1>
        </div>

        {/* Segmented Pill Channel Controls (iPhone Style) */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          borderRadius: '16px',
          padding: '4px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
        }}>
          {[
            { id: 'online', label: 'Online Store (B2C)', icon: Store },
            { id: 'retail', label: 'Showroom / POS', icon: ShoppingCart },
            { id: 'wholesale', label: 'Kênh Bán Sỉ (B2B)', icon: Building2 }
          ].map(channel => {
            const Icon = channel.icon;
            const isActive = activeChannel === channel.id;
            return (
              <button
                key={channel.id}
                onClick={() => {
                  setActiveChannel(channel.id);
                  if (channel.id !== 'wholesale' && onSwitchChannel) {
                    onSwitchChannel(channel.id);
                  }
                }}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isActive ? '#0f172a' : 'transparent',
                  color: isActive ? '#ffffff' : '#64748b',
                  fontSize: '12.5px',
                  fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={14} style={{ color: isActive ? '#f43f5e' : '#94a3b8' }} />
                <span>{channel.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. TIMEFRAME & QUICK ACTIONS BAR */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        borderRadius: '16px',
        padding: '10px 16px',
        marginBottom: '24px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Kỳ Báo Cáo:
          </span>
          {['7d', '30d', 'quarter', 'year'].map(t => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              style={{
                borderRadius: '8px',
                padding: '5px 12px',
                fontSize: '11.5px',
                fontWeight: timeRange === t ? 800 : 600,
                background: timeRange === t ? '#0f172a' : 'transparent',
                color: timeRange === t ? '#ffffff' : '#475569',
                cursor: 'pointer'
              }}
            >
              {t === '7d' ? '7 Ngày' : t === '30d' ? '30 Ngày' : t === 'quarter' ? 'Quý Này' : 'Năm 2024'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => {
              if (onAddToast) onAddToast({ type: 'info', message: 'Đã xuất file đối soát B2B & Hóa đơn VAT sang Excel/PDF.' });
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '10px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <Download size={13} style={{ color: '#64748b' }} /> Xuất Báo Cáo B2B
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0f172a, #1e293b)',
              border: 'none',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 800,
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
            }}
          >
            <Plus size={14} style={{ color: '#f43f5e' }} /> Tạo Đơn Bán Sỉ Mới
          </button>
        </div>
      </div>

      {/* 3. HÀNG 4 THẺ CHỈ SỐ KPI BÁN SỈ KÍNH MỜ (FROSTED GLASS METRIC CARDS) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {/* Card 1: Doanh Thu */}
        <div style={glassCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Doanh Thu Kênh Sỉ
            </span>
            <div style={{ background: '#fff1f2', padding: '6px', borderRadius: '10px', color: '#e11d48' }}>
              <DollarSign size={15} />
            </div>
          </div>
          <div style={{ fontSize: '23px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
            {totalWholesaleRevenue.toLocaleString('vi-VN')} ₫
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginTop: '6px', color: '#64748b' }}>
            <span style={{ color: '#059669', fontWeight: 800, display: 'inline-flex', alignItems: 'center' }}>
              <ArrowUpRight size={13} style={{ marginRight: '2px' }} /> +24.8% vs tháng trước
            </span>
            <span>88.5% đã đối soát</span>
          </div>
          <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '9999px', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '88%', background: 'linear-gradient(90deg, #f43f5e, #f59e0b)', borderRadius: '9999px' }} />
          </div>
        </div>

        {/* Card 2: AOV Sỉ */}
        <div style={glassCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Giá Trị Đơn TB (AOV)
            </span>
            <div style={{ background: '#eff6ff', padding: '6px', borderRadius: '10px', color: '#2563eb' }}>
              <Layers size={15} />
            </div>
          </div>
          <div style={{ fontSize: '23px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
            {avgOrderValue.toLocaleString('vi-VN')} ₫
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginTop: '6px', color: '#64748b' }}>
            <span style={{ color: '#059669', fontWeight: 800, display: 'inline-flex', alignItems: 'center' }}>
              <ArrowUpRight size={13} style={{ marginRight: '2px' }} /> +12.3%
            </span>
            <span>MOQ ≥ 50 sp / kiện</span>
          </div>
          <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '9999px', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '72%', background: 'linear-gradient(90deg, #3b82f6, #6366f1)', borderRadius: '9999px' }} />
          </div>
        </div>

        {/* Card 3: Công Nợ */}
        <div style={glassCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Công Nợ Trong Kỳ (Net 30)
            </span>
            <div style={{ background: '#fffbeb', padding: '6px', borderRadius: '10px', color: '#d97706' }}>
              <Clock size={15} />
            </div>
          </div>
          <div style={{ fontSize: '23px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
            {totalOutstandingReceivables.toLocaleString('vi-VN')} ₫
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginTop: '6px', color: '#64748b' }}>
            <span style={{ color: '#d97706', fontWeight: 700 }}>6 đối tác đang kỳ hạn</span>
            <span style={{ color: '#059669', fontWeight: 800 }}>0 đơn quá hạn</span>
          </div>
          <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '9999px', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '45%', background: 'linear-gradient(90deg, #f59e0b, #ea580c)', borderRadius: '9999px' }} />
          </div>
        </div>

        {/* Card 4: Tái Đặt Hàng */}
        <div style={glassCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Tỷ Lệ Tái Đặt Hàng
            </span>
            <div style={{ background: '#ecfdf5', padding: '6px', borderRadius: '10px', color: '#059669' }}>
              <CheckCircle2 size={15} />
            </div>
          </div>
          <div style={{ fontSize: '23px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
            78.6%
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginTop: '6px', color: '#64748b' }}>
            <span style={{ color: '#059669', fontWeight: 800, display: 'inline-flex', alignItems: 'center' }}>
              <ArrowUpRight size={13} style={{ marginRight: '2px' }} /> +5.2%
            </span>
            <span>18 Đại lý thân thiết</span>
          </div>
          <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '9999px', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '78%', background: 'linear-gradient(90deg, #10b981, #14b8a6)', borderRadius: '9999px' }} />
          </div>
        </div>
      </div>

      {/* 4. SUB-TABS & SEARCH BAR */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '14px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'pipeline', label: 'Wholesale Pipeline Board', count: orders.length, icon: ArrowRightLeft },
            { id: 'catalog', label: 'Bảng Chiết Khấu Sỉ & MOQ', count: WHOLESALE_TIERS_CATALOG.length, icon: FileSpreadsheet },
            { id: 'partners', label: 'Danh Bạ Đại Lý & Hạn Mức', count: WHOLESALE_PARTNERS.length, icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  background: isActive ? '#0f172a' : 'rgba(255, 255, 255, 0.7)',
                  color: isActive ? '#ffffff' : '#475569',
                  border: isActive ? 'none' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={14} style={{ color: isActive ? '#f43f5e' : '#94a3b8' }} />
                <span>{tab.label}</span>
                <span style={{
                  fontSize: '11px',
                  background: isActive ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                  color: isActive ? '#ffffff' : '#64748b',
                  padding: '1px 6px',
                  borderRadius: '9999px'
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm đại lý, mã đơn sỉ..."
            style={{
              width: '100%',
              borderRadius: '12px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              padding: '8px 12px 8px 34px',
              fontSize: '12px',
              color: '#0f172a'
            }}
          />
        </div>
      </div>

      {/* VIEW 1: WHOLESALE PIPELINE BOARD (5 CỘT LUMELLE KANBAN) */}
      {subTab === 'pipeline' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '14px',
          alignItems: 'flex-start'
        }}>
          {PIPELINE_STAGES.map((stage, stageIndex) => {
            const stageOrders = filteredOrders.filter(o => o.stage === stage.key);
            const stageTotal = stageOrders.reduce((s, o) => s + o.totalAmount, 0);

            return (
              <div
                key={stage.key}
                style={{
                  background: 'rgba(255, 255, 255, 0.65)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.85)',
                  borderRadius: '20px',
                  padding: '14px',
                  minHeight: '480px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Header cột */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '10px',
                  marginBottom: '12px'
                }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                      {stage.label}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 650 }}>
                      {stageTotal.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    background: stage.bg,
                    color: stage.text,
                    border: `1px solid ${stage.border}`,
                    padding: '1px 8px',
                    borderRadius: '9999px'
                  }}>
                    {stageOrders.length}
                  </span>
                </div>

                {/* Danh sách đơn trong cột */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
                  {stageOrders.length === 0 ? (
                    <div style={{
                      height: '120px',
                      border: '1px dashed #cbd5e1',
                      borderRadius: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#94a3b8',
                      fontSize: '11.5px'
                    }}>
                      <Package size={20} style={{ marginBottom: '4px', opacity: 0.5 }} />
                      Chưa có đơn ở chặng này
                    </div>
                  ) : (
                    stageOrders.map(order => (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        style={{
                          background: '#ffffff',
                          borderRadius: '14px',
                          border: '1px solid #e2e8f0',
                          padding: '12px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>
                            {order.id}
                          </span>
                          <span style={{ fontSize: '10px', background: '#f1f5f9', color: '#475569', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                            {order.tier}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0', lineHeight: 1.4 }}>
                          {order.partnerName}
                        </h4>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                          <span style={{ color: '#64748b' }}>{order.itemsCount} sp</span>
                          <strong style={{ color: '#0f172a' }}>{order.totalAmount.toLocaleString('vi-VN')} ₫</strong>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#94a3b8' }}>
                          <span>CK: <strong style={{ color: '#e11d48' }}>{order.discount}</strong></span>
                          <span>{order.createdAt}</span>
                        </div>

                        {/* Thanh nút chuyển chặng */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderTop: '1px solid #f1f5f9',
                          marginTop: '8px',
                          paddingTop: '6px',
                          fontSize: '11px'
                        }}>
                          {stageIndex > 0 ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveStage(order.id, 'prev');
                              }}
                              style={{ color: '#64748b', fontWeight: 700, padding: 0 }}
                            >
                              ← Lùi
                            </button>
                          ) : <span />}

                          {stageIndex < PIPELINE_STAGES.length - 1 ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveStage(order.id, 'next');
                              }}
                              style={{ color: '#e11d48', fontWeight: 800, padding: 0 }}
                            >
                              Tiến →
                            </button>
                          ) : (
                            <span style={{ color: '#059669', fontWeight: 800 }}>✓ Đã giao</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: BẢNG GIÁ SỈ BẬC THANG (TIER MATRIX) */}
      {subTab === 'catalog' && (
        <div style={glassCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Ma Trận Bảng Giá Chiết Khấu Theo Bậc (B2B Volume Tier Pricing)
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                Tự động áp dụng chiết khấu đại lý dựa trên số lượng đặt hàng tối thiểu (MOQ)
              </p>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 800, background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '3px 10px', borderRadius: '9999px' }}>
              Chính sách áp dụng Quý 4/2024
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '11.5px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px' }}>Sản Phẩm & Mã SKU</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Giá Lẻ (B2C)</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Tier 1 (Silver)</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Tier 2 (Gold)</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', background: '#fff1f2', color: '#e11d48' }}>Tier 3 (VIP Partner)</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Tồn Kho B2B</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {WHOLESALE_TIERS_CATALOG.map((prod, idx) => (
                  <tr key={prod.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                    <td style={{ padding: '14px' }}>
                      <strong style={{ color: '#0f172a', display: 'block' }}>{prod.name}</strong>
                      <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>SKU: {prod.sku} • {prod.lotDate}</span>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right', fontWeight: 600, color: '#64748b' }}>
                      {prod.retailPrice.toLocaleString('vi-VN')} ₫
                    </td>
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <strong style={{ color: '#0f172a' }}>{prod.tier1.price.toLocaleString('vi-VN')} ₫</strong>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Sl: {prod.tier1.qty} (-{prod.tier1.discount})</div>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <strong style={{ color: '#0f172a' }}>{prod.tier2.price.toLocaleString('vi-VN')} ₫</strong>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Sl: {prod.tier2.qty} (-{prod.tier2.discount})</div>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'center', background: '#fff5f6' }}>
                      <strong style={{ color: '#e11d48', fontSize: '14px' }}>{prod.tier3.price.toLocaleString('vi-VN')} ₫</strong>
                      <div style={{ fontSize: '11px', color: '#e11d48', fontWeight: 700 }}>Sl: {prod.tier3.qty} (-{prod.tier3.discount})</div>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <span style={{ background: '#ecfdf5', color: '#047857', fontSize: '11.5px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                        {prod.stockB2B} sp
                      </span>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          setNewOrderForm(prev => ({ ...prev, productId: prod.id }));
                          setIsCreateModalOpen(true);
                        }}
                        style={{ background: '#0f172a', color: '#ffffff', borderRadius: '8px', padding: '6px 14px', fontSize: '11.5px', fontWeight: 700 }}
                      >
                        Lên Đơn
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: DANH BẠ ĐẠI LÝ & CÔNG NỢ */}
      {subTab === 'partners' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {WHOLESALE_PARTNERS.map(partner => {
            const usagePercent = Math.round((partner.currentReceivable / partner.creditLimit) * 100);
            return (
              <div key={partner.id} style={glassCardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ background: '#fff1f2', color: '#e11d48', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                      {partner.tier}
                    </span>
                    <h4 style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', margin: '6px 0 2px 0' }}>{partner.name}</h4>
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>{partner.category} • {partner.city}</span>
                  </div>
                  <span style={{ background: '#ecfdf5', color: '#047857', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '9999px', border: '1px solid #a7f3d0' }}>
                    Tín nhiệm {partner.creditRating}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '12px', margin: '14px 0' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Hạn mức tín dụng</span>
                    <strong style={{ fontSize: '14px', color: '#0f172a' }}>{partner.creditLimit.toLocaleString('vi-VN')} ₫</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Công nợ ghi nhận</span>
                    <strong style={{ fontSize: '14px', color: '#d97706' }}>{partner.currentReceivable.toLocaleString('vi-VN')} ₫</strong>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                    <span>Đã dùng hạn mức:</span>
                    <strong style={{ color: '#0f172a' }}>{usagePercent}%</strong>
                  </div>
                  <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${usagePercent}%`, background: usagePercent > 80 ? '#ef4444' : '#10b981', borderRadius: '9999px' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', marginTop: '14px', paddingTop: '10px', fontSize: '12px' }}>
                  <span style={{ color: '#64748b' }}>Điều khoản: <strong>{partner.paymentTerms}</strong></span>
                  <button
                    onClick={() => {
                      if (onAddToast) onAddToast({ type: 'info', message: `Đã gửi đối soát công nợ tự động tới hotline ${partner.phone}.` });
                    }}
                    style={{ color: '#e11d48', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <FileText size={13} /> Gửi Đối Soát
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL TẠO ĐƠN SỈ MỚI */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}>
            <div
              onClick={() => setIsCreateModalOpen(false)}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.45)',
                backdropFilter: 'blur(8px)'
              }}
            />

            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '520px',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
              border: '1px solid #ffffff'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ background: '#fff1f2', color: '#e11d48', padding: '6px', borderRadius: '10px' }}>
                    <Building2 size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', margin: 0 }}>Tạo Đơn Hàng Bán Sỉ Mới (B2B)</h3>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Áp dụng chiết khấu đại lý theo số lượng tự động</span>
                  </div>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} style={{ color: '#94a3b8' }}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Chọn Đại Lý B2B
                  </label>
                  <select
                    value={newOrderForm.partnerName}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, partnerName: e.target.value })}
                    style={{ width: '100%', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px 12px', fontSize: '13px' }}
                  >
                    {WHOLESALE_PARTNERS.map(p => (
                      <option key={p.id} value={p.name}>{p.name} ({p.tier})</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      Sản Phẩm
                    </label>
                    <select
                      value={newOrderForm.productId}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, productId: e.target.value })}
                      style={{ width: '100%', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px 10px', fontSize: '12px' }}
                    >
                      {WHOLESALE_TIERS_CATALOG.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      Số Lượng (MOQ ≥ 10)
                    </label>
                    <input
                      type="number"
                      min="10"
                      step="5"
                      value={newOrderForm.quantity}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, quantity: e.target.value })}
                      style={{ width: '100%', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px 10px', fontSize: '13px' }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Kỳ Hạn Thanh Toán
                  </label>
                  <select
                    value={newOrderForm.paymentTerms}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, paymentTerms: e.target.value })}
                    style={{ width: '100%', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px 12px', fontSize: '13px' }}
                  >
                    <option value="PREPAID">Thanh toán ngay khi đặt (Chiết khấu thêm 2%)</option>
                    <option value="DEPOSIT_30">Cọc 30% khi chốt đơn, 70% sau khi nhận hàng</option>
                    <option value="NET_30">Net 30 (Thanh toán sau 30 ngày từ HĐ VAT)</option>
                    <option value="NET_45">Net 45 (Áp dụng riêng cho đối tác VIP)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    style={{ borderRadius: '10px', padding: '8px 16px', fontSize: '12px', fontWeight: 700, color: '#64748b' }}
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      borderRadius: '10px',
                      background: '#0f172a',
                      color: '#ffffff',
                      padding: '8px 18px',
                      fontSize: '12px',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} style={{ color: '#f43f5e' }} />}
                    Xác Nhận Tạo Đơn B2B
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL XEM CHI TIẾT ĐƠN */}
      <AnimatePresence>
        {selectedOrder && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}>
            <div
              onClick={() => setSelectedOrder(null)}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.45)',
                backdropFilter: 'blur(8px)'
              }}
            />

            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '440px',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
              border: '1px solid #ffffff'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                <div>
                  <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 800, color: '#e11d48' }}>{selectedOrder.id}</span>
                  <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', margin: '2px 0 0 0' }}>{selectedOrder.partnerName}</h3>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{selectedOrder.contactPerson}</span>
                </div>
                <button onClick={() => setSelectedOrder(null)} style={{ color: '#94a3b8' }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '16px 0', fontSize: '12.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Chặng xử lý:</span>
                  <strong style={{ color: '#0f172a' }}>{PIPELINE_STAGES.find(s => s.key === selectedOrder.stage)?.label}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Tổng số lượng:</span>
                  <strong style={{ color: '#0f172a' }}>{selectedOrder.itemsCount} sản phẩm</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Mức chiết khấu:</span>
                  <strong style={{ color: '#e11d48' }}>{selectedOrder.discount} ({selectedOrder.tier})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Tổng giá trị:</span>
                  <strong style={{ color: '#0f172a', fontSize: '15px' }}>{selectedOrder.totalAmount.toLocaleString('vi-VN')} ₫</strong>
                </div>
                <div style={{ marginTop: '4px' }}>
                  <span style={{ color: '#64748b', fontSize: '11.5px', display: 'block', marginBottom: '4px' }}>Ghi chú đơn hàng:</span>
                  <p style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px', fontSize: '12px', color: '#334155', margin: 0, fontStyle: 'italic' }}>
                    {selectedOrder.notes}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                <button
                  onClick={() => {
                    if (onAddToast) onAddToast({ type: 'info', message: `Đang tải Hóa Đơn Điện Tử VAT cho đơn sỉ ${selectedOrder.id}...` });
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', fontWeight: 700, color: '#334155' }}
                >
                  <Download size={13} /> Tải HĐ VAT
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{ background: '#0f172a', color: '#ffffff', borderRadius: '8px', padding: '6px 16px', fontSize: '12px', fontWeight: 800 }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
