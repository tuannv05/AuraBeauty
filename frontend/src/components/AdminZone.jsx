import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NumberTicker, MotionCard, AnimatedBadge, SpringButton, AuraBrandLogo } from './ui';
import {
  Shield, ShieldCheck, Store, Package, Users, Tag, Scale, DollarSign,
  TrendingUp, CheckCircle2, XCircle, AlertTriangle, FileText,
  Search, Lock, Unlock, Eye, Award, Check, X, ArrowUpRight,
  RefreshCw, BarChart2, ShieldAlert, Sparkles, Sliders,
  Activity, Server, Home
} from 'lucide-react';
import { AdminGraphifyExplorer } from '../features/graphify';
import { crossZoneSync } from '../lib/crossZoneSync';

export default function AdminZone({ onNavigateHome, activeTab: propTab, onTabChange }) {
  const [internalTab, setInternalTab] = useState('merchants'); 
  const activeTab = propTab !== undefined ? propTab : internalTab;
  const setActiveTab = (tab) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  }; 
  // 'merchants' | 'products' | 'users' | 'campaigns' | 'disputes' | 'finance' | 'analytics' | 'antifraud' | 'system'

  // =========================================================================
  // 1. QUẢN LÝ & KIỂM DUYỆT THƯƠNG HIỆU (Merchants & Mall Badges)
  // =========================================================================
  const [shops, setShops] = useState([
    {
      id: 'shop-001',
      name: 'Innisfree Official Store',
      ownerEmail: 'seller@cosmetics.com',
      taxCode: '0312891920',
      cosmeticLicense: '19820/24/CBMP-QLD',
      status: 'APPROVED',
      isOfficialMall: true,
      violationCount: 0,
      totalOrders: 1420
    },
    {
      id: 'shop-002',
      name: 'Some By Mi Vietnam',
      ownerEmail: 'somebymi@seller.com',
      taxCode: '0316889921',
      cosmeticLicense: 'CBMP-HCM-2024-00912',
      status: 'PENDING',
      isOfficialMall: false,
      violationCount: 0,
      totalOrders: 0
    },
    {
      id: 'shop-003',
      name: 'Mỹ Phẩm Trắng Da Cấp Tốc Kem Trộn X',
      ownerEmail: 'kemtron@fake.com',
      taxCode: 'Chưa cung cấp',
      cosmeticLicense: 'Không có số CBMP',
      status: 'BLOCKED',
      isOfficialMall: false,
      violationCount: 3,
      totalOrders: 12
    }
  ]);

  // =========================================================================
  // 2. KIỂM DUYỆT SẢN PHẨM & DANH MỤC GỐC (Catalog & Product Audit)
  // =========================================================================
  const [pendingProducts, setPendingProducts] = useState([
    {
      id: 'prod-004',
      name: 'Some By Mi AHA-BHA-PHA 30 Days Miracle Toner',
      shopName: 'Some By Mi Vietnam',
      registrationNumber: 'CBMP-HCM-2024-00912',
      inciSummary: 'Tea Tree Leaf Water, Niacinamide, Salicylic Acid, Lactobionic Acid',
      safetyStatus: 'PASS', // Pass AI ingredient check
      status: 'PENDING_APPROVAL'
    },
    {
      id: 'prod-005',
      name: 'Kem Nám Cốt Thảo Dược Đông Y Gia Truyền',
      shopName: 'Mỹ Phẩm Trắng Da Cấp Tốc Kem Trộn X',
      registrationNumber: 'Không có số CBMP',
      inciSummary: 'Bột ngọc trai, Thảo dược, Thủy ngân vượt ngưỡng, Corticoid',
      safetyStatus: 'FLAGGED_BANNED_SUBSTANCES', // Chứa chất cấm
      status: 'REJECTED'
    }
  ]);

  const standardIngredients = [
    { name: 'BHA (Salicylic Acid)', maxSafeDose: '2.0%', function: 'Tẩy tế bào chết, làm sạch lỗ chân lông, trị mụn' },
    { name: 'Retinol', maxSafeDose: '1.0%', function: 'Chống lão hóa, tăng sinh collagen, trẻ hóa da' },
    { name: 'Niacinamide (Vitamin B3)', maxSafeDose: '10.0%', function: 'Kiềm dầu, sáng da, mờ thâm nám, phục hồi' },
    { name: 'Centella Asiatica (Rau má)', maxSafeDose: 'An toàn 100%', function: 'Làm dịu khẩn cấp, kháng viêm mụn' }
  ];

  // =========================================================================
  // 3. QUẢN LÝ NGƯỜI DÙNG & PHÂN QUYỀN RBAC (Users & Roles)
  // =========================================================================
  const [usersList, setUsersList] = useState([
    { id: 'usr-1', email: 'lananh.beauty@gmail.com', name: 'Nguyễn Lan Anh', role: 'BUYER', rank: 'Hạng Kim Cương', status: 'ACTIVE', spent: '18.400.000₫' },
    { id: 'usr-2', email: 'spammer99@junk.com', name: 'Trần Văn Bom Hàng', role: 'BUYER', rank: 'Hạng Chuẩn', status: 'LOCKED', spent: '0₫' },
    { id: 'usr-3', email: 'staff.audit@cosmetics.com', name: 'Lê Thanh (Kiểm Duyệt Viên)', role: 'STAFF_AUDITOR', rank: 'Nhân viên sàn', status: 'ACTIVE', spent: 'N/A' },
    { id: 'usr-4', email: 'staff.finance@cosmetics.com', name: 'Hoàng Minh (Kế Toán Đối Soát)', role: 'STAFF_ACCOUNTANT', rank: 'Nhân viên sàn', status: 'ACTIVE', spent: 'N/A' }
  ]);

  // =========================================================================
  // 4. CHIẾN DỊCH MARKETING TOÀN SÀN (Platform Vouchers & Flash Sales)
  // =========================================================================
  const [platformVouchers, setPlatformVouchers] = useState([
    { code: 'BEAUTYFEST50K', title: 'Siêu Sale Toàn Sàn Giảm 50k', minSpend: 399000, discount: 50000, type: 'PLATFORM' },
    { code: 'FREESHIPMAX', title: 'Freeship Toàn Quốc Không Giới Hạn', minSpend: 149000, discount: 30000, type: 'FREESHIP' }
  ]);

  const [flashSaleSlots, setFlashSaleSlots] = useState([
    { time: '00:00 - 02:00', title: 'Deal Nửa Đêm (Midnight Flash Sale)', itemsCount: 45, status: 'ENDED' },
    { time: '12:00 - 14:00', title: 'Khung Giờ Vàng Nghỉ Trưa', itemsCount: 88, status: 'ACTIVE' },
    { time: '20:00 - 22:00', title: 'Đêm Hội Săn Sale Mỹ Phẩm', itemsCount: 120, status: 'UPCOMING' }
  ]);

  // =========================================================================
  // 5. TRỌNG TÀI PHÂN XỬ TRANH CHẤP / ĐỔI TRẢ (Dispute Resolution Center)
  // =========================================================================
  const [disputes, setDisputes] = useState(() => crossZoneSync.getDisputes());

  // =========================================================================
  // 6. QUẢN LÝ TÀI CHÍNH, SỔ CÁI & ĐỐI SOÁT (Double-Entry Ledger & Escrow)
  // =========================================================================
  const [platformFinance, setPlatformFinance] = useState(() => {
    const fin = crossZoneSync.getFinance();
    return {
      commissionRate: 10,
      escrowHolding: fin.escrowHolding || 245800000,
      totalRevenueAccumulated: fin.totalRevenueAccumulated || 89400000,
      pendingWithdrawRequests: fin.pendingWithdrawRequests || []
    };
  });

  // Cross-zone reactive synchronization
  React.useEffect(() => {
    return crossZoneSync.subscribe(() => {
      setDisputes(crossZoneSync.getDisputes());
      const fin = crossZoneSync.getFinance();
      setPlatformFinance(prev => ({
        ...prev,
        escrowHolding: fin.escrowHolding,
        totalRevenueAccumulated: fin.totalRevenueAccumulated,
        pendingWithdrawRequests: fin.pendingWithdrawRequests || []
      }));
    });
  }, []);

  const ledgerRecords = [
    { id: 'L-101', type: 'ESCROW_COLLECTION', debit: 620000, credit: 0, account: 'CASH_CLEARING', note: 'Thu tiền khách hàng qua cổng VNPAY đơn ORD-882341' },
    { id: 'L-102', type: 'SELLER_ALLOCATION', debit: 0, credit: 558000, account: 'SELLER_PAYABLE', note: 'Tạm ghi nhận 90% cho ví Seller Innisfree' },
    { id: 'L-103', type: 'COMMISSION_EARNED', debit: 0, credit: 62000, account: 'PLATFORM_REVENUE', note: 'Hoa hồng sàn 10% ghi nhận doanh thu' }
  ];

  // =========================================================================
  // 7. HỆ THỐNG PHÒNG CHỐNG GIAN LẬN & AN NINH SÀN (Anti-Fraud & Bot Guard)
  // =========================================================================
  const [fraudAlerts, setFraudAlerts] = useState([
    {
      id: 'FRAUD-101',
      type: 'TẠO TÀI KHOẢN ẢO GOM VOUCHER (Sybil Attack)',
      deviceFingerprint: 'FP-9823-Chrome120-VN',
      ip: '113.161.44.12',
      riskScore: 94,
      actionTaken: 'TỰ ĐỘNG CHẶN IP & KHÓA 12 TÀI KHOẢN',
      time: '10 phút trước'
    },
    {
      id: 'FRAUD-102',
      type: 'ĐÁNH GIÁ ẢO NÂNG SAO (Brushing Review)',
      deviceFingerprint: 'FP-4412-Firefox-VN',
      ip: '14.162.88.90',
      riskScore: 82,
      actionTaken: 'ẨN ĐÁNH GIÁ & CẢNH CÁO GIAN HÀNG',
      time: '35 phút trước'
    },
    {
      id: 'FRAUD-103',
      type: 'TẤN CÔNG BRUTE-FORCE MẬT KHẨU',
      deviceFingerprint: 'FP-UNKNOWN-BOT',
      ip: '45.134.20.10',
      riskScore: 98,
      actionTaken: 'RATE LIMIT KÍCH HOẠT (CHẶN 24H)',
      time: '1 giờ trước'
    }
  ]);

  // =========================================================================
  // 8. GIÁM SÁT SỨC KHỎE CỤM MICROSERVICES (System Health & APM)
  // =========================================================================
  const [systemHealth, setSystemHealth] = useState([
    { service: 'api-gateway', port: 8080, status: 'UP', latency: '4ms', rps: '420 req/s' },
    { service: 'account-service (R2DBC)', port: 8081, status: 'UP', latency: '12ms', rps: '150 req/s' },
    { service: 'catalog-service (MongoDB)', port: 8082, status: 'UP', latency: '15ms', rps: '680 req/s' },
    { service: 'order-service (Kafka Outbox)', port: 8083, status: 'UP', latency: '18ms', rps: '95 req/s' },
    { service: 'inventory-service (CAS Atomic)', port: 8084, status: 'UP', latency: '8ms', rps: '110 req/s' },
    { service: 'payment-service (Ledger)', port: 8085, status: 'UP', latency: '22ms', rps: '70 req/s' },
    { service: 'ai-advisor-service (pgvector)', port: 8086, status: 'UP', latency: '45ms', rps: '40 req/s' }
  ]);

  // Handlers
  const handleApproveShop = (shopId) => {
    setShops(shops.map(s => s.id === shopId ? { ...s, status: 'APPROVED', isOfficialMall: true } : s));
    alert(`Đã phê duyệt gian hàng ${shopId} và cấp huy hiệu OFFICIAL MALL chính thức!`);
  };

  const handleToggleBlockShop = (shopId) => {
    setShops(shops.map(s => s.id === shopId ? { ...s, status: s.status === 'BLOCKED' ? 'APPROVED' : 'BLOCKED' } : s));
    alert(`Đã thay đổi trạng thái khóa/mở khóa cho gian hàng ${shopId}`);
  };

  const handleApproveProduct = (prodId) => {
    setPendingProducts(pendingProducts.filter(p => p.id !== prodId));
    alert(`Đã duyệt sản phẩm ${prodId} thành công! Sản phẩm đã hiển thị công khai trên sàn.`);
  };

  const handleRejectProduct = (prodId, reason) => {
    setPendingProducts(pendingProducts.filter(p => p.id !== prodId));
    alert(`Đã bác bỏ sản phẩm ${prodId}. Lý do: ${reason}`);
  };

  const handleResolveDispute = (disputeId, decision) => {
    crossZoneSync.resolveDispute(disputeId, decision);
    setDisputes(disputes.map(d => d.disputeId === disputeId ? { ...d, status: decision } : d));
    if (decision === 'REFUNDED_TO_BUYER') {
      alert(`Phán quyết trọng tài: ĐỒNG Ý HOÀN TIỀN cho người mua từ tài khoản ký quỹ Escrow.`);
    } else {
      alert(`Phán quyết trọng tài: BẢO VỆ NGƯỜI BÁN, giải ngân số tiền vào ví Seller.`);
    }
  };

  const handleApproveWithdrawal = (wdrId) => {
    crossZoneSync.approveWithdrawal(wdrId);
    setPlatformFinance({
      ...platformFinance,
      pendingWithdrawRequests: platformFinance.pendingWithdrawRequests.filter(w => w.id !== wdrId)
    });
    alert(`Đã ký duyệt lệnh chuyển khoản ngân hàng ${wdrId} cho đối tác.`);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', minHeight: '80vh', paddingBottom: '60px' }}>
      {/* =========================================================================
          LEFT NAVIGATION SIDEBAR (7 Phân hệ Quản trị viên Sàn)
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
              <AuraBrandLogo variant="compact" size={36} onClick={onNavigateHome} />
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: 800, margin: 0, color: '#0f172a' }}>Admin Console</h3>
                <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700 }}>● Ban Quản Trị Sàn</span>
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
          { id: 'merchants', label: '1. Kiểm duyệt Gian hàng', icon: Store, badge: shops.filter(s => s.status === 'PENDING').length },
          { id: 'products', label: '2. Duyệt Sản phẩm & Chất cấm', icon: Package, badge: pendingProducts.filter(p => p.status === 'PENDING_APPROVAL').length },
          { id: 'users', label: '3. Người dùng & Phân quyền', icon: Users },
          { id: 'campaigns', label: '4. Chiến dịch Marketing Sàn', icon: Tag },
          { id: 'disputes', label: '5. Trọng tài Khiếu nại / Đổi trả', icon: Scale, badge: disputes.filter(d => d.status === 'UNDER_REVIEW').length },
          { id: 'finance', label: '6. Tài chính, Escrow & Sổ cái', icon: DollarSign, badge: platformFinance.pendingWithdrawRequests.length },
          { id: 'analytics', label: '7. Báo cáo GMV & Thống kê', icon: TrendingUp },
          { id: 'antifraud', label: '8. Phòng Chống Gian Lận (Anti-Fraud)', icon: ShieldAlert, badge: fraudAlerts.length },
          { id: 'system', label: '9. Giám Sát Cụm Microservices', icon: Activity }
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
                color: isActive ? '#b45309' : '#334155',
                fontSize: '12.5px',
                fontWeight: isActive ? 750 : 600,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s'
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="admin-sidebar-active-pill"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: '#fef3c7',
                    borderRadius: '10px',
                    border: '1px solid #fde68a',
                    zIndex: 0
                  }}
                />
              )}
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={17} style={{ color: isActive ? '#b45309' : '#64748b' }} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span style={{ position: 'relative', zIndex: 1, fontSize: '11px', background: '#ef4444', color: '#fff', padding: '1px 7px', borderRadius: '9999px', fontWeight: 800 }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </aside>

      {/* =========================================================================
          MAIN ADMIN WORKSPACE
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
            TAB 1: QUẢN LÝ & KIỂM DUYỆT THƯƠNG HIỆU (Official Mall & Legal)
            ========================================================================= */}
        {activeTab === 'merchants' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Thẩm Định Pháp Lý &amp; Cấp Nhãn Official Mall
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                    Chỉ cấp nhãn Chính Hãng cho gian hàng có Giấy Phép Kinh Doanh và Giấy Công Bố Mỹ Phẩm hợp lệ.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {shops.map(s => (
                  <div
                    key={s.id}
                    style={{
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '16px',
                      background: s.status === 'BLOCKED' ? '#fef2f2' : '#ffffff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '14px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: '#0f172a' }}>{s.name}</h4>
                        {s.isOfficialMall && (
                          <span style={{ background: '#ec4899', color: '#fff', fontSize: '10.5px', fontWeight: 800, padding: '2px 7px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <ShieldCheck size={12} /> OFFICIAL MALL
                          </span>
                        )}
                        <span style={{
                          background: s.status === 'APPROVED' ? '#ecfdf5' : s.status === 'PENDING' ? '#fef3c7' : '#fee2e2',
                          color: s.status === 'APPROVED' ? '#059669' : s.status === 'PENDING' ? '#d97706' : '#dc2626',
                          fontSize: '11px',
                          fontWeight: 750,
                          padding: '2px 7px',
                          borderRadius: '6px'
                        }}>
                          {s.status}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                        <span>Email chủ shop: <strong>{s.ownerEmail}</strong></span>
                        <span>Mã số thuế: <strong>{s.taxCode}</strong></span>
                        <span>Giấy công bố: <strong>{s.cosmeticLicense}</strong></span>
                      </div>
                      <div style={{ fontSize: '11.5px', color: s.violationCount > 0 ? '#ef4444' : '#10b981', marginTop: '4px', fontWeight: 650 }}>
                        {s.violationCount > 0 ? `⚠️ Có ${s.violationCount} báo cáo vi phạm hàng giả/hết date` : '✓ Điểm tín nhiệm an toàn: 100/100'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {s.status === 'PENDING' && (
                        <button
                          onClick={() => handleApproveShop(s.id)}
                          style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                        >
                          ✓ Duyệt Cấp Nhãn Mall
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleBlockShop(s.id)}
                        style={{
                          background: s.status === 'BLOCKED' ? '#0f172a' : '#ef4444',
                          color: '#fff',
                          border: 'none',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {s.status === 'BLOCKED' ? 'Mở Khóa Shop' : 'Khóa Vi Phạm'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: DUYỆT SẢN PHẨM & QUÉT CHẤT CẤM (Safety Compliance)
            ========================================================================= */}
        {activeTab === 'products' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                Hàng Đợi Kiểm Duyệt Số Công Bố Mỹ Phẩm &amp; Quét Chất Cấm ({pendingProducts.length})
              </h3>
              <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '16px' }}>
                Hệ thống AI tự động đối chiếu danh pháp thành phần INCI với danh mục chất cấm/hạn chế của Hiệp định Mỹ phẩm ASEAN.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {pendingProducts.map(p => (
                  <div
                    key={p.id}
                    style={{
                      border: p.safetyStatus === 'PASS' ? '1.5px solid #a7f3d0' : '1.5px solid #fca5a5',
                      borderRadius: '12px',
                      padding: '16px',
                      background: p.safetyStatus === 'PASS' ? '#f0fdf4' : '#fef2f2'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 4px 0', color: '#0f172a' }}>{p.name}</h4>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Đăng bởi: <strong>{p.shopName}</strong></span>
                        <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: 700, marginTop: '4px' }}>
                          Số CBMP: {p.registrationNumber}
                        </div>
                      </div>
                      <span style={{
                        background: p.safetyStatus === 'PASS' ? '#10b981' : '#ef4444',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '3px 9px',
                        borderRadius: '9999px'
                      }}>
                        {p.safetyStatus === 'PASS' ? '✓ AN TOÀN ĐẠT CHUẨN' : '🚨 CẢNH BÁO CHẤT CẤM / KEM TRỘN'}
                      </span>
                    </div>

                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#334155', background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <strong>Thành phần INCI khai báo:</strong> {p.inciSummary}
                    </div>

                    <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      {p.safetyStatus === 'PASS' ? (
                        <button
                          onClick={() => handleApproveProduct(p.id)}
                          style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                        >
                          ✓ Duyệt &amp; Cho Phép Bán Toàn Sàn
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRejectProduct(p.id, 'Phát hiện chất cấm Corticoid/Thủy ngân không rõ nguồn gốc')}
                          style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                        >
                          ✕ Bác Bỏ &amp; Cấm Lưu Hành
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Từ điển hoạt chất chuẩn */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
                Từ Điển Hoạt Chất Chuẩn Sàn Mỹ Phẩm
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                {standardIngredients.map(ing => (
                  <div key={ing.name} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 750, color: '#0f172a' }}>{ing.name}</div>
                    <div style={{ fontSize: '11px', color: '#ec4899', fontWeight: 700, margin: '2px 0' }}>Nồng độ tối đa an toàn: {ing.maxSafeDose}</div>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{ing.function}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: QUẢN LÝ NGƯỜI DÙNG & PHÂN QUYỀN RBAC (Users & Staff)
            ========================================================================= */}
        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                Quản Lý Tài Khoản Toàn Sàn &amp; Phân Quyền Vận Hành (RBAC)
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                    <th style={{ padding: '12px' }}>Tên &amp; Email</th>
                    <th style={{ padding: '12px' }}>Vai Trò (Role)</th>
                    <th style={{ padding: '12px' }}>Cấp Bậc / Quyền Hạn</th>
                    <th style={{ padding: '12px' }}>Chi Tiêu</th>
                    <th style={{ padding: '12px' }}>Trạng Thái</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{u.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{u.email}</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <code style={{ fontSize: '11px', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>{u.role}</code>
                      </td>
                      <td style={{ padding: '12px', fontWeight: 650, color: '#334155' }}>{u.rank}</td>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#ec4899' }}>{u.spent}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          background: u.status === 'ACTIVE' ? '#ecfdf5' : '#fee2e2',
                          color: u.status === 'ACTIVE' ? '#059669' : '#dc2626',
                          fontSize: '11px',
                          fontWeight: 750,
                          padding: '2px 8px',
                          borderRadius: '9999px'
                        }}>
                          {u.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button
                          onClick={() => alert(`Đã cập nhật trạng thái người dùng: ${u.email}`)}
                          style={{ background: '#f1f5f9', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 650, cursor: 'pointer' }}
                        >
                          {u.status === 'ACTIVE' ? 'Khóa' : 'Mở'}
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
            TAB 4: CHIẾN DỊCH MARKETING TOÀN SÀN (Platform Campaigns)
            ========================================================================= */}
        {activeTab === 'campaigns' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Mã Giảm Giá Toàn Sàn (Platform Vouchers) &amp; Freeship
                </h3>
                <button
                  onClick={() => alert('Đã phát hành Voucher Toàn Sàn mới!')}
                  style={{ background: '#ec4899', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  + Tạo Voucher Sàn Mới
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {platformVouchers.map(v => (
                  <div key={v.code} style={{ border: '1.5px dashed #f472b6', borderRadius: '12px', padding: '16px', background: '#fdf2f8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#be185d' }}>{v.code}</span>
                      <span style={{ fontSize: '11px', background: '#0f172a', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>{v.type}</span>
                    </div>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px 0' }}>{v.title}</h4>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Áp dụng chung cho tất cả các đơn từ {v.minSpend.toLocaleString('vi-VN')}₫</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
                Khung Giờ Flash Sale Toàn Sàn
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {flashSaleSlots.map(f => (
                  <div key={f.time} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>{f.time}</strong> - {f.title}
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                        Đã duyệt <strong>{f.itemsCount} sản phẩm</strong> từ các thương hiệu tham gia
                      </div>
                    </div>
                    <span style={{
                      background: f.status === 'ACTIVE' ? '#ecfdf5' : f.status === 'UPCOMING' ? '#eff6ff' : '#f1f5f9',
                      color: f.status === 'ACTIVE' ? '#059669' : f.status === 'UPCOMING' ? '#2563eb' : '#64748b',
                      fontSize: '11px',
                      fontWeight: 750,
                      padding: '3px 8px',
                      borderRadius: '9999px'
                    }}>
                      {f.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: TRỌNG TÀI PHÂN XỬ TRANH CHẤP / ĐỔI TRẢ (Dispute Resolution)
            ========================================================================= */}
        {activeTab === 'disputes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                Tòa Trọng Tài Sàn - Phân Xử Khiếu Nại Đổi Trả / Dị Ứng / Hàng Vỡ ({disputes.length})
              </h3>
              <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '16px' }}>
                Khi Người Mua và Người Bán không thống nhất đổi trả, Admin xem xét hình ảnh minh chứng để ra phán quyết cuối cùng.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {disputes.map(d => (
                  <div key={d.disputeId} style={{ border: '1.5px solid #fed7aa', borderRadius: '12px', padding: '16px', background: '#fffbeb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#9a3412' }}>{d.disputeId} (Đơn {d.orderId})</span>
                      <span style={{ fontSize: '11px', background: '#ea580c', color: '#fff', padding: '2px 8px', borderRadius: '9999px', fontWeight: 750 }}>
                        {d.status}
                      </span>
                    </div>

                    <div style={{ marginTop: '8px', fontSize: '12.5px', color: '#334155' }}>
                      <div>Khách mua: <strong>{d.buyerEmail}</strong> kiện Shop: <strong>{d.shopName}</strong></div>
                      <div style={{ margin: '4px 0' }}>Số tiền tranh chấp: <strong style={{ color: '#ec4899' }}>{d.amount.toLocaleString('vi-VN')}₫</strong></div>
                      <div>Lý do khiếu nại: <em>"{d.reason}"</em></div>
                      <div style={{ marginTop: '4px', color: '#0369a1', fontWeight: 650 }}>Minh chứng: 📁 {d.evidenceMedia}</div>
                    </div>

                    <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={() => handleResolveDispute(d.disputeId, 'REFUNDED_TO_BUYER')}
                        style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        ✓ Hoàn Tiền Cho Khách
                      </button>
                      <button
                        onClick={() => handleResolveDispute(d.disputeId, 'SETTLED_TO_SELLER')}
                        style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Bảo Vệ Người Bán (Bác Yêu Cầu)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: TÀI CHÍNH, ESCROW & SỔ CÁI (Double-Entry Ledger)
            ========================================================================= */}
        {activeTab === 'finance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* KPI Tài chính */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <MotionCard hoverScale={1.02} glow glowColor="rgba(236, 72, 153, 0.15)" style={{ padding: '20px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 650 }}>Tài khoản Ký quỹ Escrow (Đang giữ)</span>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#ec4899', margin: '4px 0' }}>
                  <NumberTicker value={platformFinance.escrowHolding} suffix="₫" />
                </div>
                <AnimatedBadge variant="purple" pulse>Bảo vệ an toàn cho cả Buyer &amp; Seller</AnimatedBadge>
              </MotionCard>
              <MotionCard hoverScale={1.02} glow glowColor="rgba(16, 185, 129, 0.15)" style={{ padding: '20px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 650 }}>Doanh thu thuần từ phí hoa hồng sàn (10%)</span>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>
                  <NumberTicker value={platformFinance.totalRevenueAccumulated} suffix="₫" />
                </div>
                <AnimatedBadge variant="success" pulse>Tăng trưởng +18.5% tháng này</AnimatedBadge>
              </MotionCard>
              <MotionCard hoverScale={1.02} glow glowColor="rgba(217, 119, 6, 0.15)" style={{ padding: '20px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 650 }}>Lệnh rút tiền chờ phê duyệt</span>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#d97706', margin: '4px 0' }}>
                  <NumberTicker value={platformFinance.pendingWithdrawRequests.length} suffix=" lệnh" />
                </div>
                <AnimatedBadge variant="warning" pulse>Cần xác thực tài khoản ngân hàng</AnimatedBadge>
              </MotionCard>
            </div>

            {/* Duyệt rút tiền */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
                Lệnh Rút Tiền Của Các Gian Hàng Chờ Phê Duyệt
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {platformFinance.pendingWithdrawRequests.map(w => (
                  <div key={w.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 750, color: '#0f172a' }}>{w.shopName}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                        Số tiền rút: <strong style={{ color: '#ec4899' }}>{w.amount.toLocaleString('vi-VN')}₫</strong> | STK: {w.bank}
                      </div>
                    </div>
                    <button
                      onClick={() => handleApproveWithdrawal(w.id)}
                      style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      ✓ Duyệt &amp; Giải Ngân
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bảng Sổ Cái Kép (Double-Entry Ledger) */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                Bảng Cân Đối Sổ Cái Kép Kế Toán Sàn (Double-Entry Ledger)
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                    <th style={{ padding: '10px' }}>Mã bút toán</th>
                    <th style={{ padding: '10px' }}>Tài khoản</th>
                    <th style={{ padding: '10px' }}>Nợ (Debit)</th>
                    <th style={{ padding: '10px' }}>Có (Credit)</th>
                    <th style={{ padding: '10px' }}>Diễn giải nghiệp vụ</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerRecords.map(l => (
                    <tr key={l.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px' }}><code>{l.id}</code></td>
                      <td style={{ padding: '10px', fontWeight: 700 }}>{l.account}</td>
                      <td style={{ padding: '10px', color: l.debit > 0 ? '#10b981' : '#94a3b8', fontWeight: 700 }}>
                        {l.debit > 0 ? `${l.debit.toLocaleString('vi-VN')}₫` : '-'}
                      </td>
                      <td style={{ padding: '10px', color: l.credit > 0 ? '#ec4899' : '#94a3b8', fontWeight: 700 }}>
                        {l.credit > 0 ? `${l.credit.toLocaleString('vi-VN')}₫` : '-'}
                      </td>
                      <td style={{ padding: '10px', color: '#475569' }}>{l.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 7: BÁO CÁO GMV & THỐNG KÊ TOÀN SÀN (Analytics & BI)
            ========================================================================= */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                Thống Kê Tổng Giá Trị Giao Dịch Sàn (GMV)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>GMV Quý 4/2026</span>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>1.480.000.000₫</div>
                  <span style={{ fontSize: '11px', color: '#10b981' }}>↑ Đạt 112% chỉ tiêu đề ra</span>
                </div>
                <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Tổng số người mua mới</span>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>+12.450</div>
                  <span style={{ fontSize: '11px', color: '#10b981' }}>↑ Tăng 22% nhờ AI Da Liễu</span>
                </div>
                <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Tổng thương hiệu chính hãng</span>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>48 Official Malls</div>
                  <span style={{ fontSize: '11px', color: '#3b82f6' }}>Tỷ lệ duyệt đạt 94%</span>
                </div>
              </div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
                Top 3 Thương Hiệu Có Doanh Số Cao Nhất Toàn Sàn
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { rank: 1, name: 'Innisfree Vietnam Official Mall', gmv: '620.500.000₫', orders: '2.140 đơn' },
                  { rank: 2, name: 'Cosrx Official Store', gmv: '410.200.000₫', orders: '1.450 đơn' },
                  { rank: 3, name: 'Anua Official Heartleaf Store', gmv: '280.900.000₫', orders: '980 đơn' }
                ].map(b => (
                  <div key={b.rank} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', background: '#f8fafc', borderRadius: '10px', fontSize: '13px' }}>
                    <div>
                      <strong style={{ color: '#ec4899', marginRight: '10px' }}>Top #{b.rank}</strong>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{b.name}</span>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', marginRight: '16px' }}>{b.orders}</span>
                      <strong style={{ color: '#0f172a' }}>{b.gmv}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 8: PHÒNG CHỐNG GIAN LẬN & AN NINH MẠNG (Anti-Fraud & Bot Guard)
            ========================================================================= */}
        {activeTab === 'antifraud' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Graphify Anti-Fraud Ring Graph */}
            <AdminGraphifyExplorer initialTab="antifraud" />

            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldAlert size={20} style={{ color: '#ef4444' }} /> Hệ Thống Phát Hiện Gian Lận &amp; Bot Guard Bằng Machine Learning
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                    Phân tích mẫu hành vi Device Fingerprinting, tần suất gửi đơn và địa chỉ IP để ngăn chặn trục lợi Voucher toàn sàn &amp; Brushing Review.
                  </p>
                </div>
                <span style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 800 }}>
                  ● SHIELD ACTIVE 24/7
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {fraudAlerts.map(f => (
                  <div key={f.id} style={{ border: '1px solid #fecdd3', borderRadius: '12px', padding: '16px', background: '#fff1f2' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, background: '#e11d48', color: '#fff', padding: '2px 8px', borderRadius: '6px' }}>
                            {f.id}
                          </span>
                          <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#9f1239', margin: 0 }}>
                            {f.type}
                          </h4>
                        </div>
                        <div style={{ fontSize: '12px', color: '#475569', marginTop: '6px' }}>
                          Device Fingerprint: <code>{f.deviceFingerprint}</code> | IP Nguồn: <code>{f.ip}</code>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Điểm rủi ro:</span>
                        <div style={{ fontSize: '20px', fontWeight: 900, color: '#e11d48' }}>{f.riskScore}/100</div>
                      </div>
                    </div>

                    <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #fecdd3', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px' }}>
                      <span style={{ color: '#059669', fontWeight: 700 }}>
                        🛡️ Biện pháp xử lý: {f.actionTaken}
                      </span>
                      <span style={{ color: '#94a3b8' }}>{f.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 9: GIÁM SÁT CỤM MICROSERVICES (System Health & APM)
            ========================================================================= */}
        {activeTab === 'system' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Graphify Microservices Topology Graph */}
            <AdminGraphifyExplorer initialTab="topology" />

            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Server size={20} style={{ color: '#3b82f6' }} /> Giám Sát Cụm Microservices Phân Tán (Spring WebFlux 100% Non-Blocking)
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                    Trạng thái trực tiếp của 6 Services nghiệp vụ, 1 Gateway định tuyến và các kết nối R2DBC, MongoDB, Kafka Broker.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Cụm dịch vụ đang chạy ổn định. P95 latency: 18ms')}
                  style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '6px 14px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <RefreshCw size={13} /> Làm Mới Metrics
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {systemHealth.map(svc => (
                  <div key={svc.service} style={{ border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 750, color: '#0f172a' }}>{svc.service}</span>
                      <span style={{ background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '999px', fontSize: '10.5px', fontWeight: 800 }}>
                        ● {svc.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                      <span>Port nội bộ: <code>:{svc.port}</code></span>
                      <span>Độ trễ: <strong style={{ color: '#059669' }}>{svc.latency}</strong></span>
                    </div>

                    <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 650, marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #e2e8f0' }}>
                      Throughput: {svc.rps}
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
