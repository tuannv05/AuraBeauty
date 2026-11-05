// frontend/src/components/SellerPromotionalAdsRibbon.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Flame,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Camera,
  ShieldCheck,
  Tag,
  X
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../api';

const PROMOTIONAL_DEALS = [
  {
    id: 'promo-deal-1',
    type: 'SPONSORED',
    badgeText: 'Tài Trợ • Romand Official',
    badgeType: 'sponsored',
    title: 'Son Kem Lì Romand Zero Velvet Tint — Tông Đỏ Nhung Sắc Nét',
    highlight: 'Giảm 35% + Tặng Cọ Môi Chuyên Dụng',
    price: 179000,
    originalPrice: 275000,
    discountPercent: 35,
    tagline: 'Màu son cam đất & đỏ hồng thời thượng, che phủ rãnh môi mềm mượt',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&auto=format&fit=crop&q=80',
    productId: 'prod-004',
    canTryOn: true,
    sellerName: 'Romand Official Store Vietnam'
  },
  {
    id: 'promo-deal-2',
    type: 'MALL_DEAL',
    badgeText: 'Mall Ưu Đãi • La Roche-Posay',
    badgeType: 'mall',
    title: 'Serum Phục Hồi La Roche-Posay Hyalu B5 — Cấp Ẩm Chuyên Sâu',
    highlight: 'Flash Sale -50% • Tặng Kèm Kem Chống Nắng 15ml',
    price: 490000,
    originalPrice: 980000,
    discountPercent: 50,
    tagline: 'Phục hồi màng ẩm biểu bì sau 24h với Hyaluronic Acid nguyên chất & Vitamin B5',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&auto=format&fit=crop&q=80',
    productId: 'prod-002',
    canTryOn: false,
    sellerName: 'La Roche-Posay Flagship'
  },
  {
    id: 'promo-deal-3',
    type: 'BEST_SELLER',
    badgeText: 'Bán Chạy Nhất • 2.4k+ Đã Bán',
    badgeType: 'bestseller',
    title: 'Sữa Rửa Mặt CeraVe Foaming Cleanser 473ml Cho Da Dầu Mụn',
    highlight: 'Giá Sàn Độc Quyền • Freeship Toàn Quốc Từ 0đ',
    price: 365000,
    originalPrice: 450000,
    discountPercent: 19,
    tagline: 'Chứa 3 Ceramides thiết yếu và Niacinamide làm dịu da không gây khô căng',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80',
    productId: 'prod-005',
    canTryOn: false,
    sellerName: 'CeraVe Authorized Mall'
  },
  {
    id: 'promo-deal-4',
    type: 'SPONSORED',
    badgeText: 'Tài Trợ • 3CE Korea',
    badgeType: 'sponsored',
    title: 'Phấn Má Hồng 3CE Mood Recipe Face Blush — Peach Splash Trendy',
    highlight: 'Ưu Đãi Tuần Lễ Vàng • Thử Màu AR 3D Trực Tiếp',
    price: 285000,
    originalPrice: 380000,
    discountPercent: 25,
    tagline: 'Hạt phấn siêu mịn tiệp vào da tự nhiên, kiểm soát dầu nhẹ suốt 8 giờ',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&auto=format&fit=crop&q=80',
    productId: 'prod-004',
    canTryOn: true,
    sellerName: '3CE Stylenanda Vietnam'
  }
];

export default function SellerPromotionalAdsRibbon({
  onSelectProduct,
  onOpenTryOn
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const activeDeal = PROMOTIONAL_DEALS[currentIndex];

  // Auto-advance every 5 seconds unless hovered
  useEffect(() => {
    if (isPaused || isDismissed) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROMOTIONAL_DEALS.length);
    }, 5200);
    return () => clearInterval(interval);
  }, [isPaused, isDismissed]);

  if (isDismissed) return null;

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % PROMOTIONAL_DEALS.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + PROMOTIONAL_DEALS.length) % PROMOTIONAL_DEALS.length);
  };

  const handleDealClick = () => {
    const targetProduct = MOCK_PRODUCTS.find((p) => p.id === activeDeal.productId) || MOCK_PRODUCTS[0];
    if (onSelectProduct) {
      onSelectProduct(targetProduct);
    }
  };

  const handleTryOnClick = (e) => {
    e.stopPropagation();
    const targetProduct = MOCK_PRODUCTS.find((p) => p.id === activeDeal.productId) || MOCK_PRODUCTS[0];
    if (onOpenTryOn) {
      onOpenTryOn(targetProduct);
    }
  };

  return (
    <div
      className="seller-promotional-ribbon"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        background: 'linear-gradient(90deg, #fff5f7 0%, #ffffff 50%, #fdf2f8 100%)',
        borderBottom: '1px solid #fed7e2',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 200ms ease'
      }}
    >
      {/* Background ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          left: '15%',
          width: '280px',
          height: '80px',
          background: 'radial-gradient(ellipse at center, rgba(244, 63, 94, 0.12), transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '1720px',
          margin: '0 auto',
          padding: '8px clamp(16px, 3.5vw, 48px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          minHeight: '48px'
        }}
      >
        {/* Left Side: Leading Deal Badge & Carousel */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
          {/* Channel Indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '20px',
              background: '#ffffff',
              border: '1px solid #fbcfe8',
              boxShadow: '0 2px 6px rgba(236,72,153,0.08)',
              flexShrink: 0
            }}
          >
            <Zap size={14} style={{ color: '#e11d48', fill: '#e11d48' }} />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#be185d', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              Aura Deals
            </span>
          </div>

          {/* Carousel Slide Content */}
          <div style={{ flex: 1, minWidth: 0, position: 'relative', height: '36px', display: 'flex', alignItems: 'center' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDeal.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                onClick={handleDealClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  width: '100%',
                  minWidth: 0
                }}
              >
                {/* Product Thumbnail */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #fbcfe8',
                    background: '#ffffff',
                    flexShrink: 0
                  }}
                >
                  <img
                    src={activeDeal.image}
                    alt={activeDeal.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Badge Type */}
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 750,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    flexShrink: 0,
                    background:
                      activeDeal.badgeType === 'sponsored'
                        ? 'linear-gradient(135deg, #fef3c7, #fef08a)'
                        : activeDeal.badgeType === 'mall'
                        ? 'linear-gradient(135deg, #ffe4e6, #fecdd3)'
                        : 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                    color:
                      activeDeal.badgeType === 'sponsored'
                        ? '#854d0e'
                        : activeDeal.badgeType === 'mall'
                        ? '#be123c'
                        : '#15803d',
                    border: '1px solid rgba(0,0,0,0.06)'
                  }}
                >
                  {activeDeal.badgeText}
                </span>

                {/* Title & Highlight */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, overflow: 'hidden' }}>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#0f172a',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {activeDeal.title}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 650,
                      color: '#e11d48',
                      background: 'rgba(244,63,94,0.1)',
                      padding: '1px 7px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                  >
                    {activeDeal.highlight}
                  </span>
                </div>

                {/* Price Display */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginLeft: 'auto', flexShrink: 0 }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#e11d48' }}>
                    {activeDeal.price.toLocaleString('vi-VN')} ₫
                  </span>
                  <span style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'line-through' }}>
                    {activeDeal.originalPrice.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: CTAs & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* AR Try-On Action if available */}
          {activeDeal.canTryOn && (
            <button
              type="button"
              onClick={handleTryOnClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #e11d48, #f43f5e)',
                color: '#ffffff',
                border: 'none',
                fontSize: '11.5px',
                fontWeight: 750,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(225,29,72,0.3)',
                transition: 'all 150ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Camera size={13} />
              <span>Thử màu AR</span>
            </button>
          )}

          {/* View Deal Button */}
          <button
            type="button"
            onClick={handleDealClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 12px',
              borderRadius: '20px',
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid #cbd5e1',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#ec4899';
              e.currentTarget.style.color = '#ec4899';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.color = '#0f172a';
            }}
          >
            <span>Xem deal hot</span>
            <ArrowRight size={12} />
          </button>

          {/* Carousel Arrows */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginLeft: '4px' }}>
            <button
              type="button"
              onClick={handlePrev}
              title="Ưu đãi trước"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              title="Ưu đãi tiếp theo"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            title="Đóng thanh quảng cáo"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
