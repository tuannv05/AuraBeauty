// frontend/src/components/ui/AuraBrandLogo.jsx
import React, { useId } from 'react';
import { motion } from 'framer-motion';

/**
 * AuraBrandLogo — Luxury Derma-Tech Brand Identity
 * 
 * Features:
 * - Geometric Isotype: Rhombus (93.2 x 93.2 bo góc rx="15", rot="-45deg")
 * - Dynamic SVG Mask (<mask id="aura-mask-*">) with 3 intersecting orbit ellipses and 3 nodal circles
 * - Wordmark "AURA BEAUTY MALL" with "TM" exponent & official CBMP subtitle
 * - Color variants: 'dark' (Header sáng / Ink), 'light' (Nền tối / Gold-Rose), 'compact' (Chỉ Isotype)
 * - Micro-interaction: Subtle hover orbital spin & shimmer
 */
export default function AuraBrandLogo({
  variant = 'dark', // 'dark' | 'light' | 'compact' | 'gold'
  size = 'md',      // 'sm' (h=32) | 'md' (h=42) | 'lg' (h=56)
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
    md: 42,
    lg: 56
  };
  const pixelHeight = typeof size === 'number' ? size : heightMap[size] || 42;

  // Bảng màu theo Variant
  const isLight = variant === 'light' || variant === 'gold';
  const primaryTextColor = isLight ? '#FFFFFF' : '#0F172A';
  const accentTextColor = isLight ? '#FFABB9' : '#EC4899';
  const taglineColor = isLight ? '#E5E7EB' : '#64748B';
  const markGradient = isLight
    ? { start: '#FFABB9', mid: '#F59E0B', end: '#FFFFFF' }
    : { start: '#EC4899', mid: '#DB2777', end: '#9333EA' };

  if (variant === 'gold') {
    markGradient.start = '#FBBF24';
    markGradient.mid = '#F59E0B';
    markGradient.end = '#D97706';
  }

  // Tùy chọn chỉ hiển thị Isotype (Compact)
  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.06, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        onClick={onClick}
        className={`inline-flex items-center justify-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
        style={{ width: `${pixelHeight}px`, height: `${pixelHeight}px` }}
        title="Aura Beauty Mall — Multi-Vendor Platform"
      >
        <svg
          viewBox="-75 -75 150 150"
          width={pixelHeight}
          height={pixelHeight}
          className="overflow-visible"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={markGradient.start} />
              <stop offset="50%" stopColor={markGradient.mid} />
              <stop offset="100%" stopColor={markGradient.end} />
            </linearGradient>

            <mask id={maskId}>
              {/* White background preserves the body */}
              <rect x="-100" y="-100" width="200" height="200" fill="#FFFFFF" />

              {/* 3 Intersecting Orbit Ellipses (Cut out from mask) */}
              <ellipse cx="6" cy="-64" rx="68" ry="68" fill="none" stroke="#000000" strokeWidth="2.5" />
              <ellipse cx="60" cy="-35" rx="68" ry="68" fill="none" stroke="#000000" strokeWidth="2.5" />
              <ellipse cx="40" cy="45" rx="68" ry="68" fill="none" stroke="#000000" strokeWidth="2.5" />

              {/* 3 Energy Nodes (Circles) */}
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
              filter: isLight ? 'drop-shadow(0 0 10px rgba(255,171,185,0.4))' : 'drop-shadow(0 4px 10px rgba(236,72,153,0.3))'
            }}
          />
        </svg>
      </motion.div>
    );
  }

  // Full Brand Logo: Isotype + Wordmark
  return (
    <motion.div
      whileHover={{ scale: 1.015 }}
      whileTap={onClick ? { scale: 0.985 } : undefined}
      transition={{ type: 'spring', stiffness: 350, damping: 24 }}
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ height: `${pixelHeight}px` }}
    >
      {/* 1. ISOTYPE ICON (Vector Rhombus + Mask) */}
      <div style={{ width: `${pixelHeight}px`, height: `${pixelHeight}px`, flexShrink: 0 }}>
        <svg
          viewBox="-75 -75 150 150"
          width={pixelHeight}
          height={pixelHeight}
          className="overflow-visible"
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
                ? 'drop-shadow(0 0 12px rgba(255,171,185,0.45))'
                : 'drop-shadow(0 3px 8px rgba(236,72,153,0.3))'
            }}
          />
        </svg>
      </div>

      {/* 2. WORDMARK & TAGLINE */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
          <span
            style={{
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontSize: `${Math.round(pixelHeight * 0.52)}px`,
              fontWeight: 850,
              letterSpacing: '-0.03em',
              color: primaryTextColor,
              display: 'inline-flex'
            }}
          >
            AURA
          </span>

          <span
            style={{
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontSize: `${Math.round(pixelHeight * 0.52)}px`,
              fontWeight: 850,
              letterSpacing: '-0.03em',
              color: accentTextColor,
              marginLeft: '4px'
            }}
          >
            BEAUTY
          </span>

          <span
            style={{
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontSize: `${Math.round(pixelHeight * 0.36)}px`,
              fontWeight: 700,
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
              fontSize: `${Math.max(9, Math.round(pixelHeight * 0.22))}px`,
              fontWeight: 800,
              color: accentTextColor,
              verticalAlign: 'super',
              marginLeft: '2px',
              opacity: 0.9
            }}
          >
            ™
          </span>
        </div>

        {/* Subtitle / Official Quality Certification Tagline */}
        {showTagline && (
          <p
            style={{
              fontSize: `${Math.max(10, Math.round(pixelHeight * 0.24))}px`,
              fontWeight: 650,
              color: taglineColor,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginTop: '3px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <span>Derma-Tech</span>
            <span style={{ fontSize: '7px', opacity: 0.6 }}>●</span>
            <span>Official CBMP</span>
          </p>
        )}
      </div>
    </motion.div>
  );
}
