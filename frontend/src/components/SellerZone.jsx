import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NumberTicker, MotionCard, AnimatedBadge, SpringButton } from './ui';
import {
  Store, Package, Layers, AlertTriangle, Truck, Printer, RotateCcw,
  Tag, Gift, Zap, MessageSquare, Star, Wallet, TrendingUp, CheckCircle2,
  XCircle, Clock, ShieldCheck, FileText, Upload, Plus, Edit, Trash2,
  Calendar, Check, AlertCircle, RefreshCw, DollarSign, Download, ArrowUpRight,
  Building, MapPin, Target, Eye, Home
} from 'lucide-react';

export default function SellerZone({ user, onNavigateHome }) {
  const [activeTab, setActiveTab] = useState('overview'); 
  // 'overview' | 'products' | 'inventory' | 'orders' | 'marketing' | 'cs' | 'finance' | 'profile'

  // =========================================================================
  // 1. DỮ LIỆU GIAN HÀNG & HỒ SƠ PHÁP LÝ (Legal & Branding)
  // =========================================================================
  const [shopProfile, setShopProfile] = useState({
    shopName: user?.shopName || 'Innisfree Official Store Vietnam',
    shopId: user?.shopId || 'shop-001',
    status: 'APPROVED', // 'APPROVED' | 'PENDING'
    isMall: true,
    businessLicense: 'GPKD-0312891920 (Đã kiểm duyệt)',
    cosmeticNotice: 'Số CBMP: 19820/24/CBMP-QLD (Bộ Y Tế cấp)',
    authLetter: 'Thư ủy quyền thương hiệu Amorepacific Corporation (Hiệu lực 2024 - 2027)',
    bio: 'Thương hiệu mỹ phẩm dưỡng da thiên nhiên cao cấp từ đảo ngọc Jeju Hàn Quốc.',
    hotline: '1900 6868',
    address: 'Kho tổng Quận 7, TP. Hồ Chí Minh'
  });

  // =========================================================================
  // 2. QUẢN LÝ SẢN PHẨM & BIẾN THỂ (Products & SKUs)
  // =========================================================================
  const [sellerProducts, setSellerProducts] = useState([
    {
      id: 'prod-001',
      name: 'Innisfree Green Tea Seed Hyaluronic Serum',
      category: 'Skincare',
      status: 'PUBLISHED',
      registrationNumber: '19820/24/CBMP-QLD',
      inciSummary: 'Camellia Sinensis Leaf Extract, Sodium Hyaluronate, Panthenol',
      variants: [
        { sku: 'INNI-GT-30ML', title: 'Chai 30ml (Minisize)', price: 350000, stock: 120 },
        { sku: 'INNI-GT-80ML', title: 'Chai 80ml (Fullsize)', price: 620000, stock: 45 }
      ]
    },
    {
      id: 'prod-002',
      name: 'Innisfree Cherry Blossom Glow Jelly Cream',
      category: 'Kem dưỡng ẩm',
      status: 'PUBLISHED',
      registrationNumber: '19821/24/CBMP-QLD',
      inciSummary: 'Prunus Yedoensis Leaf Extract, Betaine, Niacinamide',
      variants: [
        { sku: 'INNI-CB-50ML', title: 'Hũ 50ml', price: 480000, stock: 8 }
      ]
    },
    {
      id: 'prod-003',
      name: 'Innisfree Super Volcanic Pore Clay Mask 2X',
      category: 'Mặt nạ đất sét',
      status: 'PENDING_APPROVAL',
      registrationNumber: '19822/24/CBMP-QLD',
      inciSummary: 'Volcanic Ash, Kaolin, Lactic Acid, Bentonite',
      variants: [
        { sku: 'INNI-VM-100ML', title: 'Hũ 100ml', price: 340000, stock: 200 }
      ]
    }
  ]);

  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'Skincare',
    registrationNumber: '',
    inciSummary: '',
    sku: '',
    variantTitle: '',
    price: '',
    stock: '',
    routineStep: 'Bước 3: Serum đặc trị'
  });

  // Cấu hình AR Virtual Try-On cho người bán
  const [vtoConfigForm, setVtoConfigForm] = useState({
    supported: false,
    category: 'LIPSTICK',
    shades: [
      { skuCode: 'SHADE-01', shadeName: '01 Đỏ Nhung (Ruby)', hexColor: '#9B111E', finishType: 'MATTE', opacity: 0.82, glossiness: 0.05, shimmerIntensity: 0.0, bestUndertone: 'ALL' }
    ]
  });

  // =========================================================================
  // 3. QUẢN LÝ KHO & LÔ HẠN SỬ DỤNG (Inventory & Expiry Batches)
  // =========================================================================
  const [batchInventory, setBatchInventory] = useState([
    {
      batchNo: 'LOT-2024-IN01',
      productName: 'Innisfree Green Tea Seed Hyaluronic Serum 80ml',
      sku: 'INNI-GT-80ML',
      stock: 45,
      mfgDate: '2024-01-10',
      expDate: '2027-01-10',
      isNearExpiry: false
    },
    {
      batchNo: 'LOT-2023-CB09',
      productName: 'Innisfree Cherry Blossom Jelly Cream 50ml',
      sku: 'INNI-CB-50ML',
      stock: 8,
      mfgDate: '2023-04-15',
      expDate: '2024-11-30', // < 6 tháng: Cận date!
      isNearExpiry: true
    },
    {
      batchNo: 'LOT-2024-VM02',
      productName: 'Innisfree Super Volcanic Pore Clay Mask 100ml',
      sku: 'INNI-VM-100ML',
      stock: 200,
      mfgDate: '2024-03-01',
      expDate: '2027-03-01',
      isNearExpiry: false
    }
  ]);

  // =========================================================================
  // 3.1 KHO HÀNG ĐA ĐIỂM (Multi-Warehouse Hubs & Smart Routing)
  // =========================================================================
  const [warehouses, setWarehouses] = useState([
    {
      id: 'WH-01',
      name: 'Kho Tổng Miền Nam (Hub Quận 7)',
      city: 'TP. Hồ Chí Minh',
      address: 'Lô C2, Khu Chế Xuất Tân Thuận, Quận 7',
      isDefault: true,
      coverage: 'Miền Nam & Tây Nam Bộ',
      capacity: '45.000 sp',
      activeOrders: 18,
      leadTime: 'Giao hỏa tốc 2h - 24h'
    },
    {
      id: 'WH-02',
      name: 'Kho Phân Phối Miền Bắc (Long Biên Hub)',
      city: 'Hà Nội',
      address: 'KCN Đài Tư, 386 Nguyễn Văn Linh, Long Biên',
      isDefault: false,
      coverage: 'Hà Nội & Các tỉnh phía Bắc',
      capacity: '30.000 sp',
      activeOrders: 12,
      leadTime: 'Giao hỏa tốc 2h - 24h'
    },
    {
      id: 'WH-03',
      name: 'Kho Trung Chuyển Miền Trung (Hòa Khánh)',
      city: 'Đà Nẵng',
      address: 'Đường số 4, KCN Hòa Khánh, Liên Chiểu',
      isDefault: false,
      coverage: 'Đà Nẵng & Duyên hải miền Trung',
      capacity: '15.000 sp',
      activeOrders: 5,
      leadTime: 'Giao nhanh 12h - 36h'
    }
  ]);

  // =========================================================================
  // 3.2 ĐẤU THẦU QUẢNG CÁO TÀI TRỢ (Seller Ads Center - Sponsored Keywords)
  // =========================================================================
  const [adCampaigns, setAdCampaigns] = useState([
    {
      id: 'CAMP-01',
      keyword: 'serum b5 phục hồi',
      matchType: 'Chính xác (Exact)',
      bidPrice: 2800,
      dailyBudget: 200000,
      spent: 84000,
      clicks: 30,
      impressions: 1420,
      roas: '4.8x',
      status: 'ACTIVE'
    },
    {
      id: 'CAMP-02',
      keyword: 'kem dưỡng ẩm innisfree',
      matchType: 'Cụm từ (Phrase)',
      bidPrice: 2200,
      dailyBudget: 150000,
      spent: 55000,
      clicks: 25,
      impressions: 980,
      roas: '5.2x',
      status: 'ACTIVE'
    },
    {
      id: 'CAMP-03',
      keyword: 'trị mụn da dầu',
      matchType: 'Mở rộng (Broad)',
      bidPrice: 3500,
      dailyBudget: 300000,
      spent: 210000,
      clicks: 60,
      impressions: 3100,
      roas: '3.9x',
      status: 'ACTIVE'
    }
  ]);

  // =========================================================================
  // 4. QUẢN LÝ ĐƠN HÀNG, VẬN CHUYỂN & ĐỔI TRẢ (Orders & Fulfillment)
  // =========================================================================
  const [orders, setOrders] = useState([
    {
      subOrderId: 'SUB-8812',
      orderId: 'ORD-882341',
      customerName: 'Nguyễn Lan Anh',
      customerPhone: '0901234567',
      items: [
        { name: 'Innisfree Green Tea Seed Hyaluronic Serum (80ml)', qty: 1, price: 620000 }
      ],
      totalAmount: 620000,
      status: 'PROCESSING', // 'NEW' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'RETURN_REQUESTED'
      shippingCarrier: 'Giao Hàng Tiết Kiệm (GHTK)',
      trackingCode: 'GHTK-HCM-88234190',
      createdAt: '2026-10-30 09:15',
      returnReason: null
    },
    {
      subOrderId: 'SUB-8810',
      orderId: 'ORD-882109',
      customerName: 'Trần Văn Minh',
      customerPhone: '0912988776',
      items: [
        { name: 'Innisfree Cherry Blossom Jelly Cream (50ml)', qty: 1, price: 480000 }
      ],
      totalAmount: 480000,
      status: 'RETURN_REQUESTED',
      shippingCarrier: 'Giao Hàng Nhanh (GHN)',
      trackingCode: 'GHN-VN-4491028',
      createdAt: '2026-10-28 14:20',
      returnReason: 'Hàng bị móp méo hộp trong quá trình vận chuyển, khách đề nghị đổi lọ mới'
    },
    {
      subOrderId: 'SUB-8799',
      orderId: 'ORD-881900',
      customerName: 'Lê Thu Trang',
      customerPhone: '0988776655',
      items: [
        { name: 'Innisfree Green Tea Seed Hyaluronic Serum (30ml)', qty: 2, price: 350000 }
      ],
      totalAmount: 700000,
      status: 'DELIVERED',
      shippingCarrier: 'Shopee Xpress (SPX)',
      trackingCode: 'SPX-VN-1192038',
      createdAt: '2026-10-26 11:00',
      returnReason: null
    }
  ]);

  // =========================================================================
  // 5. KÊNH MARKETING & KHUYẾN MÃI (Marketing Center)
  // =========================================================================
  const [vouchers, setVouchers] = useState([
    { code: 'INNI20K', discount: '20.000₫', minSpend: '299.000₫', used: 142, limit: 500, status: 'ACTIVE' },
    { code: 'INNI50K', discount: '50.000₫', minSpend: '599.000₫', used: 89, limit: 200, status: 'ACTIVE' },
    { code: 'INNIFREESHIP', discount: 'Freeship 100%', minSpend: '199.000₫', used: 310, limit: 1000, status: 'ACTIVE' }
  ]);

  const [campaigns, setCampaigns] = useState([
    { id: 'CAMP-1111', title: 'Lễ Hội Siêu Sale Mỹ Phẩm 11/11', discountRate: 'Giảm 25% + Quà tặng Sample', status: 'REGISTERED' },
    { id: 'CAMP-FLASH', title: 'Flash Sale Khung Giờ Vàng (12h - 14h)', discountRate: 'Giảm 30% chớp nhoáng', status: 'APPROVED' }
  ]);

  // =========================================================================
  // 6. CHĂM SÓC KHÁCH HÀNG & REVIEW (CS & Live Chat)
  // =========================================================================
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'customer', text: 'Chào shop, da em hỗn hợp thiên dầu vùng chữ T và đang có mụn cám thì nên dùng Green Tea Serum hay Cherry Blossom Jelly Cream ạ?', time: '10:14' },
    { id: 2, sender: 'seller', text: 'Chào bạn! Với da hỗn hợp dầu có mụn cám, chuyên viên Innisfree khuyên bạn nên dùng dòng Green Tea Seed Hyaluronic Serum trước nhé. Sản phẩm cấp nước sâu mà thẩm thấu nhanh, không gây bít tắc lỗ chân lông đâu ạ!', time: '10:15' }
  ]);
  const [replyInput, setReplyInput] = useState('');

  const [reviews, setReviews] = useState([
    {
      id: 1,
      customer: 'Phương Linh',
      product: 'Green Tea Seed Serum (80ml)',
      rating: 5,
      skinType: 'Da Dầu mụn',
      comment: 'Serum thẩm thấu cực nhanh, bôi lên da mát dịu. Dùng được 2 tuần thấy vùng mũi bớt đổ dầu hẳn.',
      date: '2026-10-29',
      sellerReply: 'Cảm ơn bạn Phương Linh đã tin dùng Innisfree chính hãng! Chúc bạn luôn có làn da rạng rỡ nha.'
    },
    {
      id: 2,
      customer: 'Hải Yến',
      product: 'Cherry Blossom Glow Cream',
      rating: 4,
      skinType: 'Da Khô',
      comment: 'Chất jelly trong suốt thơm nhẹ, nâng tone nhẹ tự nhiên. Hộp đóng gói kỹ càng.',
      date: '2026-10-28',
      sellerReply: null
    }
  ]);

  // =========================================================================
  // 7. TÀI CHÍNH & THỐNG KÊ DOANH THU (Finance & Wallet)
  // =========================================================================
  const [wallet, setWallet] = useState({
    balance: 48920000, // 48.92 triệu khả dụng
    pendingSettlement: 11800000, // 11.8 triệu đang giữ trong Escrow
    totalRevenueMonth: 125400000,
    platformFeeRate: 10, // 10% phí hoa hồng sàn
    bankAccount: 'Techcombank - 1903456789001 - CTY TNHH AMOREPACIFIC VN'
  });

  // Action Handlers
  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.registrationNumber) {
      alert('Vui lòng nhập Tên sản phẩm và Số công bố mỹ phẩm (CBMP) hợp lệ!');
      return;
    }
    const created = {
      id: 'prod-' + Date.now(),
      name: newProductForm.name,
      category: newProductForm.category,
      status: 'PENDING_APPROVAL',
      registrationNumber: newProductForm.registrationNumber,
      inciSummary: newProductForm.inciSummary || 'Đang cập nhật bảng thành phần...',
      vtoConfig: vtoConfigForm.supported ? vtoConfigForm : null,
      variants: [
        {
          sku: newProductForm.sku || 'SKU-' + Math.floor(1000 + Math.random() * 9000),
          title: newProductForm.variantTitle || 'Tiêu chuẩn',
          price: parseInt(newProductForm.price) || 299000,
          stock: parseInt(newProductForm.stock) || 50
        }
      ]
    };
    setSellerProducts([created, ...sellerProducts]);
    alert('Đã gửi sản phẩm lên Ban Quản Trị sàn kiểm duyệt Số Công Bố Mỹ Phẩm và thành phần an toàn!');
    setNewProductForm({
      name: '',
      category: 'Skincare',
      registrationNumber: '',
      inciSummary: '',
      sku: '',
      variantTitle: '',
      price: '',
      stock: '',
      routineStep: 'Bước 3: Serum đặc trị'
    });
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!replyInput.trim()) return;
    setChatMessages([...chatMessages, {
      id: Date.now(),
      sender: 'seller',
      text: replyInput.trim(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }]);
    setReplyInput('');
  };

  const handleUpdateOrderStatus = (subOrderId, nextStatus) => {
    setOrders(orders.map(o => o.subOrderId === subOrderId ? { ...o, status: nextStatus } : o));
    alert(`Đơn hàng ${subOrderId} đã chuyển trạng thái sang: ${nextStatus}!`);
  };

  const handleApproveReturn = (subOrderId) => {
    setOrders(orders.map(o => o.subOrderId === subOrderId ? { ...o, status: 'RETURN_ACCEPTED' } : o));
    alert(`Đã chấp thuận yêu cầu Trả hàng / Hoàn tiền cho đơn ${subOrderId}. Tiền sẽ được hoàn lại ví khách hàng.`);
  };

  const handleDisputeReturn = (subOrderId) => {
    setOrders(orders.map(o => o.subOrderId === subOrderId ? { ...o, status: 'DISPUTE_ESCALATED' } : o));
    alert(`Đã chuyển khiếu nại đơn ${subOrderId} lên Ban Quản Trị Sàn phân xử trọng tài độc lập!`);
  };

  const handleWithdraw = () => {
    alert(`Đã gửi yêu cầu rút 40.000.000₫ về tài khoản ngân hàng ${wallet.bankAccount}. Tiền sẽ về trong 2-4 giờ làm việc.`);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', minHeight: '80vh', paddingBottom: '60px' }}>
      {/* =========================================================================
          LEFT NAVIGATION SIDEBAR (7 Phân hệ Kênh Người Bán)
          ========================================================================= */}
      <aside
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          height: 'fit-content'
        }}
      >
        <div style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Store size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: 800, margin: 0, color: '#0f172a' }}>Kênh Người Bán</h3>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>● Gian hàng chính thức</span>
              </div>
            </div>
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                title="Quay lại Trang Chủ Mua Sắm Sàn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '5px 8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#0f172a',
                  cursor: 'pointer'
                }}
              >
                <Home size={12} /> Về Sàn
              </button>
            )}
          </div>
        </div>

        {[
          { id: 'overview', label: '1. Tổng quan & Hồ sơ Shop', icon: Store },
          { id: 'products', label: '2. Quản lý Sản phẩm & Biến thể', icon: Package, badge: sellerProducts.length },
          { id: 'inventory', label: '3. Kho hàng & Hạn sử dụng', icon: Layers, alert: batchInventory.some(b => b.isNearExpiry) },
          { id: 'orders', label: '4. Đơn hàng & Vận chuyển', icon: Truck, badge: orders.filter(o => o.status === 'PROCESSING' || o.status === 'RETURN_REQUESTED').length },
          { id: 'warehouses', label: '5. Kho Đa Điểm & Smart Routing', icon: Building, badge: warehouses.length },
          { id: 'ads', label: '6. Đấu Thầu Quảng Cáo Seller Ads', icon: Zap },
          { id: 'marketing', label: '7. Kênh Marketing & Voucher', icon: Tag },
          { id: 'cs', label: '8. Chăm sóc Khách hàng & Chat', icon: MessageSquare },
          { id: 'finance', label: '9. Tài chính, Ví Shop & Báo cáo', icon: Wallet }
        ].map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 14px',
                borderRadius: '10px',
                border: 'none',
                background: 'transparent',
                color: isActive ? '#ec4899' : '#334155',
                fontSize: '12.5px',
                fontWeight: isActive ? 750 : 600,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s'
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="seller-sidebar-active-pill"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: '#fdf2f8',
                    borderRadius: '10px',
                    border: '1px solid #fbcfe8',
                    zIndex: 0
                  }}
                />
              )}
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={17} style={{ color: isActive ? '#ec4899' : '#64748b' }} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span style={{ position: 'relative', zIndex: 1, fontSize: '11px', background: isActive ? '#ec4899' : '#e2e8f0', color: isActive ? '#fff' : '#475569', padding: '1px 7px', borderRadius: '9999px', fontWeight: 700 }}>
                  {item.badge}
                </span>
              )}
              {item.alert && (
                <span title="Có sản phẩm cận date!" style={{ position: 'relative', zIndex: 1, width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
              )}
            </button>
          );
        })}
      </aside>

      {/* =========================================================================
          MAIN CONTENT AREA
          ========================================================================= */}
      <main style={{ minWidth: 0 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
        {/* =========================================================================
            TAB 1: TỔNG QUAN & HỒ SƠ PHÁP LÝ GIAN HÀNG
            ========================================================================= */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#0f172a' }}>{shopProfile.shopName}</h2>
                    <span style={{ background: '#ec4899', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '9999px' }}>
                      ✓ OFFICIAL MALL ĐÃ XÁC THỰC
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                    Mã gian hàng: <code>{shopProfile.shopId}</code> | Địa chỉ kho: {shopProfile.address}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Biểu phí hoa hồng sàn:</span>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#ec4899' }}>10% (Đối soát qua Sổ cái Escrow)</div>
                </div>
              </div>

              {/* Legal Documentation Cards */}
              <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>
                    <ShieldCheck size={18} style={{ color: '#10b981' }} /> Giấy Phép Đăng Ký Kinh Doanh
                  </div>
                  <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 10px 0' }}>{shopProfile.businessLicense}</p>
                  <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>✓ Đã được Admin sàn thẩm định</span>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>
                    <FileText size={18} style={{ color: '#3b82f6' }} /> Giấy Công Bố Mỹ Phẩm (Bộ Y Tế)
                  </div>
                  <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 10px 0' }}>{shopProfile.cosmeticNotice}</p>
                  <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 700 }}>✓ Đạt tiêu chuẩn an toàn ASEAN</span>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>
                    <CheckCircle2 size={18} style={{ color: '#8b5cf6' }} /> Chứng Nhận Đại Lý / Phân Phối
                  </div>
                  <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 10px 0' }}>{shopProfile.authLetter}</p>
                  <span style={{ fontSize: '11px', color: '#8b5cf6', fontWeight: 700 }}>✓ Cam kết 100% chính hãng</span>
                </div>
              </div>
            </div>

            {/* Quick KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <MotionCard hoverScale={1.02} glow glowColor="rgba(16, 185, 129, 0.15)" style={{ padding: '18px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Doanh thu tháng này</span>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '6px 0' }}>
                  <NumberTicker value={125400000} suffix="₫" />
                </div>
                <AnimatedBadge variant="success" pulse>↑ +14.2% so với tháng trước</AnimatedBadge>
              </MotionCard>
              <MotionCard hoverScale={1.02} glow glowColor="rgba(236, 72, 153, 0.15)" style={{ padding: '18px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Đơn hàng cần xử lý</span>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#ec4899', margin: '6px 0' }}>
                  <NumberTicker value={orders.filter(o => o.status === 'PROCESSING').length} suffix=" đơn" />
                </div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Đóng gói trước 16:00</span>
              </MotionCard>
              <MotionCard hoverScale={1.02} glow glowColor="rgba(245, 158, 11, 0.15)" style={{ padding: '18px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Đánh giá trung bình</span>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#f59e0b', margin: '6px 0' }}>4.9 ★</div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Dựa trên 124.5k lượt</span>
              </MotionCard>
              <MotionCard hoverScale={1.02} glow glowColor="rgba(239, 68, 68, 0.15)" style={{ padding: '18px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Sản phẩm cận date</span>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#ef4444', margin: '6px 0' }}>
                  <NumberTicker value={batchInventory.filter(b => b.isNearExpiry).length} suffix=" lô" />
                </div>
                <AnimatedBadge variant="danger" pulse>Cần xả kho ưu đãi!</AnimatedBadge>
              </MotionCard>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: QUẢN LÝ SẢN PHẨM & ĐĂNG MỚI (SKU Management)
            ========================================================================= */}
        {activeTab === 'products' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Form đăng sản phẩm mới */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} style={{ color: '#ec4899' }} /> Đăng Tải Sản Phẩm Mới (Gửi Chờ Sàn Kiểm Duyệt)
              </h3>
              <form onSubmit={handleCreateProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Tên sản phẩm mỹ phẩm *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Innisfree Retinol Cica Moisture Recovery Serum"
                    value={newProductForm.name}
                    onChange={e => setNewProductForm({ ...newProductForm, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Số Công Bố Mỹ Phẩm (CBMP của Cục Quản Lý Dược) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 19825/24/CBMP-QLD"
                    value={newProductForm.registrationNumber}
                    onChange={e => setNewProductForm({ ...newProductForm, registrationNumber: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Vị trí trong Chu trình Dưỡng Da (Skincare Routine)
                  </label>
                  <select
                    value={newProductForm.routineStep}
                    onChange={e => setNewProductForm({ ...newProductForm, routineStep: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                  >
                    <option>Bước 1: Tẩy trang / Làm sạch sâu</option>
                    <option>Bước 2: Nước hoa hồng (Toner / Nước thần)</option>
                    <option>Bước 3: Serum đặc trị (Active Serum)</option>
                    <option>Bước 4: Kem dưỡng ẩm khóa ẩm</option>
                    <option>Bước 5: Kem chống nắng ban ngày</option>
                  </select>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Bảng thành phần danh pháp quốc tế (INCI) chi tiết *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Water, Niacinamide, Retinol, Centella Asiatica Extract, Glycerin..."
                    value={newProductForm.inciSummary}
                    onChange={e => setNewProductForm({ ...newProductForm, inciSummary: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                  />
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Hệ thống sẽ tự động quét đối chiếu các hoạt chất gây dị ứng hoặc chất cấm của Bộ Y Tế.</span>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Mã SKU & Dung tích phân loại *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Mã SKU (VD: INNI-RET-50ML)"
                      value={newProductForm.sku}
                      onChange={e => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                      style={{ padding: '10px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                    />
                    <input
                      type="text"
                      placeholder="Tên biến thể (VD: Chai 50ml)"
                      value={newProductForm.variantTitle}
                      onChange={e => setNewProductForm({ ...newProductForm, variantTitle: e.target.value })}
                      style={{ padding: '10px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Giá bán niêm yết (VNĐ) & Tồn kho ban đầu *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <input
                      type="number"
                      placeholder="Giá (VD: 450000)"
                      value={newProductForm.price}
                      onChange={e => setNewProductForm({ ...newProductForm, price: e.target.value })}
                      style={{ padding: '10px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                    />
                    <input
                      type="number"
                      placeholder="Tồn kho (VD: 100)"
                      value={newProductForm.stock}
                      onChange={e => setNewProductForm({ ...newProductForm, stock: e.target.value })}
                      style={{ padding: '10px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                    />
                  </div>
                </div>

                {/* Cấu hình AR Virtual Try-On cho Seller */}
                <div style={{ gridColumn: 'span 2', background: '#fdf2f8', border: '1.5px dashed #f472b6', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 700, color: '#9d174d', fontSize: '13.5px' }}>
                      <input
                        type="checkbox"
                        checked={vtoConfigForm.supported}
                        onChange={e => setVtoConfigForm({ ...vtoConfigForm, supported: e.target.checked })}
                        style={{ width: '16px', height: '16px', accentColor: '#ec4899' }}
                      />
                      ✨ Kích hoạt tính năng Thử Màu Thực Tế Ảo (Aura AR Try-On)
                    </label>
                    {vtoConfigForm.supported && (
                      <select
                        value={vtoConfigForm.category}
                        onChange={e => setVtoConfigForm({ ...vtoConfigForm, category: e.target.value })}
                        style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #f472b6', fontSize: '12px', background: '#fff', fontWeight: 600 }}
                      >
                        <option value="LIPSTICK">💄 Son môi (LIPSTICK)</option>
                        <option value="BLUSH">🌸 Phấn má (BLUSH)</option>
                        <option value="FOUNDATION">🧴 Kem nền (FOUNDATION)</option>
                        <option value="EYESHADOW">✨ Phấn mắt (EYESHADOW)</option>
                      </select>
                    )}
                  </div>

                  {vtoConfigForm.supported && (
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#be185d' }}>
                        Bảng màu & Chỉ số quang học kết xuất (PBR Blending):
                      </div>
                      {vtoConfigForm.shades.map((shade, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '80px 140px 100px 110px 80px 80px 1fr 30px', gap: '8px', alignItems: 'center', background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #fbcfe8' }}>
                          <input
                            type="text"
                            placeholder="Mã SKU"
                            value={shade.skuCode}
                            onChange={e => {
                              const updated = [...vtoConfigForm.shades];
                              updated[idx].skuCode = e.target.value;
                              setVtoConfigForm({ ...vtoConfigForm, shades: updated });
                            }}
                            style={{ padding: '6px', fontSize: '12px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                          />
                          <input
                            type="text"
                            placeholder="Tên màu"
                            value={shade.shadeName}
                            onChange={e => {
                              const updated = [...vtoConfigForm.shades];
                              updated[idx].shadeName = e.target.value;
                              setVtoConfigForm({ ...vtoConfigForm, shades: updated });
                            }}
                            style={{ padding: '6px', fontSize: '12px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                          />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <input
                              type="color"
                              value={shade.hexColor}
                              onChange={e => {
                                const updated = [...vtoConfigForm.shades];
                                updated[idx].hexColor = e.target.value;
                                setVtoConfigForm({ ...vtoConfigForm, shades: updated });
                              }}
                              style={{ width: '28px', height: '28px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '11px', fontFamily: 'monospace' }}>{shade.hexColor}</span>
                          </div>
                          <select
                            value={shade.finishType}
                            onChange={e => {
                              const updated = [...vtoConfigForm.shades];
                              updated[idx].finishType = e.target.value;
                              setVtoConfigForm({ ...vtoConfigForm, shades: updated });
                            }}
                            style={{ padding: '6px', fontSize: '11px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                          >
                            <option value="MATTE">MATTE</option>
                            <option value="VELVET">VELVET</option>
                            <option value="SATIN">SATIN</option>
                            <option value="GLOSSY">GLOSSY</option>
                            <option value="SHIMMER">SHIMMER</option>
                          </select>
                          <input
                            type="number"
                            step="0.05"
                            min="0"
                            max="1"
                            placeholder="Đậm"
                            title="Độ đậm (Opacity 0 - 1)"
                            value={shade.opacity}
                            onChange={e => {
                              const updated = [...vtoConfigForm.shades];
                              updated[idx].opacity = parseFloat(e.target.value) || 0.78;
                              setVtoConfigForm({ ...vtoConfigForm, shades: updated });
                            }}
                            style={{ padding: '6px', fontSize: '12px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                          />
                          <select
                            value={shade.bestUndertone}
                            onChange={e => {
                              const updated = [...vtoConfigForm.shades];
                              updated[idx].bestUndertone = e.target.value;
                              setVtoConfigForm({ ...vtoConfigForm, shades: updated });
                            }}
                            style={{ padding: '6px', fontSize: '11px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                          >
                            <option value="ALL">ALL Tone</option>
                            <option value="WARM">WARM</option>
                            <option value="COOL">COOL</option>
                            <option value="NEUTRAL">NEUTRAL</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = vtoConfigForm.shades.filter((_, i) => i !== idx);
                              setVtoConfigForm({ ...vtoConfigForm, shades: updated });
                            }}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px' }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          setVtoConfigForm({
                            ...vtoConfigForm,
                            shades: [
                              ...vtoConfigForm.shades,
                              {
                                skuCode: `SHADE-0${vtoConfigForm.shades.length + 1}`,
                                shadeName: `Màu mới 0${vtoConfigForm.shades.length + 1}`,
                                hexColor: '#E06D77',
                                finishType: 'SATIN',
                                opacity: 0.78,
                                glossiness: 0.2,
                                shimmerIntensity: 0.0,
                                bestUndertone: 'WARM'
                              }
                            ]
                          });
                        }}
                        style={{ alignSelf: 'flex-start', padding: '6px 14px', borderRadius: '6px', background: '#fce7f3', border: '1px solid #f472b6', color: '#be185d', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        + Thêm mã màu AR
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ gridColumn: 'span 2', textAlign: 'right' }}>
                  <button
                    type="submit"
                    style={{
                      background: '#ec4899',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    🚀 Gửi Sản Phẩm Chờ Phê Duyệt
                  </button>
                </div>
              </form>
            </div>

            {/* Bảng danh sách sản phẩm */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                Danh Sách Sản Phẩm Của Gian Hàng ({sellerProducts.length})
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                    <th style={{ padding: '12px' }}>Tên Sản Phẩm</th>
                    <th style={{ padding: '12px' }}>Số CBMP</th>
                    <th style={{ padding: '12px' }}>Biến Thể & SKU</th>
                    <th style={{ padding: '12px' }}>Giá Niêm Yết</th>
                    <th style={{ padding: '12px' }}>Trạng Thái</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerProducts.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>{p.name}</td>
                      <td style={{ padding: '12px', color: '#0284c7', fontWeight: 650 }}>{p.registrationNumber}</td>
                      <td style={{ padding: '12px' }}>
                        {p.variants.map(v => (
                          <div key={v.sku} style={{ fontSize: '12px', color: '#475569' }}>
                            <code>{v.sku}</code> - {v.title} (Kho: {v.stock})
                          </div>
                        ))}
                      </td>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#ec4899' }}>
                        {p.variants[0].price.toLocaleString('vi-VN')}₫
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          background: p.status === 'PUBLISHED' ? '#ecfdf5' : '#fef3c7',
                          color: p.status === 'PUBLISHED' ? '#059669' : '#d97706',
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: 750
                        }}>
                          {p.status === 'PUBLISHED' ? 'Đang Bán (Published)' : 'Chờ Sàn Duyệt'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button
                          onClick={() => alert(`Chỉnh sửa chi tiết sản phẩm: ${p.name}`)}
                          style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', padding: '6px 10px', fontSize: '11px', fontWeight: 650, cursor: 'pointer' }}
                        >
                          Sửa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: QUẢN LÝ KHO & LÔ HẠN SỬ DỤNG (Expiry & Batch Tracking)
            ========================================================================= */}
        {activeTab === 'inventory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Quản Lý Số Lô (Batch) & Cảnh Báo Cận Date (&lt; 6 Tháng)
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                    Theo quy chế ngành mỹ phẩm, các lô cận date dưới 6 tháng phải có cảnh báo hoặc tạo chương trình xả kho.
                  </p>
                </div>
                <button
                  onClick={() => alert('Thêm mới mã lô hàng nhập kho thành công!')}
                  style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  + Nhập Lô Mới (New Batch)
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {batchInventory.map(b => (
                  <div
                    key={b.batchNo}
                    style={{
                      background: b.isNearExpiry ? '#fef2f2' : '#f8fafc',
                      border: b.isNearExpiry ? '1.5px solid #f87171' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>{b.productName}</span>
                        <code style={{ fontSize: '11px', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>{b.batchNo}</code>
                        {b.isNearExpiry && (
                          <span style={{ background: '#ef4444', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <AlertTriangle size={12} /> CẬN DATE (&lt; 6 THÁNG)
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                        <span>Ngày SX (MFG): <strong>{b.mfgDate}</strong></span>
                        <span>Hạn dùng (EXP): <strong style={{ color: b.isNearExpiry ? '#dc2626' : '#059669' }}>{b.expDate}</strong></span>
                        <span>Tồn kho thực tế: <strong>{b.stock} sản phẩm</strong></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {b.isNearExpiry ? (
                        <button
                          onClick={() => alert(`Đã kích hoạt chương trình Xả Kho Cận Date Giảm 40% cho lô ${b.batchNo}!`)}
                          style={{
                            background: '#dc2626',
                            color: '#ffffff',
                            border: 'none',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          ⚡ Bật Deal Xả Kho Giảm 40%
                        </button>
                      ) : (
                        <button
                          onClick={() => alert(`Cập nhật số lượng tồn cho lô ${b.batchNo}`)}
                          style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 650, cursor: 'pointer' }}
                        >
                          Điều Chỉnh Tồn Kho
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: QUẢN LÝ ĐƠN HÀNG, IN PHIẾU & XỬ LÝ ĐỔI TRẢ (Fulfillment)
            ========================================================================= */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Danh Sách Đơn Hàng & Xử Lý Giao Nhận ({orders.length})
                </h3>
                <button
                  onClick={() => alert('Đã xuất file in Phiếu Giao Hàng & Mã Vận Đơn hàng loạt cho Đơn vị vận chuyển!')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#0f172a',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Printer size={15} /> In Phiếu Gửi Hàng Loạt
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {orders.map(order => (
                  <div
                    key={order.subOrderId}
                    style={{
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '16px',
                      background: order.status === 'RETURN_REQUESTED' ? '#fffbeb' : '#ffffff'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{order.subOrderId}</span>
                        <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '8px' }}>({order.orderId})</span>
                        <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '12px' }}>{order.createdAt}</span>
                      </div>
                      <div>
                        <span
                          style={{
                            background:
                              order.status === 'PROCESSING' ? '#fdf2f8' :
                              order.status === 'SHIPPED' ? '#eff6ff' :
                              order.status === 'DELIVERED' ? '#ecfdf5' :
                              order.status === 'RETURN_REQUESTED' ? '#fef3c7' : '#f1f5f9',
                            color:
                              order.status === 'PROCESSING' ? '#db2777' :
                              order.status === 'SHIPPED' ? '#2563eb' :
                              order.status === 'DELIVERED' ? '#059669' :
                              order.status === 'RETURN_REQUESTED' ? '#d97706' : '#475569',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            padding: '3px 9px',
                            borderRadius: '9999px'
                          }}
                        >
                          {order.status === 'PROCESSING' && 'Chờ Đóng Gói (Processing)'}
                          {order.status === 'SHIPPED' && 'Đã Giao ĐVVC (Shipped)'}
                          {order.status === 'DELIVERED' && 'Giao Thành Công (Delivered)'}
                          {order.status === 'RETURN_REQUESTED' && 'Khách Yêu Cầu Trả Hàng / Hoàn Tiền'}
                          {order.status === 'RETURN_ACCEPTED' && 'Đã Chấp Nhận Hoàn Tiền'}
                          {order.status === 'DISPUTE_ESCALATED' && 'Đã Gửi Admin Phân Xử'}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 650, color: '#334155', margin: 0 }}>
                          Khách nhận: {order.customerName} - <code>{order.customerPhone}</code>
                        </p>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                          ĐVVC: {order.shippingCarrier} | Mã vận đơn: <strong>{order.trackingCode}</strong>
                        </p>
                        {order.items.map((it, idx) => (
                          <div key={idx} style={{ fontSize: '12px', color: '#0f172a', marginTop: '4px' }}>
                            • {it.name} x {it.qty} = <strong>{it.price.toLocaleString('vi-VN')}₫</strong>
                          </div>
                        ))}
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Tổng tiền đơn con:</div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#ec4899', margin: '2px 0 8px 0' }}>
                          {order.totalAmount.toLocaleString('vi-VN')}₫
                        </div>

                        {/* Action buttons based on status */}
                        {order.status === 'PROCESSING' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.subOrderId, 'SHIPPED')}
                            style={{ background: '#ec4899', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Xác Nhận Đóng Gói & Bàn Giao
                          </button>
                        )}

                        {order.status === 'RETURN_REQUESTED' && (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleApproveReturn(order.subOrderId)}
                              style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                            >
                              ✓ Chấp Thuận Hoàn Tiền
                            </button>
                            <button
                              onClick={() => handleDisputeReturn(order.subOrderId)}
                              style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                            >
                              ⚖ Khiếu Nại Lên Admin Sàn
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {order.returnReason && (
                      <div style={{ marginTop: '10px', background: '#fff', border: '1px dashed #f59e0b', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', color: '#92400e' }}>
                        <strong>Lý do trả hàng từ khách:</strong> {order.returnReason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: KHO ĐA ĐIỂM & SMART ROUTING (Multi-Warehouse Hubs)
            ========================================================================= */}
        {activeTab === 'warehouses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building size={18} style={{ color: '#ec4899' }} /> Mạng Lưới Kho Hàng Đa Điểm &amp; Định Tuyến Xuất Kho Thông Minh
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                    Hệ thống tự động định tuyến xuất hàng từ kho gần khách hàng nhất để kích hoạt giao hỏa tốc 2 giờ và tiết kiệm chi phí vận chuyển.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Thêm chi nhánh kho mới vào mạng lưới fulfillment của shop')}
                  style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={14} /> Thêm Kho Mới
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {warehouses.map(wh => (
                  <div key={wh.id} style={{ border: wh.isDefault ? '2px solid #ec4899' : '1px solid #e2e8f0', borderRadius: '14px', padding: '18px', background: wh.isDefault ? '#fdf2f8' : '#ffffff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, background: '#0f172a', color: '#fff', padding: '2px 6px', borderRadius: '6px' }}>{wh.id}</span>
                          <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{wh.name}</h4>
                        </div>
                        <span style={{ fontSize: '11.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                          <MapPin size={12} style={{ color: '#ec4899' }} /> {wh.city}
                        </span>
                      </div>
                      {wh.isDefault && (
                        <span style={{ fontSize: '10.5px', fontWeight: 800, background: '#ec4899', color: '#fff', padding: '2px 8px', borderRadius: '999px' }}>
                          Kho Mặc Định
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: '12px', color: '#475569', margin: '8px 0', lineHeight: 1.4 }}>
                      <strong>Địa chỉ:</strong> {wh.address}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '10px', background: '#f8fafc', borderRadius: '10px', fontSize: '11.5px', margin: '10px 0' }}>
                      <div>
                        <span style={{ color: '#64748b' }}>Khu vực bao phủ:</span>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{wh.coverage}</div>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>Tốc độ xử lý:</span>
                        <div style={{ fontWeight: 700, color: '#10b981' }}>{wh.leadTime}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                      <span style={{ color: '#64748b' }}>Đang xử lý: <strong style={{ color: '#ec4899' }}>{wh.activeOrders} đơn</strong></span>
                      <span style={{ color: '#64748b' }}>Sức chứa: <strong>{wh.capacity}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: ĐẤU THẦU QUẢNG CÁO SELLER ADS (Sponsored Keywords & Brands)
            ========================================================================= */}
        {activeTab === 'ads' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={18} style={{ color: '#f59e0b' }} /> Trung Tâm Đấu Thầu Từ Khóa Quảng Cáo (Aura Sponsored Ads)
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                    Đấu thầu theo mô hình giá mỗi lượt nhấp (CPC) để hiển thị sản phẩm tại Top 3 vị trí tìm kiếm của khách hàng mục tiêu.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Mở cửa sổ tạo chiến dịch đấu thầu từ khóa tài trợ mới')}
                  style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={14} /> Tạo Chiến Dịch Mới
                </button>
              </div>

              {/* Ads Summary KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
                <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 650 }}>Lượt hiển thị (Impressions)</span>
                  <div style={{ fontSize: '18px', fontWeight: 850, color: '#0f172a', margin: '4px 0' }}>5.500</div>
                  <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>+28% tuần qua</span>
                </div>
                <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 650 }}>Lượt click (CTR: 2.1%)</span>
                  <div style={{ fontSize: '18px', fontWeight: 850, color: '#0f172a', margin: '4px 0' }}>115 clicks</div>
                  <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>CPC TB: 3.030 ₫</span>
                </div>
                <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 650 }}>Chi phí quảng cáo đã tiêu</span>
                  <div style={{ fontSize: '18px', fontWeight: 850, color: '#e11d48', margin: '4px 0' }}>349.000 ₫</div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Ngân sách ngày: 650.000 ₫</span>
                </div>
                <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 650 }}>Hiệu quả ROAS trung bình</span>
                  <div style={{ fontSize: '18px', fontWeight: 850, color: '#10b981', margin: '4px 0' }}>4.63x</div>
                  <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>Doanh thu mang lại: 1.61M ₫</span>
                </div>
              </div>

              {/* Campaigns Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                      <th style={{ padding: '10px 14px' }}>Từ Khóa Đấu Thầu</th>
                      <th style={{ padding: '10px 14px' }}>Loại Khớp</th>
                      <th style={{ padding: '10px 14px' }}>Giá Đấu Thầu (CPC)</th>
                      <th style={{ padding: '10px 14px' }}>Ngân Sách Ngày</th>
                      <th style={{ padding: '10px 14px' }}>Đã Tiêu</th>
                      <th style={{ padding: '10px 14px' }}>Click / Lượt xem</th>
                      <th style={{ padding: '10px 14px' }}>ROAS</th>
                      <th style={{ padding: '10px 14px' }}>Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adCampaigns.map(camp => (
                      <tr key={camp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 750, color: '#0f172a' }}>{camp.keyword}</td>
                        <td style={{ padding: '12px 14px', color: '#64748b' }}>{camp.matchType}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: '#d97706' }}>{camp.bidPrice.toLocaleString('vi-VN')} ₫</td>
                        <td style={{ padding: '12px 14px' }}>{camp.dailyBudget.toLocaleString('vi-VN')} ₫</td>
                        <td style={{ padding: '12px 14px', color: '#e11d48', fontWeight: 650 }}>{camp.spent.toLocaleString('vi-VN')} ₫</td>
                        <td style={{ padding: '12px 14px' }}><strong>{camp.clicks}</strong> / {camp.impressions}</td>
                        <td style={{ padding: '12px 14px', color: '#10b981', fontWeight: 800 }}>{camp.roas}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ background: '#ecfdf5', color: '#059669', padding: '3px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 800 }}>
                            ĐANG CHẠY
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 7: KÊNH MARKETING CỦA GIAN HÀNG (Marketing Center)
            ========================================================================= */}
        {activeTab === 'marketing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Mã Giảm Giá Của Shop (Shop Vouchers)
                </h3>
                <button
                  onClick={() => alert('Mở cửa sổ tạo mã giảm giá mới cho gian hàng')}
                  style={{ background: '#ec4899', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  + Tạo Voucher Mới
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                {vouchers.map(v => (
                  <div key={v.code} style={{ border: '1.5px dashed #f472b6', borderRadius: '12px', padding: '16px', background: '#fdf2f8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#be185d' }}>{v.code}</span>
                      <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#059669', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>{v.status}</span>
                    </div>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px 0' }}>{v.discount}</h4>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Áp dụng cho đơn từ {v.minSpend}</p>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '10px' }}>
                      Đã sử dụng: <strong>{v.used}</strong> / {v.limit} mã
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
                Chiến Dịch Siêu Sale Toàn Sàn (Flash Sale &amp; Ngày Đôi)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {campaigns.map(c => (
                  <div key={c.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '13.5px', fontWeight: 750, color: '#0f172a', margin: '0 0 4px 0' }}>{c.title}</h4>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Mức trợ giá đăng ký: <strong>{c.discountRate}</strong></p>
                    </div>
                    <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 800 }}>
                      ✓ ĐÃ ĐĂNG KÝ
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: CHĂM SÓC KHÁCH HÀNG & TRỰC CHAT TƯ VẤN (CS & Reviews)
            ========================================================================= */}
        {activeTab === 'cs' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Live Chat with Customer */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', height: '520px' }}>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  💬 Trực Chat Tư Vấn Khách Hàng (Live Support)
                </h4>
                <span style={{ fontSize: '11px', color: '#10b981' }}>Khách đang hỏi: Khách hàng Phương Linh</span>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', padding: '4px' }}>
                {chatMessages.map(m => (
                  <div
                    key={m.id}
                    style={{
                      alignSelf: m.sender === 'seller' ? 'flex-end' : 'flex-start',
                      maxWidth: '80%',
                      background: m.sender === 'seller' ? '#ec4899' : '#f1f5f9',
                      color: m.sender === 'seller' ? '#ffffff' : '#0f172a',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      fontSize: '12.5px',
                      lineHeight: 1.4
                    }}
                  >
                    <div>{m.text}</div>
                    <div style={{ fontSize: '10px', textAlign: 'right', marginTop: '4px', opacity: 0.75 }}>{m.time}</div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChatMessage} style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '10px' }}>
                <input
                  type="text"
                  placeholder="Nhập nội dung tư vấn chu trình dưỡng da..."
                  value={replyInput}
                  onChange={e => setReplyInput(e.target.value)}
                  style={{ flex: 1, border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px', fontSize: '12px' }}
                />
                <button
                  type="submit"
                  style={{ background: '#ec4899', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Gửi
                </button>
              </form>
            </div>

            {/* Product Reviews Management */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 800, margin: '0 0 12px 0', color: '#0f172a' }}>
                ⭐ Đánh Giá &amp; Phản Hồi Từ Người Mua
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
                {reviews.map(r => (
                  <div key={r.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{r.customer}</strong>
                      <span style={{ color: '#f59e0b', fontWeight: 800 }}>{'★'.repeat(r.rating)}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Sản phẩm: {r.product} | Loại da: <strong>{r.skinType}</strong></span>
                    <p style={{ margin: '6px 0', color: '#334155' }}>"{r.comment}"</p>
                    {r.sellerReply ? (
                      <div style={{ background: '#fdf2f8', padding: '6px 10px', borderRadius: '6px', color: '#be185d', fontSize: '11px' }}>
                        <strong>Phản hồi của Shop:</strong> {r.sellerReply}
                      </div>
                    ) : (
                      <button
                        onClick={() => alert(`Đã gửi phản hồi cảm ơn khách hàng ${r.customer}!`)}
                        style={{ background: '#f1f5f9', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 650, cursor: 'pointer' }}
                      >
                        Trả lời review
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 7: TÀI CHÍNH, VÍ SHOP & BÁO CÁO DOANH THU (Finance & Analytics)
            ========================================================================= */}
        {activeTab === 'finance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 650 }}>Số Dư Khả Dụng Trong Ví Người Bán</span>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#ec4899', margin: '4px 0' }}>
                    {wallet.balance.toLocaleString('vi-VN')}₫
                  </div>
                  <p style={{ fontSize: '12px', color: '#059669', margin: 0 }}>
                    Tiền ký quỹ đang giữ trong Escrow (Chờ giao hàng & hết hạn đổi trả): <strong>{wallet.pendingSettlement.toLocaleString('vi-VN')}₫</strong>
                  </p>
                </div>
                <button
                  onClick={handleWithdraw}
                  style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px 20px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ArrowUpRight size={16} /> Rút Tiền Về Ngân Hàng
                </button>
              </div>

              <div style={{ marginTop: '20px', padding: '12px 16px', background: '#f8fafc', borderRadius: '10px', fontSize: '12px', color: '#475569' }}>
                Tài khoản thụ hưởng liên kết: <strong>{wallet.bankAccount}</strong>
              </div>
            </div>

            {/* Báo cáo thống kê hiệu quả kinh doanh */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                Top 3 Sản Phẩm Bán Chạy Nhất Tháng
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { name: 'Innisfree Green Tea Seed Hyaluronic Serum (80ml)', sold: '1.420 chai', rev: '880.400.000₫' },
                  { name: 'Innisfree Cherry Blossom Glow Jelly Cream (50ml)', sold: '890 hũ', rev: '427.200.000₫' },
                  { name: 'Innisfree Super Volcanic Pore Clay Mask 2X (100ml)', sold: '610 hũ', rev: '207.400.000₫' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '13px' }}>
                    <div>
                      <span style={{ fontWeight: 800, color: '#ec4899', marginRight: '8px' }}>#{idx + 1}</span>
                      <strong style={{ color: '#0f172a' }}>{item.name}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', marginRight: '16px' }}>Đã bán: <strong>{item.sold}</strong></span>
                      <strong style={{ color: '#0f172a' }}>{item.rev}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
