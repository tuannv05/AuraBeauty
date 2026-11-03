import React, { useState, useEffect } from 'react';
import {
  Search, Package, Truck, CheckCircle2, Clock, AlertCircle, Copy,
  ArrowRight, Phone, MessageSquare, Check, X
} from 'lucide-react';
import { lookupOrder } from '../api';

export default function OrderTrackingView({
  initialOrderId = '',
  initialPhone = '',
  onOpenSupportChat,
  onAddToast,
  onNavigateHome
}) {
  const [orderId, setOrderId] = useState(initialOrderId || '');
  const [phone, setPhone] = useState(initialPhone || '');
  const [loading, setLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState(null);
  const [searchAttempts, setSearchAttempts] = useState(0);
  
  // Return & Dispute State
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('DAMAGED');
  const [returnDetails, setReturnDetails] = useState('');
  const [returnSubmitted, setReturnSubmitted] = useState(false);
  const [disputeEscalated, setDisputeEscalated] = useState(false);

  useEffect(() => {
    if (initialOrderId) {
      handleLookup(initialOrderId, initialPhone);
    }
  }, [initialOrderId, initialPhone]);

  const handleLookup = async (idToLook, phoneToLook) => {
    const id = idToLook !== undefined ? idToLook : orderId;
    const ph = phoneToLook !== undefined ? phoneToLook : phone;

    if (!id.trim()) {
      onAddToast({ type: 'warning', message: 'Vui lòng nhập Mã đơn hàng.' });
      return;
    }

    if (searchAttempts >= 5) {
      onAddToast({ type: 'error', message: 'Bạn đã tra cứu quá 5 lần trong thời gian ngắn. Vui lòng thử lại sau 10 phút.' });
      return;
    }

    setLoading(true);
    const res = await lookupOrder(id, ph);
    setLoading(false);
    setSearchAttempts((prev) => prev + 1);

    if (res.success && res.data) {
      setTrackingResult(res.data);
    } else {
      setTrackingResult(null);
      onAddToast({ type: 'error', message: res.message || 'Không tìm thấy đơn hàng. Vui lòng kiểm tra lại thông tin!' });
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    onAddToast({ type: 'success', message: 'Đã sao chép mã vận đơn!' });
  };

  const handleCancelOrder = () => {
    onAddToast({ type: 'info', message: 'Yêu cầu hủy đơn đã được gửi đến bộ phận xử lý của gian hàng.' });
  };

  return (
    <div style={{ maxWidth: '820px', margin: '24px auto', paddingBottom: '60px' }}>
      {/* Search Header */}
      <div className="squircle-card" style={{ padding: '32px', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 750, marginBottom: '6px' }}>
          Tra Cứu Lộ Trình Đơn Hàng (Không Cần Đăng Nhập)
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Nhập Mã đơn hàng (ví dụ: ORD-882341) và Số điện thoại đã đặt hàng để kiểm tra trạng thái vận chuyển theo thời gian thực.
        </p>

        <form
          onSubmit={(e) => { e.preventDefault(); handleLookup(); }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', alignItems: 'end' }}
        >
          <div>
            <label style={{ fontSize: '12px', fontWeight: 650, display: 'block', marginBottom: '4px' }}>Mã đơn hàng *</label>
            <input
              type="text"
              placeholder="Ví dụ: ORD-882341"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 650, display: 'block', marginBottom: '4px' }}>Số điện thoại đặt hàng</label>
            <input
              type="text"
              placeholder="Ví dụ: 0901234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-pill-primary"
            style={{ padding: '10px 24px', fontSize: '14px', height: '42px' }}
          >
            <Search size={16} /> {loading ? 'Đang tra cứu...' : 'Tra cứu lộ trình'}
          </button>
        </form>
      </div>

      {/* Tracking Result View */}
      {trackingResult && (
        <div className="squircle-card" style={{ padding: '32px', animation: 'scaleUp 200ms ease' }}>
          {/* Top Order Summary */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--hairline-soft)', paddingBottom: '20px', marginBottom: '28px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 750 }}>{trackingResult.orderId}</h3>
                <span className="badge-pill badge-green">
                  {trackingResult.status === 'PAID' || trackingResult.status === 'CONFIRMED' ? 'Đã xác nhận' : 'Đang xử lý'}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Thời gian đặt: {trackingResult.orderDate}</p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Mã vận đơn:</span>
                <strong style={{ fontSize: '14px', color: 'var(--accent)' }}>{trackingResult.trackingNumber}</strong>
                <button onClick={() => handleCopy(trackingResult.trackingNumber)} style={{ color: 'var(--text-muted)' }}>
                  <Copy size={13} />
                </button>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Đơn vị vận chuyển: {trackingResult.carrierName}
              </p>
            </div>
          </div>

          {/* 13.2 Vertical Timeline (6 Mốc) */}
          <div style={{ marginBottom: '36px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px' }}>Lộ Trình Giao Hàng Chi Tiết</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative', paddingLeft: '32px' }}>
              {/* Vertical line bar */}
              <div style={{ position: 'absolute', top: '12px', bottom: '12px', left: '11px', width: '2px', background: 'var(--hairline)' }} />

              {trackingResult.timeline?.map((item, idx) => {
                const isCurrent = item.active || idx === trackingResult.currentStepIndex;
                const isPassed = item.done;

                return (
                  <div key={idx} style={{ position: 'relative', paddingBottom: '24px' }}>
                    {/* Circle icon */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '-32px',
                        top: '0',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: isCurrent ? 'var(--ink)' : isPassed ? '#10b981' : 'var(--canvas-soft)',
                        color: '#ffffff',
                        border: isCurrent ? '3px solid #60a5fa' : '2px solid #ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      {isPassed ? <Check size={13} /> : <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff' }} />}
                    </div>

                    <div>
                      <h5 style={{ fontSize: '14px', fontWeight: isCurrent ? 750 : isPassed ? 650 : 500, color: isCurrent ? 'var(--ink)' : isPassed ? 'var(--ink)' : 'var(--text-muted)' }}>
                        {item.step}
                        {isCurrent && <span className="badge-pill badge-blue" style={{ marginLeft: '8px', fontSize: '10px' }}>Hiện tại</span>}
                      </h5>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Product Items in Order */}
          <div style={{ borderTop: '1px solid var(--hairline-soft)', paddingTop: '20px', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>Sản Phẩm Trong Đơn</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {trackingResult.items?.map((it, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'var(--canvas-soft)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 650 }}>{it.productName}</p>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>SL: {it.quantity} · {it.variantTitle}</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700 }}>
                    {(it.price * it.quantity).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Address with Masked Phone */}
          <div style={{ padding: '14px', background: 'var(--canvas-soft)', borderRadius: 'var(--radius-sm)', marginBottom: '24px', fontSize: '13px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Địa chỉ nhận hàng:</span>
            <p style={{ fontWeight: 650 }}>{trackingResult.recipientName} (SĐT: {trackingResult.phone?.replace(/(\d{4})\d{3}(\d{3})/, '$1***$2')})</p>
            <p style={{ color: 'var(--text-muted)' }}>{trackingResult.shippingAddress}</p>
          </div>

          {/* Actions: Cancel / Return / Dispute */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid var(--hairline-soft)', paddingTop: '18px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {trackingResult.canCancel && (
                <button
                  onClick={handleCancelOrder}
                  className="btn-pill-soft"
                  style={{ color: '#ef4444', borderColor: '#fecaca', background: '#fef2f2' }}
                >
                  Hủy đơn hàng này
                </button>
              )}

              {/* Yêu cầu Trả hàng / Hoàn tiền */}
              {!returnSubmitted ? (
                <button
                  onClick={() => setIsReturnModalOpen(true)}
                  style={{
                    background: '#fff',
                    border: '1.5px solid #ec4899',
                    color: '#ec4899',
                    borderRadius: '9999px',
                    padding: '8px 16px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ↩ Yêu Cầu Trả Hàng / Hoàn Tiền
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#059669', background: '#ecfdf5', padding: '6px 12px', borderRadius: '9999px', fontWeight: 700 }}>
                    ✓ Đã gửi yêu cầu đổi trả tới Gian hàng
                  </span>
                  {!disputeEscalated ? (
                    <button
                      onClick={() => {
                        setDisputeEscalated(true);
                        onAddToast({ type: 'warning', message: 'Đã gửi hồ sơ khiếu nại lên Hội Đồng Trọng Tài Admin Sàn xem xét!' });
                      }}
                      style={{ background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '9999px', padding: '6px 12px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      ⚖ Khiếu nại lên Admin Sàn
                    </button>
                  ) : (
                    <span style={{ fontSize: '11px', color: '#b45309', background: '#fef3c7', padding: '6px 10px', borderRadius: '9999px', fontWeight: 700 }}>
                      ⚖ Admin đang thụ lý phân xử
                    </span>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={onOpenSupportChat}
                className="btn-pill-outline"
                style={{ fontSize: '13px' }}
              >
                <MessageSquare size={14} /> Chat hỗ trợ đơn hàng
              </button>
              <button
                onClick={onNavigateHome}
                className="btn-pill-primary"
                style={{ fontSize: '13px' }}
              >
                Về Trang Chủ
              </button>
            </div>
          </div>

          {/* Modal Yêu cầu Trả hàng / Hoàn tiền */}
          {isReturnModalOpen && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(4px)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px'
              }}
              onClick={() => setIsReturnModalOpen(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  maxWidth: '480px',
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                    Yêu Cầu Trả Hàng & Hoàn Tiền
                  </h3>
                  <button onClick={() => setIsReturnModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                    <X size={20} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                      Lý do trả hàng:
                    </label>
                    <select
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                    >
                      <option value="DAMAGED">Hàng bị vỡ hỏng / bể nắp trong quá trình vận chuyển</option>
                      <option value="WRONG_ITEM">Giao sai sản phẩm / sai dung tích hoặc màu sắc</option>
                      <option value="NEAR_EXPIRY">Sản phẩm cận date (&lt; 6 tháng hạn sử dụng)</option>
                      <option value="ALLERGY">Da bị kích ứng, mẩn đỏ sau khi test sản phẩm</option>
                      <option value="FAKE_SUSPECT">Nghi ngờ chất lượng không chính hãng</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                      Mô tả chi tiết tình trạng:
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Mô tả cụ thể để gian hàng và Admin sàn xử lý nhanh nhất..."
                      value={returnDetails}
                      onChange={(e) => setReturnDetails(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                      Minh chứng đính kèm (Ảnh chụp / Video bóc hộp):
                    </label>
                    <div style={{ border: '1.5px dashed #cbd5e1', borderRadius: '8px', padding: '14px', textAlign: 'center', background: '#f8fafc', fontSize: '12px', color: '#64748b' }}>
                      📸 <em>hinh_anh_hop_vo_hong.jpg (Đã đính kèm)</em>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsReturnModalOpen(false);
                      setReturnSubmitted(true);
                      onAddToast({ type: 'success', message: 'Đã gửi yêu cầu Trả hàng / Hoàn tiền thành công tới Thương hiệu!' });
                    }}
                    style={{
                      background: '#ec4899',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginTop: '6px'
                    }}
                  >
                    Gửi Yêu Cầu Trả Hàng
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
