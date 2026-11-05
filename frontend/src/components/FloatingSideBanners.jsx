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
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../api';

/**
 * FloatingSideBanners — Quảng Cáo Sản Phẩm 2 Bên Sườn (Floating Skyscraper Product Ads)
 * - Tự động trượt theo trang khi người dùng cuộn (smooth floating sticky)
 * - Chống che khuất tuyệt đối: luôn nằm ngoài biên của container (max-w 1200px)
 * - Tự động thu gọn thành Tab nam châm siêu mỏng khi màn hình không đủ khoảng đệm
 * - Quảng cáo sản phẩm chính hãng cả 2 bên (Trái: Romand, Innisfree, Voucher | Phải: La Roche-Posay, CeraVe, AI Scan)
 */
export default function FloatingSideBanners({
  onOpenTryOn,
  onOpenSkinScanner,
  onNavigateCatalog,
  onSelectProduct,
  onAddToast
}) {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1600
  );
  const [isRightExpanded, setIsRightExpanded] = useState(true);
  const [isLeftExpanded, setIsLeftExpanded] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setWindowWidth(w);
      // Tự động thu gọn nếu độ rộng màn hình < 1480px để bảo vệ 100% không che khuất sản phẩm
      if (w < 1480) {
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

  const isWideScreen = windowWidth >= 1480;

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
              initial={{ opacity: 0, x: -20, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.96 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{
                width: '136px',
                background: '#ffffff',
                borderRadius: '16px',
                border: '1.5px solid #fbcfe8',
                boxShadow: '0 12px 30px -4px rgba(244,63,94,0.18), 0 4px 12px rgba(0,0,0,0.06)',
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
                  padding: '7px 9px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Flame size={13} style={{ color: '#fef08a' }} />
                  <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Hot Deals
                  </span>
                </div>
                <button
                  onClick={() => setIsLeftExpanded(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    opacity: 0.85
                  }}
                  title="Thu gọn"
                  aria-label="Thu gọn"
                >
                  <X size={13} />
                </button>
              </div>

              {/* Sản phẩm 1: Son Romand (AR Try-On) */}
              <div
                onClick={() => onOpenTryOn && onOpenTryOn()}
                style={{
                  padding: '9px 8px',
                  borderBottom: '1px solid #fdf2f8',
                  cursor: 'pointer',
                  textAlign: 'center',
                  background: 'linear-gradient(180deg, #fff1f2 0%, #ffffff 100%)',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#ffe4e6')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'linear-gradient(180deg, #fff1f2 0%, #ffffff 100%)')
                }
              >
                <div
                  style={{
                    position: 'relative',
                    width: '52px',
                    height: '52px',
                    margin: '0 auto 5px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 3px 8px rgba(244,63,94,0.2)'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=160&auto=format&fit=crop&q=80"
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
                      fontSize: '7.5px',
                      fontWeight: 800,
                      padding: '1px 0'
                    }}
                  >
                    AR 60 FPS
                  </span>
                </div>
                <div style={{ fontSize: '10.5px', fontWeight: 750, color: '#0f172a', lineHeight: 1.25 }}>
                  Son Romand Tint
                </div>
                <div style={{ fontSize: '9px', color: '#db2777', fontWeight: 800, margin: '2px 0 3px' }}>
                  179.000₫ <span style={{ fontSize: '8px', color: '#94a3b8', textDecoration: 'line-through' }}>275k</span>
                </div>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                    fontSize: '8.5px',
                    fontWeight: 750,
                    color: '#ffffff',
                    background: '#ec4899',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    boxShadow: '0 2px 4px rgba(236,72,153,0.3)'
                  }}
                >
                  <Sparkles size={8} /> Thử Son
                </span>
              </div>

              {/* Sản phẩm 2: Serum Innisfree */}
              <div
                onClick={() => {
                  const p = findProduct('Innisfree');
                  if (onSelectProduct) onSelectProduct(p);
                }}
                style={{
                  padding: '9px 8px',
                  borderBottom: '1px solid #fdf2f8',
                  cursor: 'pointer',
                  textAlign: 'center',
                  background: '#ffffff',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    margin: '0 auto 4px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#f8fafc'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=160&auto=format&fit=crop&q=80"
                    alt="Serum Innisfree"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ fontSize: '10.5px', fontWeight: 750, color: '#0f172a', lineHeight: 1.2 }}>
                  Serum Trà Xanh
                </div>
                <div style={{ fontSize: '8.5px', color: '#059669', fontWeight: 700, margin: '2px 0' }}>
                  Best Seller • Innisfree
                </div>
                <div style={{ fontSize: '10px', color: '#0f172a', fontWeight: 800 }}>
                  620.000₫
                </div>
              </div>

              {/* Item 3: Voucher 50K */}
              <div
                onClick={() => handleCopyVoucher('AURA50K')}
                style={{
                  padding: '8px 8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  background: 'linear-gradient(180deg, #faf5ff 0%, #ffffff 100%)',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f3e8ff')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'linear-gradient(180deg, #faf5ff 0%, #ffffff 100%)')
                }
                title="Bấm để sao chép mã"
              >
                <div style={{ fontSize: '8.5px', fontWeight: 800, color: '#7c3aed', marginBottom: '2px' }}>
                  <Tag size={9} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '2px' }} />
                  VOUCHER SÀN
                </div>
                <div style={{ fontSize: '11px', fontWeight: 850, color: '#9333ea' }}>
                  GIẢM 50.000₫
                </div>
                <div
                  style={{
                    fontSize: '8px',
                    fontWeight: 800,
                    background: '#ede9fe',
                    color: '#6d28d9',
                    padding: '2px 5px',
                    borderRadius: '4px',
                    border: '1px dashed #c4b5fd',
                    display: 'inline-block',
                    marginTop: '3px'
                  }}
                >
                  MÃ: AURA50K 📋
                </div>
              </div>
            </motion.div>
          ) : (
            /* Minimized Left Badge */
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
                borderRadius: '0 8px 8px 0',
                padding: '10px 7px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(236,72,153,0.35)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Mở quảng cáo hot deals"
            >
              <Flame size={15} style={{ color: '#fef08a' }} />
              <span
                style={{
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  fontSize: '9.5px',
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
              initial={{ opacity: 0, x: 20, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.96 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{
                width: '136px',
                background: '#ffffff',
                borderRadius: '16px',
                border: '1.5px solid #fed7aa',
                boxShadow: '0 12px 30px -4px rgba(234,88,12,0.18), 0 4px 12px rgba(0,0,0,0.06)',
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
                  padding: '7px 9px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Zap size={13} style={{ color: '#fef08a' }} />
                  <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Flash Sale
                  </span>
                </div>
                <button
                  onClick={() => setIsRightExpanded(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    opacity: 0.85
                  }}
                  title="Thu gọn"
                  aria-label="Thu gọn"
                >
                  <X size={13} />
                </button>
              </div>

              {/* Sản phẩm 1: Serum La Roche-Posay B5 (-50%) */}
              <div
                onClick={() => {
                  const p = findProduct('Roche');
                  if (onSelectProduct) onSelectProduct(p);
                }}
                style={{
                  padding: '9px 8px',
                  borderBottom: '1px solid #fff7ed',
                  cursor: 'pointer',
                  textAlign: 'center',
                  background: 'linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#ffedd5')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)')
                }
              >
                <div
                  style={{
                    position: 'relative',
                    width: '52px',
                    height: '52px',
                    margin: '0 auto 5px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 3px 8px rgba(234,88,12,0.2)'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=160&auto=format&fit=crop&q=80"
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
                      fontSize: '7.5px',
                      fontWeight: 800,
                      padding: '1px 0'
                    }}
                  >
                    GIẢM 50%
                  </span>
                </div>
                <div style={{ fontSize: '10.5px', fontWeight: 750, color: '#0f172a', lineHeight: 1.25 }}>
                  Serum Hyalu B5
                </div>
                <div style={{ fontSize: '9px', color: '#ea580c', fontWeight: 800, margin: '2px 0 3px' }}>
                  490.000₫ <span style={{ fontSize: '8px', color: '#94a3b8', textDecoration: 'line-through' }}>980k</span>
                </div>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                    fontSize: '8.5px',
                    fontWeight: 750,
                    color: '#ffffff',
                    background: '#f97316',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    boxShadow: '0 2px 4px rgba(249,115,22,0.3)'
                  }}
                >
                  Săn Deal <ArrowRight size={8} />
                </span>
              </div>

              {/* Sản phẩm 2: Sữa Rửa Mặt CeraVe */}
              <div
                onClick={() => {
                  const p = findProduct('CeraVe') || findProduct('Rửa Mặt');
                  if (onSelectProduct) onSelectProduct(p);
                }}
                style={{
                  padding: '9px 8px',
                  borderBottom: '1px solid #fff7ed',
                  cursor: 'pointer',
                  textAlign: 'center',
                  background: '#ffffff',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    margin: '0 auto 4px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#f8fafc'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=160&auto=format&fit=crop&q=80"
                    alt="CeraVe Cleanser"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ fontSize: '10.5px', fontWeight: 750, color: '#0f172a', lineHeight: 1.2 }}>
                  Sữa Rửa Mặt CeraVe
                </div>
                <div style={{ fontSize: '8.5px', color: '#0284c7', fontWeight: 700, margin: '2px 0' }}>
                  Freeship 0đ • 473ml
                </div>
                <div style={{ fontSize: '10px', color: '#0f172a', fontWeight: 800 }}>
                  365.000₫
                </div>
              </div>

              {/* Item 3: AI Skin Scanner */}
              <div
                onClick={() => onOpenSkinScanner && onOpenSkinScanner()}
                style={{
                  padding: '8px 8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#dcfce7')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)')
                }
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: '#10b981',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 3px'
                  }}
                >
                  <Camera size={13} />
                </div>
                <div style={{ fontSize: '10px', fontWeight: 750, color: '#0f172a', lineHeight: 1.2 }}>
                  AI Soi Da 5 Chỉ Số
                </div>
                <div style={{ fontSize: '8.5px', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                  Miễn phí 100% →
                </div>
              </div>
            </motion.div>
          ) : (
            /* Minimized Right Badge */
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
                borderRadius: '8px 0 0 8px',
                padding: '10px 7px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(249,115,22,0.35)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Mở quảng cáo Flash Sale"
            >
              <Zap size={15} style={{ color: '#fef08a' }} />
              <span
                style={{
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  fontSize: '9.5px',
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
