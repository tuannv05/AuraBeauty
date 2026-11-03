import React, { useState } from 'react';
import {
  Trash2, Heart, Plus, Minus, ArrowRight, Truck, CheckCircle2,
  Ticket, AlertCircle, ShoppingBag, X, Check
} from 'lucide-react';
import { MOCK_VOUCHERS, MOCK_PRODUCTS } from '../api';

const FREE_SHIPPING_THRESHOLD = 299000;

export default function CartView({
  cart,
  setCart,
  onProceedCheckout,
  onSelectProduct,
  onNavigateHome,
  onAddToast
}) {
  const [selectedSkus, setSelectedSkus] = useState(cart.map((i) => i.variantSku));
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherInput, setVoucherInput] = useState('');
  const [isVoucherDrawerOpen, setIsVoucherDrawerOpen] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');

  // Selected items calculation
  const selectedItems = cart.filter((i) => selectedSkus.includes(i.variantSku));
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Voucher calculation
  let voucherDiscount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.discountAmount) {
      voucherDiscount = appliedVoucher.discountAmount;
    } else if (appliedVoucher.discountPercent) {
      voucherDiscount = Math.round((subtotal * appliedVoucher.discountPercent) / 100);
    }
  }

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 30000;
  const grandTotal = Math.max(0, subtotal - voucherDiscount + shippingFee);
  const earnedPoints = Math.round(grandTotal / 1000);

  const freeShipRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShipPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleToggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedSkus(cart.map((i) => i.variantSku));
    } else {
      setSelectedSkus([]);
    }
  };

  const handleToggleSelectItem = (sku) => {
    if (selectedSkus.includes(sku)) {
      setSelectedSkus(selectedSkus.filter((s) => s !== sku));
    } else {
      setSelectedSkus([...selectedSkus, sku]);
    }
  };

  const handleUpdateQty = (sku, delta) => {
    setCart(
      cart.map((i) => {
        if (i.variantSku === sku) {
          const next = i.quantity + delta;
          return next > 0 ? { ...i, quantity: next } : i;
        }
        return i;
      })
    );
  };

  const handleDeleteItem = (itemToDelete) => {
    const backupItem = { ...itemToDelete };
    setCart(cart.filter((i) => i.variantSku !== itemToDelete.variantSku));
    setSelectedSkus(selectedSkus.filter((s) => s !== itemToDelete.variantSku));

    onAddToast({
      type: 'warning',
      message: `Đã xóa "${itemToDelete.productName.slice(0, 24)}..."`,
      action: {
        label: 'Hoàn tác',
        onClick: () => {
          setCart((prev) => [...prev, backupItem]);
          setSelectedSkus((prev) => [...prev, backupItem.variantSku]);
          onAddToast({ type: 'success', message: 'Đã hoàn tác khôi phục sản phẩm!' });
        }
      }
    });
  };

  const handleDeleteSelected = () => {
    if (selectedSkus.length === 0) return;
    const count = selectedSkus.length;
    setCart(cart.filter((i) => !selectedSkus.includes(i.variantSku)));
    setSelectedSkus([]);
    onAddToast({ type: 'warning', message: `Đã xóa ${count} sản phẩm đã chọn khỏi giỏ hàng.` });
  };

  const handleApplyVoucherCode = (codeToApply) => {
    const code = codeToApply || voucherInput;
    const found = MOCK_VOUCHERS.find((v) => v.code.toUpperCase() === code.trim().toUpperCase());

    if (!found) {
      onAddToast({ type: 'error', message: 'Mã voucher không tồn tại hoặc đã hết hạn.' });
      return;
    }

    if (subtotal < found.minOrderAmount) {
      onAddToast({
        type: 'warning',
        message: `Mã ${found.code} yêu cầu đơn hàng tối thiểu ${found.minOrderAmount.toLocaleString('vi-VN')} đ.`
      });
      return;
    }

    setAppliedVoucher(found);
    setIsVoucherDrawerOpen(false);
    setVoucherInput('');
    onAddToast({ type: 'success', message: `Áp dụng thành công mã voucher [${found.code}]!` });
  };

  return (
    <div style={{ marginTop: '20px', paddingBottom: '40px' }}>
      <h2 style={{ fontSize: '26px', fontWeight: 750, marginBottom: '24px' }}>
        Giỏ Hàng Của Bạn ({cart.reduce((s, i) => s + i.quantity, 0)} sản phẩm)
      </h2>

      {cart.length === 0 ? (
        <div className="squircle-card" style={{ padding: '64px 24px', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--canvas-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <ShoppingBag size={36} style={{ color: 'var(--text-faint)' }} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Giỏ hàng chưa có sản phẩm nào</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Hãy lướt qua hàng trăm thương hiệu mỹ phẩm chính hãng và chọn món đồ bạn yêu thích nhé!
          </p>
          <button onClick={onNavigateHome} className="btn-pill-primary" style={{ padding: '12px 32px' }}>
            Tiếp tục mua sắm ngay
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
          {/* Left Column (65%): Product List */}
          <div style={{ flex: '1.8' }}>
            {/* Free shipping progress bar */}
            <div className="squircle-card" style={{ padding: '18px 24px', background: 'var(--canvas-soft)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>
                {freeShipRemaining === 0 ? (
                  <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} /> Đơn hàng của bạn đã đủ điều kiện Miễn phí vận chuyển toàn quốc!
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Truck size={16} /> Mua thêm <strong style={{ color: '#f43f5e' }}>{freeShipRemaining.toLocaleString('vi-VN')} đ</strong> để được Miễn phí vận chuyển
                  </span>
                )}
                <span>{freeShipPercent}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: `${freeShipPercent}%`, height: '100%', background: freeShipRemaining === 0 ? '#10b981' : '#141414', transition: 'width 250ms ease' }} />
              </div>
            </div>

            {/* List Controls: Select All & Batch Delete */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', background: 'var(--canvas-soft)', borderRadius: 'var(--radius-sm)', marginBottom: '14px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectedSkus.length === cart.length && cart.length > 0}
                  onChange={handleToggleSelectAll}
                  style={{ width: '16px', height: '16px' }}
                />
                Chọn tất cả ({cart.length} món)
              </label>

              {selectedSkus.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  style={{ fontSize: '12px', color: '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Trash2 size={14} /> Xóa đã chọn ({selectedSkus.length})
                </button>
              )}
            </div>

            {/* Item Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {cart.map((item) => {
                const isChecked = selectedSkus.includes(item.variantSku);

                return (
                  <div
                    key={item.variantSku}
                    className="squircle-card"
                    style={{
                      padding: '18px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      border: isChecked ? '1px solid var(--hairline-strong)' : '1px solid var(--hairline-soft)'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleSelectItem(item.variantSku)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />

                    <img
                      src={
                        item.image ||
                        MOCK_PRODUCTS.find((p) => p.id === item.productId)?.images?.[0] ||
                        '/products/PROD-CRW-001.jpg'
                      }
                      alt={item.productName}
                      style={{ width: '72px', height: '72px', borderRadius: 'var(--radius-sm)', objectFit: 'contain', background: '#f8fafc', padding: '4px' }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4
                        style={{
                          fontSize: '14px',
                          fontWeight: 650,
                          lineHeight: 1.35,
                          marginBottom: '4px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {item.productName}
                      </h4>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
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
                          <span>Phân loại: {item.variantTitle}</span>
                        </span>
                        <span style={{ fontSize: '10.5px', color: '#94a3b8', fontFamily: 'monospace' }}>
                          [{item.variantSku || item.skuCode}]
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 750, color: 'var(--ink)' }}>
                          {item.price.toLocaleString('vi-VN')} đ
                        </span>
                      </div>
                    </div>

                    {/* Stepper */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--hairline)', borderRadius: 'var(--radius-full)', background: 'var(--canvas-soft)', padding: '2px 6px' }}>
                      <button onClick={() => handleUpdateQty(item.variantSku, -1)} style={{ padding: '4px 8px' }}>
                        <Minus size={13} />
                      </button>
                      <span style={{ minWidth: '28px', textAlign: 'center', fontSize: '13px', fontWeight: 700 }}>
                        {item.quantity}
                      </span>
                      <button onClick={() => handleUpdateQty(item.variantSku, 1)} style={{ padding: '4px 8px' }}>
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Subtotal for line */}
                    <div style={{ minWidth: '90px', textAlign: 'right' }}>
                      <span style={{ fontSize: '15px', fontWeight: 750 }}>
                        {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                      </span>
                    </div>

                    {/* Delete action */}
                    <button
                      onClick={() => handleDeleteItem(item)}
                      style={{ color: 'var(--text-faint)', padding: '6px' }}
                      title="Xóa sản phẩm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (35%): Sticky Order Summary */}
          <div style={{ position: 'sticky', top: '90px', height: 'fit-content' }}>
            <div className="squircle-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '18px' }}>Tóm Tắt Đơn Hàng</h3>

              {/* Pricing breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Tạm tính ({selectedItems.length} món đã chọn):</span>
                  <span style={{ fontWeight: 600 }}>{subtotal.toLocaleString('vi-VN')} đ</span>
                </div>

                {voucherDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Ticket size={14} /> Voucher [{appliedVoucher?.code}]:
                    </span>
                    <span style={{ fontWeight: 600 }}>-{voucherDiscount.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Phí vận chuyển dự kiến:</span>
                  <span style={{ fontWeight: 600, color: shippingFee === 0 ? '#10b981' : 'var(--ink)' }}>
                    {shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')} đ`}
                  </span>
                </div>

                <div style={{ height: '1px', background: 'var(--hairline)', margin: '4px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700 }}>Tổng thanh toán:</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink)' }}>
                      {grandTotal.toLocaleString('vi-VN')} đ
                    </span>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>(Đã bao gồm VAT 8-10%)</p>
                  </div>
                </div>

                <div style={{ padding: '8px 12px', background: 'rgba(0, 102, 255, 0.05)', borderRadius: 'var(--radius-sm)', fontSize: '12px', color: '#0066ff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ✨ Tích lũy <strong>{earnedPoints} điểm thưởng</strong> sau đơn hàng này.
                </div>
              </div>

              {/* Voucher Input & Drawer trigger */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    placeholder="Nhập mã voucher (NEW10...)"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    style={{ fontSize: '13px', padding: '8px 12px' }}
                  />
                  <button
                    onClick={() => handleApplyVoucherCode()}
                    className="btn-pill-primary"
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                  >
                    Áp dụng
                  </button>
                </div>

                <button
                  onClick={() => setIsVoucherDrawerOpen(true)}
                  style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 650, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'underline' }}
                >
                  <Ticket size={14} /> Chọn mã từ Kho Voucher Aura Beauty Mall →
                </button>
              </div>

              {/* Order Notes */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: 650, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Ghi chú cho người bán & shipper (tối đa 200 ký tự):
                </label>
                <textarea
                  rows={2}
                  maxLength={200}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Ví dụ: Giao vào giờ hành chính, bọc chống sốc kỹ giúp tôi..."
                  style={{ fontSize: '13px', resize: 'none' }}
                />
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  if (selectedItems.length === 0) {
                    onAddToast({ type: 'warning', message: 'Vui lòng tích chọn ít nhất 1 sản phẩm để thanh toán.' });
                    return;
                  }
                  onProceedCheckout({
                    selectedItems,
                    subtotal,
                    voucherDiscount,
                    shippingFee,
                    grandTotal,
                    appliedVoucher,
                    orderNotes
                  });
                }}
                disabled={selectedItems.length === 0}
                className="btn-pill-primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '15px',
                  opacity: selectedItems.length === 0 ? 0.5 : 1
                }}
              >
                Tiến hành thanh toán ({selectedItems.length} món) <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voucher Drawer Modal */}
      {isVoucherDrawerOpen && (
        <div className="modal-backdrop" onClick={() => setIsVoucherDrawerOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', width: '92%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Kho Voucher & Khuyến Mãi</h3>
              <button onClick={() => setIsVoucherDrawerOpen(false)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
              {MOCK_VOUCHERS.map((v) => {
                const isEligible = subtotal >= v.minOrderAmount;
                const isCurrent = appliedVoucher?.code === v.code;

                return (
                  <div
                    key={v.code}
                    style={{
                      border: isCurrent ? '2px solid var(--ink)' : '1px solid var(--hairline)',
                      background: isEligible ? 'var(--canvas)' : 'var(--canvas-soft)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                      opacity: isEligible ? 1 : 0.65,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span className="badge-pill badge-neutral" style={{ background: 'var(--ink)', color: '#ffffff' }}>{v.code}</span>
                        <span style={{ fontSize: '12px', fontWeight: 650 }}>{v.title}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{v.description}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-faint)' }}>HSD: {v.expiry}</p>
                      {!isEligible && (
                        <p style={{ fontSize: '11px', color: '#f43f5e', marginTop: '4px', fontWeight: 600 }}>
                          Chưa đủ điều kiện: Mua thêm {(v.minOrderAmount - subtotal).toLocaleString('vi-VN')} đ
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleApplyVoucherCode(v.code)}
                      disabled={!isEligible}
                      className={isCurrent ? 'btn-pill-primary' : 'btn-pill-outline'}
                      style={{ padding: '6px 14px', fontSize: '12px', flexShrink: 0 }}
                    >
                      {isCurrent ? 'Đang dùng' : 'Áp dụng'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
