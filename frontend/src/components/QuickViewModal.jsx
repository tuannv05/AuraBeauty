import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Star, ShoppingBag, ShieldCheck, Check, Bell } from 'lucide-react';
import VariantColorPicker from './VariantColorPicker';

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  onViewFullDetail,
  onPrevProduct,
  onNextProduct,
  onAddToast
}) {
  if (!product) return null;

  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    () => product.variants?.[0] || {
      skuCode: `${product.id}-STD`,
      name: product.name,
      price: product.price || 0,
      originalPrice: product.originalPrice || null,
      onHand: product.inStock === false ? 0 : 120
    }
  );
  const [quantity, setQuantity] = useState(1);

  React.useEffect(() => {
    setActiveImgIdx(0);
    setSelectedVariant(
      product.variants?.[0] || {
        skuCode: `${product.id}-STD`,
        name: product.name,
        price: product.price || 0,
        originalPrice: product.originalPrice || null,
        onHand: product.inStock === false ? 0 : 120
      }
    );
    setQuantity(1);
  }, [product?.id]);

  const images = product.images || [
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'
  ];

  const isProductInStock = product.inStock !== false;
  const stockCount = (isProductInStock && selectedVariant?.inStock !== false)
    ? (selectedVariant?.onHand ?? selectedVariant?.stock ?? 120)
    : 0;
  const isAvailable = stockCount > 0;

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    const stock = variant.onHand ?? variant.stock ?? 120;
    if (quantity > stock && stock > 0) {
      setQuantity(stock);
    }
    const sku = variant.skuCode || variant.sku;
    if (sku) {
      const skuImg = `/products/${sku}.jpg`;
      const foundIdx = images.findIndex((img) => img === skuImg || img.includes(sku));
      if (foundIdx !== -1) {
        setActiveImgIdx(foundIdx);
      }
    }
  };

  const handleAdd = () => {
    if (!isAvailable) {
      onAddToast({ type: 'warning', message: 'Phân loại này tạm hết hàng. Chúng tôi sẽ thông báo khi có hàng lại!' });
      return;
    }
    onAddToCart(product, selectedVariant, quantity);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '880px',
          maxWidth: '94vw',
          padding: 0,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            background: 'var(--canvas-soft)',
            color: 'var(--ink)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {/* Prev / Next buttons */}
        {onPrevProduct && (
          <button
            onClick={onPrevProduct}
            style={{
              position: 'absolute',
              top: '50%',
              left: '12px',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: 'rgba(255, 255, 255, 0.85)',
              color: 'var(--ink)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)'
            }}
            title="Sản phẩm trước"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {onNextProduct && (
          <button
            onClick={onNextProduct}
            style={{
              position: 'absolute',
              top: '50%',
              right: '12px',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: 'rgba(255, 255, 255, 0.85)',
              color: 'var(--ink)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)'
            }}
            title="Sản phẩm tiếp theo"
          >
            <ChevronRight size={20} />
          </button>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {/* Left: Gallery */}
          <div style={{ padding: '24px', background: 'var(--canvas-soft)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '340px', aspectRatio: '1 / 1', overflow: 'hidden', borderRadius: 'var(--radius-md)', background: '#ffffff', marginBottom: '14px' }}>
              <img
                src={images[activeImgIdx]}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }}
              />
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIdx(idx)}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: activeImgIdx === idx ? '2px solid var(--ink)' : '1px solid var(--hairline)',
                      opacity: activeImgIdx === idx ? 1 : 0.6
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Actions */}
          <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {product.brand}
                </span>
                <span className="badge-pill badge-green" style={{ fontSize: '10px' }}>
                  <ShieldCheck size={11} /> Chính hãng 100%
                </span>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.35, marginBottom: '8px' }}>
                {product.name}
              </h3>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', color: '#f59e0b' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#f59e0b" />
                  ))}
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>{product.rating || 4.9}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>({product.reviewCount || 128} đánh giá)</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>· Đã bán {product.soldCount || 1200}</span>
              </div>

              {/* Pricing */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontSize: '24px', fontWeight: 750, color: 'var(--ink)' }}>
                  {(selectedVariant?.price ?? product.price ?? 0).toLocaleString('vi-VN')} đ
                </span>
                {(selectedVariant?.originalPrice || product.originalPrice) && (
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    {(selectedVariant?.originalPrice || product.originalPrice).toLocaleString('vi-VN')} đ
                  </span>
                )}
                {(selectedVariant?.originalPrice || product.originalPrice) && (
                  <span className="badge-pill badge-sale">
                    -{Math.round((((selectedVariant?.originalPrice || product.originalPrice) - (selectedVariant?.price || product.price)) / (selectedVariant?.originalPrice || product.originalPrice)) * 100)}%
                  </span>
                )}
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '18px' }}>
                {product.description}
              </p>

              {/* Upgraded Variant & Color Picker System */}
              <div style={{ marginBottom: '18px' }}>
                <VariantColorPicker
                  compact
                  product={product}
                  selectedVariant={selectedVariant}
                  onSelectVariant={handleVariantChange}
                />
              </div>

              {/* Quantity Stepper */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
                <span style={{ fontSize: '13px', color: '#757575', fontWeight: 500, width: '80px' }}>Số Lượng:</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '2px', background: '#ffffff', overflow: 'hidden' }}>
                  <button
                    type="button"
                    disabled={!isAvailable || quantity <= 1}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '15px',
                      color: !isAvailable || quantity <= 1 ? '#d1d5db' : '#374151',
                      border: 'none',
                      borderRight: '1px solid #e5e7eb',
                      background: '#ffffff',
                      cursor: !isAvailable || quantity <= 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    readOnly
                    value={!isAvailable ? 0 : quantity}
                    style={{
                      width: '42px',
                      height: '28px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#111827',
                      border: 'none',
                      background: '#ffffff',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    disabled={!isAvailable || quantity >= stockCount}
                    onClick={() => setQuantity(quantity + 1)}
                    style={{
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '15px',
                      color: !isAvailable || quantity >= stockCount ? '#d1d5db' : '#374151',
                      border: 'none',
                      borderLeft: '1px solid #e5e7eb',
                      background: '#ffffff',
                      cursor: !isAvailable || quantity >= stockCount ? 'not-allowed' : 'pointer'
                    }}
                  >
                    +
                  </button>
                </div>
                <span style={{ fontSize: '12px', color: '#757575' }}>
                  {isAvailable ? `${stockCount} sản phẩm có sẵn` : <span style={{ color: '#ef4444', fontWeight: 600 }}>Tạm hết hàng</span>}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                {isAvailable ? (
                  <button
                    onClick={handleAdd}
                    style={{
                      flex: 1,
                      height: '44px',
                      borderRadius: '3px',
                      border: '1px solid #ee4d2d',
                      background: 'rgba(238, 77, 45, 0.08)',
                      color: '#ee4d2d',
                      fontSize: '14px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <ShoppingBag size={17} /> Thêm Vào Giỏ Hàng
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onAddToast({ type: 'info', message: `Đã đăng ký nhận thông báo cho phân loại "${selectedVariant?.name || selectedVariant?.title || ''}"!` });
                      onClose();
                    }}
                    style={{
                      flex: 1,
                      height: '44px',
                      borderRadius: '3px',
                      border: '1px solid #ee4d2d',
                      background: 'rgba(238, 77, 45, 0.08)',
                      color: '#ee4d2d',
                      fontSize: '13px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <Bell size={16} /> Nhận thông báo khi có hàng
                  </button>
                )}
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => { onClose(); onViewFullDetail(product); }}
                  style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'underline' }}
                >
                  Xem chi tiết đầy đủ sản phẩm →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
