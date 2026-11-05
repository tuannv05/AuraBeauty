import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Filter, SlidersHorizontal, Grid, List, ChevronDown, X, Star, Heart,
  ShoppingBag, Eye, Check, ArrowRight, RotateCcw, ShieldCheck, Sparkles, ArrowLeft
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../api';
import { getEnrichedCatalog, getSubmenuMetadata, searchAndFilterProducts } from '../lib/submenuCatalogMapper';
import { searchCatalogProducts } from '../lib/searchEngine';
import { AnimatedBadge } from './ui';

const QUICK_PRICES = [
  { label: 'Tất cả', min: 0, max: 99999999 },
  { label: 'Dưới 200k', min: 0, max: 200000 },
  { label: '200k – 500k', min: 200000, max: 500000 },
  { label: '500k – 1 triệu', min: 500000, max: 1000000 },
  { label: 'Trên 1 triệu', min: 1000000, max: 99999999 }
];

const SKIN_TYPES = [
  { id: 'OILY', label: 'Da Dầu (Oily)' },
  { id: 'DRY', label: 'Da Khô (Dry)' },
  { id: 'COMBINATION', label: 'Da Hỗn Hợp (Combination)' },
  { id: 'SENSITIVE', label: 'Da Nhạy Cảm (Sensitive)' },
  { id: 'NORMAL', label: 'Da Thường (Normal)' },
  { id: 'ACNE_PRONE', label: 'Da Dễ Nổi Mụn (Acne-prone)' }
];

const CONCERNS = [
  'Mụn', 'Thâm nám', 'Lão hóa', 'Lỗ chân lông', 'Dưỡng ẩm', 'Chống nắng', 'Phục hồi', 'Kiềm dầu', 'Đều màu da'
];

const KEY_ACTIVE_GROUPS = [
  { id: 'HYDRATION', label: 'Cấp Nước & Giữ Ẩm (HA, B5, Ceramide)' },
  { id: 'EXFOLIATION', label: 'Tẩy Da Chết Hóa Học (AHA/BHA/PHA)' },
  { id: 'BRIGHTENING', label: 'Dưỡng Sáng & Mờ Thâm (Vit C, Niacinamide)' },
  { id: 'ANTI_AGING', label: 'Chống Lão Hóa (Retinol, Peptides)' },
  { id: 'SOOTHING_BOTANICAL', label: 'Làm Dịu (Rau Má, Diếp Cá, Tràm Trà)' },
  { id: 'UV_FILTERS', label: 'Màng Lọc Chống Nắng (Zinc Oxide, Mexoryl)' }
];

const SAFETY_BADGES = [
  { id: 'FRAGRANCE_FREE', label: 'Không Hương Liệu' },
  { id: 'ALCOHOL_FREE', label: 'Không Cồn Khô' },
  { id: 'PARABEN_FREE', label: 'Không Paraben' },
  { id: 'NON_COMEDOGENIC', label: 'Không Bít Tắc (Non-comedogenic)' },
  { id: 'HYPOALLERGENIC', label: 'Kiểm Nghiệm Dị Ứng' },
  { id: 'VEGAN', label: 'Thuần Chay (Vegan)' },
  { id: 'CRUELTY_FREE', label: 'Không Thử Nghiệm Động Vật' },
  { id: 'PREGNANCY_SAFE', label: 'An Toàn Cho Mẹ Bầu' }
];

const FORMULATION_TEXTURES = [
  { id: 'WATER_LIQUID', label: 'Nước / Tinh Chất' },
  { id: 'GEL', label: 'Gel Mỏng Nhẹ' },
  { id: 'LOTION_EMULSION', label: 'Sữa Dưỡng (Lotion)' },
  { id: 'CREAM_BALM', label: 'Kem Đặc / Sáp' },
  { id: 'FACIAL_OIL', label: 'Dầu Dưỡng (Oil)' },
  { id: 'POWDER', label: 'Phấn Nén / Bột' },
  { id: 'STICK', label: 'Dạng Thỏi (Stick)' }
];

const ORIGINS = ['Hàn Quốc', 'Nhật Bản', 'Pháp', 'Mỹ', 'Canada', 'Việt Nam'];

const CATEGORY_SUBCHIPS = {
  'Chăm sóc cơ thể': [
    'Tất cả',
    'Sữa tắm',
    'Tẩy da chết toàn thân',
    'Muối tắm thư giãn',
    'Sữa dưỡng thể (Body Lotion)',
    'Lăn / Xịt khử mùi',
    'Kem dưỡng da tay / chân',
    'Triệt lông'
  ],
  'Chăm sóc da mặt': [
    'Tất cả',
    'Tẩy trang',
    'Sữa rửa mặt',
    'Tẩy tế bào chết',
    'Toner / Nước hoa hồng',
    'Serum / Tinh chất',
    'Kem dưỡng ẩm',
    'Kem chống nắng',
    'Mặt nạ'
  ],
  'Trang điểm': [
    'Tất cả',
    'Kem nền & Cushion',
    'Che khuyết điểm',
    'Phấn phủ',
    'Má hồng & Highlight',
    'Son thỏi',
    'Son kem / Tint',
    'Kẻ mắt & Mascara'
  ],
  'Chăm sóc tóc & Da đầu': [
    'Tất cả',
    'Dầu gội',
    'Dầu xả',
    'Dầu gội khô',
    'Kem ủ / Mặt nạ tóc',
    'Tinh dầu dưỡng tóc',
    'Xịt mọc tóc',
    'Thuốc nhuộm tóc'
  ],
  'Nước hoa': [
    'Tất cả',
    'Nước hoa Nữ',
    'Nước hoa Nam',
    'Nước hoa Unisex',
    'Xịt thơm toàn thân (Body Mist)',
    'Nước hoa chiết mini 10ml'
  ],
  'Thực phẩm chức năng': [
    'Tất cả',
    'Collagen',
    'Viên uống trắng da',
    'Viên uống trị mụn / nội tiết',
    'Vitamin tổng hợp',
    'Viên uống cấp nước'
  ],
  'Phụ kiện làm đẹp': [
    'Tất cả',
    'Bông tẩy trang',
    'Bộ cọ trang điểm',
    'Mút tán nền',
    'Kẹp bấm mi',
    'Máy rửa mặt',
    'Máy massage nâng cơ'
  ]
};

export default function CatalogView({
  initialCategory = '',
  initialBrand = '',
  initialSearch = '',
  onSelectProduct,
  onAddToCart,
  onOpenQuickView,
  onToggleWishlist,
  wishlistIds = [],
  onNavigateHome,
  onOpenTryOn,
  onBack
}) {
  // Filter States
  const [selectedBrands, setSelectedBrands] = useState(initialBrand ? [initialBrand] : []);
  const [selectedPriceRange, setSelectedPriceRange] = useState(QUICK_PRICES[0]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState([]);
  const [selectedConcerns, setSelectedConcerns] = useState([]);
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [selectedActiveGroups, setSelectedActiveGroups] = useState([]);
  const [selectedSafetyBadges, setSelectedSafetyBadges] = useState([]);
  const [selectedTextures, setSelectedTextures] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyDiscount, setOnlyDiscount] = useState(false);

  // Brand Search Inside Filter
  const [brandSearch, setBrandSearch] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 24;

  // Toolbar States
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'newest' | 'priceAsc' | 'priceDesc' | 'rating'
  const [gridCols, setGridCols] = useState(4); // 4 | 3 | 1 (list)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // SEO Banner Expander
  const [isSeoExpanded, setIsSeoExpanded] = useState(false);

  // Unique Brands from Enriched Catalog
  const baseCatalog = useMemo(() => {
    return getEnrichedCatalog(MOCK_PRODUCTS);
  }, []);

  const currentSubmenuMeta = useMemo(() => {
    return getSubmenuMetadata(initialSearch || initialCategory || '');
  }, [initialSearch, initialCategory]);

  const currentCategory = useMemo(() => {
    return currentSubmenuMeta?.parent || initialCategory || 'Chăm sóc da mặt';
  }, [currentSubmenuMeta, initialCategory]);

  // Sub-categories chips dynamically resolved per category
  const subCategoryChips = useMemo(() => {
    return CATEGORY_SUBCHIPS[currentCategory] || CATEGORY_SUBCHIPS['Chăm sóc da mặt'];
  }, [currentCategory]);

  const [activeSubChip, setActiveSubChip] = useState('Tất cả');

  // Reset all filters and sub-chip when navigating to a new category or search
  React.useEffect(() => {
    setActiveSubChip('Tất cả');
    setSelectedBrands(initialBrand ? [initialBrand] : []);
    setSelectedPriceRange(QUICK_PRICES[0]);
    setSelectedSkinTypes([]);
    setSelectedConcerns([]);
    setSelectedOrigins([]);
    setSelectedActiveGroups([]);
    setSelectedSafetyBadges([]);
    setSelectedTextures([]);
    setMinRating(0);
    setOnlyInStock(false);
    setOnlyDiscount(false);
    setCurrentPage(1);
  }, [initialCategory, initialSearch, initialBrand]);

  const allBrands = useMemo(() => Array.from(new Set(baseCatalog.map((p) => p.brand))), [baseCatalog]);
  const filteredBrands = allBrands.filter((b) => b.toLowerCase().includes(brandSearch.toLowerCase()));

  const currentCurrency = typeof window !== 'undefined' ? (localStorage.getItem('aura_currency') || 'VND') : 'VND';
  const formatPrice = (amount) => {
    if (!amount) return '0 đ';
    if (currentCurrency === 'USD') {
      return '$' + (amount / 25000).toFixed(2);
    }
    return amount.toLocaleString('vi-VN') + ' đ';
  };

  // Multi-facet filtering logic
  const filteredProducts = useMemo(() => {
    let pool = baseCatalog;

    if (activeSubChip && activeSubChip !== 'Tất cả') {
      pool = searchAndFilterProducts(baseCatalog, activeSubChip, currentCategory);
    } else if (initialSearch && initialSearch.trim()) {
      pool = searchCatalogProducts(baseCatalog, initialSearch.trim());
    } else if (initialCategory) {
      pool = searchAndFilterProducts(baseCatalog, '', initialCategory);
    }

    return pool.filter((p) => {
      // Brand Filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }

      // Price Range Filter (null-safe across variants or root price)
      const price = p.variants?.[0]?.price ?? p.price ?? 0;
      if (price < selectedPriceRange.min || price > selectedPriceRange.max) {
        return false;
      }

      // Skin Type Filter
      if (selectedSkinTypes.length > 0) {
        const pSkin = p.targetSkinTypes || [];
        if (!selectedSkinTypes.some((st) => pSkin.includes(st))) return false;
      }

      // Concerns Filter
      if (selectedConcerns.length > 0) {
        const pConcerns = p.skinConcerns || p.concerns || [];
        if (!selectedConcerns.some((c) => pConcerns.includes(c) || pConcerns.some((pc) => pc.toLowerCase().includes(c.toLowerCase())))) {
          return false;
        }
      }

      // Origin Filter
      if (selectedOrigins.length > 0 && !selectedOrigins.includes(p.originCountry || p.origin)) {
        return false;
      }

      // Active Groups Filter
      if (selectedActiveGroups.length > 0) {
        const groups = p.keyActiveGroups || [];
        if (!selectedActiveGroups.some((ag) => groups.includes(ag))) {
          return false;
        }
      }

      // Safety Badges Filter
      if (selectedSafetyBadges.length > 0) {
        const badges = p.safetyEthicsBadges || [];
        if (!selectedSafetyBadges.some((sb) => badges.includes(sb))) {
          return false;
        }
      }

      // Texture Filter
      if (selectedTextures.length > 0) {
        const tex = p.formulationTexture || p.texture;
        if (!selectedTextures.includes(tex)) {
          return false;
        }
      }

      // Rating Filter
      if (minRating > 0 && (p.rating || 0) < minRating) {
        return false;
      }

      // In Stock Filter
      if (onlyInStock && p.inStock === false) {
        return false;
      }

      // Discount Filter
      if (onlyDiscount && !p.variants?.[0]?.originalPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.variants?.[0]?.price ?? a.price ?? 0;
      const priceB = b.variants?.[0]?.price ?? b.price ?? 0;
      if (sortBy === 'priceAsc') return priceA - priceB;
      if (sortBy === 'priceDesc') return priceB - priceA;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'bestseller') return (b.soldCount || 0) - (a.soldCount || 0);
      return 0; // Default popular
    });
  }, [
    baseCatalog, initialCategory, initialSearch, selectedBrands, selectedPriceRange,
    selectedSkinTypes, selectedConcerns, selectedOrigins,
    selectedActiveGroups, selectedSafetyBadges, selectedTextures, minRating,
    onlyInStock, onlyDiscount, sortBy, activeSubChip
  ]);

  // Reset page to 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [initialCategory, initialSearch, selectedBrands, selectedPriceRange, selectedSkinTypes, selectedConcerns, selectedOrigins, selectedActiveGroups, selectedSafetyBadges, selectedTextures, minRating, onlyInStock, onlyDiscount, sortBy, activeSubChip]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, currentPage, PAGE_SIZE]);

  const activeFiltersCount =
    selectedBrands.length +
    (selectedPriceRange.min > 0 || selectedPriceRange.max < 99999999 ? 1 : 0) +
    selectedSkinTypes.length +
    selectedConcerns.length +
    selectedOrigins.length +
    selectedActiveGroups.length +
    selectedSafetyBadges.length +
    selectedTextures.length +
    (minRating > 0 ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (onlyDiscount ? 1 : 0);

  const handleClearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedPriceRange(QUICK_PRICES[0]);
    setSelectedSkinTypes([]);
    setSelectedConcerns([]);
    setSelectedOrigins([]);
    setSelectedActiveGroups([]);
    setSelectedSafetyBadges([]);
    setSelectedTextures([]);
    setMinRating(0);
    setOnlyInStock(false);
    setOnlyDiscount(false);
  };

  return (
    <div style={{ marginTop: '16px', paddingBottom: '40px' }}>
      {/* 3.1.1 Back Button & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
        <button
          onClick={onBack || (() => window.history.back())}
          className="btn-back-nav"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-soft)',
            background: 'var(--canvas)',
            color: 'var(--ink)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all 0.15s ease'
          }}
          title="Quay lại trang trước"
        >
          <ArrowLeft size={16} /> Quay lại
        </button>
        <nav style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
          <button onClick={onNavigateHome} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Trang chủ</button>
          <span>/</span>
          <button onClick={() => {}} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'default', padding: 0 }}>
            {currentCategory || 'Mỹ phẩm chính hãng'}
          </button>
          <span>/</span>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>
            {currentSubmenuMeta?.name || initialSearch || 'Tất cả sản phẩm'}
          </span>
        </nav>
      </div>

      {/* 3.1.2 Category Banner with SEO Expander */}
      <div
        className="squircle-card"
        style={{
          padding: '24px 28px',
          background: 'var(--canvas-soft)',
          marginBottom: '20px',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 750, letterSpacing: '-0.01em', margin: 0 }}>
            {currentSubmenuMeta?.banner?.title || (initialSearch ? `Kết quả tìm kiếm cho "${initialSearch}"` : initialCategory || 'Danh Mục Mỹ Phẩm & Chăm Sóc Da')}
          </h2>
          {currentSubmenuMeta?.banner?.badge && (
            <AnimatedBadge variant="purple" pulse>
              {currentSubmenuMeta.banner.badge}
            </AnimatedBadge>
          )}
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, maxWidth: '820px' }}>
          {currentSubmenuMeta?.banner?.desc || 'Tuyển chọn các dòng mỹ phẩm chính hãng có số CBMP hợp chuẩn từ Bộ Y Tế. Hệ thống tích hợp bộ lọc khoa học theo thành phần INCI, nồng độ hoạt chất và độ an toàn cho từng nền da người Việt.'}
          {isSeoExpanded && (
            <span style={{ display: 'block', marginTop: '8px' }}>
              Dù bạn sở hữu làn da dầu mụn cần kiểm soát bã nhờn với BHA/Niacinamide, hay làn da khô nhạy cảm cần bổ sung Ceramide và Hyaluronic Acid đa tầng, Aura Beauty Mall đều cung cấp các giải pháp chuẩn y khoa từ các thương hiệu hàng đầu như Innisfree, La Roche-Posay, CeraVe, Cosrx.
            </span>
          )}
        </p>
        <button
          onClick={() => setIsSeoExpanded(!isSeoExpanded)}
          style={{ fontSize: '12px', color: 'var(--ink)', fontWeight: 650, marginTop: '6px', textDecoration: 'underline' }}
        >
          {isSeoExpanded ? 'Thu gọn ▲' : 'Xem thêm giới thiệu chuẩn SEO ▼'}
        </button>
      </div>

      {/* 3.1.3 Sub-category Chips */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
        {subCategoryChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSubChip(chip)}
            className={activeSubChip === chip ? 'btn-pill-primary' : 'btn-pill-outline'}
            style={{ fontSize: '12px', padding: '6px 16px', flexShrink: 0 }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* 3.1.4 Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '12px 0',
          borderBottom: '1px solid var(--hairline)',
          marginBottom: '20px'
        }}
      >
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Hiển thị <strong>{filteredProducts.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredProducts.length)}</strong> trên <strong>{filteredProducts.length}</strong> sản phẩm
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="btn-pill-outline mobile-filter-btn"
            style={{ display: 'none', fontSize: '12px', padding: '6px 14px' }}
          >
            <Filter size={14} /> Bộ Lọc {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: 'auto',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px',
                fontWeight: 500
              }}
            >
              <option value="popular">Phổ biến nhất</option>
              <option value="bestseller">Bán chạy nhất</option>
              <option value="priceAsc">Giá thấp → cao</option>
              <option value="priceDesc">Giá cao → thấp</option>
              <option value="rating">Đánh giá cao nhất</option>
            </select>
          </div>

          {/* Grid Toggle (Desktop) */}
          <div style={{ display: 'flex', gap: '4px', background: 'var(--canvas-soft)', padding: '2px', borderRadius: 'var(--radius-sm)' }} className="desktop-grid-toggle">
            <button
              onClick={() => setGridCols(4)}
              style={{ padding: '6px', color: gridCols === 4 ? 'var(--ink)' : 'var(--text-faint)' }}
              title="4 cột"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setGridCols(3)}
              style={{ padding: '6px', color: gridCols === 3 ? 'var(--ink)' : 'var(--text-faint)' }}
              title="3 cột"
            >
              <SlidersHorizontal size={16} />
            </button>
            <button
              onClick={() => setGridCols(1)}
              style={{ padding: '6px', color: gridCols === 1 ? 'var(--ink)' : 'var(--text-faint)' }}
              title="Danh sách"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <span style={{ fontSize: '12px', fontWeight: 650, color: 'var(--text-muted)' }}>Đang lọc:</span>

          {selectedBrands.map((b) => (
            <span
              key={b}
              className="badge-pill badge-neutral"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', fontSize: '12px' }}
            >
              {b}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedBrands(selectedBrands.filter((x) => x !== b))} />
            </span>
          ))}

          {selectedPriceRange.min > 0 || selectedPriceRange.max < 99999999 ? (
            <span
              className="badge-pill badge-neutral"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', fontSize: '12px' }}
            >
              {selectedPriceRange.label}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedPriceRange(QUICK_PRICES[0])} />
            </span>
          ) : null}

          {selectedSkinTypes.map((st) => (
            <span
              key={st}
              className="badge-pill badge-neutral"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', fontSize: '12px' }}
            >
              {SKIN_TYPES.find((s) => s.id === st)?.label}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedSkinTypes(selectedSkinTypes.filter((x) => x !== st))} />
            </span>
          ))}

          {selectedConcerns.map((c) => (
            <span
              key={c}
              className="badge-pill badge-neutral"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', fontSize: '12px' }}
            >
              {c}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedConcerns(selectedConcerns.filter((x) => x !== c))} />
            </span>
          ))}

          {onlyInStock && (
            <span
              className="badge-pill badge-neutral"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', fontSize: '12px' }}
            >
              Còn hàng
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => setOnlyInStock(false)} />
            </span>
          )}

          <button
            onClick={handleClearAllFilters}
            style={{ fontSize: '12px', color: '#f43f5e', fontWeight: 650, textDecoration: 'underline', padding: '4px' }}
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      )}

      {/* Main Content Layout: Sidebar + Grid */}
      <div style={{ display: 'flex', gap: '28px' }}>
        {/* 3.2 Desktop Sidebar Filters (Width: 260px) */}
        <aside
          style={{ width: '260px', flexShrink: 0 }}
          className="desktop-filter-sidebar"
        >
          <div style={{ background: 'var(--canvas)', border: '1px solid var(--hairline-soft)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={16} /> Bộ Lọc Chi Tiết
              </h4>
              {activeFiltersCount > 0 && (
                <button onClick={handleClearAllFilters} style={{ fontSize: '11px', color: 'var(--text-muted)', textDecoration: 'underline' }}>
                  Đặt lại
                </button>
              )}
            </div>

            {/* Filter Group: Thương hiệu */}
            <div style={{ marginBottom: '22px', borderBottom: '1px solid var(--hairline-soft)', paddingBottom: '18px' }}>
              <p style={{ fontSize: '13px', fontWeight: 650, marginBottom: '10px' }}>Thương hiệu</p>
              <input
                type="text"
                placeholder="Tìm hãng..."
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '12px', marginBottom: '10px' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
                {filteredBrands.map((b) => {
                  const count = MOCK_PRODUCTS.filter((p) => p.brand === b).length;
                  return (
                    <label key={b} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedBrands([...selectedBrands, b]);
                          else setSelectedBrands(selectedBrands.filter((x) => x !== b));
                        }}
                        style={{ width: '15px', height: '15px' }}
                      />
                      <span>{b} ({count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Filter Group: Khoảng giá */}
            <div style={{ marginBottom: '22px', borderBottom: '1px solid var(--hairline-soft)', paddingBottom: '18px' }}>
              <p style={{ fontSize: '13px', fontWeight: 650, marginBottom: '10px' }}>Khoảng giá</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {QUICK_PRICES.map((qp, idx) => (
                  <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="quick_price"
                      checked={selectedPriceRange.label === qp.label}
                      onChange={() => setSelectedPriceRange(qp)}
                      style={{ width: '15px', height: '15px' }}
                    />
                    <span>{qp.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Group: Loại da phù hợp */}
            <div style={{ marginBottom: '22px', borderBottom: '1px solid var(--hairline-soft)', paddingBottom: '18px' }}>
              <p style={{ fontSize: '13px', fontWeight: 650, marginBottom: '10px' }}>Loại da</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {SKIN_TYPES.map((st) => (
                  <label key={st.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedSkinTypes.includes(st.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedSkinTypes([...selectedSkinTypes, st.id]);
                        else setSelectedSkinTypes(selectedSkinTypes.filter((x) => x !== st.id));
                      }}
                      style={{ width: '15px', height: '15px' }}
                    />
                    <span>{st.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Group: Công dụng / Vấn đề da */}
            <div style={{ marginBottom: '22px', borderBottom: '1px solid var(--hairline-soft)', paddingBottom: '18px' }}>
              <p style={{ fontSize: '13px', fontWeight: 650, marginBottom: '10px' }}>Công dụng & Vấn đề da</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {CONCERNS.map((c) => {
                  const isChecked = selectedConcerns.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => {
                        if (isChecked) setSelectedConcerns(selectedConcerns.filter((x) => x !== c));
                        else setSelectedConcerns([...selectedConcerns, c]);
                      }}
                      className={isChecked ? 'btn-pill-primary' : 'btn-pill-soft'}
                      style={{ fontSize: '11px', padding: '4px 10px' }}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Group: Nhóm Hoạt Chất Vàng (INCI Active Groups) */}
            <div style={{ marginBottom: '22px', borderBottom: '1px solid var(--hairline-soft)', paddingBottom: '18px' }}>
              <p style={{ fontSize: '13px', fontWeight: 650, marginBottom: '10px' }}>Nhóm Hoạt Chất Vàng (INCI)</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {KEY_ACTIVE_GROUPS.map((ag) => (
                  <label key={ag.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedActiveGroups.includes(ag.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedActiveGroups([...selectedActiveGroups, ag.id]);
                        else setSelectedActiveGroups(selectedActiveGroups.filter((x) => x !== ag.id));
                      }}
                      style={{ width: '14px', height: '14px' }}
                    />
                    <span>{ag.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Group: Tiêu Chuẩn An Toàn & Đạo Đức */}
            <div style={{ marginBottom: '22px', borderBottom: '1px solid var(--hairline-soft)', paddingBottom: '18px' }}>
              <p style={{ fontSize: '13px', fontWeight: 650, marginBottom: '10px' }}>Tiêu Chuẩn An Toàn & Nhãn</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {SAFETY_BADGES.map((sb) => {
                  const isChecked = selectedSafetyBadges.includes(sb.id);
                  return (
                    <button
                      key={sb.id}
                      onClick={() => {
                        if (isChecked) setSelectedSafetyBadges(selectedSafetyBadges.filter((x) => x !== sb.id));
                        else setSelectedSafetyBadges([...selectedSafetyBadges, sb.id]);
                      }}
                      className={isChecked ? 'badge-pill badge-primary' : 'badge-pill badge-soft'}
                      style={{ fontSize: '10.5px', padding: '3px 8px', cursor: 'pointer' }}
                    >
                      {sb.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Group: Kết cấu sản phẩm */}
            <div style={{ marginBottom: '22px', borderBottom: '1px solid var(--hairline-soft)', paddingBottom: '18px' }}>
              <p style={{ fontSize: '13px', fontWeight: 650, marginBottom: '10px' }}>Kết cấu (Texture)</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {FORMULATION_TEXTURES.map((t) => {
                  const isChecked = selectedTextures.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        if (isChecked) setSelectedTextures(selectedTextures.filter((x) => x !== t.id));
                        else setSelectedTextures([...selectedTextures, t.id]);
                      }}
                      className={isChecked ? 'btn-pill-primary' : 'btn-pill-soft'}
                      style={{ fontSize: '11px', padding: '4px 10px' }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Group: Tình trạng & Ưu đãi */}
            <div>
              <p style={{ fontSize: '13px', fontWeight: 650, marginBottom: '10px' }}>Trạng thái</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    style={{ width: '15px', height: '15px' }}
                  />
                  <span>Chỉ hiện sản phẩm còn hàng</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={onlyDiscount}
                    onChange={(e) => setOnlyDiscount(e.target.checked)}
                    style={{ width: '15px', height: '15px' }}
                  />
                  <span>Đang có giảm giá</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* 3.3 Product Grid Area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {filteredProducts.length === 0 ? (
            <div className="squircle-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--canvas-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Filter size={24} style={{ color: 'var(--text-faint)' }} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
                {initialSearch ? `Không tìm thấy sản phẩm cho "${initialSearch}"` : 'Không có sản phẩm nào phù hợp'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 20px' }}>
                {initialSearch
                  ? 'Thử tìm với tên hoạt chất (BHA, Niacinamide, Retinol), tên thương hiệu ngắn gọn (CeraVe, La Roche-Posay, Anua) hoặc xóa các bộ lọc bên trái.'
                  : 'Thử nới lỏng các tiêu chí bộ lọc giá hoặc loại bỏ bớt các thương hiệu đã chọn.'}
              </p>
              <button onClick={handleClearAllFilters} className="btn-pill-primary" style={{ padding: '8px 24px' }}>
                <RotateCcw size={14} /> Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  gridCols === 4
                    ? 'repeat(auto-fill, minmax(230px, 1fr))'
                    : gridCols === 3
                    ? 'repeat(auto-fill, minmax(280px, 1fr))'
                    : '1fr',
                gap: '20px',
                marginBottom: '32px'
              }}
            >
              {paginatedProducts.map((prod) => {
                const isWish = wishlistIds.includes(prod.id);

                return (
                  <motion.div
                    key={prod.id}
                    className="squircle-card"
                    whileHover={{ y: -5, scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 25 }}
                  >
                    <div className="product-card-img-wrap" onClick={() => onSelectProduct(prod)} style={{ cursor: 'pointer' }}>
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        onClick={() => onSelectProduct(prod)}
                        style={{ cursor: 'pointer' }}
                      />

                      {/* Badges */}
                      <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 2 }}>
                        {prod.badges?.slice(0, 2).map((b, bIdx) => (
                          <span
                            key={bIdx}
                            className={`badge-pill ${b.includes('%') ? 'badge-sale' : b === 'Mới' ? 'badge-blue' : 'badge-gold'}`}
                          >
                            {b}
                          </span>
                        ))}
                        {(prod.vtoConfig?.supported || (prod.category && (prod.category.toLowerCase().includes('son') || prod.category.toLowerCase().includes('má') || prod.category.toLowerCase().includes('nền') || prod.category.toLowerCase().includes('mắt') || prod.category.toLowerCase().includes('makeup')))) && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onOpenTryOn) onOpenTryOn(prod);
                            }}
                            className="badge-pill"
                            style={{
                              background: 'linear-gradient(135deg, #e11d48, #f43f5e)',
                              color: '#ffffff',
                              border: 'none',
                              cursor: 'pointer',
                              fontWeight: 700,
                              fontSize: '10.5px',
                              padding: '3px 8px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              boxShadow: '0 2px 8px rgba(225,29,72,0.35)'
                            }}
                          >
                            ✨ Thử Màu AR
                          </button>
                        )}
                      </div>

                      {/* Wishlist Heart */}
                      <button
                        onClick={() => onToggleWishlist(prod.id)}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: 'rgba(255, 255, 255, 0.85)',
                          backdropFilter: 'blur(4px)',
                          color: isWish ? '#f43f5e' : 'var(--ink)',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        <Heart size={16} fill={isWish ? '#f43f5e' : 'none'} />
                      </button>

                      {/* Desktop Hover Quick Actions */}
                      <div className="product-card-hover-actions">
                        <button
                          onClick={() => onOpenQuickView(prod)}
                          className="btn-pill-soft"
                          style={{ flex: 1, padding: '8px', fontSize: '11px', background: 'rgba(255,255,255,0.95)' }}
                        >
                          <Eye size={13} /> Xem nhanh
                        </button>
                        <button
                          onClick={() => onAddToCart(prod, prod.variants?.[0])}
                          className="btn-pill-primary"
                          style={{ flex: 1, padding: '8px', fontSize: '11px' }}
                        >
                          <ShoppingBag size={13} /> Thêm giỏ
                        </button>
                      </div>
                    </div>

                    <div style={{ padding: '16px' }}>
                      <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {prod.brand}
                      </p>
                      <h4
                        onClick={() => onSelectProduct(prod)}
                        style={{
                          fontSize: '14px',
                          fontWeight: 650,
                          lineHeight: 1.35,
                          marginBottom: '8px',
                          cursor: 'pointer',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {prod.name}
                      </h4>

                      {/* Rating & Sold count */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', color: '#f59e0b' }}>
                          <Star size={12} fill="#f59e0b" />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>{prod.rating || 4.9}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({prod.reviewCount || 100})</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                          Đã bán {prod.soldCount > 1000 ? `${(prod.soldCount / 1000).toFixed(1)}k` : (prod.soldCount || 100)}
                        </span>
                      </div>

                      {/* Price */}
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 750, color: 'var(--ink)' }}>
                          {prod.variants && prod.variants.length > 1
                            ? `Từ ${formatPrice(prod.variants[0]?.price ?? 0)}`
                            : formatPrice(prod.variants?.[0]?.price ?? 0)}
                        </span>
                        {prod.variants?.[0]?.originalPrice && (
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                            {formatPrice(prod.variants[0].originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '28px', flexWrap: 'wrap' }}>
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className="btn-pill-soft"
                style={{ padding: '8px 16px', fontSize: '12px', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                ← Trước
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === '...' ? (
                    <span key={`dots-${idx}`} style={{ padding: '0 6px', color: 'var(--text-muted)' }}>...</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => {
                        setCurrentPage(item);
                        window.scrollTo({ top: 380, behavior: 'smooth' });
                      }}
                      className={currentPage === item ? 'btn-pill-primary' : 'btn-pill-soft'}
                      style={{ padding: '8px 14px', fontSize: '12px' }}
                    >
                      {item}
                    </button>
                  )
                )}

              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className="btn-pill-soft"
                style={{ padding: '8px 16px', fontSize: '12px', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
              >
                Sau →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3.2 Mobile Bottom Sheet Filter (90% Height) */}
      {isMobileFilterOpen && (
        <div className="modal-backdrop" onClick={() => setIsMobileFilterOpen(false)}>
          <div className="drawer-bottom" onClick={(e) => e.stopPropagation()} style={{ height: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Bộ Lọc Sản Phẩm</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {/* Quick Brand */}
              <div style={{ marginBottom: '18px' }}>
                <p style={{ fontSize: '13px', fontWeight: 650, marginBottom: '8px' }}>Thương hiệu</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {allBrands.map((b) => (
                    <button
                      key={b}
                      onClick={() => {
                        if (selectedBrands.includes(b)) setSelectedBrands(selectedBrands.filter((x) => x !== b));
                        else setSelectedBrands([...selectedBrands, b]);
                      }}
                      className={selectedBrands.includes(b) ? 'btn-pill-primary' : 'btn-pill-soft'}
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div style={{ marginBottom: '18px' }}>
                <p style={{ fontSize: '13px', fontWeight: 650, marginBottom: '8px' }}>Mức giá</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {QUICK_PRICES.map((qp, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPriceRange(qp)}
                      className={selectedPriceRange.label === qp.label ? 'btn-pill-primary' : 'btn-pill-soft'}
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      {qp.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--hairline)', display: 'flex', gap: '10px' }}>
              <button onClick={handleClearAllFilters} className="btn-pill-outline" style={{ flex: 1 }}>Xóa lọc</button>
              <button onClick={() => setIsMobileFilterOpen(false)} className="btn-pill-primary" style={{ flex: 1 }}>
                Xem {filteredProducts.length} sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-filter-sidebar, .desktop-grid-toggle {
            display: none !important;
          }
          .mobile-filter-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </div>
  );
}
