import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Clock, ArrowRight, ShieldCheck, Truck, RefreshCw, Headphones,
  Star, Heart, ShoppingBag, Eye, ChevronLeft, ChevronRight, Check,
  Camera, Calendar, Crown
} from 'lucide-react';
import {
  MOCK_PRODUCTS, MOCK_COMBOS, MOCK_BLOG_POSTS, MOCK_CUSTOMER_FEED
} from '../api';
import {
  NumberTicker,
  AnimatedBadge,
  SpringButton,
  StaggerContainer,
  StaggerItem
} from './ui';

const HERO_SLIDES = [
  {
    id: 1,
    title: 'Đánh Thức Làn Da Căng Bóng',
    subtitle: 'Khám phá tinh chất trà xanh hữu cơ Jeju & 5 tầng Hyaluronic Acid đột phá.',
    ctaText: 'Khám phá ngay',
    category: 'Serum',
    bgGradient: 'linear-gradient(135deg, #141414 0%, #2a2a2a 100%)',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&auto=format&fit=crop&q=80',
    badge: 'Bộ Sưu Tập Mùa Thu 2026'
  },
  {
    id: 2,
    title: 'Giải Pháp Mụn Chuẩn Da Liễu',
    subtitle: 'Ức chế vi khuẩn C.acnes, ngừa thâm mụn tái phát thấy rõ sau 8 giờ.',
    ctaText: 'Xem sản phẩm',
    category: 'Làm sạch',
    bgGradient: 'linear-gradient(135deg, #092c48 0%, #174d75 100%)',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&auto=format&fit=crop&q=80',
    badge: 'Số 1 Được Bác Sĩ Khuyên Dùng'
  },
  {
    id: 3,
    title: 'Son Kem Lì Mịn Như Bơ Tan',
    subtitle: 'Bảng màu cam đất & hồng khô trendy, che phủ hoàn hảo rãnh môi suốt 8H.',
    ctaText: 'Thử màu son',
    category: 'Trang điểm',
    bgGradient: 'linear-gradient(135deg, #4a121a 0%, #7d2634 100%)',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=1200&auto=format&fit=crop&q=80',
    badge: 'Hot Trend Châu Á'
  }
];

const FEATURED_CATS = [
  { name: 'Serum & Tinh chất', icon: '💧', count: '124 sp', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&auto=format&fit=crop&q=80' },
  { name: 'Sữa rửa mặt', icon: '🫧', count: '96 sp', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&auto=format&fit=crop&q=80' },
  { name: 'Chống nắng', icon: '☀️', count: '82 sp', img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=200&auto=format&fit=crop&q=80' },
  { name: 'Son môi lì', icon: '💄', count: '145 sp', img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=200&auto=format&fit=crop&q=80' },
  { name: 'Kem dưỡng ẩm', icon: '🧴', count: '110 sp', img: 'https://images.unsplash.com/photo-1608248597359-33568c07d30f?w=200&auto=format&fit=crop&q=80' },
  { name: 'Trị mụn & Thâm', icon: '🌿', count: '78 sp', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80' },
  { name: 'Nước hoa Pháp', icon: '🌸', count: '65 sp', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&auto=format&fit=crop&q=80' },
  { name: 'TPCN Collagen', icon: '💊', count: '48 sp', img: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&auto=format&fit=crop&q=80' }
];

export default function HomeView({
  onSelectProduct,
  onAddToCart,
  onOpenQuickView,
  onToggleWishlist,
  wishlistIds = [],
  onAddToCompare,
  onNavigateCatalog,
  onNavigateCategory,
  onNavigateCombos,
  onOpenQuiz,
  skinType = 'COMBINATION',
  onOpenTryOn,
  onOpenSkinScanner,
  onOpenBeautyPass,
  onNavigateRoutine
}) {
  // Hero Slider
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSlidePaused, setIsSlidePaused] = useState(false);

  // Flash Sale Countdown
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 14, seconds: 35 });

  // Tab Selection
  const [activeTab, setActiveTab] = useState('bestseller'); // 'new' | 'bestseller' | 'foryou'

  // Photo Review Modal
  const [activeFeedItem, setActiveFeedItem] = useState(null);

  // Slide autoplay
  useEffect(() => {
    if (isSlidePaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isSlidePaused]);

  // Flash sale clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashSaleItems = MOCK_PRODUCTS.filter((p) => p.isFlashSale);

  const tabbedProducts = (() => {
    if (activeTab === 'new') {
      return [...MOCK_PRODUCTS].reverse();
    }
    if (activeTab === 'foryou') {
      return MOCK_PRODUCTS.filter((p) => p.targetSkinTypes.includes(skinType));
    }
    return MOCK_PRODUCTS;
  })();

  return (
    <div style={{ marginTop: '16px' }}>
      {/* VÙNG A: HERO SLIDER (Staggered Reveal & Ken Burns Scale) */}
      <motion.section
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setIsSlidePaused(true)}
        onMouseLeave={() => setIsSlidePaused(false)}
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ position: 'relative', minHeight: '460px', display: 'flex', alignItems: 'center' }}>
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = currentSlide === idx;
            return (
              <div
                key={slide.id}
                style={{
                  position: isActive ? 'relative' : 'absolute',
                  inset: 0,
                  opacity: isActive ? 1 : 0,
                  pointerEvents: isActive ? 'auto' : 'none',
                  transition: 'opacity 500ms ease',
                  background: slide.bgGradient,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '44px 56px',
                  width: '100%'
                }}
              >
                <div style={{ flex: 1, zIndex: 2, maxWidth: '580px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <span
                      className="badge-pill badge-neutral"
                      style={{
                        background: 'rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        border: 'none'
                      }}
                    >
                      ✨ {slide.badge}
                    </span>
                  </div>

                  <h2
                    style={{
                      fontSize: '42px',
                      fontWeight: 750,
                      lineHeight: 1.15,
                      letterSpacing: '-0.02em',
                      marginBottom: '14px'
                    }}
                  >
                    {slide.title}
                  </h2>
                  <p
                    style={{
                      fontSize: '15px',
                      color: 'rgba(255,255,255,0.85)',
                      lineHeight: 1.5,
                      marginBottom: '22px',
                      fontWeight: 300
                    }}
                  >
                    {slide.subtitle}
                  </p>

                  {/* CTA */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '22px' }}>
                    <SpringButton
                      variant="rose"
                      size="md"
                      onClick={() => {
                        if (slide.ctaText === 'Thử màu son' && onOpenTryOn) {
                          onOpenTryOn();
                        } else {
                          onNavigateCatalog();
                        }
                      }}
                      className="shadow-md font-bold"
                    >
                      <span>{slide.ctaText}</span>
                      <ArrowRight size={15} />
                    </SpringButton>
                  </div>

                  {/* Trust Metrics Counter */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.15)', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: '#FFABB9' }}>
                        <NumberTicker value={154} suffix="+" />
                      </span>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>Sản phẩm chính hãng</span>
                    </div>
                    <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.15)' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: '#38bdf8' }}>
                        <NumberTicker value={100} suffix="%" />
                      </span>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>Kiểm định CBMP Bộ Y Tế</span>
                    </div>
                    <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.15)' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: '#34d399' }}>
                        <NumberTicker value={200} suffix="%" />
                      </span>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>Cam kết hoàn tiền</span>
                    </div>
                  </div>
                </div>

                {/* Hero Product Image */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative'
                  }}
                  className="hero-image-wrap"
                >
                  <motion.img
                    src={slide.image}
                    alt={slide.title}
                    key={slide.id}
                    initial={{ scale: 1.05, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{
                      width: '360px',
                      height: '360px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                      border: '4px solid rgba(255,255,255,0.1)'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
          style={{
            position: 'absolute',
            top: '50%',
            left: '20px',
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(4px)',
            color: '#ffffff',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
          style={{
            position: 'absolute',
            top: '50%',
            right: '20px',
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(4px)',
            color: '#ffffff',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          <ChevronRight size={22} />
        </button>

        {/* Dots */}
        <div style={{ position: 'absolute', bottom: '18px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
          {HERO_SLIDES.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentSlide(i)}
              style={{
                width: currentSlide === i ? '24px' : '8px',
                height: '8px',
                borderRadius: '9999px',
                background: currentSlide === i ? '#ffffff' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                transition: 'all 200ms ease'
              }}
            />
          ))}
        </div>
      </motion.section>

      {/* VÙNG B: DẢI CAM KẾT (USP BAR) */}
      <section style={{ marginBottom: '40px' }}>
        <StaggerContainer
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}
        >
          {[
            { icon: <ShieldCheck size={22} style={{ color: '#0066ff' }} />, title: 'Hàng Chính Hãng 100%', desc: 'Hoàn tiền 200% nếu phát hiện hàng giả' },
            { icon: <Truck size={22} style={{ color: '#10b981' }} />, title: 'Giao Nhanh 2 Giờ', desc: 'Nội thành Hà Nội & TP. Hồ Chí Minh' },
            { icon: <RefreshCw size={22} style={{ color: '#d97706' }} />, title: 'Đổi Trả Trong 7 Ngày', desc: 'Thủ tục nhanh chóng, miễn phí đổi lỗi' },
            { icon: <Headphones size={22} style={{ color: '#f43f5e' }} />, title: 'Dược Sĩ Tư Vấn 8h–22h', desc: 'Hỗ trợ soi da & phân tích hoạt chất INCI' }
          ].map((usp, idx) => (
            <StaggerItem key={idx}>
              <div
                className="squircle-card"
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: 'var(--canvas-soft)',
                  border: '1px solid var(--hairline-soft)'
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)',
                    flexShrink: 0
                  }}
                >
                  {usp.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 650, marginBottom: '2px' }}>{usp.title}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{usp.desc}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* VÙNG B2: KHÔNG GIAN CÔNG NGHỆ LÀM ĐẸP BEAUTY-TECH QUỐC TẾ */}
      <section style={{ marginBottom: '40px' }}>
        <div
          style={{
            borderRadius: '24px',
            padding: '24px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
            color: '#ffffff',
            boxShadow: '0 16px 36px -10px rgba(15,23,42,0.3)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(236,72,153,0.2)', color: '#f472b6', padding: '3px 12px', borderRadius: '14px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
                <Sparkles size={13} /> Aura Beauty-Tech™ Innovation Suite
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 850, margin: 0, color: '#ffffff' }}>
                Trải Nghiệm Làm Đẹp Đột Phá Chuẩn Quốc Tế
              </h3>
            </div>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Ứng dụng Trí tuệ Nhân tạo & Thực tế ảo AR 3D
            </span>
          </div>

          <StaggerContainer
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}
          >
            {/* Card 1: AR Virtual Try-On */}
            <StaggerItem>
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (onOpenTryOn) onOpenTryOn();
                }}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && onOpenTryOn) onOpenTryOn();
                }}
                style={{
                  height: '100%',
                  padding: '18px',
                  borderRadius: '18px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(236,72,153,0.18)';
                  e.currentTarget.style.borderColor = '#f472b6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={20} style={{ color: '#ffffff' }} />
                </div>
                <h4 style={{ fontSize: '14.5px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                  AR Virtual Try-On
                </h4>
                <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
                  Thử màu son Romand và cushion căng bóng 3D trực tiếp qua Webcam không cần đến showroom.
                </p>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenTryOn) onOpenTryOn();
                  }}
                  style={{ fontSize: '11.5px', fontWeight: 750, color: '#f472b6', marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                >
                  Thử màu son ngay →
                </span>
              </div>
            </StaggerItem>

            {/* Card 2: AI Skin Scanner */}
            <StaggerItem>
              <div
                onClick={() => onOpenSkinScanner && onOpenSkinScanner()}
                style={{
                  height: '100%',
                  padding: '18px',
                  borderRadius: '18px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(16,185,129,0.15)';
                  e.currentTarget.style.borderColor = '#34d399';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Camera size={20} style={{ color: '#ffffff' }} />
                </div>
                <h4 style={{ fontSize: '14.5px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                  AI Skin Scanner
                </h4>
                <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
                  Chụp ảnh phân tích 5 chỉ số biểu bì da liễu: bã nhờn, mụn ẩn, thâm sạm và màng lipid.
                </p>
                <span style={{ fontSize: '11.5px', fontWeight: 750, color: '#34d399', marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Quét & chấm điểm da →
                </span>
              </div>
            </StaggerItem>

            {/* Card 3: 28-Day Skincare Routine & Conflict Detector */}
            <StaggerItem>
              <div
                onClick={() => onNavigateRoutine && onNavigateRoutine()}
                style={{
                  height: '100%',
                  padding: '18px',
                  borderRadius: '18px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59,130,246,0.15)';
                  e.currentTarget.style.borderColor = '#60a5fa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={20} style={{ color: '#ffffff' }} />
                </div>
                <h4 style={{ fontSize: '14.5px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                  Routine 28 Ngày & Cảnh Báo Xung Đột
                </h4>
                <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
                  Lập lịch bôi thoa Sáng/Tối chuẩn y khoa, phát hiện xung đột cấm kỵ giữa BHA & Retinol.
                </p>
                <span style={{ fontSize: '11.5px', fontWeight: 750, color: '#60a5fa', marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Xem chu trình bôi thoa →
                </span>
              </div>
            </StaggerItem>

            {/* Card 4: Beauty Pass Loyalty Tier */}
            <StaggerItem>
              <div
                onClick={() => onOpenBeautyPass && onOpenBeautyPass()}
                style={{
                  height: '100%',
                  padding: '18px',
                  borderRadius: '18px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(245,158,11,0.15)';
                  e.currentTarget.style.borderColor = '#fde047';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Crown size={20} style={{ color: '#ffffff' }} />
                </div>
                <h4 style={{ fontSize: '14.5px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                  Aura Beauty Pass™
                </h4>
                <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
                  Hệ thống 4 hạng hội viên chuẩn Sephora, tích lũy điểm đổi voucher và quà sinh nhật độc quyền.
                </p>
                <span style={{ fontSize: '11.5px', fontWeight: 750, color: '#fde047', marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Khám phá đặc quyền VIP →
                </span>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>
      <section style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Danh Mục Nổi Bật</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Khám phá các dòng mỹ phẩm chăm sóc toàn diện</p>
          </div>
          <button onClick={() => onNavigateCatalog()} className="btn-pill-soft">
            Tất cả danh mục →
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '16px'
          }}
          className="featured-cats-grid"
        >
          {FEATURED_CATS.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => onNavigateCategory(cat.name)}
              className="squircle-card"
              style={{
                padding: '18px 12px',
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                background: 'var(--canvas)'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: 'var(--canvas-soft)',
                  border: '1px solid var(--hairline-soft)'
                }}
              >
                <img src={cat.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 650, lineHeight: 1.3 }}>{cat.name}</h4>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{cat.count}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VÙNG D: FLASH SALE GIỜ VÀNG */}
      <section
        style={{
          background: 'var(--canvas-soft)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          marginBottom: '48px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>⚡</span>
              <h3 style={{ fontSize: '22px', fontWeight: 750, letterSpacing: '-0.01em' }}>
                FLASH SALE GIỜ VÀNG
              </h3>
            </div>
            <span className="badge-pill badge-neutral" style={{ background: '#ffffff', color: 'var(--ink)' }}>
              Khung giờ: 12:00 – 14:00
            </span>

            {/* Live Countdown Clock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} style={{ color: '#f43f5e' }} />
              <div style={{ display: 'flex', gap: '4px', fontSize: '13px', fontWeight: 700 }}>
                <span style={{ background: 'var(--ink)', color: '#ffffff', padding: '3px 8px', borderRadius: '6px' }}>
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span>:</span>
                <span style={{ background: 'var(--ink)', color: '#ffffff', padding: '3px 8px', borderRadius: '6px' }}>
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span>:</span>
                <span style={{ background: 'var(--ink)', color: '#ffffff', padding: '3px 8px', borderRadius: '6px' }}>
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          <button onClick={() => onNavigateCatalog()} className="btn-pill-soft" style={{ background: '#ffffff' }}>
            Xem tất cả ưu đãi →
          </button>
        </div>

        {/* Flash Sale Cards Grid */}
        <StaggerContainer
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px'
          }}
        >
          {flashSaleItems.map((prod) => {
            const soldPercent = Math.min(100, Math.round((prod.flashSaleSold / prod.flashSaleTotal) * 100));
            const isSoldOut = soldPercent >= 100;

            return (
              <StaggerItem key={prod.id}>
                <div
                  className="squircle-card"
                  style={{
                    background: '#ffffff',
                    opacity: isSoldOut ? 0.6 : 1
                  }}
                >
                <div className="product-card-img-wrap" onClick={() => onSelectProduct(prod)} style={{ cursor: 'pointer' }}>
                  <img src={prod.images[0]} alt={prod.name} />
                  <span className="badge-pill badge-sale" style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    -{Math.round(((prod.flashSaleOriginal - prod.flashSalePrice) / prod.flashSaleOriginal) * 100)}%
                  </span>
                  {isSoldOut && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 700 }}>
                      ĐÃ HẾT SUẤT
                    </div>
                  )}
                </div>

                <div style={{ padding: '16px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
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

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 750, color: '#f43f5e' }}>
                      {prod.flashSalePrice.toLocaleString('vi-VN')} đ
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      {prod.flashSaleOriginal.toLocaleString('vi-VN')} đ
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <span>Đã bán {prod.flashSaleSold}/{prod.flashSaleTotal}</span>
                      <span>{soldPercent}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: `${soldPercent}%`, height: '100%', background: '#f43f5e' }} />
                    </div>
                  </div>

                  <button
                    onClick={() => onAddToCart(prod, prod.variants[0])}
                    disabled={isSoldOut}
                    className="btn-pill-primary"
                    style={{ width: '100%', padding: '8px', fontSize: '12px' }}
                  >
                    {isSoldOut ? 'Hết hàng' : 'Mua ngay'}
                  </button>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </section>

      {/* VÙNG E: SẢN PHẨM THEO TAB */}
      <section style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '22px' }}>
          <div>
            <h3 style={{ fontSize: '22px', fontWeight: 750 }}>Bộ Sưu Tập Tuyển Chọn</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Cập nhật các sản phẩm hot nhất theo xu hướng làm đẹp</p>
          </div>

          {/* Spring Segmented Tab Control */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              background: '#f1f5f9',
              padding: '4px',
              borderRadius: '9999px',
              border: '1px solid #e2e8f0'
            }}
          >
            {[
              { id: 'bestseller', label: 'Bán Chạy Nhất' },
              { id: 'new', label: 'Mới Về' },
              { id: 'foryou', label: '✨ Dành Cho Da Bạn' }
            ].map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    position: 'relative',
                    padding: '8px 20px',
                    fontSize: '13px',
                    fontWeight: 700,
                    borderRadius: '9999px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    userSelect: 'none',
                    outline: 'none',
                    color: isActive ? '#ffffff' : '#475569',
                    zIndex: 2,
                    transition: 'color 150ms ease'
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="home-curated-tab-indicator"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: '#0f172a',
                        borderRadius: '9999px',
                        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.25)',
                        zIndex: -1
                      }}
                    />
                  )}
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4x2 Product Cards Grid with Spring AnimatePresence & 3D Lift */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '20px',
              marginBottom: '24px'
            }}
          >
            {tabbedProducts.slice(0, 16).map((prod) => {
              const isWish = wishlistIds.includes(prod.id);
              return (
                <motion.div
                  key={prod.id}
                  className="squircle-card"
                  whileHover={{ y: -5, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 25 }}
                  style={{
                    position: 'relative',
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
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

                  {/* Hover Quick Actions */}
                  <div className="product-card-hover-actions">
                    <button
                      onClick={() => onOpenQuickView(prod)}
                      className="btn-pill-soft"
                      style={{ flex: 1, padding: '8px', fontSize: '11px', background: 'rgba(255,255,255,0.95)' }}
                    >
                      <Eye size={13} /> Xem nhanh
                    </button>
                    <button
                      onClick={() => onAddToCart(prod, prod.variants[0])}
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
                      Đã bán {prod.soldCount > 1000 ? `${(prod.soldCount / 1000).toFixed(1)}k` : prod.soldCount}
                    </span>
                  </div>

                  {/* Price */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 750, color: 'var(--ink)' }}>
                      {prod.variants[0].price.toLocaleString('vi-VN')} đ
                    </span>
                    {prod.variants[0].originalPrice && (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        {prod.variants[0].originalPrice.toLocaleString('vi-VN')} đ
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
          </motion.div>
        </AnimatePresence>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => onNavigateCatalog()}
            className="btn-pill-outline"
            style={{ padding: '12px 32px', fontSize: '14px' }}
          >
            Xem tất cả {tabbedProducts.length} sản phẩm chính hãng →
          </button>
        </div>
      </section>

      {/* VÙNG F: MARQUEE THƯƠNG HIỆU */}
      <section style={{ marginBottom: '48px', padding: '24px 0', borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)' }}>
        <p style={{ textAlign: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px' }}>
          Đối Tác Phân Phối Mỹ Phẩm Chính Hãng Được Uỷ Quyền
        </p>
        <div className="marquee-container">
          <div className="marquee-inner">
            {[
              'INNISFREE', 'LA ROCHE-POSAY', 'COSRX', 'CERAVE', "KIEHL'S",
              'LANEIGE', 'THE ORDINARY', 'ANESSA', 'ROMAND', 'MAC COSMETICS',
              'SK-II', 'SHISEIDO'
            ].map((brand, idx) => (
              <div
                key={idx}
                onClick={() => onNavigateCatalog()}
                style={{
                  fontSize: '18px',
                  fontWeight: 750,
                  letterSpacing: '0.05em',
                  color: 'var(--ink)',
                  opacity: 0.65,
                  cursor: 'pointer',
                  transition: 'opacity 150ms'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.65)}
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VÙNG G: BANNER QUIZ TƯ VẤN DA */}
      <section
        style={{
          background: 'linear-gradient(135deg, #091e3a 0%, #173d6e 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '40px',
          marginBottom: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px'
        }}
      >
        <div style={{ maxWidth: '540px' }}>
          <span className="badge-pill badge-neutral" style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: 'none', marginBottom: '12px' }}>
            🔬 Trợ Lý Khoa Học Da Liễu
          </span>
          <h3 style={{ fontSize: '26px', fontWeight: 750, lineHeight: 1.25, marginBottom: '10px' }}>
            Tìm Routine Hợp Với Làn Da Của Bạn Trong 1 Phút
          </h3>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, marginBottom: '20px' }}>
            Làm bài trắc nghiệm nhanh 4 câu hỏi để AI phân tích tình trạng da, lọc bỏ các hoạt chất dễ gây kích ứng và đề xuất chu trình dưỡng da tối ưu nhất.
          </p>
          <button
            onClick={onOpenQuiz}
            className="btn-pill-primary"
            style={{ background: '#ffffff', color: '#141414', padding: '12px 28px', fontSize: '14px' }}
          >
            Làm bài trắc nghiệm ngay <Sparkles size={16} />
          </button>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.08)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontSize: '24px' }}>✨</span>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 700 }}>Hồ Sơ Hiện Tại Của Bạn</p>
              <p style={{ fontSize: '12px', color: '#93c5fd' }}>
                {skinType === 'OILY' ? 'Da Dầu' : skinType === 'DRY' ? 'Da Khô' : skinType === 'SENSITIVE' ? 'Da Nhạy Cảm' : 'Da Hỗn Hợp'}
              </p>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
            Đã lọc 14 thành phần có nguy cơ gây bít tắc lỗ chân lông cao.
          </p>
        </div>
      </section>

      {/* VÙNG H: BỘ SƯU TẬP / COMBO ROUTINE */}
      <section style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '22px', fontWeight: 750 }}>Combo Routine Toàn Diện</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Tiết kiệm hơn khi mua theo chu trình hoàn chỉnh</p>
          </div>
          <button onClick={onNavigateCombos} className="btn-pill-soft">
            Xem tất cả combo →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {MOCK_COMBOS.map((combo) => (
            <div
              key={combo.id}
              className="squircle-card"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div style={{ position: 'relative', height: '200px' }}>
                <img src={combo.image} alt={combo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span className="badge-pill badge-sale" style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  {combo.badge}
                </span>
              </div>

              <div style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{combo.name}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.4 }}>{combo.description}</p>

                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Gồm các sản phẩm:</p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: 'var(--ink)' }}>
                    {combo.products.map((p, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Check size={13} style={{ color: '#10b981' }} /> {p.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 750, color: 'var(--ink)' }}>
                    {combo.comboPrice.toLocaleString('vi-VN')} đ
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    {combo.originalPrice.toLocaleString('vi-VN')} đ
                  </span>
                  <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 650 }}>
                    ({combo.savingsText})
                  </span>
                </div>

                <button
                  onClick={onNavigateCombos}
                  className="btn-pill-primary"
                  style={{ width: '100%', padding: '10px', fontSize: '13px' }}
                >
                  Xem chi tiết combo & mua
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VÙNG I: BÀI VIẾT LÀM ĐẸP & CHIA SẺ CHUYÊN GIA */}
      <section style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '22px', fontWeight: 750 }}>Cẩm Nang Skincare Khoa Học</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Kiến thức chăm sóc da từ các chuyên gia da liễu</p>
          </div>
          <button onClick={() => onNavigateCatalog()} className="btn-pill-soft">
            Xem tất cả bài viết →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {MOCK_BLOG_POSTS.map((post) => (
            <div key={post.id} className="squircle-card">
              <div style={{ height: '170px', overflow: 'hidden' }}>
                <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <span className="badge-pill badge-neutral">{post.category}</span>
                  <span>{post.date} · {post.readTime}</span>
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.35, marginBottom: '8px' }}>
                  {post.title}
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.45, lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {post.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VÙNG J: ĐÁNH GIÁ THỰC TẾ & FEED ẢNH KHÁCH HÀNG */}
      <section style={{ marginBottom: '48px' }}>
        <div style={{ textAlign: 'center', maxWidth: '580px', margin: '0 auto 24px' }}>
          <h3 style={{ fontSize: '22px', fontWeight: 750, marginBottom: '6px' }}>Góc Trải Nghiệm Khách Hàng</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Hơn 50.000 khách hàng tin chọn mỹ phẩm chính hãng tại Aura Beauty Mall mỗi tháng.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {MOCK_CUSTOMER_FEED.map((rev) => (
            <div
              key={rev.id}
              onClick={() => setActiveFeedItem(rev)}
              className="squircle-card"
              style={{ padding: '20px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <img src={rev.avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 650 }}>{rev.author}</h4>
                  <span className="badge-pill badge-blue" style={{ fontSize: '10px', padding: '1px 6px' }}>{rev.skinType}</span>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', color: '#f59e0b' }}>
                  {[...Array(rev.rating)].map((_, i) => <Star key={i} size={13} fill="#f59e0b" />)}
                </div>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.45, marginBottom: '14px', fontStyle: 'italic' }}>
                "{rev.quote}"
              </p>

              <div style={{ height: '140px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <img src={rev.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEED DETAIL MODAL */}
      {activeFeedItem && (
        <div className="modal-backdrop" onClick={() => setActiveFeedItem(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', width: '92%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={activeFeedItem.avatar} alt="" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700 }}>{activeFeedItem.author}</h4>
                  <span className="badge-pill badge-blue" style={{ fontSize: '11px' }}>{activeFeedItem.skinType}</span>
                </div>
              </div>
              <button onClick={() => setActiveFeedItem(null)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            <div style={{ width: '100%', height: '320px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '16px' }}>
              <img src={activeFeedItem.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <p style={{ fontSize: '14px', lineHeight: 1.5, marginBottom: '18px' }}>
              "{activeFeedItem.quote}"
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--canvas-soft)', padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sản phẩm được sử dụng:</p>
                <p style={{ fontSize: '13px', fontWeight: 650 }}>{activeFeedItem.productName}</p>
              </div>
              <button onClick={() => { setActiveFeedItem(null); onNavigateCatalog(); }} className="btn-pill-primary" style={{ fontSize: '12px', padding: '6px 16px' }}>
                Xem sản phẩm →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
