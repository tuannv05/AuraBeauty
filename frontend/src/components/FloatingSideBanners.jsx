// frontend/src/components/FloatingSideBanners.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Camera,
  ShieldCheck,
  Truck,
  Headphones,
  Tag,
  X,
  ChevronRight,
  Flame
} from 'lucide-react';

/**
 * FloatingSideBanners — Quảng cáo 2 bên sườn trang web (Floating Skyscraper Ads)
 * Chuẩn phong cách sàn TMĐT cao cấp (Shopee Mall / Hasaki / Thegioididong)
 * Tự động căn chỉnh bám sát 2 bên mép lề của Main Container trên màn hình lớn (>= 1400px)
 */
export default function FloatingSideBanners({
  onOpenTryOn,
  onOpenSkinScanner,
  onNavigateCatalog,
  onSelectProduct,
  onAddToast
}) {
  const [isRightVisible, setIsRightVisible] = useState(true);
  const [isLeftVisible, setIsLeftVisible] = useState(true);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1600
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Chỉ hiển thị trên màn hình rộng >= 1380px để không đè vào nội dung chính
  if (windowWidth < 1380) {
    return null;
  }

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

  return (
    <>
      {/* =========================================================================
          CỘT QUẢNG CÁO PHẢI (RIGHT SIDEBAR ADVERT — VÙNG KHOANH TRÒN CỦA NGƯỜI DÙNG)
         ========================================================================= */}
      <div
        className="floating-ad-right"
        style={{
          position: 'fixed',
          top: '210px',
          left: 'calc(50% + 655px)',
          width: '144px',
          zIndex: 80,
          pointerEvents: 'auto'
        }}
      >
        <AnimatePresence mode="wait">
          {isRightVisible ? (
            <motion.div
              key="right-expanded"
              initial={{ opacity: 0, x: 24, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1.5px solid #fbcfe8',
                boxShadow: '0 12px 32px -4px rgba(236,72,153,0.18), 0 4px 12px rgba(0,0,0,0.06)',
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
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Flame size={14} style={{ color: '#fef08a' }} />
                  <span style={{ fontSize: '10.5px', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Aura Hot Deal
                  </span>
                </div>
                <button
                  onClick={() => setIsRightVisible(false)}
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
                  title="Thu gọn quảng cáo"
                  aria-label="Thu gọn quảng cáo"
                >
                  <X size={13} />
                </button>
              </div>

              {/* Promo Item 1: AR Try-On Son Romand */}
              <div
                onClick={() => onOpenTryOn && onOpenTryOn()}
                style={{
                  padding: '10px 8px',
                  borderBottom: '1px solid #fdf2f8',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'background 0.2s ease',
                  background: 'linear-gradient(180deg, #fff1f2 0%, #ffffff 100%)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#ffe4e6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(180deg, #fff1f2 0%, #ffffff 100%)'}
              >
                <div style={{ position: 'relative', width: '56px', height: '56px', margin: '0 auto 6px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 3px 8px rgba(244,63,94,0.2)' }}>
                  <img
                    src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=160&auto=format&fit=crop&q=80"
                    alt="Son Romand"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'rgba(236,72,153,0.9)', color: '#ffffff', fontSize: '8px', fontWeight: 800, padding: '1px 0' }}>
                    AR 60 FPS
                  </span>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 750, color: '#0f172a', lineHeight: 1.25, marginBottom: '2px' }}>
                  Son Romand Tint
                </div>
                <div style={{ fontSize: '9.5px', color: '#ec4899', fontWeight: 800, marginBottom: '4px' }}>
                  Mua 1 Tặng 1
                </div>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                    fontSize: '9px',
                    fontWeight: 700,
                    color: '#ffffff',
                    background: '#ec4899',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    boxShadow: '0 2px 4px rgba(236,72,153,0.3)'
                  }}
                >
                  <Sparkles size={9} /> Thử Son
                </span>
              </div>

              {/* Promo Item 2: Voucher 50k */}
              <div
                onClick={() => handleCopyVoucher('AURA50K')}
                style={{
                  padding: '9px 8px',
                  borderBottom: '1px solid #fdf2f8',
                  cursor: 'pointer',
                  textAlign: 'center',
                  background: '#fafafa',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f3ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fafafa'}
                title="Bấm để sao chép mã"
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#7c3aed', fontSize: '9.5px', fontWeight: 800, marginBottom: '2px' }}>
                  <Tag size={10} /> VOUCHER SÀN
                </div>
                <div style={{ fontSize: '12px', fontWeight: 850, color: '#db2777', letterSpacing: '0.02em' }}>
                  GIẢM 50.000₫
                </div>
                <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '4px' }}>
                  Đơn từ 299K
                </div>
                <div
                  style={{
                    fontSize: '8.5px',
                    fontWeight: 800,
                    background: '#ede9fe',
                    color: '#6d28d9',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px dashed #c4b5fd',
                    display: 'inline-block'
                  }}
                >
                  MÃ: AURA50K 📋
                </div>
              </div>

              {/* Promo Item 3: AI Skin Scanner */}
              <div
                onClick={() => onOpenSkinScanner && onOpenSkinScanner()}
                style={{
                  padding: '9px 8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#dcfce7'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)'}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px' }}>
                  <Camera size={14} />
                </div>
                <div style={{ fontSize: '10.5px', fontWeight: 750, color: '#0f172a', lineHeight: 1.2 }}>
                  AI Soi Da 5 Chỉ Số
                </div>
                <div style={{ fontSize: '9px', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                  Miễn phí 100% →
                </div>
              </div>
            </motion.div>
          ) : (
            /* Minimized Tab */
            <motion.button
              key="right-minimized"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={() => setIsRightVisible(true)}
              style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px 0 0 8px',
                padding: '10px 8px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(236,72,153,0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Mở bảng khuyến mãi hot"
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
                Khuyến Mãi
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* =========================================================================
          CỘT QUẢNG CÁO TRÁI (LEFT SIDEBAR TRUST BADGES — ĐỐI XỨNG CÂN BẰNG)
         ========================================================================= */}
      <div
        className="floating-ad-left"
        style={{
          position: 'fixed',
          top: '210px',
          right: 'calc(50% + 655px)',
          width: '144px',
          zIndex: 80,
          pointerEvents: 'auto'
        }}
      >
        <AnimatePresence mode="wait">
          {isLeftVisible ? (
            <motion.div
              key="left-expanded"
              initial={{ opacity: 0, x: -24, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -24, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1.5px solid #bfdbfe',
                boxShadow: '0 12px 32px -4px rgba(59,130,246,0.18), 0 4px 12px rgba(0,0,0,0.06)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Header Ribbon */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  color: '#ffffff',
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255,255,255,0.15)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ShieldCheck size={14} style={{ color: '#38bdf8' }} />
                  <span style={{ fontSize: '10.5px', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Chuẩn Y Khoa
                  </span>
                </div>
                <button
                  onClick={() => setIsLeftVisible(false)}
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

              {/* Trust 1: 100% CBMP */}
              <div
                onClick={() => onNavigateCatalog && onNavigateCatalog()}
                style={{
                  padding: '10px 8px',
                  borderBottom: '1px solid #f1f5f9',
                  cursor: 'pointer',
                  textAlign: 'center',
                  background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#eff6ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)'}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px' }}>
                  <ShieldCheck size={15} />
                </div>
                <div style={{ fontSize: '11px', fontWeight: 750, color: '#0f172a', lineHeight: 1.25 }}>
                  100% Chính Hãng
                </div>
                <div style={{ fontSize: '9px', color: '#0284c7', fontWeight: 700, marginTop: '2px' }}>
                  Bộ Y Tế CBMP
                </div>
                <div style={{ fontSize: '8.5px', color: '#64748b', marginTop: '2px' }}>
                  Đền 200% nếu giả
                </div>
              </div>

              {/* Trust 2: Freeship 2H */}
              <div
                style={{
                  padding: '9px 8px',
                  borderBottom: '1px solid #f1f5f9',
                  textAlign: 'center',
                  background: '#fafafa'
                }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#059669', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px' }}>
                  <Truck size={14} />
                </div>
                <div style={{ fontSize: '11px', fontWeight: 750, color: '#0f172a', lineHeight: 1.2 }}>
                  Giao Nhanh 2H
                </div>
                <div style={{ fontSize: '8.5px', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                  Freeship từ 0đ
                </div>
              </div>

              {/* Trust 3: Dược sĩ tư vấn */}
              <div
                onClick={() => {
                  const chatBtn = document.querySelector('[aria-label="Mở Trợ Lý AI"]');
                  if (chatBtn) chatBtn.click();
                }}
                style={{
                  padding: '9px 8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  background: 'linear-gradient(180deg, #fdf4ff 0%, #ffffff 100%)',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fae8ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(180deg, #fdf4ff 0%, #ffffff 100%)'}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#a855f7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px' }}>
                  <Headphones size={14} />
                </div>
                <div style={{ fontSize: '10.5px', fontWeight: 750, color: '#0f172a', lineHeight: 1.2 }}>
                  Dược Sĩ 24/7
                </div>
                <div style={{ fontSize: '8.5px', color: '#9333ea', fontWeight: 700, marginTop: '2px' }}>
                  Hỏi đáp INCI →
                </div>
              </div>
            </motion.div>
          ) : (
            /* Minimized Left Tab */
            <motion.button
              key="left-minimized"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={() => setIsLeftVisible(true)}
              style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0 8px 8px 0',
                padding: '10px 8px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(15,23,42,0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Mở cam kết chuẩn y khoa"
            >
              <ShieldCheck size={16} style={{ color: '#38bdf8' }} />
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
                Cam Kết
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
