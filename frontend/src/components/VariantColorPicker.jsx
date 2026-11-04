import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * VariantColorPicker
 * Hệ thống chọn biến thể & màu sắc chuẩn Shopee Mall cho sàn thương mại mỹ phẩm.
 * Hiển thị nút phân loại chữ nhật với ảnh thumbnail mini + tên sắc thái + góc tam giác đỏ kèm checkmark khi chọn.
 * Hỗ trợ hiển thị trạng thái Hết hàng (gạch mờ, vô hiệu hóa) và đồng bộ gương AR Virtual Try-On 3D.
 */
export default function VariantColorPicker({
  product,
  selectedVariant,
  onSelectVariant,
  onOpenTryOn,
  compact = false,
  className = ''
}) {
  if (!product) return null;

  const variants = product.variants || [];
  const vtoShades = product.vtoConfig?.shades || [];
  const isVtoSupported = !!(product.vtoConfig?.supported || vtoShades.length > 0);

  // Normalize variants with their shade metadata
  const isProductInStock = product.inStock !== false;

  const normalizedVariants = useMemo(() => {
    if (variants.length === 0) {
      // Fallback single variant from product
      return [
        {
          skuCode: product.id ? `${product.id}-STD` : 'SKU-STD',
          title: 'Tiêu chuẩn',
          price: product.price || 0,
          originalPrice: product.originalPrice || null,
          hexColor: null,
          finishType: null,
          undertone: null,
          onHand: isProductInStock ? 120 : 0,
          isAvailable: isProductInStock,
          thumbImg: product.images?.[0] || product.image || null,
          raw: product
        }
      ];
    }

    return variants.map((v, idx) => {
      const sku = v.skuCode || v.sku || `SKU-${idx + 1}`;
      
      // Look for matching shade in vtoConfig.shades
      const matchedShade = vtoShades.find(
        (s) => s.skuCode === sku || (s.shadeName && v.name && v.name.includes(s.shadeName))
      ) || vtoShades[idx];

      const hex =
        v.attributes?.Hex ||
        v.attributes?.color ||
        matchedShade?.hexColor ||
        null;

      const finish =
        v.attributes?.Finish ||
        matchedShade?.finishType ||
        null;

      const undertone =
        matchedShade?.bestUndertone ||
        null;

      // Extract title cleanly
      let title = v.name || v.title || '';
      if (v.attributes?.Shade) {
        title = v.attributes.Shade;
      } else if (v.attributes?.DungTich) {
        title = v.attributes.DungTich;
      } else if (v.attributes?.volume) {
        title = v.attributes.volume;
      } else if (matchedShade?.shadeName) {
        title = matchedShade.shadeName;
      }

      // If title includes full product name, strip prefix
      if (product.name && title.startsWith(product.name)) {
        title = title.replace(product.name, '').replace(/^[\s\-–—]+/, '').trim();
      }
      if (!title) title = `Phân loại ${idx + 1}`;

      const stockCount = (isProductInStock && v.inStock !== false) ? (v.onHand ?? v.stock ?? 120) : 0;
      const isAvailable = stockCount > 0;

      // Thumbnail image resolution
      let thumbImg = v.image || v.imageUrl || null;
      if (!thumbImg && sku) {
        thumbImg = `/products/${sku}.jpg`;
      }
      if (!thumbImg && product.images?.[idx]) {
        thumbImg = product.images[idx];
      }
      if (!thumbImg) {
        thumbImg = product.images?.[0] || product.image || null;
      }

      return {
        skuCode: sku,
        title,
        price: v.price || product.price || 0,
        originalPrice: v.originalPrice || null,
        hexColor: hex,
        finishType: finish,
        undertone,
        onHand: stockCount,
        isAvailable,
        thumbImg,
        matchedShade,
        raw: v
      };
    });
  }, [product, variants, vtoShades, isProductInStock]);

  // Determine if this is a color-based product
  const hasColors = normalizedVariants.some((v) => !!v.hexColor);

  const axisLabel = useMemo(() => {
    if (product.variantAxisName) return product.variantAxisName;
    const catLow = (product.category || '').toLowerCase();
    if (hasColors || catLow.includes('lipstick') || catLow.includes('son') || catLow.includes('blush') || catLow.includes('cushion') || catLow.includes('foundation') || catLow.includes('eyeshadow')) {
      return 'Phân Loại Màu';
    }
    return 'Phân Loại Hàng';
  }, [product, hasColors]);

  // Active selected normalized variant
  const activeNormalized = useMemo(() => {
    if (!selectedVariant) return normalizedVariants[0] || null;
    const currentSku = selectedVariant.skuCode || selectedVariant.sku;
    return (
      normalizedVariants.find((v) => v.skuCode === currentSku) ||
      normalizedVariants[0] ||
      null
    );
  }, [normalizedVariants, selectedVariant]);

  const handleSelect = (norm) => {
    if (onSelectVariant) {
      onSelectVariant(norm.raw, norm);
    }
  };

  if (normalizedVariants.length === 0) return null;

  return (
    <div className={cn('shopee-variant-selector-root', className)} style={{ marginBottom: '18px' }}>
      {/* Container: Cột nhãn bên trái + Lưới nút phân loại bên phải chuẩn Shopee */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        {/* Nhãn trục (Phân Loại Màu) - đồng bộ chuẩn xác 110px với hàng Số Lượng */}
        <div style={{ width: '110px', minWidth: '110px', flexShrink: 0, height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '13px', color: '#757575', fontWeight: 400, userSelect: 'none' }}>
            {axisLabel}
          </span>
          {/* Nút thử AR trên mobile */}
          {isVtoSupported && onOpenTryOn && (
            <button
              type="button"
              onClick={() => onOpenTryOn(activeNormalized?.raw || activeNormalized)}
              className="sm:hidden inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-[#e05370] bg-[#fff0f3] border border-[#FFABB9]/50"
            >
              <Sparkles className="w-3 h-3 text-[#e05370]" />
              <span>Thử AR</span>
            </button>
          )}
        </div>

        {/* Danh sách các nút phân loại chuẩn Shopee Mall */}
        <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
          {normalizedVariants.map((norm) => {
            const isSelected = activeNormalized?.skuCode === norm.skuCode;
            // Clean up title (ví dụ: '#4 Đỏ Ruby' -> 'Đỏ Ruby') để chuẩn xác như ảnh mẫu
            const cleanTitle = norm.title ? norm.title.replace(/^#\d+\s*/, '') : '';

            return (
              <button
                key={norm.skuCode}
                type="button"
                disabled={!norm.isAvailable}
                onClick={() => norm.isAvailable && handleSelect(norm)}
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  height: '38px',
                  minHeight: '38px',
                  padding: '0 12px',
                  borderRadius: '2px',
                  border: isSelected ? '1px solid #FFABB9' : '1px solid #e5e7eb',
                  background: isSelected ? 'rgba(255, 171, 185, 0.08)' : '#ffffff',
                  color: isSelected ? '#e05370' : !norm.isAvailable ? '#d1d5db' : '#222222',
                  fontSize: '13px',
                  fontWeight: 400,
                  cursor: !norm.isAvailable ? 'not-allowed' : 'pointer',
                  opacity: !norm.isAvailable ? 0.6 : 1,
                  userSelect: 'none',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                  transition: 'border-color 120ms ease, color 120ms ease'
                }}
                onMouseEnter={(e) => {
                  if (norm.isAvailable && !isSelected) {
                    e.currentTarget.style.borderColor = '#FFABB9';
                    e.currentTarget.style.color = '#e05370';
                  }
                }}
                onMouseLeave={(e) => {
                  if (norm.isAvailable && !isSelected) {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.color = '#222222';
                  }
                }}
                title={!norm.isAvailable ? `${cleanTitle} (Tạm hết hàng)` : `${cleanTitle} - ${norm.price.toLocaleString('vi-VN')} đ`}
              >
                {/* Miniature Thumbnail Swatch chuẩn Shopee: cố định kích thước 24x24px không bao giờ vỡ layout */}
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    minWidth: '24px',
                    minHeight: '24px',
                    maxWidth: '24px',
                    maxHeight: '24px',
                    flexShrink: 0,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#ffffff'
                  }}
                >
                  {norm.thumbImg ? (
                    <img
                      src={norm.thumbImg}
                      alt={cleanTitle}
                      style={{
                        width: '24px',
                        height: '24px',
                        maxWidth: '24px',
                        maxHeight: '24px',
                        objectFit: 'contain',
                        display: 'block',
                        flexShrink: 0,
                        opacity: !norm.isAvailable ? 0.35 : 1,
                        filter: !norm.isAvailable ? 'grayscale(100%)' : 'none'
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling;
                        if (fallback) fallback.style.display = 'block';
                      }}
                    />
                  ) : null}
                  {norm.hexColor && (
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '2px',
                        border: '1px solid rgba(0,0,0,0.1)',
                        display: norm.thumbImg ? 'none' : 'block',
                        backgroundColor: norm.hexColor,
                        opacity: !norm.isAvailable ? 0.35 : 1
                      }}
                    />
                  )}
                </div>

                {/* Tên sắc thái / biến thể */}
                <span style={{ whiteSpace: 'nowrap', lineHeight: 1 }}>
                  {cleanTitle}
                </span>

                {/* Shopee Signature Corner Triangle with Checkmark khi được chọn */}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '12px',
                      height: '12px',
                      overflow: 'hidden',
                      pointerEvents: 'none'
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 0,
                        height: 0,
                        borderBottom: '12px solid #FFABB9',
                        borderLeft: '12px solid transparent'
                      }}
                    />
                    <Check
                      size={9}
                      strokeWidth={3.5}
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        color: '#ffffff',
                        transform: 'translate(-0.5px, -0.5px)'
                      }}
                    />
                  </div>
                )}
              </button>
            );
          })}

          {/* Nút thử AR trên Desktop */}
          {isVtoSupported && onOpenTryOn && (
            <button
              type="button"
              onClick={() => onOpenTryOn(activeNormalized?.raw || activeNormalized)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                height: '38px',
                padding: '0 12px',
                borderRadius: '2px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#e05370',
                background: '#fff0f3',
                border: '1px solid rgba(255, 171, 185, 0.5)',
                cursor: 'pointer'
              }}
              title="Thử trực tiếp màu này trên gương AR MediaPipe 3D"
            >
              <Sparkles size={14} style={{ color: '#e05370' }} />
              <span>Thử Màu AR</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
