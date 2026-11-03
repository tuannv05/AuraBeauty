import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, Copy, Clock, ArrowRight, ShieldCheck, ShoppingBag,
  ExternalLink, Check
} from 'lucide-react';

export default function OrderResultView({
  orderData,
  onNavigateTracking,
  onNavigateHome,
  onAddToast
}) {
  const [copiedField, setCopiedField] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(1799); // 30 mins

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    onAddToast({ type: 'success', message: `Đã sao chép ${fieldName} vào bộ nhớ tạm!` });
    setTimeout(() => setCopiedField(null), 2500);
  };

  const isQrPayment = orderData?.paymentMethod === 'QR';

  return (
    <div style={{ maxWidth: '780px', margin: '32px auto', paddingBottom: '60px' }}>
      {/* Success Celebration Card */}
      <div className="squircle-card" style={{ padding: '40px 32px', textAlign: 'center', marginBottom: '24px' }}>
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: '#ecfdf5',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            animation: 'scaleUp 300ms ease'
          }}
        >
          <CheckCircle2 size={42} />
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>Đặt Hàng Thành Công!</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 20px' }}>
          Cảm ơn bạn đã lựa chọn mua sắm tại Aura Beauty Mall. Email xác nhận đơn hàng cùng chi tiết bảo hành chính hãng đã được gửi đến hộp thư của bạn.
        </p>

        {/* Order ID with Copy button */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: 'var(--canvas-soft)',
            padding: '10px 20px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--hairline)',
            marginBottom: '28px'
          }}
        >
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Mã đơn hàng:</span>
          <strong style={{ fontSize: '16px', letterSpacing: '0.05em' }}>{orderData?.orderId || 'ORD-982341'}</strong>
          <button
            onClick={() => handleCopy(orderData?.orderId || 'ORD-982341', 'Mã đơn')}
            style={{ color: 'var(--accent)', display: 'flex', padding: '2px' }}
            title="Sao chép"
          >
            {copiedField === 'Mã đơn' ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

        {/* QR Bank Transfer Section (if applicable) */}
        {isQrPayment && (
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              textAlign: 'left',
              marginBottom: '28px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>📱</span>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#166534' }}>
                  Chuyển Khoản Ngân Hàng Qua Mã VietQR Tự Động
                </h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#b91c1c', fontWeight: 650 }}>
                <Clock size={15} /> Giữ đơn trong: <strong>{formatCountdown(secondsLeft)}</strong>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', alignItems: 'center' }}>
              {/* Dynamic QR image */}
              <div style={{ textAlign: 'center' }}>
                <img
                  src={orderData?.bankInfo?.qrUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=VietQRDemo'}
                  alt="Mã VietQR"
                  style={{
                    width: '180px',
                    height: '180px',
                    borderRadius: '12px',
                    border: '1px solid #86efac',
                    boxShadow: 'var(--shadow-sm)',
                    margin: '0 auto'
                  }}
                />
                <p style={{ fontSize: '11px', color: '#166534', marginTop: '6px' }}>Quét bằng app ngân hàng bất kỳ</p>
              </div>

              {/* Bank Details Table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: '#4b5563', fontSize: '12px' }}>Ngân hàng thụ hưởng:</span>
                  <p style={{ fontWeight: 650 }}>{orderData?.bankInfo?.bankName || 'MB Bank'}</p>
                </div>

                <div>
                  <span style={{ color: '#4b5563', fontSize: '12px' }}>Số tài khoản:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '15px' }}>{orderData?.bankInfo?.accountNumber || '999988886666'}</strong>
                    <button
                      onClick={() => handleCopy(orderData?.bankInfo?.accountNumber || '999988886666', 'Số tài khoản')}
                      style={{ color: '#0066ff' }}
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </div>

                <div>
                  <span style={{ color: '#4b5563', fontSize: '12px' }}>Số tiền chính xác:</span>
                  <p style={{ fontSize: '16px', fontWeight: 750, color: '#15803d' }}>
                    {(orderData?.finalTotal || orderData?.totalAmount || 0).toLocaleString('vi-VN')} đ
                  </p>
                </div>

                <div>
                  <span style={{ color: '#4b5563', fontSize: '12px' }}>Nội dung chuyển tiền:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <code style={{ background: '#dcfce7', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                      {orderData?.bankInfo?.transferContent || 'AURA ORD-982341'}
                    </code>
                    <button
                      onClick={() => handleCopy(orderData?.bankInfo?.transferContent || 'AURA ORD-982341', 'Nội dung')}
                      style={{ color: '#0066ff' }}
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => onAddToast({ type: 'success', message: 'Hệ thống đã nhận yêu cầu và đang tự động đối soát giao dịch!' })}
                  className="btn-pill-primary"
                  style={{ background: '#15803d', marginTop: '10px', fontSize: '13px', padding: '8px 16px' }}
                >
                  Tôi đã chuyển khoản thành công
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Briefing */}
        <div style={{ textAlign: 'left', borderTop: '1px solid var(--hairline)', paddingTop: '20px', marginBottom: '28px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Thông Tin Giao Hàng & Đơn Vị Vận Chuyển</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', fontSize: '13px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Người nhận:</span>
              <p style={{ fontWeight: 600 }}>{orderData?.recipientName || 'Nguyễn Văn Mua'} ({orderData?.phone || '0901234567'})</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Địa chỉ nhận hàng:</span>
              <p style={{ fontWeight: 600 }}>{orderData?.shippingAddress || 'TP. Hồ Chí Minh'}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Đơn vị vận chuyển:</span>
              <p style={{ fontWeight: 600 }}>{orderData?.carrierName || 'Giao Hàng Tiết Kiệm (GHTK)'}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Mã vận đơn:</span>
              <p style={{ fontWeight: 600, color: 'var(--accent)' }}>{orderData?.trackingNumber || 'GHTK-98234190'}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigateTracking(orderData?.orderId, orderData?.phone)}
            className="btn-pill-outline"
            style={{ padding: '12px 28px', fontSize: '14px' }}
          >
            📦 Theo dõi lộ trình đơn hàng
          </button>
          <button
            onClick={onNavigateHome}
            className="btn-pill-primary"
            style={{ padding: '12px 28px', fontSize: '14px' }}
          >
            Tiếp tục mua sắm <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
