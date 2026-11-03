import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { MOCK_PRODUCTS } from '../api';

const FREE_SHIPPING_THRESHOLD = 299000;

export default function MiniCartDrawer({
  isOpen,
  onClose,
  cart,
  setCart,
  onOpenFullCart,
  onCheckout,
  onAddToast,
  onSelectProduct
}) {
  const [confirmDeleteSku, setConfirmDeleteSku] = useState(null);
  const [stockWarningSku, setStockWarningSku] = useState(null);

  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShipRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const freeShipPercent = Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100));

  const handleUpdateQuantity = (item, delta) => {
    setStockWarningSku(null);
    if (delta > 0) {
      // Find product to check stock
      const prod = MOCK_PRODUCTS.find((p) => p.id === item.productId);
      const variant = prod?.variants?.find((v) => (v.skuCode || v.sku) === item.variantSku);
      const maxStock = variant?.onHand ?? variant?.stock ?? 120;

      if (item.quantity + delta > maxStock) {
        setStockWarningSku(item.variantSku);
        setTimeout(() => setStockWarningSku(null), 3000);
        return;
      }

      setCart(
        cart.map((i) =>
          i.variantSku === item.variantSku ? { ...i, quantity: i.quantity + delta } : i
        )
      );
    } else if (delta < 0) {
      if (item.quantity === 1) {
        setConfirmDeleteSku(item.variantSku);
      } else {
        setCart(
          cart.map((i) =>
            i.variantSku === item.variantSku ? { ...i, quantity: i.quantity + delta } : i
          )
        );
      }
    }
  };

  const handleDeleteItem = (itemToDelete) => {
    const backupItem = { ...itemToDelete };
    setCart(cart.filter((i) => i.variantSku !== itemToDelete.variantSku));
    setConfirmDeleteSku(null);

    // Toast with Undo action in 5 seconds
    onAddToast({
      type: 'warning',
      message: `Đã xóa "${itemToDelete.productName.slice(0, 24)}..." khỏi giỏ hàng.`,
      action: {
        label: 'Hoàn tác',
        onClick: () => {
          setCart((prev) => [...prev, backupItem]);
          onAddToast({ type: 'success', message: 'Đã hoàn tác khôi phục sản phẩm vào giỏ!' });
        }
      }
    });
  };

  const handleAddUpsell = (prod) => {
    const v = prod.variants?.[0] || {};
    const vSku = v.skuCode || v.sku || `${prod.id}-STD`;
    const existing = cart.find((i) => i.variantSku === vSku);
    if (existing) {
      setCart(cart.map((i) => (i.variantSku === vSku ? { ...i, quantity: i.quantity + 1 } : i)));
    } else {
      setCart([
        ...cart,
        {
          productId: prod.id,
          variantSku: vSku,
          skuCode: vSku,
          shopId: prod.shopId,
          productName: prod.name,
          variantTitle: v.name || v.title || 'Tiêu chuẩn',
          price: v.price || prod.price || 0,
          quantity: 1,
          image: prod.images?.[0] || prod.image || '/products/PROD-CRW-001.jpg',
          hexColor: v.attributes?.Hex || v.attributes?.color || null,
          finishType: v.attributes?.Finish || null
        }
      ]);
    }
    onAddToast({ type: 'success', message: `Đã thêm nhanh ${prod.name.slice(0, 22)}...` });
  };

  // 2 Upsell suggestions from Mock Products not currently in cart
  const upsellItems = MOCK_PRODUCTS.filter((p) => !cart.some((c) => c.productId === p.id)).slice(0, 2);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="drawer-right" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--hairline)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--canvas)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} />
            <h3 style={{ fontSize: '16px', fontWeight: 650 }}>
              Giỏ Hàng ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Free shipping progress bar */}
        <div style={{ padding: '12px 20px', background: 'var(--canvas-soft)', borderBottom: '1px solid var(--hairline)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontSize: '12px', fontWeight: 500 }}>
            {freeShipRemaining === 0 ? (
              <>
                <CheckCircle2 size={16} style={{ color: '#10b981' }} />
                <span style={{ color: '#059669', fontWeight: 600 }}>🎉 Bạn đã được Miễn phí vận chuyển toàn quốc!</span>
              </>
            ) : (
              <>
                <Truck size={16} style={{ color: 'var(--ink)' }} />
                <span>
                  Mua thêm <strong style={{ color: '#f43f5e' }}>{freeShipRemaining.toLocaleString('vi-VN')} đ</strong> để được Miễn phí ship
                </span>
              </>
            )}
          </div>

          <div style={{ width: '100%', height: '6px', background: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${freeShipPercent}%`,
                height: '100%',
                background: freeShipRemaining === 0 ? '#10b981' : '#141414',
                transition: 'width 300ms ease'
              }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--canvas-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}
              >
                <ShoppingBag size={28} style={{ color: 'var(--text-faint)' }} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>Giỏ hàng của bạn đang trống</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Hàng ngàn mỹ phẩm chính hãng đang chờ bạn khám phá.
              </p>
              <button
                onClick={onClose}
                className="btn-pill-primary"
                style={{ fontSize: '13px', padding: '8px 24px', margin: '0 auto' }}
              >
                Khám phá sản phẩm
              </button>

              {/* Best sellers recommendation */}
              <div style={{ marginTop: '36px', textAlign: 'left' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Sản phẩm bán chạy gợi ý:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {MOCK_PRODUCTS.slice(0, 3).map((prod) => (
                    <div
                      key={prod.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px',
                        border: '1px solid var(--hairline-soft)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flex: 1 }}
                        onClick={() => { onSelectProduct(prod); onClose(); }}
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'contain', background: '#f8fafc', padding: '2px' }}
                        />
                        <div>
                          <p style={{ fontSize: '12px', fontWeight: 600, lineClamp: 1, WebkitLineClamp: 1, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {prod.name}
                          </p>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)' }}>
                            {prod.variants[0].price.toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddUpsell(prod)}
                        className="btn-pill-soft"
                        style={{ padding: '4px 10px', fontSize: '11px', flexShrink: 0 }}
                      >
                        + Thêm
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {cart.map((item) => {
                const isConfirming = confirmDeleteSku === item.variantSku;
                const isWarning = stockWarningSku === item.variantSku;

                return (
                  <div
                    key={item.variantSku}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      paddingBottom: '14px',
                      borderBottom: '1px solid var(--hairline-soft)',
                      position: 'relative'
                    }}
                  >
                    {/* Square Image 64px */}
                    <img
                      src={
                        item.image ||
                        MOCK_PRODUCTS.find((p) => p.id === item.productId)?.images?.[0] ||
                        '/products/PROD-CRW-001.jpg'
                      }
                      alt={item.productName}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: 'var(--radius-sm)',
                        objectFit: 'contain',
                        background: '#f8fafc',
                        padding: '4px',
                        border: '1px solid var(--hairline-soft)'
                      }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          lineHeight: 1.35,
                          marginBottom: '4px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {item.productName}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span className="badge-pill badge-neutral" style={{ fontSize: '11px', padding: '1px 8px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          {item.hexColor && (
                            <span
                              style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: item.hexColor,
                                display: 'inline-block',
                                border: '1px solid rgba(0,0,0,0.15)'
                              }}
                            />
                          )}
                          <span>{item.variantTitle}</span>
                        </span>
                        <span style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>
                          [{item.variantSku || item.skuCode}]
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700 }}>
                          {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                        </span>

                        {/* Quantity Stepper */}
                        {isConfirming ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fee2e2', padding: '2px 6px', borderRadius: '6px' }}>
                            <span style={{ fontSize: '11px', color: '#b91c1c' }}>Xóa?</span>
                            <button
                              onClick={() => handleDeleteItem(item)}
                              style={{ color: '#b91c1c', fontWeight: 700, fontSize: '11px', padding: '2px' }}
                            >
                              Có
                            </button>
                            <button
                              onClick={() => setConfirmDeleteSku(null)}
                              style={{ color: '#4b5563', fontSize: '11px', padding: '2px' }}
                            >
                              Giữ
                            </button>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              border: isWarning ? '1px solid #ef4444' : '1px solid var(--hairline)',
                              borderRadius: 'var(--radius-full)',
                              background: 'var(--canvas-soft)',
                              padding: '2px 4px'
                            }}
                          >
                            <button
                              onClick={() => handleUpdateQuantity(item, -1)}
                              style={{ padding: '2px 6px', color: 'var(--ink)' }}
                              title="Giảm"
                            >
                              <Minus size={13} />
                            </button>
                            <span style={{ fontSize: '12px', fontWeight: 650, minWidth: '20px', textAlign: 'center' }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item, 1)}
                              style={{ padding: '2px 6px', color: 'var(--ink)' }}
                              title="Tăng"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Stock Warning message */}
                      {isWarning && (
                        <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <AlertCircle size={12} /> Số lượng đã đạt giới hạn tồn kho
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Upsell / Frequently bought together */}
              {upsellItems.length > 0 && (
                <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px dashed var(--hairline)' }}>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px' }}>
                    Thường được mua cùng:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {upsellItems.map((prod) => (
                      <div
                        key={prod.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 10px',
                          background: 'var(--canvas-soft)',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'contain', background: '#f8fafc', padding: '2px' }}
                          />
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {prod.name}
                            </p>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              {prod.variants[0].price.toLocaleString('vi-VN')} đ
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddUpsell(prod)}
                          className="btn-pill-soft"
                          style={{ padding: '4px 8px', fontSize: '11px', background: '#ffffff', flexShrink: 0 }}
                        >
                          + Thêm
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fixed Footer */}
        {cart.length > 0 && (
          <div
            style={{
              padding: '16px 20px',
              borderTop: '1px solid var(--hairline)',
              background: 'var(--canvas)',
              boxShadow: '0 -4px 16px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Tạm tính ({cart.reduce((s, i) => s + i.quantity, 0)} món):</span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)' }}>
                {total.toLocaleString('vi-VN')} đ
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { onClose(); onOpenFullCart(); }}
                className="btn-pill-outline"
                style={{ flex: 1, fontSize: '13px', padding: '10px 14px' }}
              >
                Xem giỏ hàng
              </button>
              <button
                onClick={() => { onClose(); onCheckout(); }}
                className="btn-pill-primary"
                style={{ flex: 1, fontSize: '13px', padding: '10px 14px' }}
              >
                Thanh toán ngay <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
