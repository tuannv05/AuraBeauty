// frontend/src/components/FloatingSideBanners.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Camera,
  Flame,
  Tag,
  X,
  ArrowRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../api';

/**
 * FloatingSideBanners — Quảng Cáo Sản Phẩm 2 Bên Sườn (Mở Rộng Full Skyscraper)
 * - Tự động trượt theo trang khi cuộn (smooth floating sticky)
 * - Mở rộng kích thước tối đa theo không gian lề (240px - 280px) đúng yêu cầu người dùng
 * - Bố cục Card ngang sang trọng: Ảnh to 76x76, Đầy đủ Thương hiệu, Tên sản phẩm, Giá giảm & Nút CTA
 * - Chống che khuất tuyệt đối: luôn nằm ngoài container 1200px
 * - Tự động thu gọn thành Tab nam châm siêu mỏng khi màn hình nhỏ (< 1480px)
 */
export default function FloatingSideBanners({
  onOpenTryOn,
  onOpenSkinScanner,
  onNavigateCatalog,
  onSelectProduct,
  onAddToast
}) {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1680
  );
  const [isRightExpanded, setIsRightExpanded] = useState(true);
  const [isLeftExpanded, setIsLeftExpanded] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setWindowWidth(w);
      const sideMargin = (w - 1200) / 2;
      // Nếu lề bên ngoài < 180px thì tự động thu gọn để bảo vệ 100% không che khuất sản phẩm
      if (sideMargin < 180) {
        setIsRightExpanded(false);
        setIsLeftExpanded(false);
      } else {
        setIsRightExpanded(true);
        setIsLeftExpanded(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Chỉ kích hoạt trên màn hình từ 1280px trở lên
  if (windowWidth < 1280) {
    return null;
  }

  // Helper tìm sản phẩm trong mock catalog
  const findProduct = (keyword) => {
    return (
      MOCK_PRODUCTS.find((p) => p.name.toLowerCase().includes(keyword.toLowerCase())) ||
      MOCK_PRODUCTS[0]
    );
  };

  const handleCopyVoucher = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      if (onAddToast) {
        onAddToast({
          type: 'success',
          message: `🎉 Đã sao chép mã voucher ${code}! Dán tại bước thanh toán để giảm ngay 50.000₫.`
        });
      }
    }
  };

  // Tính toán độ rộng mở rộng dựa theo không gian lề thực tế của màn hình
  const sideSpace = (windowWidth - 1200) / 2;
  const isWideScreen = sideSpace >= 180;
  // Mở rộng từ 220px đến 280px tùy kích cỡ màn hình người dùng
  const bannerWidth = Math.min(280, Math.max(220, Math.floor(sideSpace - 24)));

  return (
    <>
      {/* =========================================================================
          CỘT QUẢNG CÁO SẢN PHẨM BÊN TRÁI (LEFT SIDE PRODUCT ADS — TRƯỢT THEO WEB)
         ========================================================================= */}
      <div
        className="floating-ad-left"
        style={{
          position: 'fixed',
          top: '175px',
          right: isWideScreen ? 'calc(50% + 616px)' : 'auto',
          left: !isWideScreen ? '0' : 'auto',
          zIndex: 85,
          pointerEvents: 'auto'
        }}
      >
        <AnimatePresence mode="wait">
          {isLeftExpanded ? (
            <motion.div
              key="left-full"
              initial={{ opacity: 0, x: -24, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -24, scale: 0.96 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{
                width: `${bannerWidth}px`,
                background: '#ffffff',
                borderRadius: '18px',
                border: '1.5px solid #fbcfe8',
                boxShadow: '0 16px 36px -4px rgba(244,63,94,0.2), 0 4px 14px rgba(0,0,0,0.06)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Header Ribbon */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                  color: '#ffffff',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255,255,255,0.15)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Flame size={15} style={{ color: '#fef08a' }} />
                    <span style={{ fontSize: '12px', fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Hot Deals Mall
                    </span>
                  </div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.85)', marginTop: '1px' }}>
                    Chính Hãng 100% • CBMP Bộ Y Tế
                  </div>
                </div>
                <button
                  onClick={() => setIsLeftExpanded(false)}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.9,
                    transition: 'opacity 0.2s'
                  }}
                  title="Thu gọn quảng cáo"
                  aria-label="Thu gọn quảng cáo"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Sản phẩm 1: Son Romand (Bố cục ngang rộng rãi) */}
              <div
                onClick={() => onOpenTryOn && onOpenTryOn()}
                style={{
                  padding: '12px 14px',
                  borderBottom: '1px solid #fdf2f8',
                  cursor: 'pointer',
                  background: 'linear-gradient(180deg, #fff1f2 0%, #ffffff 100%)',
                  transition: 'background 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#ffe4e6')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'linear-gradient(180deg, #fff1f2 0%, #ffffff 100%)')
                }
              >
                <div
                  style={{
                    position: 'relative',
                    width: '74px',
                    height: '74px',
                    flexShrink: 0,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 10px rgba(244,63,94,0.22)',
                    border: '1.5px solid #ffffff'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=240&auto=format&fit=crop&q=80"
                    alt="Son Romand"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'rgba(236,72,153,0.92)',
                      color: '#ffffff',
                      fontSize: '8px',
                      fontWeight: 800,
                      textAlign: 'center',
                      padding: '2px 0'
                    }}
                  >
                    AR 60 FPS
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#be185d', background: '#fce7f3', padding: '1px 5px', borderRadius: '4px' }}>
                      -35%
                    </span>
                    <span style={{ fontSize: '9px', color: '#64748b' }}>Romand</span>
                  </div>
                  <h4 style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Son Velvet Tint
                  </h4>
                  <div style={{ fontSize: '9.5px', color: '#e11d48', fontWeight: 700, marginBottom: '3px' }}>
                    Mua 1 Tặng 1 Cọ
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 850, color: '#db2777' }}>179.000₫</span>
                    <span style={{ fontSize: '9.5px', color: '#94a3b8', textDecoration: 'line-through' }}>275k</span>
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '9.5px',
                      fontWeight: 750,
                      color: '#ffffff',
                      background: '#ec4899',
                      padding: '4px 9px',
                      borderRadius: '9999px',
                      boxShadow: '0 2px 4px rgba(236,72,153,0.3)'
                    }}
                  >
                    <Sparkles size={10} /> Thử Son AR
                  </span>
                </div>
              </div>

              {/* Sản phẩm 2: Serum Innisfree */}
              <div
                onClick={() => {
                  const p = findProduct('Innisfree');
                  if (onSelectProduct) onSelectProduct(p);
                }}
                style={{
                  padding: '12px 14px',
                  borderBottom: '1px solid #fdf2f8',
                  cursor: 'pointer',
                  background: '#ffffff',
                  transition: 'background 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '74px',
                    height: '74px',
                    flexShrink: 0,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: '#f8fafc',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                    border: '1.5px solid #f1f5f9'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=240&auto=format&fit=crop&q=80"
                    alt="Serum Innisfree"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'rgba(5,150,105,0.92)',
                      color: '#ffffff',
                      fontSize: '8px',
                      fontWeight: 800,
                      textAlign: 'center',
                      padding: '2px 0'
                    }}
                  >
                    BEST SELLER
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#059669', background: '#ecfdf5', padding: '1px 5px', borderRadius: '4px' }}>
                      Innisfree
                    </span>
                    <span style={{ fontSize: '9px', color: '#64748b' }}>Chai 80ml</span>
                  </div>
                  <h4 style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Serum Trà Xanh
                  </h4>
                  <div style={{ fontSize: '9.5px', color: '#059669', fontWeight: 700, marginBottom: '3px' }}>
                    Cấp Ẩm Phục Hồi
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 850, color: '#0f172a', marginBottom: '6px' }}>
                    620.000₫
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '9.5px',
                      fontWeight: 750,
                      color: '#059669',
                      background: '#ecfdf5',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      border: '1px solid #a7f3d0'
                    }}
                  >
                    Xem chi tiết <ArrowRight size={9} />
                  </span>
                </div>
              </div>

              {/* Item 3: Voucher Sàn 50K */}
              <div
                onClick={() => handleCopyVoucher('AURA50K')}
                style={{
                  padding: '12px 14px',
                  cursor: 'pointer',
                  background: 'linear-gradient(180deg, #faf5ff 0%, #ffffff 100%)',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f3e8ff')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'linear-gradient(180deg, #faf5ff 0%, #ffffff 100%)')
                }
                title="Bấm để sao chép mã"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 850, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Tag size={11} /> VOUCHER SÀN
                  </span>
                  <span style={{ fontSize: '9px', color: '#64748b' }}>Đơn từ 299K</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '14px', fontWeight: 850, color: '#9333ea', letterSpacing: '0.01em' }}>
                    GIẢM 50.000₫
                  </div>
                  <div
                    style={{
                      fontSize: '9.5px',
                      fontWeight: 800,
                      background: '#ede9fe',
                      color: '#6d28d9',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: '1px dashed #c4b5fd'
                    }}
                  >
                    MÃ: AURA50K 📋
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Minimized Left Tab */
            <motion.button
              key="left-tab"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              onClick={() => setIsLeftExpanded(true)}
              style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0 10px 10px 0',
                padding: '12px 8px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(236,72,153,0.35)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Mở quảng cáo Hot Deals"
            >
              <Flame size={16} style={{ color: '#fef08a' }} />
              <span
                style={{
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}
              >
                Hot Deals
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* =========================================================================
          CỘT QUẢNG CÁO SẢN PHẨM BÊN PHẢI (RIGHT SIDE PRODUCT ADS — TRƯỢT THEO WEB)
         ========================================================================= */}
      <div
        className="floating-ad-right"
        style={{
          position: 'fixed',
          top: '175px',
          left: isWideScreen ? 'calc(50% + 616px)' : 'auto',
          right: !isWideScreen ? '0' : 'auto',
          zIndex: 85,
          pointerEvents: 'auto'
        }}
      >
        <AnimatePresence mode="wait">
          {isRightExpanded ? (
            <motion.div
              key="right-full"
              initial={{ opacity: 0, x: 24, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.96 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{
                width: `${bannerWidth}px`,
                background: '#ffffff',
                borderRadius: '18px',
                border: '1.5px solid #fed7aa',
                boxShadow: '0 16px 36px -4px rgba(234,88,12,0.2), 0 4px 14px rgba(0,0,0,0.06)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Header Ribbon */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  color: '#ffffff',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255,255,255,0.15)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Zap size={15} style={{ color: '#fef08a' }} />
                    <span style={{ fontSize: '12px', fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Flash Sale Giờ Vàng
                    </span>
                  </div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.85)', marginTop: '1px' }}>
                    Ưu Đãi Độc Quyền Giảm Đến 50%
                  </div>
                </div>
                <button
                  onClick={() => setIsRightExpanded(false)}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.9,
                    transition: 'opacity 0.2s'
                  }}
                  title="Thu gọn quảng cáo"
                  aria-label="Thu gọn quảng cáo"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Sản phẩm 1: Serum La Roche-Posay B5 (-50%) */}
              <div
                onClick={() => {
                  const p = findProduct('Roche');
                  if (onSelectProduct) onSelectProduct(p);
                }}
                style={{
                  padding: '12px 14px',
                  borderBottom: '1px solid #fff7ed',
                  cursor: 'pointer',
                  background: 'linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)',
                  transition: 'background 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#ffedd5')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)')
                }
              >
                <div
                  style={{
                    position: 'relative',
                    width: '74px',
                    height: '74px',
                    flexShrink: 0,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 10px rgba(234,88,12,0.22)',
                    border: '1.5px solid #ffffff'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=240&auto=format&fit=crop&q=80"
                    alt="Serum B5"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'rgba(234,88,12,0.92)',
                      color: '#ffffff',
                      fontSize: '8px',
                      fontWeight: 800,
                      textAlign: 'center',
                      padding: '2px 0'
                    }}
                  >
                    GIẢM 50%
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#c2410c', background: '#ffedd5', padding: '1px 5px', borderRadius: '4px' }}>
                      Flash Deal
                    </span>
                    <span style={{ fontSize: '9px', color: '#64748b' }}>La Roche-Posay</span>
                  </div>
                  <h4 style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Serum Hyalu B5
                  </h4>
                  <div style={{ fontSize: '9.5px', color: '#ea580c', fontWeight: 700, marginBottom: '3px' }}>
                    Phục Hồi Biểu Bì 24H
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 850, color: '#ea580c' }}>490.000₫</span>
                    <span style={{ fontSize: '9.5px', color: '#94a3b8', textDecoration: 'line-through' }}>980k</span>
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '9.5px',
                      fontWeight: 750,
                      color: '#ffffff',
                      background: '#f97316',
                      padding: '4px 9px',
                      borderRadius: '9999px',
                      boxShadow: '0 2px 4px rgba(249,115,22,0.3)'
                    }}
                  >
                    Săn Deal <ArrowRight size={9} />
                  </span>
                </div>
              </div>

              {/* Sản phẩm 2: Sữa Rửa Mặt CeraVe */}
              <div
                onClick={() => {
                  const p = findProduct('CeraVe') || findProduct('Rửa Mặt');
                  if (onSelectProduct) onSelectProduct(p);
                }}
                style={{
                  padding: '12px 14px',
                  borderBottom: '1px solid #fff7ed',
                  cursor: 'pointer',
                  background: '#ffffff',
                  transition: 'background 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '74px',
                    height: '74px',
                    flexShrink: 0,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: '#f8fafc',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                    border: '1.5px solid #f1f5f9'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=240&auto=format&fit=crop&q=80"
                    alt="CeraVe Cleanser"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'rgba(2,132,199,0.92)',
                      color: '#ffffff',
                      fontSize: '8px',
                      fontWeight: 800,
                      textAlign: 'center',
                      padding: '2px 0'
                    }}
                  >
                    FREESHIP 0Đ
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#0284c7', background: '#f0f9ff', padding: '1px 5px', borderRadius: '4px' }}>
                      CeraVe
                    </span>
                    <span style={{ fontSize: '9px', color: '#64748b' }}>Chai 473ml</span>
                  </div>
                  <h4 style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Sữa Rửa Mặt Dầu
                  </h4>
                  <div style={{ fontSize: '9.5px', color: '#0284c7', fontWeight: 700, marginBottom: '3px' }}>
                    Ceramides Phục Hồi
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 850, color: '#0f172a', marginBottom: '6px' }}>
                    365.000₫
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '9.5px',
                      fontWeight: 750,
                      color: '#0284c7',
                      background: '#f0f9ff',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      border: '1px solid #bae6fd'
                    }}
                  >
                    Xem chi tiết <ArrowRight size={9} />
                  </span>
                </div>
              </div>

              {/* Item 3: AI Skin Scanner */}
              <div
                onClick={() => onOpenSkinScanner && onOpenSkinScanner()}
                style={{
                  padding: '12px 14px',
                  cursor: 'pointer',
                  background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
                  transition: 'background 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#dcfce7')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)')
                }
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    flexShrink: 0,
                    borderRadius: '50%',
                    background: '#10b981',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 3px 8px rgba(16,185,129,0.3)'
                  }}
                >
                  <Camera size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a', lineHeight: 1.25 }}>
                    AI Soi Da Liễu
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#64748b', marginTop: '1px' }}>
                    Phân tích 5 chỉ số biểu bì
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#059669', fontWeight: 800, marginTop: '2px' }}>
                    Miễn phí 100% →
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Minimized Right Tab */
            <motion.button
              key="right-tab"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              onClick={() => setIsRightExpanded(true)}
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px 0 0 10px',
                padding: '12px 8px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(249,115,22,0.35)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Mở quảng cáo Flash Sale"
            >
              <Zap size={16} style={{ color: '#fef08a' }} />
              <span
                style={{
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}
              >
                Flash Sale
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
