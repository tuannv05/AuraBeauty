// frontend/src/components/ui/AuraBrandLogo.jsx
import React, { useId } from 'react';
import { motion } from 'framer-motion';

/**
 * AuraBrandLogo — Luxury Derma-Tech Brand Identity
 * 
 * Features:
 * - Geometric Isotype: Rhombus (84 x 84 bo góc rx="14", rot="-45deg")
 * - Dynamic SVG Mask (<mask id="aura-mask-*">) with 3 intersecting orbit ellipses and 3 nodal circles
 * - Strictly horizontal row layout (display: inline-flex, flexDirection: row, whiteSpace: nowrap)
 * - Zero overlap / clipping guarantee inside Header & Navigation menus
 * - Feminine Rose & Luxury Gold accent palettes
 */
export default function AuraBrandLogo({
  variant = 'dark', // 'dark' | 'light' | 'compact' | 'gold' | 'rose'
  size = 'md',      // 'sm' (h=32) | 'md' (h=40) | 'lg' (h=52)
  showTagline = true,
  className = '',
  onClick,
  isAnimated = false
}) {
  const uniqueMaskId = useId().replace(/:/g, '_');
  const maskId = `aura-brand-mask-${uniqueMaskId}`;
  const gradientId = `aura-brand-grad-${uniqueMaskId}`;

  // Kích thước chuẩn
  const heightMap = {
    sm: 32,
    md: 40,
    lg: 52
  };
  const pixelHeight = typeof size === 'number' ? size : heightMap[size] || 40;

  // Bảng màu theo Variant
  const isLight = variant === 'light' || variant === 'gold';
  const primaryTextColor = isLight ? '#FFFFFF' : '#0F172A';
  const accentTextColor = isLight ? '#FF8096' : '#EC4899';
  const taglineColor = isLight ? '#FCE7F3' : '#64748B';

  // Gradient khối Isotype
  let markGradient = {
    start: '#FF8096',
    mid: '#F43F5E',
    end: '#BE185D'
  };

  if (variant === 'gold') {
    markGradient = { start: '#FBBF24', mid: '#F59E0B', end: '#D97706' };
  } else if (variant === 'light') {
    markGradient = { start: '#FFA5BA', mid: '#FF69B4', end: '#FFFFFF' };
  }

  // Tùy chọn chỉ hiển thị Isotype (Compact)
  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.06, rotate: 2 }}
        whileTap={onClick ? { scale: 0.95 } : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        onClick={onClick}
        style={{
          width: `${pixelHeight}px`,
          height: `${pixelHeight}px`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          cursor: onClick ? 'pointer' : 'default',
          userSelect: 'none'
        }}
        className={className}
        title="Aura Beauty Mall — Sàn TMĐT Mỹ Phẩm Phái Đẹp"
      >
        <svg
          viewBox="-75 -75 150 150"
          width={pixelHeight}
          height={pixelHeight}
          style={{ overflow: 'visible', display: 'block' }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={markGradient.start} />
              <stop offset="50%" stopColor={markGradient.mid} />
              <stop offset="100%" stopColor={markGradient.end} />
            </linearGradient>

            <mask id={maskId}>
              <rect x="-100" y="-100" width="200" height="200" fill="#FFFFFF" />
              {/* 3 Intersecting Orbit Ellipses */}
              <ellipse cx="6" cy="-64" rx="68" ry="68" fill="none" stroke="#000000" strokeWidth="2.5" />
              <ellipse cx="60" cy="-35" rx="68" ry="68" fill="none" stroke="#000000" strokeWidth="2.5" />
              <ellipse cx="40" cy="45" rx="68" ry="68" fill="none" stroke="#000000" strokeWidth="2.5" />
              {/* 3 Energy Nodes */}
              <circle cx="16" cy="-14" r="5" fill="#000000" />
              <circle cx="-18" cy="18" r="4" fill="#000000" />
              <circle cx="28" cy="22" r="4.5" fill="#000000" />
            </mask>
          </defs>

          {/* Rhombus Isotype with Mask Applied */}
          <rect
            id="iso"
            x="-42"
            y="-42"
            width="84"
            height="84"
            rx="14"
            ry="14"
            transform="rotate(-45)"
            fill={`url(#${gradientId})`}
            mask={`url(#${maskId})`}
            style={{
              filter: isLight
                ? 'drop-shadow(0 0 10px rgba(255,182,193,0.5))'
                : 'drop-shadow(0 3px 8px rgba(244,63,94,0.35))'
            }}
          />
        </svg>
      </motion.div>
    );
  }

  // Full Brand Logo: Isotype (Bên Trái) + Wordmark (Bên Phải) luôn nằm trên 1 hàng ngang
  return (
    <motion.div
      whileHover={{ scale: 1.015 }}
      whileTap={onClick ? { scale: 0.985 } : undefined}
      transition={{ type: 'spring', stiffness: 350, damping: 24 }}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '10px',
        height: `${pixelHeight}px`,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        userSelect: 'none',
        cursor: onClick ? 'pointer' : 'default',
        lineHeight: 1
      }}
      className={className}
    >
      {/* 1. ISOTYPE ICON (Vector Rhombus + Mask) */}
      <div
        style={{
          width: `${pixelHeight}px`,
          height: `${pixelHeight}px`,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg
          viewBox="-75 -75 150 150"
          width={pixelHeight}
          height={pixelHeight}
          style={{ overflow: 'visible', display: 'block' }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={markGradient.start} />
              <stop offset="50%" stopColor={markGradient.mid} />
              <stop offset="100%" stopColor={markGradient.end} />
            </linearGradient>

            <mask id={maskId}>
              <rect x="-100" y="-100" width="200" height="200" fill="#FFFFFF" />
              {/* 3 Intersecting Orbit Ellipses */}
              <ellipse cx="6" cy="-64" rx="68" ry="68" fill="none" stroke="#000000" strokeWidth="2.5" />
              <ellipse cx="60" cy="-35" rx="68" ry="68" fill="none" stroke="#000000" strokeWidth="2.5" />
              <ellipse cx="40" cy="45" rx="68" ry="68" fill="none" stroke="#000000" strokeWidth="2.5" />
              {/* 3 Core Intersection Nodes */}
              <circle cx="16" cy="-14" r="5" fill="#000000" />
              <circle cx="-18" cy="18" r="4" fill="#000000" />
              <circle cx="28" cy="22" r="4.5" fill="#000000" />
            </mask>
          </defs>

          <rect
            id="iso"
            x="-42"
            y="-42"
            width="84"
            height="84"
            rx="14"
            ry="14"
            transform="rotate(-45)"
            fill={`url(#${gradientId})`}
            mask={`url(#${maskId})`}
            style={{
              filter: isLight
                ? 'drop-shadow(0 0 12px rgba(255,182,193,0.55))'
                : 'drop-shadow(0 3px 8px rgba(244,63,94,0.35))'
            }}
          />
        </svg>
      </div>

      {/* 2. WORDMARK & TAGLINE (Bên Phải Khối Thoi) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flexShrink: 0,
          whiteSpace: 'nowrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', whiteSpace: 'nowrap' }}>
          <span
            style={{
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontSize: `${Math.round(pixelHeight * 0.46)}px`,
              fontWeight: 850,
              letterSpacing: '-0.02em',
              color: primaryTextColor
            }}
          >
            AURA
          </span>

          <span
            style={{
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontSize: `${Math.round(pixelHeight * 0.46)}px`,
              fontWeight: 850,
              letterSpacing: '-0.02em',
              color: accentTextColor,
              marginLeft: '3px'
            }}
          >
            BEAUTY
          </span>

          <span
            style={{
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontSize: `${Math.round(pixelHeight * 0.34)}px`,
              fontWeight: 750,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: primaryTextColor,
              opacity: 0.85,
              marginLeft: '3px'
            }}
          >
            MALL
          </span>

          {/* TM Superscript */}
          <span
            style={{
              fontSize: `${Math.max(8, Math.round(pixelHeight * 0.2))}px`,
              fontWeight: 800,
              color: accentTextColor,
              verticalAlign: 'super',
              marginLeft: '2px',
              opacity: 0.95
            }}
          >
            ™
          </span>
        </div>

        {/* Subtitle / Official Quality Certification Tagline */}
        {showTagline && (
          <p
            style={{
              fontSize: `${Math.max(9, Math.round(pixelHeight * 0.22))}px`,
              fontWeight: 650,
              color: taglineColor,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginTop: '1px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap'
            }}
          >
            <span>Derma-Tech</span>
            <span style={{ fontSize: '6px', opacity: 0.5 }}>●</span>
            <span>Official CBMP</span>
          </p>
        )}
      </div>
    </motion.div>
  );
}
