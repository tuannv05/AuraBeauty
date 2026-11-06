import React, { useState, useEffect, useMemo, useRef } from 'react';

/**
 * Enterprise Resilient Product Image Component for Aura Beauty Mall.
 * Guarantees ZERO Broken Image Icons, ZERO Alt text overflow, and ZERO Blank Screen:
 * 1. Immediate visual rendering (No opacity:0 delay that causes blank boxes on cache/lazy)
 * 2. Automatic multi-candidate fallback on error (images[0] -> images[1..N] -> Luxury SVG)
 * 3. Preserves aspect-ratio and styling of .product-card-img-wrap
 */
export function ProductImage({
  src,
  images = [],
  alt = '',
  className = '',
  style = {},
  onClick,
  brand = '',
  productName = '',
  objectFit = 'contain',
  ...props
}) {
  // Normalize candidate image URLs
  const candidates = useMemo(() => {
    const list = [];
    if (src && typeof src === 'string' && src.trim()) {
      list.push(src.trim());
    }
    if (Array.isArray(images)) {
      images.forEach((img) => {
        if (img && typeof img === 'string' && img.trim() && !list.includes(img.trim())) {
          list.push(img.trim());
        }
      });
    }
    // Clean and ensure leading slash for local assets
    return list.map((item) => {
      if (!item.startsWith('http') && !item.startsWith('data:') && !item.startsWith('/')) {
        return `/${item}`;
      }
      return item;
    });
  }, [src, images]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Reset when candidates change
  useEffect(() => {
    setCurrentIndex(0);
    setHasError(candidates.length === 0);
  }, [candidates]);

  const currentUrl = candidates[currentIndex] || '';

  const handleError = () => {
    // Try next candidate image if available
    if (currentIndex + 1 < candidates.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // All candidate images exhausted -> Fallback to Luxury SVG
      setHasError(true);
    }
  };

  // Luxury SVG Placeholder Component when image fails or is missing
  if (hasError || !currentUrl) {
    const displayBrand = (brand || 'AURA BEAUTY').toUpperCase();
    return (
      <div
        className={`aura-product-image-fallback ${className}`}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          cursor: onClick ? 'pointer' : 'default',
          ...style
        }}
        onClick={onClick}
        title={productName || alt}
        {...props}
      >
        <svg
          viewBox="0 0 200 200"
          style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}
        >
          {/* Subtle geometric luxury backdrop */}
          <circle cx="100" cy="90" r="50" fill="#e2e8f0" opacity="0.4" />
          
          {/* Elegant Cosmetic Flask Icon */}
          <path d="M85 55 L115 55 L115 65 L85 65 Z" fill="#94a3b8" />
          <path d="M93 65 L107 65 L107 75 L93 75 Z" fill="#cbd5e1" />
          <path
            d="M80 85 C80 78, 120 78, 120 85 L130 135 C130 145, 70 145, 70 135 Z"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="2"
          />
          {/* Liquid highlight */}
          <path
            d="M78 115 C88 120, 112 110, 122 115 L126 133 C126 142, 74 142, 74 133 Z"
            fill="#e2e8f0"
            opacity="0.6"
          />
          {/* Gold Star Accents */}
          <circle cx="120" cy="78" r="3" fill="#d97706" />
          <circle cx="125" cy="85" r="1.5" fill="#f59e0b" />

          {/* Luxury Text */}
          <text
            x="100"
            y="165"
            textAnchor="middle"
            fill="#475569"
            fontSize="10"
            fontWeight="700"
            letterSpacing="2"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            {displayBrand.length > 18 ? displayBrand.slice(0, 18) + '...' : displayBrand}
          </text>
          <text
            x="100"
            y="178"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="8"
            fontWeight="500"
            letterSpacing="1"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            OFFICIAL MALL
          </text>
        </svg>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={currentUrl}
      alt={alt || productName || 'Aura Beauty Product'}
      onError={handleError}
      className={`aura-product-image ${className}`}
      style={{
        width: '100%',
        height: '100%',
        objectFit: objectFit,
        padding: '6px',
        display: 'block',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 300ms ease',
        ...style
      }}
      onClick={onClick}
      {...props}
    />
  );
}

export default ProductImage;
