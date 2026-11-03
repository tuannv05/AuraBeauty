import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Clock, Flame, ShoppingBag, Eye, Heart, Sparkles,
  ArrowRight, ShieldCheck, CheckCircle2
} from 'lucide-react';
import { AnimatedTabs, MotionCard, AnimatedBadge, SpringButton, NumberTicker } from './ui';
import { MOCK_PRODUCTS } from '../api';

export function FlashSaleView({
  onSelectProduct,
  onAddToCart,
  onOpenQuickView,
  onOpenTryOn,
  onNavigateHome,
  onAddToast,
  wishlistIds = []
}) {
  const [activeSlot, setActiveSlot] = useState('slot-1');

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 3, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const SLOTS = [
    { id: 'slot-1', label: '09:00 - 12:00', badge: 'ĐANG DIỄN RA' },
    { id: 'slot-2', label: '12:00 - 15:00', badge: 'SẮP MỞ' },
    { id: 'slot-3', label: '18:00 - 21:00', badge: 'CHỜ ĐÓN' },
    { id: 'slot-4', label: '21:00 - 24:00', badge: 'ĐÊM VÀNG' }
  ];

  // Lấy các sản phẩm có giảm giá hoặc gán mức giảm Flash Sale
  const flashProducts = MOCK_PRODUCTS.slice(0, 16).map((p, idx) => {
    const discountPercent = idx % 3 === 0 ? 50 : idx % 2 === 0 ? 40 : 35;
    const originalPrice = p.variants[0].originalPrice || Math.round(p.variants[0].price * (100 / (100 - discountPercent)));
    const soldPercent = Math.min(95, 45 + ((idx * 13) % 50));

    return {
      ...p,
      discountPercent,
      flashPrice: p.variants[0].price,
      originalPrice,
      soldPercent,
      isNearSoldOut: soldPercent >= 80
    };
  });

  return (
    <div style={{ marginTop: '20px', paddingBottom: '60px' }}>
      {/* 1. Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
        <button onClick={onNavigateHome} style={{ color: '#64748b', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>
          Trang chủ
        </button>
        <span>/</span>
        <span style={{ color: '#e11d48', fontWeight: 700 }}>⚡ Flash Sale Khung Giờ Vàng</span>
      </nav>

      {/* 2. Hero Flash Sale Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #be123c 0%, #e11d48 45%, #f43f5e 100%)',
          borderRadius: '24px',
          padding: '32px 36px',
          color: '#ffffff',
          marginBottom: '28px',
          boxShadow: '0 20px 35px -10px rgba(225, 29, 72, 0.45)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 800, marginBottom: '12px' }}>
            <Zap size={15} style={{ fill: '#fbbf24', color: '#fbbf24' }} /> GIẢM ĐẾN 50% - DUY NHẤT HÔM NAY
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 10px 0' }}>
            Lễ Hội Săn Sale Mỹ Phẩm Chính Hãng
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6, margin: '0 0 20px 0' }}>
            Số lượng giới hạn 100 suất mỗi sản phẩm. Miễn phí giao hàng hỏa tốc 2H cho mọi đơn săn deal thành công.
          </p>

          {/* Countdown Clock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', fontWeight: 750, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              KẾT THÚC TRONG:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ background: '#0f172a', padding: '6px 12px', borderRadius: '10px', fontSize: '20px', fontWeight: 900, minWidth: '48px', textAlign: 'center' }}>
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span style={{ fontSize: '20px', fontWeight: 900 }}>:</span>
              <div style={{ background: '#0f172a', padding: '6px 12px', borderRadius: '10px', fontSize: '20px', fontWeight: 900, minWidth: '48px', textAlign: 'center' }}>
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span style={{ fontSize: '20px', fontWeight: 900 }}>:</span>
              <div style={{ background: '#0f172a', padding: '6px 12px', borderRadius: '10px', fontSize: '20px', fontWeight: 900, minWidth: '48px', textAlign: 'center' }}>
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Slot Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
        <AnimatedTabs
          tabs={SLOTS}
          activeTab={activeSlot}
          onChange={(id) => {
            setActiveSlot(id);
            onAddToast({ type: 'info', message: `Đã chuyển sang khung giờ ${SLOTS.find(s => s.id === id)?.label}` });
          }}
          className="p-1.5 bg-neutral-100 max-w-2xl w-full"
        />
      </div>

      {/* 4. Products Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '20px'
        }}
      >
        {flashProducts.map((p) => {
          const isWish = wishlistIds.includes(p.id);

          return (
            <motion.div
              key={p.id}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #fecdd3',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(225, 29, 72, 0.08)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ position: 'relative', width: '100%', paddingTop: '100%', background: '#f8fafc', overflow: 'hidden' }}>
                <img
                  src={p.images[0]}
                  alt={p.name}
                  onClick={() => onSelectProduct(p)}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', padding: '8px', cursor: 'pointer' }}
                />

                {/* Discount Badge */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#e11d48', color: '#ffffff', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Zap size={13} style={{ fill: '#fff' }} /> -{p.discountPercent}%
                </div>

                {/* Try-on Badge */}
                {(p.vtoConfig?.supported || p.category?.toLowerCase().includes('lipstick') || p.category?.toLowerCase().includes('blush')) && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onOpenTryOn(p); }}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'linear-gradient(135deg, #e11d48, #f43f5e)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '9999px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: 750,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Sparkles size={12} /> Thử AR
                  </button>
                )}
              </div>

              {/* Product Info */}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#ec4899', textTransform: 'uppercase' }}>
                    {p.brand}
                  </span>
                  <h4
                    onClick={() => onSelectProduct(p)}
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#0f172a',
                      lineHeight: 1.4,
                      margin: '4px 0 8px 0',
                      cursor: 'pointer',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {p.name}
                  </h4>

                  {/* Price */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 900, color: '#e11d48' }}>
                      {p.flashPrice.toLocaleString('vi-VN')}₫
                    </span>
                    <span style={{ fontSize: '12.5px', color: '#94a3b8', textDecoration: 'line-through' }}>
                      {p.originalPrice.toLocaleString('vi-VN')}₫
                    </span>
                  </div>

                  {/* Stock progress bar */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 700, color: p.isNearSoldOut ? '#e11d48' : '#64748b', marginBottom: '4px' }}>
                      <span>{p.isNearSoldOut ? '🔥 Sắp cháy hàng!' : 'Đang bán nhanh'}</span>
                      <span>Đã bán {p.soldPercent}%</span>
                    </div>
                    <div style={{ height: '8px', background: '#ffe4e6', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${p.soldPercent}%`,
                          background: 'linear-gradient(90deg, #f43f5e, #e11d48)',
                          borderRadius: '9999px',
                          transition: 'width 0.5s'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => onAddToCart(p, p.variants[0])}
                    className="btn-pill-primary"
                    style={{ flex: 1, padding: '10px', fontSize: '12.5px', background: '#e11d48' }}
                  >
                    <ShoppingBag size={14} /> Mua Ngay
                  </button>
                  <button
                    onClick={() => onOpenQuickView(p)}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
