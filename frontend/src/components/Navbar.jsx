import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Heart, ShoppingBag, User, Menu, X, ChevronRight, ChevronDown, ArrowLeft,
  Sparkles, Camera, Mic, Trash2, ArrowUpRight, Flame, ShieldCheck, Grid, Zap,
  PhoneCall, MapPin, PackageCheck, Globe, BookOpen, Gift, Award, Home, Store
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../api';
import { searchCatalogProducts } from '../lib/searchEngine';
import { getEnrichedCatalog } from '../lib/submenuCatalogMapper';
import { AuraBrandLogo } from './ui';

const TOP_BAR_ANNOUNCEMENTS = [
  '🚚 FREESHIP TOÀN QUỐC CHO ĐƠN TỪ 199K',
  '🛡️ HOÀN TIỀN 200% NẾU PHÁT HIỆN HÀNG GIẢ - 100% CHÍNH HÃNG',
  '⚡ DEAL CHỚP NHOÁNG HÔM NAY: GIẢM ĐẾN 50% CÁC THƯƠNG HIỆU LỚN'
];

const TRENDING_KEYWORDS = [
  'Son dưỡng có màu', 'Kem chống nắng kiềm dầu', 'Serum B5 phục hồi',
  'Niacinamide 10%', 'Sữa rửa mặt CeraVe', 'Retinol tái tạo da', 'BHA 2% Paula\'s Choice'
];

const RECENT_SEARCHES_KEY = 'aura_recent_searches';

// 8 danh mục chi tiết theo đúng tiêu chuẩn sàn mỹ phẩm cao cấp
export const MEGA_MENU_CATEGORIES = [
  {
    id: 'skincare',
    name: 'Chăm sóc da mặt',
    slug: 'skincare',
    icon: '✨',
    badge: 'Hot',
    banner: {
      title: 'Routine Phục Hồi & Cấp Ẩm Chuyên Sâu',
      desc: 'Giảm đến 40% tinh chất Hyaluronic và kem dưỡng Ceramide lành tính.',
      img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80',
      actionText: 'Xem bộ sưu tập'
    },
    columns: [
      {
        title: 'Làm sạch da',
        items: ['Tẩy trang (Nước/Dầu/Sáp)', 'Sữa rửa mặt', 'Tẩy tế bào chết (Vật lý/Hóa học)']
      },
      {
        title: 'Cân bằng & Điều trị',
        items: ['Toner / Nước hoa hồng', 'Serum / Tinh chất đặc trị', 'Kem dưỡng ẩm', 'Dầu dưỡng da']
      },
      {
        title: 'Bảo vệ & Phục hồi',
        items: ['Mặt nạ (Giấy/Đất sét/Ngủ)', 'Kem chống nắng', 'Xịt khoáng làm dịu']
      }
    ]
  },
  {
    id: 'makeup',
    name: 'Trang điểm',
    slug: 'makeup',
    icon: '💄',
    banner: {
      title: 'BST Son Kem Mịn Lì & Cushion Căng Bóng',
      desc: 'Sắc son xu hướng mùa mới cùng lớp nền trong trẻo chuẩn Hàn Quốc.',
      img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&auto=format&fit=crop&q=80',
      actionText: 'Mua ngay'
    },
    columns: [
      {
        title: 'Trang điểm Mặt',
        items: ['Kem lót (Primer)', 'Kem nền (Foundation)', 'Cushion', 'Che khuyết điểm', 'Phấn phủ', 'Má hồng', 'Tạo khối / Highlight']
      },
      {
        title: 'Trang điểm Mắt',
        items: ['Kẻ mắt (Eyeliner)', 'Mascara', 'Phấn mắt', 'Kẻ mày']
      },
      {
        title: 'Trang điểm Môi',
        items: ['Son thỏi', 'Son kem / Tint', 'Son bóng', 'Son dưỡng', 'Tẩy da chết môi']
      }
    ]
  },
  {
    id: 'bodycare',
    name: 'Chăm sóc cơ thể',
    slug: 'bodycare',
    icon: '🧴',
    banner: {
      title: 'Dưỡng Thể Trắng Mịn & Lưu Hương',
      desc: 'Sữa tắm và dưỡng thể Niacinamide dưỡng sáng da toàn diện.',
      img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80',
      actionText: 'Khám phá'
    },
    columns: [
      {
        title: 'Làm sạch cơ thể',
        items: ['Sữa tắm', 'Tẩy da chết toàn thân', 'Muối tắm thư giãn']
      },
      {
        title: 'Dưỡng thể & Vệ sinh',
        items: ['Sữa dưỡng thể (Body Lotion)', 'Lăn / Xịt khử mùi', 'Kem dưỡng da tay / chân', 'Triệt lông']
      }
    ]
  },
  {
    id: 'haircare',
    name: 'Chăm sóc tóc & Da đầu',
    slug: 'haircare',
    icon: '💇‍♀️',
    banner: {
      title: 'Giải Pháp Ngừa Rụng & Phục Hồi Tóc',
      desc: 'Dầu gội bưởi và tinh dầu argan nuôi dưỡng tóc bồng bềnh bóng mượt.',
      img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80',
      actionText: 'Xem sản phẩm'
    },
    columns: [
      {
        title: 'Làm sạch & Xả tóc',
        items: ['Dầu gội', 'Dầu xả', 'Dầu gội khô']
      },
      {
        title: 'Đặc trị & Dưỡng tóc',
        items: ['Kem ủ / Mặt nạ tóc', 'Tinh dầu dưỡng tóc', 'Xịt mọc tóc', 'Thuốc nhuộm tóc']
      }
    ]
  },
  {
    id: 'fragrance',
    name: 'Nước hoa',
    slug: 'fragrance',
    icon: '🌸',
    banner: {
      title: 'Hương Thơm Đẳng Cấp & Quyến Rũ',
      desc: 'Nước hoa chính hãng từ các thương hiệu hàng đầu thế giới.',
      img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&auto=format&fit=crop&q=80',
      actionText: 'Thử mùi ngay'
    },
    columns: [
      {
        title: 'Nước hoa theo giới tính',
        items: ['Nước hoa Nữ', 'Nước hoa Nam', 'Nước hoa Unisex']
      },
      {
        title: 'Xịt thơm & Khác',
        items: ['Xịt thơm toàn thân (Body Mist)', 'Nước hoa vùng kín', 'Nước hoa chiết mini 10ml']
      }
    ]
  },
  {
    id: 'supplements',
    name: 'Thực phẩm chức năng',
    slug: 'supplements',
    icon: '💊',
    banner: {
      title: 'Inner Beauty - Khỏe Đẹp Từ Bên Trong',
      desc: 'Collagen thủy phân và viên uống chống nắng bảo vệ làn da.',
      img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
      actionText: 'Tư vấn'
    },
    columns: [
      {
        title: 'Dưỡng da & Trẻ hóa',
        items: ['Collagen', 'Viên uống trắng da', 'Viên uống trị mụn / nội tiết']
      },
      {
        title: 'Sức khỏe tổng thể',
        items: ['Vitamin tổng hợp', 'Viên uống cấp nước Hyaluronic', 'Viên uống kẽm giảm nhờn']
      }
    ]
  },
  {
    id: 'beauty-tools',
    name: 'Phụ kiện làm đẹp',
    slug: 'beauty-tools',
    icon: '🪞',
    banner: {
      title: 'Phụ Kiện Chuyên Nghiệp Cho Nàng',
      desc: 'Bông tẩy trang organic, cọ trang điểm và máy rửa mặt cao cấp.',
      img: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&auto=format&fit=crop&q=80',
      actionText: 'Xem thêm'
    },
    columns: [
      {
        title: 'Phụ kiện Makeup',
        items: ['Bông tẩy trang', 'Bộ cọ trang điểm', 'Mút tán nền', 'Kẹp bấm mi']
      },
      {
        title: 'Thiết bị & Chăm sóc',
        items: ['Máy rửa mặt', 'Máy massage nâng cơ', 'Nhíp / Dao cạo mày']
      }
    ]
  }
];

// Dữ liệu Vấn đề da (Shop by Skin Concern)
export const SKIN_CONCERNS_DATA = {
  skinTypes: [
    { title: 'Da Dầu (Oily Skin)', desc: 'Kiềm dầu, thông thoáng lỗ chân lông', query: 'Da Dầu' },
    { title: 'Da Khô (Dry Skin)', desc: 'Cấp ẩm sâu, chống bong tróc', query: 'Da Khô' },
    { title: 'Da Hỗn Hợp (Combination)', desc: 'Cân bằng ẩm - dầu vùng T-zone', query: 'Da Hỗn Hợp' },
    { title: 'Da Nhạy Cảm (Sensitive)', desc: 'Làm dịu kích ứng, củng cố màng bảo vệ', query: 'Da Nhạy Cảm' }
  ],
  concerns: [
    { title: 'Trị mụn & Mờ thâm', desc: 'Mụn viêm, mụn ẩn, thâm đỏ/đen', query: 'Mụn' },
    { title: 'Chống lão hóa & Nếp nhăn', desc: 'Tăng sinh collagen, mờ rãnh nhăn', query: 'Chống lão hóa' },
    { title: 'Dưỡng trắng & Đều màu da', desc: 'Cải thiện sạm nám, đốm nâu', query: 'Dưỡng trắng' },
    { title: 'Thu nhỏ lỗ chân lông', desc: 'Kiểm soát bã nhờn, làm mịn bề mặt', query: 'Lỗ chân lông' },
    { title: 'Phục hồi da hư tổn', desc: 'Phục hồi sau treatment, peel, kem trộn', query: 'Phục hồi' }
  ],
  ingredients: [
    { name: 'BHA / AHA', desc: 'Tẩy tế bào chết, sạch lỗ chân lông', query: 'BHA' },
    { name: 'Retinol', desc: 'Trẻ hóa tế bào, mờ nếp nhăn', query: 'Retinol' },
    { name: 'Vitamin C', desc: 'Chống oxy hóa, sáng da mờ thâm', query: 'Vitamin C' },
    { name: 'Niacinamide', desc: 'Kiềm dầu, thu nhỏ lỗ chân lông, phục hồi', query: 'Niacinamide' },
    { name: 'Hyaluronic Acid (HA)', desc: 'Cấp nước đa tầng, căng mọng da', query: 'Hyaluronic Acid' },
    { name: 'Rau má (Centella)', desc: 'Làm dịu khẩn cấp, kháng viêm mụn', query: 'Centella' }
  ]
};

// Dữ liệu Thương hiệu (Brands)
export const BRANDS_DATA = {
  hotBrands: [
    { name: 'Innisfree', country: 'Hàn Quốc', badge: 'Best Seller' },
    { name: 'La Roche-Posay', country: 'Pháp', badge: 'Dược mỹ phẩm' },
    { name: 'Cosrx', country: 'Hàn Quốc', badge: 'Trend' },
    { name: 'CeraVe', country: 'Mỹ', badge: 'Bác sĩ khuyên dùng' },
    { name: 'Paula\'s Choice', country: 'Mỹ', badge: 'Khoa học' },
    { name: 'Klairs', country: 'Hàn Quốc', badge: 'Dịu nhẹ' },
    { name: 'Some By Mi', country: 'Hàn Quốc', badge: 'Trị mụn' },
    { name: 'Anua', country: 'Hàn Quốc', badge: 'Trending' }
  ],
  categories: [
    { title: 'Dược mỹ phẩm (Derma Cosmetics)', desc: 'Được bác sĩ da liễu khuyên dùng cho da mụn, nhạy cảm' },
    { title: 'Mỹ phẩm cao cấp (High-end)', desc: 'Trải nghiệm xa xỉ, công nghệ độc quyền đẳng cấp' },
    { title: 'Mỹ phẩm thiên nhiên (Vegan / Clean)', desc: 'Thành phần thuần chay, không cồn hương liệu paraben' }
  ]
};

export default function Navbar({
  activeRole,
  setActiveRole,
  cartCount,
  onOpenCart,
  onOpenSkinProfile,
  onOpenAuthModal,
  onLogout,
  onNavigateHome,
  onNavigateCatalog,
  onNavigateCategory,
  onNavigateTracking,
  onNavigateCombos,
  onNavigateProfile,
  onNavigateAdmin,
  onNavigateSeller,
  onSelectProduct,
  onSearchSubmit,
  onOpenTopBarModal,
  onNavigateFlashSale,
  onCurrencyChange,
  onReplayIntro,
  wishlistCount = 0,
  user
}) {
  // 1. Top Bar state
  const [topBarIndex, setTopBarIndex] = useState(0);
  const [currency, setCurrency] = useState(() => localStorage.getItem('aura_currency') || 'VND');
  const [lang, setLang] = useState(() => localStorage.getItem('aura_lang') || 'vi');

  const handleCurrencyChange = (curr) => {
    setCurrency(curr);
    localStorage.setItem('aura_currency', curr);
    window.dispatchEvent(new Event('currency_change'));
    if (onCurrencyChange) onCurrencyChange(curr);
  };

  const handleLangChange = (l) => {
    setLang(l);
    localStorage.setItem('aura_lang', l);
    window.dispatchEvent(new Event('lang_change'));
  };

  // 2. Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchContainerRef = useRef(null);

  // 3. Navigation Dropdown States
  const [hoveredNav, setHoveredNav] = useState(null); // 'categories' | 'concerns' | 'brands' | null
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const navDropdownTimeoutRef = useRef(null);

  // 4. Mobile Drawer & Navigation
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState('categories'); // 'categories' | 'concerns' | 'brands'
  const [mobileSubDrawer, setMobileSubDrawer] = useState(null);

  // 5. Account Menu
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountRef = useRef(null);

  // 6. Sticky on Scroll
  const [isScrolled, setIsScrolled] = useState(false);

  // Top Bar Carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setTopBarIndex((prev) => (prev + 1) % TOP_BAR_ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Load Recent Searches
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch (e) {}
  }, []);

  // Sticky Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close search and account dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (term) => {
    const query = term !== undefined ? term : searchTerm;
    if (!query.trim()) return;

    const updated = [query, ...recentSearches.filter((s) => s.toLowerCase() !== query.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));

    setIsSearchFocused(false);
    setHoveredNav(null);
    setIsMobileMenuOpen(false);
    onSearchSubmit(query);
  };

  const handleClearRecents = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const openNavDropdown = (navKey) => {
    clearTimeout(navDropdownTimeoutRef.current);
    setHoveredNav(navKey);
  };

  const closeNavDropdownDelayed = () => {
    clearTimeout(navDropdownTimeoutRef.current);
    navDropdownTimeoutRef.current = setTimeout(() => {
      setHoveredNav(null);
    }, 220);
  };

  const allCatalogProducts = useMemo(() => {
    return getEnrichedCatalog(MOCK_PRODUCTS);
  }, []);

  // Matched products for auto-suggest in search bar (token-based & multi-field)
  const matchedProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return searchCatalogProducts(allCatalogProducts, searchTerm).slice(0, 6);
  }, [allCatalogProducts, searchTerm]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'sticky', top: 0, zIndex: 900, background: '#ffffff', boxShadow: isScrolled ? '0 2px 10px rgba(0,0,0,0.08)' : 'none', transition: 'box-shadow 200ms ease' }}
    >
      
      {/* =========================================================================
          TẦNG 1: TOP BAR (Tầng trên cùng: 30px - 36px)
          - Thông báo ưu đãi freeship
          - Hệ thống cửa hàng / Tra cứu đơn hàng
          - Hotline CSKH / Ngôn ngữ / Chuyển vai trò Demo
         ========================================================================= */}
      <div
        className="top-bar-wrapper"
        style={{
          background: '#0f172a',
          color: '#e2e8f0',
          height: '34px',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          borderBottom: '1px solid #1e293b'
        }}
      >
        {/* Left: Hotline & Stores */}
        <div className="top-bar-left" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            onClick={() => onOpenTopBarModal && onOpenTopBarModal('hotline')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            title="Bấm để mở Trung tâm hỗ trợ 24/7"
          >
            <PhoneCall size={13} style={{ color: '#ec4899' }} />
            <span>Hotline: <strong style={{ color: '#ffffff' }}>1900 6868</strong> (8h - 22h)</span>
          </div>
          <div
            onClick={onNavigateTracking}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#cbd5e1' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          >
            <PackageCheck size={13} />
            <span>Tra cứu đơn hàng</span>
          </div>
          <div
            onClick={onNavigateSeller}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: '#60a5fa', fontWeight: 700, background: 'rgba(96, 165, 250, 0.15)', padding: '2px 8px', borderRadius: '4px' }}
            title="Chuyển đến Kênh Người Bán"
          >
            <Store size={12} />
            <span>Kênh Người Bán</span>
          </div>
          <div
            onClick={onNavigateAdmin}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: '#f59e0b', fontWeight: 700, background: 'rgba(245, 158, 11, 0.15)', padding: '2px 8px', borderRadius: '4px' }}
            title="Chuyển đến Kênh Quản Trị Hệ Thống"
          >
            <ShieldCheck size={12} />
            <span>Kênh Quản Trị</span>
          </div>
        </div>

        {/* Center: Rotating Promotion Banner */}
        <div
          onClick={() => {
            if (topBarIndex === 0 && onOpenTopBarModal) onOpenTopBarModal('freeship');
            else if (topBarIndex === 1 && onOpenTopBarModal) onOpenTopBarModal('authenticity');
            else if (onNavigateFlashSale) onNavigateFlashSale();
            else onNavigateCatalog();
          }}
          title="Bấm để xem chi tiết ưu đãi"
          style={{
            flex: 1,
            textAlign: 'center',
            cursor: 'pointer',
            fontWeight: 600,
            color: '#fbcfe8',
            letterSpacing: '0.02em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span>{TOP_BAR_ANNOUNCEMENTS[topBarIndex]}</span>
        </div>

        {/* Right: Hệ thống cửa hàng & Đa tiền tệ / Đa ngôn ngữ Quốc tế */}
        <div className="top-bar-right" style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#cbd5e1' }}>
          {onReplayIntro && (
            <div
              onClick={onReplayIntro}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: '#ffabb9' }}
              title="Phát lại màn hình vén rèm thương hiệu 5 cảnh"
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#ffabb9')}
            >
              <Sparkles size={12} style={{ color: '#f59e0b' }} />
              <span style={{ fontSize: '11px', fontWeight: 700 }}>Phát lại Intro</span>
            </div>
          )}

          <div
            onClick={() => onOpenTopBarModal && onOpenTopBarModal('showrooms')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            title="Xem danh sách Showroom & Flagship Store"
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          >
            <MapPin size={13} style={{ color: '#ec4899' }} />
            <span>Hệ thống 45+ Cửa hàng</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid #334155', paddingLeft: '12px' }}>
            {/* Currency selector */}
            <select
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              title="Đơn vị tiền tệ hiển thị"
              style={{
                background: 'transparent',
                color: '#fbcfe8',
                border: 'none',
                fontSize: '11px',
                fontWeight: 750,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="VND" style={{ background: '#0f172a', color: '#fff' }}>₫ VND</option>
              <option value="USD" style={{ background: '#0f172a', color: '#fff' }}>$ USD</option>
            </select>

            <span style={{ color: '#475569' }}>|</span>

            {/* Language selector */}
            <select
              value={lang}
              onChange={(e) => handleLangChange(e.target.value)}
              title="Ngôn ngữ giao diện"
              style={{
                background: 'transparent',
                color: '#ffffff',
                border: 'none',
                fontSize: '11px',
                fontWeight: 650,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="vi" style={{ background: '#0f172a', color: '#fff' }}>🇻🇳 VN</option>
              <option value="en" style={{ background: '#0f172a', color: '#fff' }}>🇺🇸 EN</option>
            </select>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TẦNG 2: MAIN HEADER (Tầng giữa - Trọng tâm)
          - Logo thương hiệu (bên trái)
          - Search Bar (ở giữa 40-50%, Auto-suggest, Trending Keywords)
          - Utility Icons: Yêu thích, Tài khoản, Giỏ hàng có badge
         ========================================================================= */}
      <div
        className="main-header-wrapper"
        style={{
          borderBottom: '1px solid #f1f5f9',
          padding: '12px 24px',
          background: '#ffffff'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px'
          }}
        >
          {/* Logo & Mobile Menu Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="mobile-hamburger-btn"
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                padding: '6px',
                cursor: 'pointer',
                color: '#0f172a'
              }}
              aria-label="Mở Menu Danh Mục"
            >
              <Menu size={24} />
            </button>

            <AuraBrandLogo
              variant="dark"
              size="md"
              onClick={onNavigateHome}
            />
          </div>

          {/* Search Bar (Chiếm 45-50% chiều ngang kèm Auto-Suggest & Trending) */}
          <div
            ref={searchContainerRef}
            className="search-bar-center"
            style={{
              flex: 1,
              maxWidth: '580px',
              position: 'relative'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#f8fafc',
                border: isSearchFocused ? '1.5px solid #ec4899' : '1.5px solid #e2e8f0',
                borderRadius: '9999px',
                padding: '4px 6px 4px 16px',
                transition: 'all 200ms ease',
                boxShadow: isSearchFocused ? '0 0 0 3px rgba(236,72,153,0.15)' : 'none'
              }}
            >
              <Search size={18} style={{ color: isSearchFocused ? '#ec4899' : '#94a3b8', marginRight: '8px' }} />
              <input
                type="text"
                placeholder="Tìm sản phẩm, thương hiệu, thành phần BHA, Niacinamide, Retinol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchSubmit();
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: '8px 0',
                  fontSize: '13px',
                  width: '100%',
                  outline: 'none',
                  color: '#0f172a'
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', padding: '4px 8px', cursor: 'pointer' }}
                >
                  <X size={15} />
                </button>
              )}
              <button
                onClick={() => handleSearchSubmit()}
                style={{
                  background: '#ec4899',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '7px 18px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 150ms ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#db2777')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#ec4899')}
              >
                Tìm kiếm
              </button>
            </div>

            {/* Trending Keywords dưới thanh tìm kiếm */}
            <div
              className="trending-keywords-sub"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '6px',
                paddingLeft: '12px',
                overflowX: 'auto',
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Gợi ý:</span>
              {['Kem chống nắng kiềm dầu', 'Serum B5 phục hồi', 'BHA 2%', 'Son dưỡng màu', 'Niacinamide'].map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => { setSearchTerm(tag); handleSearchSubmit(tag); }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '11px',
                    padding: '0 2px',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ec4899')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Auto-suggest & Recent Searches Popover */}
            {isSearchFocused && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  right: 0,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                  padding: '16px',
                  zIndex: 950
                }}
              >
                {!searchTerm.trim() ? (
                  <div>
                    {recentSearches.length > 0 && (
                      <div style={{ marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                            Lịch sử tìm kiếm
                          </span>
                          <button
                            onClick={handleClearRecents}
                            style={{ background: 'none', border: 'none', fontSize: '11px', color: '#ec4899', cursor: 'pointer' }}
                          >
                            Xóa hết
                          </button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {recentSearches.map((kw, idx) => (
                            <div
                              key={idx}
                              onClick={() => { setSearchTerm(kw); handleSearchSubmit(kw); }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '9999px',
                                padding: '4px 10px',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              <span>{kw}</span>
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const updated = recentSearches.filter((_, i) => i !== idx);
                                  setRecentSearches(updated);
                                  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
                                }}
                                style={{ color: '#94a3b8', display: 'flex' }}
                              >
                                <X size={12} />
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <Flame size={14} style={{ color: '#f43f5e' }} />
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                          Từ khóa xu hướng làm đẹp
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {TRENDING_KEYWORDS.map((tag, idx) => (
                          <button
                            key={idx}
                            onClick={() => { setSearchTerm(tag); handleSearchSubmit(tag); }}
                            style={{
                              background: '#fdf2f8',
                              border: '1px solid #fbcfe8',
                              color: '#db2777',
                              borderRadius: '9999px',
                              padding: '5px 12px',
                              fontSize: '12px',
                              fontWeight: 500,
                              cursor: 'pointer'
                            }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {matchedProducts.length > 0 ? (
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                          Gợi ý sản phẩm phù hợp
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                          {matchedProducts.map((p) => (
                            <div
                              key={p.id}
                              onClick={() => { onSelectProduct(p); setIsSearchFocused(false); }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '6px 8px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'background 120ms ease'
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                              <img
                                src={p.images?.[0] || '/products/PROD-CRW-001.jpg'}
                                alt={p.name}
                                style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'contain', background: '#f8fafc', padding: '2px' }}
                              />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {p.name}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  {p.brand && <span style={{ fontSize: '11px', color: '#64748b' }}>{p.brand}</span>}
                                  <span style={{ fontSize: '12px', color: '#ec4899', fontWeight: 700 }}>
                                    {((p.variants?.[0]?.price ?? p.price) || 0).toLocaleString('vi-VN')} đ
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => handleSearchSubmit()}
                          style={{
                            width: '100%',
                            textAlign: 'center',
                            fontSize: '12px',
                            color: '#ec4899',
                            fontWeight: 600,
                            padding: '8px',
                            borderTop: '1px solid #f1f5f9',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          Xem tất cả kết quả cho "{searchTerm}" →
                        </button>
                      </div>
                    ) : (
                      <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', padding: '12px' }}>
                        Nhấn <strong>Enter</strong> để tìm kiếm kết quả cho "{searchTerm}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Utility Icons (Yêu thích, Tài khoản, Giỏ hàng có badge) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Wishlist */}
            <button
              onClick={() => onNavigateCatalog()}
              style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: '8px', color: '#0f172a' }}
              title="Sản phẩm yêu thích"
            >
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: '#f43f5e',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 700,
                    borderRadius: '50%',
                    width: '17px',
                    height: '17px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Account Profile Dropdown / Login Button */}
            <div ref={accountRef} style={{ position: 'relative' }}>
              {user ? (
                /* KHI ĐÃ ĐĂNG NHẬP: Hiện như trên ảnh của bạn:
                   (Icon User) Tài khoản
                               [Tên tài khoản]
                */
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#0f172a',
                    padding: '6px 8px',
                    borderRadius: '8px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#fdf2f8', border: '1.5px solid #fbcfe8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={18} style={{ color: '#ec4899' }} />
                  </div>
                  <div className="account-text-desktop" style={{ textAlign: 'left', lineHeight: 1.25 }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', fontWeight: 500 }}>Tài khoản</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{user.name || user.fullName || user.email}</span>
                  </div>
                </button>
              ) : (
                /* KHI CHƯA ĐĂNG NHẬP: Chỉ hiện nút Đăng nhập / Đăng ký */
                <button
                  onClick={onOpenAuthModal}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#f8fafc',
                    border: '1.5px solid #e2e8f0',
                    cursor: 'pointer',
                    color: '#0f172a',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fdf2f8';
                    e.currentTarget.style.borderColor = '#fbcfe8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={18} style={{ color: '#ec4899' }} />
                  </div>
                  <div className="account-text-desktop" style={{ textAlign: 'left', lineHeight: 1.25 }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', fontWeight: 500 }}>Tài khoản</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#ec4899' }}>Đăng nhập / Đăng ký</span>
                  </div>
                </button>
              )}

              {isAccountMenuOpen && user && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '240px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    padding: '8px',
                    zIndex: 950
                  }}
                >
                  <div style={{ padding: '8px 10px', borderBottom: '1px solid #f1f5f9' }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{user?.name || 'Khách Vãng Lai'}</p>
                    <p style={{ fontSize: '11px', color: '#94a3b8' }}>{user?.email || 'Chưa đăng nhập'}</p>
                    <div style={{ marginTop: '6px' }}>
                      <span
                        style={{
                          background: user?.role === 'ADMIN' ? '#fef3c7' : user?.role === 'SELLER' ? '#eff6ff' : '#fdf2f8',
                          color: user?.role === 'ADMIN' ? '#b45309' : user?.role === 'SELLER' ? '#1d4ed8' : '#be185d',
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          display: 'inline-block'
                        }}
                      >
                        Quyền: {user?.role === 'ADMIN' ? 'Quản Trị Viên (Admin)' : user?.role === 'SELLER' ? 'Người Bán (Seller)' : 'Khách Mua (Buyer)'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '6px 0' }}>
                    {onNavigateProfile && (
                      <button
                        onClick={() => { setIsAccountMenuOpen(false); onNavigateProfile(); }}
                        style={{ padding: '8px 10px', fontSize: '13px', textAlign: 'left', border: 'none', background: '#fdf2f8', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#db2777', fontWeight: 700 }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#fce7f3')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#fdf2f8')}
                      >
                        <User size={16} style={{ color: '#ec4899' }} /> Hồ sơ & Quản lý tài khoản
                      </button>
                    )}
                    {user?.role === 'ADMIN' && (
                      <button
                        onClick={() => { setIsAccountMenuOpen(false); if (onNavigateAdmin) onNavigateAdmin(); }}
                        style={{ padding: '8px 10px', fontSize: '13px', textAlign: 'left', border: 'none', background: '#fef3c7', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309', fontWeight: 700 }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#fde68a')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#fef3c7')}
                      >
                        <ShieldCheck size={16} style={{ color: '#d97706' }} /> Kênh Quản Trị Hệ Thống
                      </button>
                    )}
                    {user?.role === 'SELLER' && (
                      <button
                        onClick={() => { setIsAccountMenuOpen(false); if (onNavigateSeller) onNavigateSeller(); }}
                        style={{ padding: '8px 10px', fontSize: '13px', textAlign: 'left', border: 'none', background: '#eff6ff', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#1d4ed8', fontWeight: 700 }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#dbeafe')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#eff6ff')}
                      >
                        <Store size={16} style={{ color: '#2563eb' }} /> Kênh Người Bán (Shop)
                      </button>
                    )}
                    <button
                      onClick={() => { setIsAccountMenuOpen(false); if (onNavigateHome) onNavigateHome(); }}
                      style={{ padding: '8px 10px', fontSize: '13px', textAlign: 'left', border: 'none', background: '#f8fafc', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: 650 }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
                    >
                      <Home size={16} style={{ color: '#ec4899' }} /> Về Trang Chủ Mua Sắm
                    </button>
                    <button
                      onClick={() => { setIsAccountMenuOpen(false); onOpenAuthModal(); }}
                      style={{ padding: '8px 10px', fontSize: '13px', textAlign: 'left', border: 'none', background: '#ffffff', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 600 }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                    >
                      <User size={16} style={{ color: '#94a3b8' }} /> Đổi tài khoản / Đăng nhập
                    </button>
                    {user?.role === 'BUYER' && (
                      <>
                        <button
                          onClick={() => { setIsAccountMenuOpen(false); onOpenSkinProfile(); }}
                          style={{ padding: '8px 10px', fontSize: '13px', textAlign: 'left', border: 'none', background: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <Sparkles size={16} style={{ color: '#ec4899' }} /> Hồ sơ & Phân tích da
                        </button>
                        <button
                          onClick={() => { setIsAccountMenuOpen(false); onNavigateTracking(); }}
                          style={{ padding: '8px 10px', fontSize: '13px', textAlign: 'left', border: 'none', background: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <PackageCheck size={16} style={{ color: '#3b82f6' }} /> Lịch sử đơn hàng
                        </button>
                        <button
                          onClick={() => { setIsAccountMenuOpen(false); onNavigateCombos(); }}
                          style={{ padding: '8px 10px', fontSize: '13px', textAlign: 'left', border: 'none', background: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <Gift size={16} style={{ color: '#10b981' }} /> Combo tiết kiệm
                        </button>
                      </>
                    )}
                    {onLogout && (
                      <button
                        onClick={() => { setIsAccountMenuOpen(false); onLogout(); }}
                        style={{ padding: '8px 10px', fontSize: '12px', textAlign: 'left', border: 'none', background: 'none', borderRadius: '6px', cursor: 'pointer', color: '#ef4444', borderTop: '1px solid #f1f5f9', marginTop: '4px' }}
                      >
                        Đăng xuất
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#ec4899',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '9px 18px',
                fontSize: '13px',
                fontWeight: 650,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(236,72,153,0.35)',
                transition: 'all 150ms ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#db2777')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#ec4899')}
            >
              <ShoppingBag size={18} />
              <span className="cart-label-desktop">Giỏ hàng</span>
              {cartCount > 0 && (
                <span
                  style={{
                    background: '#ffffff',
                    color: '#ec4899',
                    fontSize: '11px',
                    fontWeight: 800,
                    borderRadius: '9999px',
                    padding: '2px 7px',
                    marginLeft: '2px'
                  }}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TẦNG 3: MAIN NAVIGATION (Thanh Menu chính ghim Sticky)
          Gồm 7 - 8 mục chuẩn:
          1. Danh mục sản phẩm (All Categories - Mega Menu đa cột)
          2. Tìm theo vấn đề da (Shop by Skin Concern)
          3. Thương hiệu (Brands)
          4. ⚡ Flash Sale / Hot Deals
          5. Bán chạy (Best Sellers)
          6. Hàng mới về (New Arrivals)
          7. Góc làm đẹp (Beauty Blog)
         ========================================================================= */}
      <nav
        className="main-navigation-bar"
        style={{
          borderBottom: '1px solid #e2e8f0',
          background: '#ffffff',
          position: 'relative'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '46px'
          }}
        >
          {/* Main Menu Links */}
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            
            {/* 1. Danh mục sản phẩm (Mega Menu) */}
            <div
              onMouseEnter={() => openNavDropdown('categories')}
              onMouseLeave={closeNavDropdownDelayed}
              style={{ height: '100%', display: 'flex', alignItems: 'center' }}
            >
              <button
                onClick={() => onNavigateCatalog()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: hoveredNav === 'categories' ? '#fdf2f8' : '#f8fafc',
                  color: hoveredNav === 'categories' ? '#ec4899' : '#0f172a',
                  border: '1px solid #f1f5f9',
                  borderRadius: '6px',
                  padding: '7px 14px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginRight: '12px'
                }}
              >
                <Grid size={16} />
                <span>DANH MỤC SẢN PHẨM</span>
                <ChevronDown size={14} />
              </button>
            </div>

            {/* 2. Chăm sóc theo vấn đề da (Shop by Skin Concern) */}
            <div
              onMouseEnter={() => openNavDropdown('concerns')}
              onMouseLeave={closeNavDropdownDelayed}
              style={{ height: '100%', display: 'flex', alignItems: 'center' }}
            >
              <button
                onClick={() => onNavigateCatalog()}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0 14px',
                  height: '100%',
                  fontSize: '13px',
                  fontWeight: 650,
                  color: hoveredNav === 'concerns' ? '#ec4899' : '#334155',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  borderBottom: hoveredNav === 'concerns' ? '2px solid #ec4899' : '2px solid transparent'
                }}
              >
                <span>Vấn Đề Da & Hoạt Chất</span>
                <ChevronDown size={14} />
              </button>
            </div>

            {/* 3. Thương hiệu (Brands) */}
            <div
              onMouseEnter={() => openNavDropdown('brands')}
              onMouseLeave={closeNavDropdownDelayed}
              style={{ height: '100%', display: 'flex', alignItems: 'center' }}
            >
              <button
                onClick={() => onNavigateCatalog()}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0 14px',
                  height: '100%',
                  fontSize: '13px',
                  fontWeight: 650,
                  color: hoveredNav === 'brands' ? '#ec4899' : '#334155',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  borderBottom: hoveredNav === 'brands' ? '2px solid #ec4899' : '2px solid transparent'
                }}
              >
                <span>Thương Hiệu</span>
                <ChevronDown size={14} />
              </button>
            </div>

            {/* 4. Flash Sale / Hot Deals */}
            <button
              onClick={() => {
                if (onNavigateFlashSale) onNavigateFlashSale();
                else { onSearchSubmit('Sale'); onNavigateCatalog(); }
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: '0 14px',
                height: '100%',
                fontSize: '13px',
                fontWeight: 750,
                color: '#e11d48',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Zap size={15} style={{ fill: '#e11d48' }} />
              <span>FLASH SALE</span>
              <span style={{ background: '#ffe4e6', color: '#e11d48', fontSize: '10px', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>-50%</span>
            </button>

            {/* 5. Bán chạy (Best Sellers) */}
            <button
              onClick={() => { onSearchSubmit('Innisfree'); onNavigateCatalog(); }}
              style={{
                background: 'none',
                border: 'none',
                padding: '0 14px',
                height: '100%',
                fontSize: '13px',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ec4899')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#334155')}
            >
              <Flame size={15} style={{ color: '#f97316' }} />
              <span>Bán Chạy</span>
            </button>

            {/* 6. Hàng mới về (New Arrivals) */}
            <button
              onClick={() => { onSearchSubmit('Serum'); onNavigateCatalog(); }}
              style={{
                background: 'none',
                border: 'none',
                padding: '0 14px',
                height: '100%',
                fontSize: '13px',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ec4899')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#334155')}
            >
              <Sparkles size={15} style={{ color: '#8b5cf6' }} />
              <span>Hàng Mới Về</span>
            </button>

            {/* 7. Góc làm đẹp (Beauty Blog) */}
            <button
              onClick={() => onNavigateCombos()}
              style={{
                background: 'none',
                border: 'none',
                padding: '0 14px',
                height: '100%',
                fontSize: '13px',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ec4899')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#334155')}
            >
              <BookOpen size={15} style={{ color: '#0ea5e9' }} />
              <span>Góc Làm Đẹp & Routine</span>
            </button>
          </div>

          {/* Right link: Cam kết hàng chính hãng */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#16a34a', fontWeight: 650 }}>
            <ShieldCheck size={16} />
            <span>100% Chính Hãng & Đã Duyệt CBMP</span>
          </div>
        </div>

        {/* =========================================================================
            DROPDOWN 1: MEGA MENU CHI TIẾT (Desktop)
            Cột 1: Danh mục lớn (Hover chuyển tab)
            Cột 2-4: 3-4 cột danh mục con
            Cột phải: Banner quảng cáo visual
           ========================================================================= */}
        {hoveredNav === 'categories' && (
          <div
            onMouseEnter={() => openNavDropdown('categories')}
            onMouseLeave={closeNavDropdownDelayed}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#ffffff',
              borderBottom: '2px solid #e2e8f0',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              zIndex: 890
            }}
          >
            <div className="container" style={{ display: 'flex', minHeight: '360px', padding: 0 }}>
              {/* Cột trái: Danh sách 7-8 danh mục chính */}
              <div
                style={{
                  width: '260px',
                  background: '#f8fafc',
                  borderRight: '1px solid #f1f5f9',
                  padding: '12px 0'
                }}
              >
                {MEGA_MENU_CATEGORIES.map((cat, idx) => {
                  const isActive = activeCategoryIndex === idx;
                  return (
                    <div
                      key={cat.id}
                      onMouseEnter={() => setActiveCategoryIndex(idx)}
                      onClick={() => {
                        onNavigateCategory(cat.name);
                        setHoveredNav(null);
                      }}
                      style={{
                        padding: '11px 20px',
                        fontSize: '13px',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? '#ec4899' : '#1e293b',
                        background: isActive ? '#ffffff' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderLeft: isActive ? '3px solid #ec4899' : '3px solid transparent',
                        transition: 'all 120ms ease'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>{cat.icon}</span> {cat.name}
                      </span>
                      {cat.badge && (
                        <span style={{ fontSize: '10px', background: '#ffe4e6', color: '#e11d48', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          {cat.badge}
                        </span>
                      )}
                      <ChevronRight size={14} style={{ color: isActive ? '#ec4899' : '#cbd5e1' }} />
                    </div>
                  );
                })}
              </div>

              {/* Phần giữa: 3 cột danh mục con chi tiết */}
              <div
                style={{
                  flex: 1,
                  padding: '24px 32px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '24px'
                }}
              >
                {MEGA_MENU_CATEGORIES[activeCategoryIndex]?.columns?.map((col, cIdx) => (
                  <div key={cIdx}>
                    <h4 style={{ fontSize: '13px', fontWeight: 750, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                      {col.title}
                    </h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {col.items.map((subItem, sIdx) => (
                        <li key={sIdx}>
                          <button
                            onClick={() => {
                              onSearchSubmit(subItem);
                              setHoveredNav(null);
                            }}
                            className="group relative flex items-center gap-1.5 py-1 text-left w-full text-[13px] text-slate-500 hover:text-rose-600 transition-all duration-200 outline-none"
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 flex-shrink-0" />
                            <span className="group-hover:translate-x-1 transition-transform duration-200">
                              {subItem}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Cột phải: Visual Banner sản phẩm nổi bật */}
              {MEGA_MENU_CATEGORIES[activeCategoryIndex]?.banner && (
                <div
                  style={{
                    width: '300px',
                    padding: '24px',
                    borderLeft: '1px solid #f1f5f9',
                    background: '#fdf2f8',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <img
                      src={MEGA_MENU_CATEGORIES[activeCategoryIndex].banner.img}
                      alt="Campaign Banner"
                      style={{ width: '100%', height: '150px', borderRadius: '8px', objectFit: 'cover', marginBottom: '12px' }}
                    />
                    <h5 style={{ fontSize: '14px', fontWeight: 750, color: '#0f172a', marginBottom: '6px' }}>
                      {MEGA_MENU_CATEGORIES[activeCategoryIndex].banner.title}
                    </h5>
                    <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.45 }}>
                      {MEGA_MENU_CATEGORIES[activeCategoryIndex].banner.desc}
                    </p>
                  </div>
                  <button
                    onClick={() => { onNavigateCatalog(); setHoveredNav(null); }}
                    style={{
                      marginTop: '16px',
                      background: '#ec4899',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '9999px',
                      padding: '8px 16px',
                      fontSize: '12px',
                      fontWeight: 650,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>{MEGA_MENU_CATEGORIES[activeCategoryIndex].banner.actionText}</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            DROPDOWN 2: VẤN ĐỀ DA & HOẠT CHẤT (Shop by Skin Concern)
            - Theo loại da: Dầu, Khô, Nhạy cảm, Hỗn hợp
            - Theo vấn đề: Mụn, Lão hóa, Dưỡng trắng, Lỗ chân lông, Phục hồi
            - Theo hoạt chất (Ingredients): BHA, Retinol, Vitamin C, Niacinamide...
           ========================================================================= */}
        {hoveredNav === 'concerns' && (
          <div
            onMouseEnter={() => openNavDropdown('concerns')}
            onMouseLeave={closeNavDropdownDelayed}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#ffffff',
              borderBottom: '2px solid #e2e8f0',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              padding: '28px 0',
              zIndex: 890
            }}
          >
            <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '32px' }}>
              {/* Cột 1: Phân loại theo loại da */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🧴</span> THEO LOẠI DA (SKIN TYPE)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {SKIN_CONCERNS_DATA.skinTypes.map((st, i) => (
                    <div
                      key={i}
                      onClick={() => { onSearchSubmit(st.query); setHoveredNav(null); }}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 120ms ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.background = '#fdf2f8'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      <p style={{ fontSize: '13px', fontWeight: 650, color: '#0f172a' }}>{st.title}</p>
                      <p style={{ fontSize: '11px', color: '#64748b' }}>{st.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cột 2: Phân loại theo tình trạng da */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🎯</span> THEO TÌNH TRẠNG / VẤN ĐỀ
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {SKIN_CONCERNS_DATA.concerns.map((sc, i) => (
                    <div
                      key={i}
                      onClick={() => { onSearchSubmit(sc.query); setHoveredNav(null); }}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 120ms ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.background = '#fdf2f8'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      <p style={{ fontSize: '13px', fontWeight: 650, color: '#0f172a' }}>{sc.title}</p>
                      <p style={{ fontSize: '11px', color: '#64748b' }}>{sc.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cột 3: Phân loại theo hoạt chất INCI vàng */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🔬</span> HOẠT CHẤT CHUYÊN SÂU (INCI)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {SKIN_CONCERNS_DATA.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      onClick={() => { onSearchSubmit(ing.query); setHoveredNav(null); }}
                      style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fafafa', cursor: 'pointer' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.background = '#fdf2f8'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fafafa'; }}
                    >
                      <strong style={{ fontSize: '12px', color: '#ec4899', display: 'block' }}>{ing.name}</strong>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{ing.desc}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '14px', background: '#eff6ff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #dbeafe' }}>
                  <p style={{ fontSize: '11px', color: '#1e40af', lineHeight: 1.4 }}>
                    💡 <strong>Cần tư vấn hoạt chất?</strong> Hãy dùng trợ lý AI INCI ở góc dưới màn hình để kiểm tra độ an toàn và thành phần gây bít tắc chân lông!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            DROPDOWN 3: THƯƠNG HIỆU (Brands)
            - Bảng chữ cái A - Z
            - Hot Brands
            - Phân khúc: Dược mỹ phẩm, Mỹ phẩm cao cấp, Mỹ phẩm thiên nhiên
           ========================================================================= */}
        {hoveredNav === 'brands' && (
          <div
            onMouseEnter={() => openNavDropdown('brands')}
            onMouseLeave={closeNavDropdownDelayed}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#ffffff',
              borderBottom: '2px solid #e2e8f0',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              padding: '24px 0',
              zIndex: 890
            }}
          >
            <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Lọc A-Z nhanh */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', overflowX: 'auto' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginRight: '6px' }}>LỌC A-Z:</span>
                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((char) => (
                  <button
                    key={char}
                    onClick={() => { onSearchSubmit(char); setHoveredNav(null); }}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px',
                      width: '26px',
                      height: '26px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#ec4899'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#475569'; }}
                  >
                    {char}
                  </button>
                ))}
              </div>

              {/* Lưới các thương hiệu nổi bật */}
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 750, color: '#0f172a', textTransform: 'uppercase', marginBottom: '12px' }}>
                  ⭐ THƯƠNG HIỆU HÀNG ĐẦU ĐÃ ĐƯỢC KIỂM ĐỊNH
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                  {BRANDS_DATA.hotBrands.map((b, i) => (
                    <div
                      key={i}
                      onClick={() => { onSearchSubmit(b.name); setHoveredNav(null); }}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 120ms ease'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.background = '#fdf2f8'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div>
                        <strong style={{ fontSize: '13px', color: '#0f172a' }}>{b.name}</strong>
                        <p style={{ fontSize: '11px', color: '#94a3b8' }}>Xuất xứ: {b.country}</p>
                      </div>
                      <span style={{ fontSize: '10px', background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                        {b.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phân khúc thương hiệu */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                {BRANDS_DATA.categories.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => { onSearchSubmit(c.title); setHoveredNav(null); }}
                    style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#ec4899', marginBottom: '4px' }}>{c.title}</h5>
                    <p style={{ fontSize: '11px', color: '#64748b' }}>{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* =========================================================================
          MOBILE DRAWER (Ngăn kéo trượt khi bấm Hamburger trên điện thoại)
          - Chuyển toàn bộ danh mục thành Accordion phân cấp mượt mà
         ========================================================================= */}
      {isMobileMenuOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '85%',
              maxWidth: '360px',
              height: '100%',
              background: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '4px 0 20px rgba(0,0,0,0.2)'
            }}
          >
            {/* Drawer Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <AuraBrandLogo
                variant="dark"
                size="sm"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateHome) onNavigateHome();
                }}
              />
              <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={22} />
              </button>
            </div>

            {/* Sub Drawer Level 2 */}
            {mobileSubDrawer ? (
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <button
                  onClick={() => setMobileSubDrawer(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '12px 20px',
                    fontSize: '13px',
                    fontWeight: 650,
                    color: '#ec4899',
                    border: 'none',
                    borderBottom: '1px solid #f1f5f9',
                    background: '#fdf2f8',
                    width: '100%',
                    cursor: 'pointer'
                  }}
                >
                  <ArrowLeft size={16} /> Quay lại danh mục
                </button>
                <div style={{ padding: '16px 20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '14px', color: '#0f172a' }}>{mobileSubDrawer.name}</h3>
                  {mobileSubDrawer.columns?.map((col, cIdx) => (
                    <div key={cIdx} style={{ marginBottom: '18px' }}>
                      <h4 style={{ fontSize: '12px', fontWeight: 750, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>{col.title}</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {col.items.map((sub, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => {
                              onSearchSubmit(sub);
                              setIsMobileMenuOpen(false);
                            }}
                            style={{
                              textAlign: 'left',
                              fontSize: '13px',
                              padding: '6px 0',
                              border: 'none',
                              background: 'none',
                              color: '#1e293b',
                              cursor: 'pointer'
                            }}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Main Drawer Navigation Tabs */
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {/* 3 tabs chọn phân loại */}
                <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                  <button
                    onClick={() => setMobileActiveTab('categories')}
                    style={{
                      flex: 1,
                      padding: '10px 4px',
                      fontSize: '12px',
                      fontWeight: 700,
                      border: 'none',
                      background: mobileActiveTab === 'categories' ? '#ffffff' : 'transparent',
                      color: mobileActiveTab === 'categories' ? '#ec4899' : '#64748b',
                      borderBottom: mobileActiveTab === 'categories' ? '2px solid #ec4899' : 'none'
                    }}
                  >
                    Danh Mục
                  </button>
                  <button
                    onClick={() => setMobileActiveTab('concerns')}
                    style={{
                      flex: 1,
                      padding: '10px 4px',
                      fontSize: '12px',
                      fontWeight: 700,
                      border: 'none',
                      background: mobileActiveTab === 'concerns' ? '#ffffff' : 'transparent',
                      color: mobileActiveTab === 'concerns' ? '#ec4899' : '#64748b',
                      borderBottom: mobileActiveTab === 'concerns' ? '2px solid #ec4899' : 'none'
                    }}
                  >
                    Vấn Đề Da
                  </button>
                  <button
                    onClick={() => setMobileActiveTab('brands')}
                    style={{
                      flex: 1,
                      padding: '10px 4px',
                      fontSize: '12px',
                      fontWeight: 700,
                      border: 'none',
                      background: mobileActiveTab === 'brands' ? '#ffffff' : 'transparent',
                      color: mobileActiveTab === 'brands' ? '#ec4899' : '#64748b',
                      borderBottom: mobileActiveTab === 'brands' ? '2px solid #ec4899' : 'none'
                    }}
                  >
                    Thương Hiệu
                  </button>
                </div>

                {/* Tab content: Danh mục */}
                {mobileActiveTab === 'categories' && (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {MEGA_MENU_CATEGORIES.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => setMobileSubDrawer(cat)}
                        style={{
                          padding: '14px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderBottom: '1px solid #f1f5f9',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#0f172a',
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span>{cat.icon}</span> {cat.name}
                        </span>
                        <ChevronRight size={16} style={{ color: '#94a3b8' }} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab content: Vấn đề da */}
                {mobileActiveTab === 'concerns' && (
                  <div style={{ padding: '16px 20px' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 750, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Theo Loại Da</h4>
                    {SKIN_CONCERNS_DATA.skinTypes.map((st, i) => (
                      <button
                        key={i}
                        onClick={() => { onSearchSubmit(st.query); setIsMobileMenuOpen(false); }}
                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 0', border: 'none', background: 'none', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}
                      >
                        {st.title}
                      </button>
                    ))}
                    <h4 style={{ fontSize: '12px', fontWeight: 750, color: '#94a3b8', textTransform: 'uppercase', marginTop: '16px', marginBottom: '8px' }}>Hoạt Chất INCI</h4>
                    {SKIN_CONCERNS_DATA.ingredients.map((ing, i) => (
                      <button
                        key={i}
                        onClick={() => { onSearchSubmit(ing.query); setIsMobileMenuOpen(false); }}
                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 0', border: 'none', background: 'none', fontSize: '13px', color: '#db2777' }}
                      >
                        • {ing.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Tab content: Thương hiệu */}
                {mobileActiveTab === 'brands' && (
                  <div style={{ padding: '16px 20px' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 750, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Top Thương Hiệu</h4>
                    {BRANDS_DATA.hotBrands.map((b, i) => (
                      <button
                        key={i}
                        onClick={() => { onSearchSubmit(b.name); setIsMobileMenuOpen(false); }}
                        style={{ display: 'flex', justifyContent: 'space-between', width: '100%', textAlign: 'left', padding: '8px 0', border: 'none', background: 'none', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}
                      >
                        <span>{b.name}</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{b.country}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bottom info in Drawer */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Hotline CSKH: <strong>1900 6868</strong></p>
              <button
                onClick={() => { onOpenSkinProfile(); setIsMobileMenuOpen(false); }}
                style={{
                  width: '100%',
                  background: '#ec4899',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '8px',
                  fontSize: '13px',
                  fontWeight: 650,
                  cursor: 'pointer'
                }}
              >
                🌿 Cập nhật hồ sơ da
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          BOTTOM NAVIGATION BAR (Cố định dưới đáy màn hình trên Mobile: 5 Tabs)
          1. Trang chủ
          2. Danh mục
          3. AI Da Liễu (Nút tròn nổi bật ở giữa)
          4. Khuyến mãi (Flash Sale)
          5. Tài khoản
         ========================================================================= */}
      <div className="mobile-bottom-nav">
        <button onClick={onNavigateHome} className="nav-item">
          <span>🏠</span>
          <span>Trang chủ</span>
        </button>
        <button onClick={() => setIsMobileMenuOpen(true)} className="nav-item">
          <span>📂</span>
          <span>Danh mục</span>
        </button>
        <button
          onClick={onOpenSkinProfile}
          className="nav-item center-highlight"
          title="Tư vấn AI"
        >
          <div className="center-icon">
            <Sparkles size={20} />
          </div>
          <span>AI Da Liễu</span>
        </button>
        <button onClick={() => { onSearchSubmit('Sale'); onNavigateCatalog(); }} className="nav-item">
          <span>⚡</span>
          <span>Flash Sale</span>
        </button>
        <button
          onClick={() => {
            if (user) {
              setIsAccountMenuOpen(true);
            } else {
              onOpenAuthModal();
            }
          }}
          className="nav-item"
        >
          <span>👤</span>
          <span>{user ? (user.name?.split(' ').slice(-1)[0] || 'Tài khoản') : 'Đăng nhập'}</span>
        </button>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .top-bar-left, .top-bar-right .account-text-desktop, .trending-keywords-sub, .main-navigation-bar {
            display: none !important;
          }
          .mobile-hamburger-btn {
            display: flex !important;
          }
        }
        .mobile-bottom-nav {
          display: none;
        }
        @media (max-width: 768px) {
          .cart-label-desktop {
            display: none;
          }
          .mobile-bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 60px;
            background: #ffffff;
            border-top: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: space-around;
            z-index: 850;
            padding: 0 10px;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
          }
          .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
            font-size: 10px;
            color: #64748b;
            background: none;
            border: none;
            cursor: pointer;
          }
          .nav-item.center-highlight {
            position: relative;
            top: -12px;
          }
          .center-icon {
            width: 46px;
            height: 46px;
            border-radius: 50%;
            background: #ec4899;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(236,72,153,0.4);
          }
        }
      `}</style>
    </motion.div>
  );
}
