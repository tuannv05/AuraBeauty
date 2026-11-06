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
  Truck,
  Star
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../api';

/**
 * FloatingSideBanners — Quảng Cáo Sản Phẩm 2 Bên Sườn (Mở Rộng & Kéo Dài Full Skyscraper)
 * - Tự động trượt theo trang khi cuộn (smooth floating sticky)
 * - Kéo dài chiều cao với 5 sản phẩm hot + 1 tiện ích đặc quyền + 1 trust footer mỗi bên
 * - Mở rộng kích thước ngang tối đa theo lề (240px - 300px)
 * - Tự động giới hạn max-height theo viewport (calc(100vh - 195px)) chống tràn màn hình
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
  const [isLeftExpanded, setIsLeftExpanded] = useState(true);
  const [isRightExpanded, setIsRightExpanded] = useState(true);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

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
  // Mở rộng từ 220px đến 300px tùy kích cỡ màn hình người dùng
  const bannerWidth = Math.min(300, Math.max(220, Math.floor(sideSpace - 20)));

  return (
    <>
      {/* =========================================================================
          CỘT QUẢNG CÁO SẢN PHẨM BÊN TRÁI (LEFT SIDE PRODUCT ADS — KÉO DÀI XUỐNG DƯỚI)
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
                maxHeight: 'calc(100vh - 195px)',
                background: '#ffffff',
                borderRadius: '18px',
                border: '1.5px solid #fbcfe8',
                boxShadow: '0 16px 36px -4px rgba(244,63,94,0.2), 0 4px 14px rgba(0,0,0,0.06)',
                overflowY: 'auto',
                overflowX: 'hidden',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Header Ribbon */}
              <div
                style={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 2,
                  background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                  color: '#ffffff',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
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
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title="Thu gọn quảng cáo"
                >
                  <X size={12} />
                </button>
              </div>

              {/* Sản phẩm 1: Son Romand Tint */}
              <div
                onClick={() => {
                  const p = findProduct('Romand') || findProduct('Son');
                  if (onSelectProduct) onSelectProduct(p);
                }}
                style={{
                  padding: '10px 12px',
                  borderBottom: '1px solid #fdf2f8',
                  cursor: 'pointer',
                  background: 'linear-gradient(180deg, #fff1f2 0%, #ffffff 100%)',
                  transition: 'background 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#ffe4e6')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'linear-gradient(180deg, #fff1f2 0%, #ffffff 100%)')
                }
              >
                <div
                  style={{
                    position: 'relative',
                    width: '68px',
                    height: '68px',
                    flexShrink: 0,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 10px rgba(244,63,94,0.18)',
                    border: '1.5px solid #ffffff'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=240&auto=format&fit=crop&q=80"
                    alt="Son Romand Tint"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'rgba(225,29,72,0.92)',
                      color: '#ffffff',
                      fontSize: '7.5px',
                      fontWeight: 800,
                      textAlign: 'center',
                      padding: '1.5px 0'
                    }}
                  >
                    AR 60 FPS
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1px' }}>
                    <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#e11d48', background: '#ffe4e6', padding: '1px 4px', borderRadius: '3px' }}>
                      -35%
                    </span>
                    <span style={{ fontSize: '8.5px', color: '#64748b' }}>Romand</span>
                  </div>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', margin: '0 0 1px', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Son Velvet Tint
                  </h4>
                  <div style={{ fontSize: '9px', color: '#db2777', fontWeight: 700, marginBottom: '2px' }}>
                    Mua 1 Tặng 1 Cọ Môi
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 850, color: '#e11d48' }}>179.000₫</span>
                    <span style={{ fontSize: '9px', color: '#94a3b8', textDecoration: 'line-through' }}>275k</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenTryOn) onOpenTryOn();
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '9px',
                      fontWeight: 750,
                      color: '#ffffff',
                      background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                      border: 'none',
                      padding: '2.5px 7px',
                      borderRadius: '9999px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(236,72,153,0.3)'
                    }}
                  >
                    <Sparkles size={8} /> Thử Son AR
                  </button>
                </div>
              </div>

              {/* Sản phẩm 2: Serum Trà Xanh Innisfree */}
              <div
                onClick={() => {
                  const p = findProduct('Innisfree') || findProduct('Serum');
                  if (onSelectProduct) onSelectProduct(p);
                }}
                style={{
                  padding: '10px 12px',
                  borderBottom: '1px solid #fdf2f8',
                  cursor: 'pointer',
                  background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
                  transition: 'background 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#dcfce7')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)')
                }
              >
                <div
                  style={{
                    position: 'relative',
                    width: '68px',
                    height: '68px',
                    flexShrink: 0,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 10px rgba(16,185,129,0.18)',
                    border: '1.5px solid #ffffff'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=240&auto=format&fit=crop&q=80"
                    alt="Serum Trà Xanh"
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
                      fontSize: '7.5px',
                      fontWeight: 800,
                      textAlign: 'center',
                      padding: '1.5px 0'
                    }}
                  >
                    BEST SELLER
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1px' }}>
                    <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#059669', background: '#d1fae5', padding: '1px 4px', borderRadius: '3px' }}>
                      Innisfree
                    </span>
                    <span style={{ fontSize: '8.5px', color: '#64748b' }}>Chai 80ml</span>
                  </div>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', margin: '0 0 1px', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Serum Trà Xanh
                  </h4>
                  <div style={{ fontSize: '9px', color: '#059669', fontWeight: 700, marginBottom: '2px' }}>
                    Cấp Ẩm Phục Hồi Sâu
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 850, color: '#0f172a' }}>620.000₫</span>
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '9px',
                      fontWeight: 750,
                      color: '#059669',
                      background: '#ecfdf5',
                      padding: '2.5px 7px',
                      borderRadius: '9999px',
                      border: '1px solid #a7f3d0'
                    }}
                  >
                    Xem chi tiết <ArrowRight size={8} />
                  </span>
                </div>
              </div>

              {/* Sản phẩm 3: Sữa Chống Nắng Anessa 60ml */}
              <div
                onClick={() => {
                  const p = findProduct('Anessa') || findProduct('Chống nắng');
                  if (onSelectProduct) onSelectProduct(p);
                }}
                style={{
                  padding: '10px 12px',
                  borderBottom: '1px solid #fdf2f8',
                  cursor: 'pointer',
                  background: 'linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)',
                  transition: 'background 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#fef3c7')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)')
                }
              >
                <div
                  style={{
                    position: 'relative',
                    width: '68px',
                    height: '68px',
                    flexShrink: 0,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 10px rgba(217,119,6,0.18)',
                    border: '1.5px solid #ffffff'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=240&auto=format&fit=crop&q=80"
                    alt="Chống Nắng Anessa"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'rgba(217,119,6,0.92)',
                      color: '#ffffff',
                      fontSize: '7.5px',
                      fontWeight: 800,
                      textAlign: 'center',
                      padding: '1.5px 0'
                    }}
                  >
                    SPF50+ PA++++
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1px' }}>
                    <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#b45309', background: '#fef3c7', padding: '1px 4px', borderRadius: '3px' }}>
                      -23%
                    </span>
                    <span style={{ fontSize: '8.5px', color: '#64748b' }}>Anessa 60ml</span>
                  </div>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', margin: '0 0 1px', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Chống Nắng Anessa
                  </h4>
                  <div style={{ fontSize: '9px', color: '#d97706', fontWeight: 700, marginBottom: '2px' }}>
                    Kiềm Dầu • Kháng Nước
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 850, color: '#b45309' }}>525.000₫</span>
                    <span style={{ fontSize: '9px', color: '#94a3b8', textDecoration: 'line-through' }}>685k</span>
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '9px',
                      fontWeight: 750,
                      color: '#ffffff',
                      background: '#d97706',
                      padding: '2.5px 7px',
                      borderRadius: '9999px',
                      boxShadow: '0 2px 4px rgba(217,119,6,0.3)'
                    }}
                  >
                    Săn Ngay <ArrowRight size={8} />
                  </span>
                </div>
              </div>

              {/* Sản phẩm 4 (KÉO DÀI): Paula's Choice BHA 2% 118ml */}
              <div
                onClick={() => {
                  const p = findProduct('BHA') || findProduct("Paula's Choice");
                  if (onSelectProduct) onSelectProduct(p);
                }}
                style={{
                  padding: '10px 12px',
                  borderBottom: '1px solid #fdf2f8',
                  cursor: 'pointer',
                  background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
                  transition: 'background 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)')
                }
              >
                <div
                  style={{
                    position: 'relative',
                    width: '68px',
                    height: '68px',
                    flexShrink: 0,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 10px rgba(15,23,42,0.18)',
                    border: '1.5px solid #ffffff'
                  }}
                >
                  <img
                    src="/products/SKU-PC-BHA-118ML.jpg"
                    alt="Paula's Choice BHA 2%"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'rgba(15,23,42,0.92)',
                      color: '#ffffff',
                      fontSize: '7.5px',
                      fontWeight: 800,
                      textAlign: 'center',
                      padding: '1.5px 0'
                    }}
                  >
                    BEST BHA 2%
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1px' }}>
                    <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#0284c7', background: '#e0f2fe', padding: '1px 4px', borderRadius: '3px' }}>
                      -20%
                    </span>
                    <span style={{ fontSize: '8.5px', color: '#64748b' }}>Paula's Choice</span>
                  </div>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', margin: '0 0 1px', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    BHA 2% Liquid
                  </h4>
                  <div style={{ fontSize: '9px', color: '#0284c7', fontWeight: 700, marginBottom: '2px' }}>
                    Đào Thải Mụn Đầu Đen
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 850, color: '#0f172a' }}>750.000₫</span>
                    <span style={{ fontSize: '9px', color: '#94a3b8', textDecoration: 'line-through' }}>939k</span>
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '9px',
                      fontWeight: 750,
                      color: '#0284c7',
                      background: '#f0f9ff',
                      padding: '2.5px 7px',
                      borderRadius: '9999px',
                      border: '1px solid #bae6fd'
                    }}
                  >
                    Xem deal hot <ArrowRight size={8} />
                  </span>
                </div>
              </div>

              {/* Sản phẩm 5 (KÉO DÀI): Nước Hoa Hồng Klairs 180ml */}
              <div
                onClick={() => {
                  const p = findProduct('Klairs') || findProduct('Toner');
                  if (onSelectProduct) onSelectProduct(p);
                }}
                style={{
                  padding: '10px 12px',
                  borderBottom: '1px solid #fdf2f8',
                  cursor: 'pointer',
                  background: 'linear-gradient(180deg, #fdf4ff 0%, #ffffff 100%)',
                  transition: 'background 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#fae8ff')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'linear-gradient(180deg, #fdf4ff 0%, #ffffff 100%)')
                }
              >
                <div
                  style={{
                    position: 'relative',
                    width: '68px',
                    height: '68px',
                    flexShrink: 0,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 10px rgba(168,85,247,0.18)',
                    border: '1.5px solid #ffffff'
                  }}
                >
                  <img
                    src="/products/SKU-KLAIRS-TONER-180ML.jpg"
                    alt="Toner Klairs 180ml"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'rgba(147,51,234,0.92)',
                      color: '#ffffff',
                      fontSize: '7.5px',
                      fontWeight: 800,
                      textAlign: 'center',
                      padding: '1.5px 0'
                    }}
                  >
                    KHÔNG CỒN
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1px' }}>
                    <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#9333ea', background: '#f3e8ff', padding: '1px 4px', borderRadius: '3px' }}>
                      -25%
                    </span>
                    <span style={{ fontSize: '8.5px', color: '#64748b' }}>Klairs Hàn Quốc</span>
                  </div>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', margin: '0 0 1px', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Toner Klairs 180ml
                  </h4>
                  <div style={{ fontSize: '9px', color: '#9333ea', fontWeight: 700, marginBottom: '2px' }}>
                    Cấp Ẩm Dịu Nhẹ Da Nhạy Cảm
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 850, color: '#9333ea' }}>295.000₫</span>
                    <span style={{ fontSize: '9px', color: '#94a3b8', textDecoration: 'line-through' }}>395k</span>
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '9px',
                      fontWeight: 750,
                      color: '#ffffff',
                      background: '#9333ea',
                      padding: '2.5px 7px',
                      borderRadius: '9999px',
                      boxShadow: '0 2px 4px rgba(147,51,234,0.3)'
                    }}
                  >
                    Săn Deal <ArrowRight size={8} />
                  </span>
                </div>
              </div>

              {/* Item 6: Voucher Sàn 50K */}
              <div
                onClick={() => handleCopyVoucher('AURA50K')}
                style={{
                  padding: '10px 12px',
                  cursor: 'pointer',
                  background: 'linear-gradient(180deg, #faf5ff 0%, #ffffff 100%)',
                  transition: 'background 0.2s ease',
                  borderBottom: '1px solid #fdf2f8'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f3e8ff')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'linear-gradient(180deg, #faf5ff 0%, #ffffff 100%)')
                }
                title="Bấm để sao chép mã"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ fontSize: '9.5px', fontWeight: 850, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Tag size={10} /> VOUCHER SÀN
                  </span>
                  <span style={{ fontSize: '8.5px', color: '#64748b' }}>Đơn từ 299K</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '13px', fontWeight: 850, color: '#9333ea', letterSpacing: '0.01em' }}>
                    GIẢM 50.000₫
                  </div>
                  <div
                    style={{
                      fontSize: '9px',
                      fontWeight: 800,
                      background: '#ede9fe',
                      color: '#6d28d9',
                      padding: '2.5px 7px',
                      borderRadius: '5px',
                      border: '1px dashed #c4b5fd'
                    }}
                  >
                    MÃ: AURA50K 📋
                  </div>
                </div>
              </div>

              {/* Item 7: Footer Trust Bar */}
              <div
                style={{
                  padding: '8px 12px',
                  background: '#fdf2f8',
                  borderTop: '1px solid #fce7f3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  fontSize: '9px',
                  fontWeight: 750,
                  color: '#be185d'
                }}
              >
                <ShieldCheck size={12} style={{ color: '#db2777' }} />
                <span>100% Chính Hãng • Đổi Trả 7 Ngày Miễn Phí</span>
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
          CỘT QUẢNG CÁO SẢN PHẨM BÊN PHẢI (RIGHT SIDE PRODUCT ADS — KÉO DÀI XUỐNG DƯỚI)
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
                maxHeight: 'calc(100vh - 195px)',
                background: '#ffffff',
                borderRadius: '18px',
                border: '1.5px solid #fed7aa',
                boxShadow: '0 16px 36px -4px rgba(234,88,12,0.2), 0 4px 14px rgba(0,0,0,0.06)',
                overflowY: 'auto',
                overflowX: 'hidden',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Header Ribbon */}
              <div
                style={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 2,
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  color: '#ffffff',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
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
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title="Thu gọn quảng cáo"
                >
                  <X size={12} />
                </button>
              </div>

              {/* Sản phẩm 1: Serum La Roche-Posay Hyalu B5 */}
              <div
                onClick={() => {
                  const p = findProduct('Hyalu B5') || findProduct('La Roche-Posay');
                  if (onSelectProduct) onSelectProduct(p);
                }}
                style={{
                  padding: '10px 12px',
                  borderBottom: '1px solid #fff7ed',
                  cursor: 'pointer',
                  background: 'linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)',
                  transition: 'background 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#ffedd5')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)')
                }
              >
                <div
                  style={{
                    position: 'relative',
                    width: '68px',
                    height: '68px',
                    flexShrink: 0,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 10px rgba(249,115,22,0.18)',
                    border: '1.5px solid #ffffff'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=240&auto=format&fit=crop&q=80"
                    alt="Serum Hyalu B5"
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
                      textAlign: 'center',
                      padding: '1.5px 0'
                    }}
                  >
                    GIẢM 50%
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1px' }}>
                    <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#ea580c', background: '#ffedd5', padding: '1px 4px', borderRadius: '3px' }}>
                      Flash Deal
                    </span>
                    <span style={{ fontSize: '8.5px', color: '#64748b' }}>La Roche-Posay</span>
                  </div>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', margin: '0 0 1px', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Serum Hyalu B5
                  </h4>
                  <div style={{ fontSize: '9px', color: '#ea580c', fontWeight: 700, marginBottom: '2px' }}>
                    Phục Hồi Biểu Bì 24H
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 850, color: '#ea580c' }}>490.000₫</span>
                    <span style={{ fontSize: '9px', color: '#94a3b8', textDecoration: 'line-through' }}>980k</span>
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '9px',
                      fontWeight: 750,
                      color: '#ffffff',
                      background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                      padding: '2.5px 7px',
                      borderRadius: '9999px',
                      boxShadow: '0 2px 4px rgba(234,88,12,0.3)'
                    }}
                  >
                    Săn Deal <ArrowRight size={8} />
                  </span>
                </div>
              </div>

              {/* Sản phẩm 2: Sữa Rửa Mặt CeraVe */}
              <div
                onClick={() => {
                  const p = findProduct('CeraVe') || findProduct('Sữa rửa mặt');
                  if (onSelectProduct) onSelectProduct(p);
                }}
                style={{
                  padding: '10px 12px',
                  borderBottom: '1px solid #fff7ed',
                  cursor: 'pointer',
                  background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
                  transition: 'background 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#dcfce7')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)')
                }
              >
                <div
                  style={{
                    position: 'relative',
                    width: '68px',
                    height: '68px',
                    flexShrink: 0,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 10px rgba(14,165,233,0.18)',
                    border: '1.5px solid #ffffff'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=240&auto=format&fit=crop&q=80"
                    alt="Sữa Rửa Mặt CeraVe"
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
                      fontSize: '7.5px',
                      fontWeight: 800,
                      textAlign: 'center',
                      padding: '1.5px 0'
                    }}
                  >
                    FREESHIP 0Đ
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1px' }}>
                    <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#0284c7', background: '#e0f2fe', padding: '1px 4px', borderRadius: '3px' }}>
                      CeraVe
                    </span>
                    <span style={{ fontSize: '8.5px', color: '#64748b' }}>Chai 473ml</span>
                  </div>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', margin: '0 0 1px', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Sữa Rửa Mặt Dầu
                  </h4>
                  <div style={{ fontSize: '9px', color: '#0284c7', fontWeight: 700, marginBottom: '2px' }}>
                    Ceramides Phục Hồi
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 850, color: '#0f172a' }}>365.000₫</span>
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '9px',
                      fontWeight: 750,
                      color: '#0284c7',
                      background: '#f0f9ff',
                      padding: '2.5px 7px',
                      borderRadius: '9999px',
                      border: '1px solid #bae6fd'
                    }}
                  >
                    Xem chi tiết <ArrowRight size={8} />
                  </span>
                </div>
              </div>

              {/* Sản phẩm 3: Tẩy Tế Bào Chết Dove Lựu Đỏ 298g */}
              <div
                onClick={() => {
                  const p = findProduct('Dove') || findProduct('Tẩy tế bào chết');
                  if (onSelectProduct) onSelectProduct(p);
                }}
                style={{
                  padding: '10px 12px',
                  borderBottom: '1px solid #fff7ed',
                  cursor: 'pointer',
                  background: 'linear-gradient(180deg, #fdf2f8 0%, #ffffff 100%)',
                  transition: 'background 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#fce7f3')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'linear-gradient(180deg, #fdf2f8 0%, #ffffff 100%)')
                }
              >
                <div
                  style={{
                    position: 'relative',
                    width: '68px',
                    height: '68px',
                    flexShrink: 0,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 10px rgba(225,29,72,0.18)',
                    border: '1.5px solid #ffffff'
                  }}
                >
                  <img
                    src="/products/dove-pomegranate-main.jpg"
                    alt="Tẩy Tế Bào Chết Dove"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'rgba(225,29,72,0.92)',
                      color: '#ffffff',
                      fontSize: '7.5px',
                      fontWeight: 800,
                      textAlign: 'center',
                      padding: '1.5px 0'
                    }}
                  >
                    BẢN MỸ 298G
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1px' }}>
                    <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#e11d48', background: '#ffe4e6', padding: '1px 4px', borderRadius: '3px' }}>
                      -13%
                    </span>
                    <span style={{ fontSize: '8.5px', color: '#64748b' }}>Dove USA</span>
                  </div>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', margin: '0 0 1px', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Tẩy Da Chết Dove
                  </h4>
                  <div style={{ fontSize: '9px', color: '#e11d48', fontWeight: 700, marginBottom: '2px' }}>
                    Hạt Lựu Đỏ & Bơ Mỡ
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 850, color: '#e11d48' }}>249.000₫</span>
                    <span style={{ fontSize: '9px', color: '#94a3b8', textDecoration: 'line-through' }}>285k</span>
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '9px',
                      fontWeight: 750,
                      color: '#ffffff',
                      background: '#e11d48',
                      padding: '2.5px 7px',
                      borderRadius: '9999px',
                      boxShadow: '0 2px 4px rgba(225,29,72,0.3)'
                    }}
                  >
                    Săn Deal <ArrowRight size={8} />
                  </span>
                </div>
              </div>

              {/* Sản phẩm 4 (KÉO DÀI): Vichy Mineral 89 Booster 50ml */}
              <div
                onClick={() => {
                  const p = findProduct('Vichy') || findProduct('Mineral 89');
                  if (onSelectProduct) onSelectProduct(p);
                }}
                style={{
                  padding: '10px 12px',
                  borderBottom: '1px solid #fff7ed',
                  cursor: 'pointer',
                  background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)',
                  transition: 'background 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#e0f2fe')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)')
                }
              >
                <div
                  style={{
                    position: 'relative',
                    width: '68px',
                    height: '68px',
                    flexShrink: 0,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 10px rgba(2,132,199,0.18)',
                    border: '1.5px solid #ffffff'
                  }}
                >
                  <img
                    src="/products/SKU-VICHY-89-50ML.webp"
                    alt="Vichy Mineral 89"
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
                      fontSize: '7.5px',
                      fontWeight: 800,
                      textAlign: 'center',
                      padding: '1.5px 0'
                    }}
                  >
                    KHOÁNG NÚI LỬA
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1px' }}>
                    <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#0284c7', background: '#e0f2fe', padding: '1px 4px', borderRadius: '3px' }}>
                      -28%
                    </span>
                    <span style={{ fontSize: '8.5px', color: '#64748b' }}>Vichy Pháp</span>
                  </div>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', margin: '0 0 1px', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Vichy Mineral 89
                  </h4>
                  <div style={{ fontSize: '9px', color: '#0284c7', fontWeight: 700, marginBottom: '2px' }}>
                    Tái Tạo Hàng Rào Bảo Vệ
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 850, color: '#0284c7' }}>680.000₫</span>
                    <span style={{ fontSize: '9px', color: '#94a3b8', textDecoration: 'line-through' }}>950k</span>
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '9px',
                      fontWeight: 750,
                      color: '#ffffff',
                      background: '#0284c7',
                      padding: '2.5px 7px',
                      borderRadius: '9999px',
                      boxShadow: '0 2px 4px rgba(2,132,199,0.3)'
                    }}
                  >
                    Săn Deal <ArrowRight size={8} />
                  </span>
                </div>
              </div>

              {/* Sản phẩm 5 (KÉO DÀI): Dầu Tẩy Trang DHC 200ml */}
              <div
                onClick={() => {
                  const p = findProduct('DHC') || findProduct('Tẩy trang');
                  if (onSelectProduct) onSelectProduct(p);
                }}
                style={{
                  padding: '10px 12px',
                  borderBottom: '1px solid #fff7ed',
                  cursor: 'pointer',
                  background: 'linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)',
                  transition: 'background 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#fef3c7')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)')
                }
              >
                <div
                  style={{
                    position: 'relative',
                    width: '68px',
                    height: '68px',
                    flexShrink: 0,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 10px rgba(217,119,6,0.18)',
                    border: '1.5px solid #ffffff'
                  }}
                >
                  <img
                    src="/products/SKU-DHC-OIL-200ML.jpg"
                    alt="Dầu Tẩy Trang DHC"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'rgba(217,119,6,0.92)',
                      color: '#ffffff',
                      fontSize: '7.5px',
                      fontWeight: 800,
                      textAlign: 'center',
                      padding: '1.5px 0'
                    }}
                  >
                    DẦU OLIU NGUYÊN CHẤT
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1px' }}>
                    <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#b45309', background: '#fef3c7', padding: '1px 4px', borderRadius: '3px' }}>
                      -30%
                    </span>
                    <span style={{ fontSize: '8.5px', color: '#64748b' }}>DHC Nhật Bản</span>
                  </div>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', margin: '0 0 1px', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Dầu Tẩy Trang DHC
                  </h4>
                  <div style={{ fontSize: '9px', color: '#b45309', fontWeight: 700, marginBottom: '2px' }}>
                    Hòa Tan Sạch Mụn Cám
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 850, color: '#b45309' }}>450.000₫</span>
                    <span style={{ fontSize: '9px', color: '#94a3b8', textDecoration: 'line-through' }}>645k</span>
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '9px',
                      fontWeight: 750,
                      color: '#ffffff',
                      background: '#d97706',
                      padding: '2.5px 7px',
                      borderRadius: '9999px',
                      boxShadow: '0 2px 4px rgba(217,119,6,0.3)'
                    }}
                  >
                    Săn Deal <ArrowRight size={8} />
                  </span>
                </div>
              </div>

              {/* Item 6: AI Skin Scanner */}
              <div
                onClick={() => onOpenSkinScanner && onOpenSkinScanner()}
                style={{
                  padding: '10px 12px',
                  cursor: 'pointer',
                  background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
                  transition: 'background 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  borderBottom: '1px solid #fff7ed'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#dcfce7')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)')
                }
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
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
                  <Camera size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', lineHeight: 1.25 }}>
                    AI Soi Da Liễu
                  </div>
                  <div style={{ fontSize: '9px', color: '#64748b', marginTop: '1px' }}>
                    Phân tích 5 chỉ số biểu bì
                  </div>
                  <div style={{ fontSize: '9px', color: '#059669', fontWeight: 800, marginTop: '2px' }}>
                    Miễn phí 100% →
                  </div>
                </div>
              </div>

              {/* Item 7: Footer Trust Bar */}
              <div
                style={{
                  padding: '8px 12px',
                  background: '#fff7ed',
                  borderTop: '1px solid #fed7aa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  fontSize: '9px',
                  fontWeight: 750,
                  color: '#c2410c'
                }}
              >
                <Truck size={12} style={{ color: '#ea580c' }} />
                <span>Giao Hỏa Tốc 2H • Freeship Toàn Quốc Từ 299K</span>
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
