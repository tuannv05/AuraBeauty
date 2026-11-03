import React, { useState, useRef } from 'react';
import {
  Star, Heart, Scale, ShoppingBag, ShieldCheck, Truck, RefreshCw,
  Check, Info, Share2, AlertCircle, ChevronDown, ChevronUp, Copy,
  CheckCircle2, ThumbsUp, MessageSquare, Play, X, Sparkles, Bell
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../api';
import VirtualTryOnModal from './VirtualTryOnModal';
import VariantColorPicker from './VariantColorPicker';

export default function ProductDetailView({
  product,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isWishlisted = false,
  onAddToCompare,
  onSelectProduct,
  onAddToast,
  onNavigateHome,
  onNavigateBrandStore
}) {
  if (!product) return null;

  const images = product.images || [
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'
  ];

  // Gallery States
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });

  // Buy box states
  const [selectedVariant, setSelectedVariant] = useState(
    () => product.variants?.[0] || {
      skuCode: `${product.id}-STD`,
      name: product.name,
      price: product.price || 0,
      originalPrice: product.originalPrice || null,
      onHand: product.inStock !== false ? 120 : 0
    }
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedProvince, setSelectedProvince] = useState('TP. Hồ Chí Minh');
  const [isCopiedLink, setIsCopiedLink] = useState(false);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);

  // Reset variant, image index, and quantity when product changes
  React.useEffect(() => {
    setActiveImgIdx(0);
    setSelectedVariant(
      product.variants?.[0] || {
        skuCode: `${product.id}-STD`,
        name: product.name,
        price: product.price || 0,
        originalPrice: product.originalPrice || null,
        onHand: product.inStock !== false ? 120 : 0
      }
    );
    setQuantity(1);
  }, [product?.id]);

  // Tabs State
  const [activeTab, setActiveTab] = useState('description');
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Popover for INCI Active
  const [activeInciPopover, setActiveInciPopover] = useState(null);

  // Reviews Filter & Helpful Likes
  const [reviewStarFilter, setReviewStarFilter] = useState(0);
  const [helpfulLikes, setHelpfulLikes] = useState({ 1: 18, 2: 24, 3: 9 });
  const [userLikedReviews, setUserLikedReviews] = useState([]);

  // Frequently bought together bundle checkboxes
  const upsellBundleItems = MOCK_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 2);
  const [bundleChecked, setBundleChecked] = useState([true, true]);

  // Reviews Section Ref for smooth scroll
  const reviewsRef = useRef(null);

  // Magnifier Zoom Lens Effect on Hover
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${images[activeImgIdx]})`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  const handleVariantSelect = (v, norm) => {
    setSelectedVariant(v);
    const stock = v.onHand ?? v.stock ?? 120;
    if (quantity > stock && stock > 0) {
      setQuantity(stock);
    }
    const sku = v.skuCode || v.sku;
    if (sku) {
      const skuImg = `/products/${sku}.jpg`;
      const foundIdx = images.findIndex((img) => img === skuImg || img.includes(sku));
      if (foundIdx !== -1) {
        setActiveImgIdx(foundIdx);
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopiedLink(true);
    onAddToast({ type: 'success', message: 'Đã sao chép liên kết sản phẩm vào bộ nhớ tạm!' });
    setTimeout(() => setIsCopiedLink(false), 3000);
  };

  const handleToggleLikeReview = (revId) => {
    if (userLikedReviews.includes(revId)) {
      setUserLikedReviews(userLikedReviews.filter((id) => id !== revId));
      setHelpfulLikes({ ...helpfulLikes, [revId]: helpfulLikes[revId] - 1 });
    } else {
      setUserLikedReviews([...userLikedReviews, revId]);
      setHelpfulLikes({ ...helpfulLikes, [revId]: (helpfulLikes[revId] || 0) + 1 });
      onAddToast({ type: 'success', message: 'Cảm ơn bạn đã phản hồi đánh giá hữu ích!' });
    }
  };

  const bundleTotal =
    selectedVariant.price +
    upsellBundleItems.reduce((sum, item, idx) => (bundleChecked[idx] ? sum + item.variants[0].price : sum), 0);

  const handleAddBundleToCart = () => {
    onAddToCart(product, selectedVariant, 1);
    upsellBundleItems.forEach((item, idx) => {
      if (bundleChecked[idx]) {
        onAddToCart(item, item.variants[0], 1);
      }
    });
    onAddToast({ type: 'success', message: 'Đã thêm trọn bộ Routine vào giỏ hàng!' });
  };

  return (
    <div style={{ marginTop: '16px', paddingBottom: '80px' }}>
      {/* 5.1 Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
        <button onClick={onNavigateHome} style={{ color: 'var(--text-muted)' }}>Trang chủ</button>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span>{product.brand}</span>
        <span>/</span>
        <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{product.name}</span>
      </nav>

      {/* 5.2 Top Two-Column Area: Gallery (55%) vs Purchase Info (45%) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '40px', marginBottom: '48px' }}>
        {/* Left: Gallery (55%) */}
        <div>
          {/* Main 1:1 Image with 2x Zoom Magnifier Lens */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => setIsLightboxOpen(true)}
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1 / 1',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              background: 'var(--canvas-soft)',
              border: '1px solid var(--hairline-soft)',
              cursor: 'zoom-in',
              marginBottom: '16px'
            }}
          >
            <img
              src={images[activeImgIdx]}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }}
            />

            {/* Badges Overlay */}
            <div style={{ position: 'absolute', top: '14px', left: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {product.badges?.map((b, i) => (
                <span key={i} className={`badge-pill ${b.includes('%') ? 'badge-sale' : 'badge-gold'}`}>
                  {b}
                </span>
              ))}
            </div>

            {/* 2x Magnifier Lens Window */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                backgroundSize: '200%',
                ...zoomStyle
              }}
            />
          </div>

          {/* Thumbnail Carousel */}
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImgIdx(idx)}
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  border: activeImgIdx === idx ? '2px solid var(--ink)' : '1px solid var(--hairline)',
                  opacity: activeImgIdx === idx ? 1 : 0.65,
                  flexShrink: 0,
                  transition: 'all 150ms'
                }}
              >
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Purchase Buy Box (45% - Sticky) */}
        <div style={{ position: 'sticky', top: '90px', height: 'fit-content' }}>
          {/* Brand & Genuine Shield */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 750, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {product.brand}
            </span>
            <span className="badge-pill badge-green" style={{ fontSize: '11px' }}>
              <ShieldCheck size={14} /> 100% Chính Hãng Được Kiểm Định
            </span>
          </div>

          {/* Brand Store Card Widget */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              marginBottom: '14px'
            }}
          >
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a' }}>{product.brand} Official Store</div>
              <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 650 }}>✓ Gian hàng chính hãng • Tích xanh Official Mall</div>
            </div>
            {onNavigateBrandStore && (
              <button
                type="button"
                onClick={() => onNavigateBrandStore(product.brand)}
                style={{
                  background: '#fdf2f8',
                  color: '#db2777',
                  border: '1px solid #fbcfe8',
                  borderRadius: '8px',
                  padding: '5px 12px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Xem Gian Hàng
              </button>
            )}
          </div>

          {/* Product H1 Title */}
          <h1 style={{ fontSize: '24px', fontWeight: 750, lineHeight: 1.3, letterSpacing: '-0.01em', marginBottom: '12px' }}>
            {product.name}
          </h1>

          {/* Rating Summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="#f59e0b" />
              ))}
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>{product.rating || 4.9}</span>
            <button
              onClick={() => {
                setActiveTab('reviews');
                reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'underline' }}
            >
              ({product.reviewCount || 214} đánh giá kiểm duyệt)
            </button>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>· Đã bán {product.soldCount || '3.2k'}</span>
          </div>

          {/* Pricing Box */}
          <div
            style={{
              padding: '16px 20px',
              background: 'var(--canvas-soft)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--hairline-soft)',
              marginBottom: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '6px' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--ink)' }}>
                {(selectedVariant?.price ?? product.price ?? 0).toLocaleString('vi-VN')} đ
              </span>
              {(selectedVariant?.originalPrice || product.originalPrice) && (
                <span style={{ fontSize: '15px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  {(selectedVariant?.originalPrice || product.originalPrice).toLocaleString('vi-VN')} đ
                </span>
              )}
              {(selectedVariant?.originalPrice || product.originalPrice) && (
                <span className="badge-pill badge-sale" style={{ fontSize: '12px' }}>
                  Tiết kiệm {((selectedVariant?.originalPrice || product.originalPrice) - (selectedVariant?.price || product.price)).toLocaleString('vi-VN')} đ
                </span>
              )}
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Đã bao gồm thuế giá trị gia tăng (VAT)</p>
          </div>

          {/* Short Key Benefits Bullets */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Điểm nổi bật:
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={14} style={{ color: '#10b981' }} /> {product.description}
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={14} style={{ color: '#10b981' }} /> Số CBMP: <strong>{product.registrationNumber || product.cbmpNumber || 'Đang cập nhật'}</strong>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={14} style={{ color: '#10b981' }} /> Phù hợp với: {product.targetSkinTypes?.join(', ') || 'Mọi loại da'}
              </li>
            </ul>
          </div>

          {/* Upgraded Variant & Color Picker System */}
          <div style={{ marginBottom: '22px' }}>
            <VariantColorPicker
              product={product}
              selectedVariant={selectedVariant}
              onSelectVariant={handleVariantSelect}
              onOpenTryOn={(v) => {
                if (v) setSelectedVariant(v);
                setIsTryOnOpen(true);
              }}
            />
          </div>

          {/* Quantity Stepper & Stock Status */}
          {(() => {
            const isProductInStock = product.inStock !== false;
            const stockCount = (isProductInStock && selectedVariant?.inStock !== false)
              ? (selectedVariant?.onHand ?? selectedVariant?.stock ?? 120)
              : 0;
            const isOutOfStock = stockCount <= 0;

            return (
              <>
                {/* Shopee Row: Số Lượng */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <span style={{ width: '110px', flexShrink: 0, fontSize: '13px', color: '#757575', fontWeight: 500 }}>
                    Số Lượng
                  </span>

                  {/* Stepper with Shopee styling */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '2px', background: '#ffffff', overflow: 'hidden' }}>
                    <button
                      type="button"
                      disabled={isOutOfStock || quantity <= 1}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        color: isOutOfStock || quantity <= 1 ? '#d1d5db' : '#374151',
                        border: 'none',
                        borderRight: '1px solid #e5e7eb',
                        background: '#ffffff',
                        cursor: isOutOfStock || quantity <= 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      readOnly
                      value={isOutOfStock ? 0 : quantity}
                      style={{
                        width: '50px',
                        height: '32px',
                        textAlign: 'center',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#111827',
                        border: 'none',
                        background: '#ffffff',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="button"
                      disabled={isOutOfStock || quantity >= stockCount}
                      onClick={() => setQuantity(Math.min(stockCount, quantity + 1))}
                      style={{
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        color: isOutOfStock || quantity >= stockCount ? '#d1d5db' : '#374151',
                        border: 'none',
                        borderLeft: '1px solid #e5e7eb',
                        background: '#ffffff',
                        cursor: isOutOfStock || quantity >= stockCount ? 'not-allowed' : 'pointer'
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Stock count label */}
                  <span style={{ fontSize: '13px', color: '#757575' }}>
                    {isOutOfStock ? (
                      <span style={{ color: '#ef4444', fontWeight: 600 }}>Tạm hết hàng</span>
                    ) : (
                      `${stockCount} sản phẩm có sẵn`
                    )}
                  </span>
                </div>

                {/* Shopee Action Buy Buttons */}
                <div style={{ display: 'flex', gap: '14px', marginBottom: '18px', flexWrap: 'wrap' }}>
                  {isOutOfStock ? (
                    <>
                      <button
                        type="button"
                        onClick={() => onAddToast({ type: 'info', message: `Đã lưu yêu cầu! Aura sẽ gửi thông báo đến bạn ngay khi "${selectedVariant?.name || selectedVariant?.title || 'sản phẩm'}" có hàng trở lại!` })}
                        style={{
                          flex: 1,
                          minWidth: '200px',
                          height: '48px',
                          borderRadius: '3px',
                          border: '1px solid #ee4d2d',
                          background: 'rgba(238, 77, 45, 0.08)',
                          color: '#ee4d2d',
                          fontSize: '14px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        <Bell size={17} /> Nhận thông báo khi có hàng
                      </button>
                      <button
                        type="button"
                        disabled
                        style={{
                          flex: 1,
                          minWidth: '180px',
                          height: '48px',
                          borderRadius: '3px',
                          border: 'none',
                          background: '#f3f4f6',
                          color: '#9ca3af',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'not-allowed'
                        }}
                      >
                        Tạm hết hàng
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => onAddToCart(product, selectedVariant, quantity)}
                        style={{
                          flex: 1,
                          minWidth: '190px',
                          height: '48px',
                          borderRadius: '3px',
                          border: '1px solid #ee4d2d',
                          background: 'rgba(238, 77, 45, 0.08)',
                          color: '#ee4d2d',
                          fontSize: '14px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                          transition: 'background 150ms ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(238, 77, 45, 0.14)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(238, 77, 45, 0.08)')}
                      >
                        <ShoppingBag size={18} /> Thêm Vào Giỏ Hàng
                      </button>
                      <button
                        type="button"
                        onClick={() => onBuyNow(product, selectedVariant, quantity)}
                        style={{
                          flex: 1,
                          minWidth: '220px',
                          height: '48px',
                          borderRadius: '3px',
                          border: 'none',
                          background: '#ee4d2d',
                          color: '#ffffff',
                          fontSize: '14px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 8px rgba(238, 77, 45, 0.3)',
                          transition: 'background 150ms ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#d73211')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#ee4d2d')}
                      >
                        Mua Với Voucher {(selectedVariant?.price || product.price).toLocaleString('vi-VN')}₫
                      </button>
                    </>
                  )}
                </div>
              </>
            );
          })()}

          {/* Wishlist, Compare & Share shortcuts */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--hairline-soft)', fontSize: '13px' }}>
            <button
              onClick={() => onToggleWishlist(product.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isWishlisted ? '#f43f5e' : 'var(--text-muted)' }}
            >
              <Heart size={16} fill={isWishlisted ? '#f43f5e' : 'none'} />
              <span>{isWishlisted ? 'Đã yêu thích' : 'Lưu yêu thích'}</span>
            </button>

            <button
              onClick={() => onAddToCompare(product)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}
            >
              <Scale size={16} />
              <span>Thêm so sánh</span>
            </button>

            <button
              onClick={handleCopyLink}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}
            >
              {isCopiedLink ? <CheckCircle2 size={16} style={{ color: '#10b981' }} /> : <Share2 size={16} />}
              <span>{isCopiedLink ? 'Đã sao chép' : 'Chia sẻ'}</span>
            </button>
          </div>

          {/* Estimated Shipping Calculator */}
          <div style={{ marginTop: '20px', padding: '14px', background: 'var(--canvas-soft)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--hairline-soft)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 650, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={15} /> Giao hàng dự kiến:
              </span>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                style={{ width: 'auto', padding: '3px 8px', fontSize: '11px', borderRadius: 'var(--radius-full)' }}
              >
                <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Cần Thơ">Cần Thơ</option>
              </select>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Nhận hàng vào <strong>Thứ Tư (Giao nhanh 2h khả dụng)</strong> · Cước phí: <strong>Miễn phí</strong> (đơn từ 299k)
            </p>
          </div>
        </div>
      </div>

      {/* 5.3 Sticky Tabbed Content Navigation */}
      <div style={{ borderBottom: '1px solid var(--hairline)', marginBottom: '32px', position: 'sticky', top: '74px', background: 'var(--canvas)', zIndex: 10 }}>
        <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '12px' }}>
          {[
            { id: 'description', label: 'Mô Tả Sản Phẩm' },
            { id: 'specs', label: 'Thông Số Kỹ Thuật' },
            { id: 'inci', label: 'Bảng Hoạt Chất INCI (Chuẩn Y Khoa)' },
            { id: 'howtouse', label: 'Hướng Dẫn Sử Dụng' },
            { id: 'reviews', label: `Đánh Giá (${product.reviewCount || 214})` },
            { id: 'faq', label: 'Hỏi & Đáp' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? 'var(--ink)' : 'var(--text-muted)',
                paddingBottom: '8px',
                borderBottom: activeTab === tab.id ? '2px solid var(--ink)' : '2px solid transparent',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Mô Tả */}
      {activeTab === 'description' && (
        <div className="squircle-card" style={{ padding: '32px', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>Chi Tiết Sản Phẩm & Công Dụng Vượt Trội</h3>
          <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--ink)', marginBottom: '16px' }}>
            {product.longDescription || product.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', margin: '24px 0' }}>
            <img
              src={images[0]}
              alt=""
              style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
            />
            {images[1] && (
              <img
                src={images[1]}
                alt=""
                style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
              />
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Thông số kỹ thuật */}
      {activeTab === 'specs' && (
        <div className="squircle-card" style={{ padding: '32px', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '18px' }}>Thông Số Kỹ Thuật Chuẩn Hồ Sơ Công Bố</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <tbody>
              {[
                { label: 'Thương hiệu', val: product.brand },
                { label: 'Xuất xứ thương hiệu', val: product.origin },
                { label: 'Dung tích / Trọng lượng', val: selectedVariant.title },
                { label: 'Loại da phù hợp', val: product.targetSkinTypes?.join(', ') },
                { label: 'Vấn đề da khắc phục', val: product.concerns?.join(', ') },
                { label: 'Số phiếu công bố mỹ phẩm (CBMP)', val: product.registrationNumber },
                { label: 'Hạn sử dụng', val: '36 tháng kể từ ngày sản xuất (12 tháng sau khi mở nắp)' },
                { label: 'Nhà sản xuất', val: 'Tập đoàn mỹ phẩm được cấp chứng chỉ cGMP quốc tế' }
              ].map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--hairline-soft)' }}>
                  <td style={{ width: '35%', padding: '12px', fontWeight: 650, color: 'var(--text-muted)' }}>{row.label}</td>
                  <td style={{ padding: '12px', color: 'var(--ink)' }}>{row.val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Bảng hoạt chất INCI Chuẩn Y Khoa */}
      {activeTab === 'inci' && (
        <div className="squircle-card" style={{ padding: '32px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Danh Sách Hoạt Chất INCI Quốc Tế</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Bấm vào từng hoạt chất để xem đánh giá khoa học về nguy cơ bít tắc lỗ chân lông (Comedogenic Rating 0–5) và khả năng gây kích ứng.
              </p>
            </div>
            <span className="badge-pill badge-green">Đã kiểm nghiệm da liễu</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
            {product.inciIngredients?.map((inci, idx) => (
              <button
                key={idx}
                onClick={() => setActiveInciPopover(inci)}
                className="btn-pill-soft"
                style={{
                  fontSize: '13px',
                  padding: '8px 16px',
                  background: activeInciPopover?.name === inci.name ? 'var(--ink)' : 'var(--canvas-soft)',
                  color: activeInciPopover?.name === inci.name ? '#ffffff' : 'var(--ink)',
                  border: '1px solid var(--hairline)'
                }}
              >
                🔬 {inci.name}
              </button>
            ))}
          </div>

          {/* INCI Active Popover Detail Box */}
          {activeInciPopover && (
            <div
              style={{
                padding: '20px',
                background: 'rgba(0, 102, 255, 0.05)',
                border: '1px solid rgba(0, 102, 255, 0.2)',
                borderRadius: 'var(--radius-md)',
                animation: 'scaleUp 180ms ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0066ff' }}>
                  {activeInciPopover.name}
                </h4>
                <button onClick={() => setActiveInciPopover(null)} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
              </div>

              <p style={{ fontSize: '13px', marginBottom: '12px' }}>
                <strong>Công năng sinh học:</strong> {activeInciPopover.functionCategory}
              </p>

              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Chỉ số bít tắc mụn (Comedogenic):</span>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: activeInciPopover.comedogenicRating > 2 ? '#ef4444' : '#10b981' }}>
                    {activeInciPopover.comedogenicRating}/5 ({activeInciPopover.comedogenicRating === 0 ? 'Tuyệt đối an toàn' : 'Cần lưu ý'})
                  </p>
                </div>

                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Chỉ số kích ứng (Irritation Score):</span>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: activeInciPopover.irritationRating > 1 ? '#f59e0b' : '#10b981' }}>
                    {activeInciPopover.irritationRating}/5 (Không gây châm chích)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Hướng Dẫn Sử Dụng & Routine */}
      {activeTab === 'howtouse' && (
        <div className="squircle-card" style={{ padding: '32px', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '18px' }}>Hướng Dẫn Sử Dụng Theo Chu Trình Chuẩn</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            {product.howToUse?.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--ink)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>
                  {idx + 1}
                </div>
                <p style={{ fontSize: '14px', lineHeight: 1.5, paddingTop: '2px' }}>{step}</p>
              </div>
            ))}
          </div>

          <div style={{ padding: '16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 'var(--radius-sm)' }}>
            <p style={{ fontSize: '13px', color: '#92400e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} /> Lưu ý an toàn từ Dược sĩ:
            </p>
            <p style={{ fontSize: '12px', color: '#92400e', marginTop: '4px' }}>
              Nên thoa thử một lượng nhỏ ở vùng da sau mang tai hoặc dưới quai hàm trong vòng 24 giờ trước khi thoa đều khắp mặt. Ban ngày luôn kết hợp kem chống nắng có SPF từ 30 trở lên.
            </p>
          </div>
        </div>
      )}

      {/* Tab 5: Đánh Giá Khách Hàng (5.6) */}
      <div ref={reviewsRef} id="reviews-section">
        {activeTab === 'reviews' && (
          <div className="squircle-card" style={{ padding: '32px', marginBottom: '40px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 750, marginBottom: '20px' }}>Đánh Giá Từ Khách Hàng Đã Trải Nghiệm</h3>

            {/* Score & Distribution bars */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'center', paddingBottom: '24px', borderBottom: '1px solid var(--hairline-soft)', marginBottom: '24px' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1 }}>{product.rating || 4.9}</span>
                <div style={{ display: 'flex', color: '#f59e0b', justifyContent: 'center', margin: '6px 0' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#f59e0b" />)}
                </div>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{product.reviewCount || 214} đánh giá</span>
              </div>

              {/* 5-star distribution */}
              <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { star: 5, count: '85%' },
                  { star: 4, count: '12%' },
                  { star: 3, count: '2%' },
                  { star: 2, count: '1%' },
                  { star: 1, count: '0%' }
                ].map((row) => (
                  <div key={row.star} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
                    <span style={{ width: '40px' }}>{row.star} sao</span>
                    <div style={{ flex: 1, height: '6px', background: '#f3f4f6', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: row.count, height: '100%', background: '#f59e0b' }} />
                    </div>
                    <span style={{ width: '32px', color: 'var(--text-muted)', textAlign: 'right' }}>{row.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                {
                  id: 1,
                  author: 'Nguyễn Thị H***',
                  skin: 'Da Dầu Mụn',
                  date: '25/10/2026',
                  rating: 5,
                  variant: 'Chai 80ml',
                  comment: 'Mùi trà xanh tự nhiên rất dễ chịu, thoa lên mát da và thấm cực kỳ nhanh. Dùng 1 tuần thấy da ẩm mịn và đỡ đổ dầu rõ rệt.'
                },
                {
                  id: 2,
                  author: 'Lê Hoàng M***',
                  skin: 'Da Hỗn Hợp Nhạy Cảm',
                  date: '20/10/2026',
                  rating: 5,
                  variant: 'Chai 80ml',
                  comment: 'Sản phẩm chính hãng có tem phụ rõ ràng, quét mã QR ra thông tin kiểm định. Không hề bị châm chích hay kích ứng gì.'
                }
              ].map((rev) => (
                <div key={rev.id} style={{ paddingBottom: '18px', borderBottom: '1px solid var(--hairline-soft)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 650 }}>{rev.author}</span>
                      <span className="badge-pill badge-green" style={{ fontSize: '10px', padding: '1px 6px' }}>
                        <CheckCircle2 size={10} /> Đã mua hàng
                      </span>
                      <span className="badge-pill badge-blue" style={{ fontSize: '10px', padding: '1px 6px' }}>{rev.skin}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{rev.date}</span>
                  </div>

                  <div style={{ display: 'flex', color: '#f59e0b', marginBottom: '6px' }}>
                    {[...Array(rev.rating)].map((_, i) => <Star key={i} size={13} fill="#f59e0b" />)}
                  </div>

                  <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--ink)', marginBottom: '10px' }}>
                    {rev.comment}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>Phân loại: {rev.variant}</span>
                    <button
                      onClick={() => handleToggleLikeReview(rev.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: userLikedReviews.includes(rev.id) ? '#0066ff' : 'var(--text-muted)',
                        fontWeight: userLikedReviews.includes(rev.id) ? 700 : 500
                      }}
                    >
                      <ThumbsUp size={13} /> Hữu ích ({helpfulLikes[rev.id] || 15})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Frequently Bought Together Bundle */}
      {upsellBundleItems.length > 0 && (
        <section
          style={{
            background: 'var(--canvas-soft)',
            border: '1px solid var(--hairline)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
            marginBottom: '48px'
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 750, marginBottom: '6px' }}>
            Thường Được Mua Cùng Nhau (Combo Tiết Kiệm)
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Kết hợp các sản phẩm bổ trợ lẫn nhau để đạt hiệu quả tối ưu trên da.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            {/* Current Item */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ffffff', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
              <img src={images[0]} alt="" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
              <div>
                <p style={{ fontSize: '12px', fontWeight: 650 }}>{product.name}</p>
                <span style={{ fontSize: '13px', fontWeight: 750 }}>{selectedVariant.price.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>

            <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-muted)' }}>+</span>

            {/* Bundle items with checkboxes */}
            {upsellBundleItems.map((uItem, idx) => (
              <React.Fragment key={uItem.id}>
                <div
                  onClick={() => {
                    const copy = [...bundleChecked];
                    copy[idx] = !copy[idx];
                    setBundleChecked(copy);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#ffffff',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    border: bundleChecked[idx] ? '1px solid var(--ink)' : '1px solid var(--hairline)'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={bundleChecked[idx]}
                    onChange={() => {}}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <img src={uItem.images[0]} alt="" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 650 }}>{uItem.name}</p>
                    <span style={{ fontSize: '13px', fontWeight: 750 }}>{uItem.variants[0].price.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>
                {idx < upsellBundleItems.length - 1 && <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-muted)' }}>+</span>}
              </React.Fragment>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Tổng thanh toán trọn bộ:</span>
              <p style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink)' }}>
                {bundleTotal.toLocaleString('vi-VN')} đ
              </p>
            </div>
            <button
              onClick={handleAddBundleToCart}
              className="btn-pill-primary"
              style={{ padding: '12px 28px', fontSize: '14px' }}
            >
              Thêm cả bộ vào giỏ hàng
            </button>
          </div>
        </section>
      )}

      {/* Lightbox Full Screen Modal */}
      {isLightboxOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsLightboxOpen(false)}
          style={{ background: 'rgba(0, 0, 0, 0.92)' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', maxWidth: '80vw', maxHeight: '80vh' }}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              style={{ position: 'absolute', top: '-40px', right: 0, color: '#ffffff' }}
            >
              <X size={28} />
            </button>
            <img
              src={images[activeImgIdx]}
              alt=""
              style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '12px', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
      {/* Virtual Try-On AR Modal */}
      <VirtualTryOnModal
        isOpen={isTryOnOpen}
        onClose={() => setIsTryOnOpen(false)}
        initialProduct={product}
        initialVariant={selectedVariant}
        onAddToCart={onAddToCart}
        onAddToast={onAddToast}
      />
    </div>
  );
}
