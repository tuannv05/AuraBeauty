import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, ShoppingBag, Truck, Printer, RotateCcw, Settings, Plus,
  Sparkles, ShieldCheck, Tag, Zap, TrendingUp, Users, Video, Gift,
  MessageSquare, Bot, Star, DollarSign, Wallet, Landmark, BarChart2,
  Award, Store, Palette, Moon, ShieldAlert, ChevronDown, ChevronRight,
  Download, Grid, BookOpen, Bell, ArrowRight, X, ExternalLink, HelpCircle
} from 'lucide-react';
import { DEMO_SHOPS, crossZoneSync } from '../lib/crossZoneSync';
import {
  OrderManagementViews,
  ProductManagementViews,
  MarketingViews,
  CustomerServiceViews,
  FinanceViews,
  DataAnalyticsViews,
  ShopManagementViews
} from '../features/seller';
import WholesaleDashboard from './WholesaleDashboard';
import { NumberTicker, AnimatedBadge, SpringButton, AuraBrandLogo } from './ui';

// ============================================================================
// 7 PHÂN HỆ & 32 SUB-MENUS KÊNH NGƯỜI BÁN AURA (AURA SELLER CENTER)
// ============================================================================
const SELLER_NAVIGATION = [
  {
    id: 'orders',
    title: '1. Quản Lý Đơn Hàng',
    icon: Package,
    submenus: [
      { id: 'orders/all', label: 'Tất cả đơn hàng', badgeKey: 'ordersPending' },
      { id: 'orders/mass-ship', label: 'Giao hàng loạt & In AWB' },
      { id: 'orders/handover', label: 'Bàn giao đơn hàng' },
      { id: 'orders/return-refund', label: 'Trả hàng/Hoàn tiền', badgeKey: 'ordersRefund' },
      { id: 'orders/shipping-settings', label: 'Cài đặt vận chuyển & Kho' }
    ]
  },
  {
    id: 'products',
    title: '2. Quản Lý Sản Phẩm',
    icon: ShoppingBag,
    submenus: [
      { id: 'products/all', label: 'Tất cả sản phẩm & Lô date' },
      { id: 'products/add', label: '+ Thêm sản phẩm & VTO AR' },
      { id: 'products/standard', label: 'Sản phẩm tiêu chuẩn Aura Mall' },
      { id: 'products/ai-optimizer', label: 'Công cụ tối ưu AI & Graphify', highlight: true }
    ]
  },
  {
    id: 'marketing',
    title: '3. Kênh Marketing',
    icon: Tag,
    submenus: [
      { id: 'marketing/center', label: 'Kênh Marketing tổng quan' },
      { id: 'marketing/bidding', label: 'Đấu giá Rẻ Vô Địch' },
      { id: 'marketing/display-ads', label: 'Quảng cáo tìm kiếm Aura Ads' },
      { id: 'marketing/off-platform-ads', label: 'Quảng cáo ngoại sàn' },
      { id: 'marketing/kol-affiliate', label: 'Tăng đơn cùng KOL' },
      { id: 'marketing/live-video', label: 'Live & Video' },
      { id: 'marketing/discounts', label: 'Khuyến mãi của Shop' },
      { id: 'marketing/flash-sale', label: 'Flash Sale của Shop' },
      { id: 'marketing/vouchers', label: 'Mã giảm giá của Shop' },
      { id: 'marketing/shopee-campaigns', label: 'Chương trình Sàn Aura' }
    ]
  },
  {
    id: 'cs',
    title: '4. Chăm Sóc Khách Hàng',
    icon: MessageSquare,
    submenus: [
      { id: 'cs/chat', label: 'Quản lý Chat & Skin Profile', badgeKey: 'unreadChat' },
      { id: 'cs/ai-assistant', label: 'Trợ lý Chat AI tư vấn da' },
      { id: 'cs/broadcast', label: 'Tin nhắn quảng bá' },
      { id: 'cs/reviews', label: 'Quản lý đánh giá' }
    ]
  },
  {
    id: 'finance',
    title: '5. Tài Chính',
    icon: DollarSign,
    submenus: [
      { id: 'finance/revenue', label: 'Doanh thu & Quyết toán' },
      { id: 'finance/balance', label: 'Số dư Ví Aura & Rút tiền' },
      { id: 'finance/bank-accounts', label: 'Tài khoản ngân hàng' }
    ]
  },
  {
    id: 'data',
    title: '6. Dữ Liệu',
    icon: BarChart2,
    submenus: [
      { id: 'data/sales-analytics', label: 'Phân tích bán hàng & VTO' },
      { id: 'data/operation-performance', label: 'Hiệu quả hoạt động & Sao Quả Tạ' }
    ]
  },
  {
    id: 'shop',
    title: '7. Quản Lý Shop',
    icon: Store,
    submenus: [
      { id: 'shop/profile', label: 'Hồ sơ Shop & Official Mall' },
      { id: 'shop/decoration', label: 'Trang trí Shop' },
      { id: 'shop/settings', label: 'Thiết lập Shop & Chế độ nghỉ' },
      { id: 'shop/appeals', label: 'Quản lý các khiếu nại' },
      { id: 'shop/missions', label: 'Nhiệm vụ Người Bán & Thưởng' }
    ]
  }
];

// BACKWARD COMPATIBLE ALIAS MAP (9 Old Keys)
const ALIAS_MAP = {
  overview: 'data/sales-analytics',
  products: 'products/all',
  inventory: 'products/all',
  orders: 'orders/all',
  warehouses: 'orders/shipping-settings',
  ads: 'marketing/display-ads',
  marketing: 'marketing/center',
  cs: 'cs/chat',
  finance: 'finance/revenue',
  wholesale: 'wholesale'
};

export default function SellerZone({ user, onNavigateHome, activeTab: propTab, onTabChange, onAddToast }) {
  const [internalTab, setInternalTab] = useState('orders/all');
  const rawTab = propTab !== undefined ? propTab : internalTab;

  // Resolve alias
  const activeRouteKey = useMemo(() => {
    if (ALIAS_MAP[rawTab]) return ALIAS_MAP[rawTab];
    return rawTab || 'orders/all';
  }, [rawTab]);

  const setActiveRouteKey = (key) => {
    if (onTabChange) {
      onTabChange(key);
    } else {
      setInternalTab(key);
    }
  };

  // Current Shop State (Support Switching between Demo Shops)
  const [currentShop, setCurrentShop] = useState(DEMO_SHOPS[0]);
  const [showShopDropdown, setShowShopDropdown] = useState(false);

  // Accordion open state for sidebar
  const [expandedSections, setExpandedSections] = useState({
    orders: true,
    products: true,
    marketing: false,
    cs: false,
    finance: false,
    data: false,
    shop: false
  });

  // Modal drawers
  const [showExportDrawer, setShowExportDrawer] = useState(false);
  const [showAppGrid, setShowAppGrid] = useState(false);
  const [showAcademyModal, setShowAcademyModal] = useState(false);
  const [showQuickChat, setShowQuickChat] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Real-time notification counters from sync
  const [badgeCounters, setBadgeCounters] = useState({
    ordersPending: 1,
    ordersRefund: 1,
    unreadChat: 1
  });

  useEffect(() => {
    return crossZoneSync.subscribe(() => {
      const orders = crossZoneSync.getOrders(currentShop.id);
      const pending = orders.filter((o) => o.status === 'PENDING_CONFIRMATION').length;
      const refund = orders.filter((o) => o.status === 'RETURN_REQUESTED').length;
      setBadgeCounters((prev) => ({ ...prev, ordersPending: pending, ordersRefund: refund }));
    });
  }, [currentShop.id]);

  // Derive active section & sub-menu label for Dynamic Breadcrumb
  const { currentSectionTitle, currentSubmenuLabel } = useMemo(() => {
    if (activeRouteKey === 'wholesale') {
      return { currentSectionTitle: 'Bán Sỉ B2B', currentSubmenuLabel: 'Lumelle Wholesale Pipeline' };
    }
    for (const sec of SELLER_NAVIGATION) {
      for (const sub of sec.submenus) {
        if (sub.id === activeRouteKey) {
          return { currentSectionTitle: sec.title.replace(/^\d+\.\s*/, ''), currentSubmenuLabel: sub.label };
        }
      }
    }
    return { currentSectionTitle: 'Quản Lý Đơn Hàng', currentSubmenuLabel: 'Tất cả đơn hàng' };
  }, [activeRouteKey]);

  // Parse section and sub-part
  const [secPrefix, subPart] = activeRouteKey.includes('/')
    ? activeRouteKey.split('/')
    : [activeRouteKey, 'all'];

  return (
    <div className="min-h-screen bg-[#F6F6F9] text-slate-800 -mx-4 -mt-6 sm:-mx-6 lg:-mx-8">
      {/* =====================================================================
          1. TOP NAVIGATION BAR (HEADER KÊNH NGƯỜI BÁN)
          ===================================================================== */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm px-4 lg:px-8 py-3 flex items-center justify-between">
        {/* Left: Brand + Kênh Người Bán + Dynamic Breadcrumb */}
        <div className="flex items-center gap-4">
          <div
            onClick={onNavigateHome}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <AuraBrandLogo size={28} />
            <span className="font-extrabold text-sm tracking-tight text-slate-900 group-hover:text-pink-600 transition">
              AURA BEAUTY MALL
            </span>
          </div>

          <div className="h-5 w-px bg-slate-300 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm">
              Kênh Người Bán
            </span>

            {/* Dynamic Breadcrumb */}
            <div className="hidden md:flex items-center text-xs text-slate-400 gap-1.5 ml-1">
              <span>Trang chủ</span>
              <span>›</span>
              <span className="text-slate-600 font-semibold">{currentSectionTitle}</span>
              <span>›</span>
              <span className="text-pink-600 font-bold">{currentSubmenuLabel}</span>
            </div>
          </div>
        </div>

        {/* Right: Actions, App Grid, Academy & Shop Profile Switcher */}
        <div className="flex items-center gap-3">
          {/* Export Drawer Button */}
          <button
            onClick={() => setShowExportDrawer(true)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold"
            title="Trung tâm Xuất Báo Cáo"
          >
            <Download size={16} />
            <span className="hidden lg:inline">Xuất Báo Cáo</span>
          </button>

          {/* Quick App Menu (9 dots) */}
          <button
            onClick={() => setShowAppGrid(!showAppGrid)}
            className={`p-2 rounded-xl transition ${showAppGrid ? 'bg-pink-50 text-pink-600' : 'text-slate-600 hover:bg-slate-100'}`}
            title="Menu Ứng Dụng Nhanh"
          >
            <Grid size={18} />
          </button>

          {/* Học Viện Người Bán */}
          <button
            onClick={() => setShowAcademyModal(true)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold"
            title="Trung tâm Học Viện Người Bán"
          >
            <BookOpen size={16} />
            <span className="hidden xl:inline">Học Viện Người Bán</span>
          </button>

          {/* Shop Profile & Switcher */}
          <div className="relative">
            <div
              onClick={() => setShowShopDropdown(!showShopDropdown)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-2xl border border-slate-200 hover:border-pink-300 bg-white cursor-pointer transition shadow-sm"
            >
              <img
                src={currentShop.logo}
                alt={currentShop.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
              />
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  <span className="line-clamp-1 max-w-[130px]">{currentShop.name}</span>
                  {currentShop.isMall && (
                    <span className="text-[9px] font-extrabold text-white bg-red-600 px-1 py-0.2 rounded">
                      MALL
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400">Đổi gian hàng ▾</div>
              </div>
            </div>

            {/* Shop Switcher Dropdown */}
            <AnimatePresence>
              {showShopDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 text-xs"
                >
                  <div className="px-3 py-2 font-bold text-slate-400 text-[10px] border-b border-slate-100">
                    CHỌN GIAN HÀNG THỬ NGHIỆM SPLIT ORDER:
                  </div>
                  {DEMO_SHOPS.map((shop) => (
                    <div
                      key={shop.id}
                      onClick={() => {
                        setCurrentShop(shop);
                        setShowShopDropdown(false);
                        onAddToast?.({
                          type: 'info',
                          message: `Đã chuyển sang quản lý gian hàng: ${shop.name}`
                        });
                      }}
                      className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition ${
                        currentShop.id === shop.id ? 'bg-pink-50 font-bold text-pink-700' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={shop.logo} alt="" className="w-6 h-6 rounded-full object-cover" />
                        <div>
                          <div>{shop.name}</div>
                          <span className="text-[10px] text-slate-400">{shop.brand}</span>
                        </div>
                      </div>
                      {currentShop.id === shop.id && <span className="text-pink-600">✓</span>}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* =====================================================================
          2. MAIN BODY: LEFT SIDEBAR ACCORDION + RIGHT CONTENT
          ===================================================================== */}
      <div className="flex">
        {/* LEFT SIDEBAR ACCORDION (7 PHÂN HỆ & 32 SUB-MENUS) */}
        <aside className="w-64 lg:w-72 bg-white border-r border-slate-200 shrink-0 min-h-[calc(100vh-57px)] sticky top-[57px] self-start overflow-y-auto max-h-[calc(100vh-57px)] p-3 space-y-1">
          {SELLER_NAVIGATION.map((section) => {
            const isExpanded = expandedSections[section.id];
            const Icon = section.icon;
            const hasActiveChild = section.submenus.some((s) => s.id === activeRouteKey);

            return (
              <div key={section.id} className="rounded-xl overflow-hidden">
                {/* Section Header */}
                <button
                  onClick={() =>
                    setExpandedSections((prev) => ({
                      ...prev,
                      [section.id]: !prev[section.id]
                    }))
                  }
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition ${
                    hasActiveChild ? 'text-pink-600 bg-pink-50/50' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={hasActiveChild ? 'text-pink-600' : 'text-slate-400'} />
                    <span>{section.title}</span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Sub-menus List (Framer Motion Accordion) */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden pl-4 pr-1 py-1 space-y-0.5"
                    >
                      {section.submenus.map((sub) => {
                        const isActive = activeRouteKey === sub.id;
                        const badgeCount = sub.badgeKey ? badgeCounters[sub.badgeKey] : 0;

                        return (
                          <button
                            key={sub.id}
                            onClick={() => setActiveRouteKey(sub.id)}
                            className={`w-full px-3 py-2 rounded-lg text-xs font-medium text-left flex items-center justify-between transition ${
                              isActive
                                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-sm'
                                : sub.highlight
                                ? 'text-pink-700 font-bold bg-pink-50/60 hover:bg-pink-100/60'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                          >
                            <span className="truncate">{sub.label}</span>
                            {badgeCount > 0 && (
                              <span
                                className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                  isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
                                }`}
                              >
                                {badgeCount}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Lối tắt kênh Bán Sỉ B2B Lumelle */}
          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={() => setActiveRouteKey('wholesale')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition ${
                activeRouteKey === 'wholesale'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Store size={16} className="text-purple-600" />
                <span>Bán Sỉ B2B Lumelle</span>
              </div>
              <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-bold">
                KÊNH SỈ
              </span>
            </button>
          </div>
        </aside>

        {/* RIGHT CONTENT WORKSPACE */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden min-h-[calc(100vh-57px)]">
          {/* RENDER VIEW THEO ACTIVE ROUTE KEY */}
          {secPrefix === 'orders' && (
            <OrderManagementViews
              subTab={subPart}
              currentShop={currentShop}
              onAddToast={onAddToast}
              onNavigateSubTab={(t) => setActiveRouteKey(`orders/${t}`)}
            />
          )}

          {secPrefix === 'products' && (
            <ProductManagementViews
              subTab={subPart}
              currentShop={currentShop}
              onAddToast={onAddToast}
              onNavigateSubTab={(t) => setActiveRouteKey(`products/${t}`)}
            />
          )}

          {secPrefix === 'marketing' && (
            <MarketingViews
              subTab={subPart}
              currentShop={currentShop}
              onAddToast={onAddToast}
              onNavigateSubTab={(t) => setActiveRouteKey(`marketing/${t}`)}
            />
          )}

          {secPrefix === 'cs' && (
            <CustomerServiceViews
              subTab={subPart}
              currentShop={currentShop}
              onAddToast={onAddToast}
              onNavigateSubTab={(t) => setActiveRouteKey(`cs/${t}`)}
            />
          )}

          {secPrefix === 'finance' && (
            <FinanceViews
              subTab={subPart}
              currentShop={currentShop}
              onAddToast={onAddToast}
              onNavigateSubTab={(t) => setActiveRouteKey(`finance/${t}`)}
            />
          )}

          {secPrefix === 'data' && (
            <DataAnalyticsViews
              subTab={subPart}
              currentShop={currentShop}
              onAddToast={onAddToast}
            />
          )}

          {secPrefix === 'shop' && (
            <ShopManagementViews
              subTab={subPart}
              currentShop={currentShop}
              onAddToast={onAddToast}
              onNavigateSubTab={(t) => setActiveRouteKey(`shop/${t}`)}
            />
          )}

          {activeRouteKey === 'wholesale' && (
            <WholesaleDashboard onAddToast={onAddToast} />
          )}
        </main>
      </div>

      {/* =====================================================================
          3. RIGHT FLOATING DOCK (THANH CÔNG CỤ NỔI BÊN PHẢI)
          ===================================================================== */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* 1. Trợ lý AI Người Bán */}
        <button
          onClick={() => setShowAiModal(true)}
          className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg hover:scale-105 active:scale-95 transition flex items-center justify-center relative group"
          title="Trợ lý AI Người Bán"
        >
          <Bot size={22} />
          <span className="absolute right-14 bg-slate-900 text-white text-[11px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none shadow-md">
            Trợ lý AI Người Bán
          </span>
        </button>

        {/* 2. Chuông Thông Báo */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-md hover:bg-slate-50 active:scale-95 transition flex items-center justify-center relative"
          title="Thông Báo Mới"
        >
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold flex items-center justify-center">
            3
          </span>
        </button>

        {/* 3. Khung Aura Chat Thu Gọn */}
        <button
          onClick={() => setShowQuickChat(!showQuickChat)}
          className="w-12 h-12 rounded-2xl bg-slate-900 text-white shadow-lg hover:bg-slate-800 active:scale-95 transition flex items-center justify-center relative"
          title="Khung Chat Người Bán Aura"
        >
          <MessageSquare size={20} />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
        </button>
      </div>

      {/* =====================================================================
          4. MODALS & DRAWERS TIỆN ÍCH
          ===================================================================== */}
      {/* Drawer: Xuất Báo Cáo */}
      <AnimatePresence>
        {showExportDrawer && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Download className="text-pink-600" size={18} />
                    Trung Tâm Xuất Báo Cáo Kênh Người Bán
                  </h3>
                  <button onClick={() => setShowExportDrawer(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={18} />
                  </button>
                </div>
                <div className="space-y-3 mt-4 text-xs">
                  {[
                    { title: 'Báo cáo doanh thu & Sổ cái kép (CSV)', desc: 'Chi tiết hoa hồng sàn 10% & thực nhận 90% theo từng mã đơn con.' },
                    { title: 'Danh sách tồn kho CAS & Hạn dùng FEFO', desc: 'Kiểm soát hạn sử dụng, số lượng giữ hàng và cảnh báo cận date.' },
                    { title: 'Báo cáo tỷ lệ chuyển đổi Gương AR VTO', desc: 'Phân tích số lượt khách thử màu trên camera 60 FPS sang đơn hàng.' }
                  ].map((rep, i) => (
                    <div key={i} className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition flex items-center justify-between">
                      <div>
                        <strong className="text-slate-800">{rep.title}</strong>
                        <p className="text-[11px] text-slate-500 mt-0.5">{rep.desc}</p>
                      </div>
                      <button
                        onClick={() => {
                          onAddToast?.({ type: 'success', message: `Đang tải xuống: ${rep.title}` });
                          setShowExportDrawer(false);
                        }}
                        className="px-3 py-1.5 text-[11px] font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 rounded-lg whitespace-nowrap ml-2"
                      >
                        Tải Về
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowExportDrawer(false)}
                className="w-full py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Đóng Drawer
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* App Grid Dropdown */}
      <AnimatePresence>
        {showAppGrid && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed top-16 right-20 z-50 w-80 bg-white rounded-3xl border border-slate-200 shadow-2xl p-4 text-xs"
          >
            <div className="font-bold text-slate-400 text-[10px] pb-2 border-b border-slate-100">
              TIỆN ÍCH HỆ SINH THÁI AURA MALL:
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {[
                { label: 'Gương Thử AR 3D', desc: 'Thử màu son 60 FPS', action: () => onNavigateHome() },
                { label: 'AI Optimizer', desc: 'Tối ưu nội dung SKU', action: () => setActiveRouteKey('products/ai-optimizer') },
                { label: 'Đồ Thị Graphify', desc: 'Hiệp đồng hoạt chất', action: () => setActiveRouteKey('products/ai-optimizer') },
                { label: 'Kênh Sỉ Lumelle', desc: 'B2B Wholesale Pipeline', action: () => setActiveRouteKey('wholesale') }
              ].map((app, i) => (
                <div
                  key={i}
                  onClick={() => {
                    app.action();
                    setShowAppGrid(false);
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-pink-300 hover:bg-pink-50/50 cursor-pointer transition text-left"
                >
                  <strong className="text-slate-800 text-[11px]">{app.label}</strong>
                  <div className="text-[10px] text-slate-400">{app.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Học Viện Người Bán */}
      <AnimatePresence>
        {showAcademyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl text-xs space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <BookOpen className="text-pink-600" size={18} />
                  Học Viện Người Bán Aura Mall (Seller Academy)
                </h3>
                <button onClick={() => setShowAcademyModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-2.5">
                {[
                  { title: 'Khóa học: Tích hợp Gương Thử Son AR 60 FPS tăng x3 tỷ lệ chốt đơn', duration: '15 phút' },
                  { title: 'Hướng dẫn pháp lý: Đăng ký số công bố mỹ phẩm (CBMP) chuẩn Bộ Y Tế', duration: '20 phút' },
                  { title: 'Chiến thuật: Quản lý tồn kho nguyên tử CAS & xuất kho FEFO không âm', duration: '12 phút' }
                ].map((l, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900">{l.title}</strong>
                      <div className="text-[10px] text-slate-400">Thời lượng: {l.duration}</div>
                    </div>
                    <button
                      onClick={() => onAddToast?.({ type: 'info', message: 'Mở bài giảng Học viện Người bán...' })}
                      className="px-3 py-1 font-bold text-pink-600 bg-pink-50 rounded-lg hover:bg-pink-100"
                    >
                      Học ngay
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Chat Drawer */}
      <AnimatePresence>
        {showQuickChat && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-96 bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[480px]"
          >
            <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-bold text-xs flex items-center gap-1.5">
                <MessageSquare size={15} /> Chat Nhanh Người Bán
              </span>
              <button onClick={() => setShowQuickChat(false)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto text-xs space-y-2 bg-slate-50">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-700">
                <strong>Khách Lê Hoàng Yến:</strong> "Shop ơi son màu 01 có hợp da warm undertone không ạ?"
              </div>
              <div className="p-2.5 bg-pink-50 text-pink-800 rounded-xl border border-pink-100 text-right">
                <strong>Shop phản hồi:</strong> "Dạ tone 01 Đỏ Nhung hợp mọi tone da bạn nhé!"
              </div>
            </div>
            <div className="p-2.5 bg-white border-t border-slate-200 flex gap-1.5">
              <input
                type="text"
                placeholder="Trả lời nhanh..."
                className="flex-1 p-1.5 text-xs border rounded-lg"
              />
              <button
                onClick={() => onAddToast?.({ type: 'success', message: 'Đã gửi phản hồi nhanh!' })}
                className="px-3 py-1 bg-pink-600 text-white rounded-lg font-bold text-xs"
              >
                Gửi
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
