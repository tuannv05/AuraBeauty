import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, Copy, Clock, ArrowRight, ShieldCheck, ShoppingBag,
  ExternalLink, Check, AlertCircle, RefreshCw, Zap
} from 'lucide-react';
import { confirmPaymentSimulation, expireOrderSimulation } from '../api';

export default function OrderResultView({
  orderData,
  onNavigateTracking,
  onNavigateHome,
  onAddToast
}) {
  const [copiedField, setCopiedField] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(orderData?.status || 'CONFIRMED');
  const [secondsLeft, setSecondsLeft] = useState(900); // 15 phút chuẩn nghiệp vụ
  const [isSimulating, setIsSimulating] = useState(false);

  const isMomo = orderData?.paymentMethod === 'MOMO';
  const isOnlinePayment = ['MOMO', 'QR', 'VIETQR', 'WALLET', 'CARD'].includes(orderData?.paymentMethod);

  // Bộ đếm ngược 15 phút cho đơn hàng chờ thanh toán
  useEffect(() => {
    if (currentStatus !== 'PENDING_PAYMENT') return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleExpireOrder();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStatus]);

  const handleExpireOrder = async () => {
    setCurrentStatus('EXPIRED');
    if (orderData?.orderId) {
      await expireOrderSimulation(orderData.orderId);
      if (onAddToast) {
        onAddToast({
          type: 'error',
          message: 'Đơn hàng đã hết hạn thanh toán (15 phút). Hệ thống đã tự động hủy và giải phóng tồn kho.'
        });
      }
    }
  };

  const handleSimulatePaymentWebhook = async () => {
    setIsSimulating(true);
    try {
      await confirmPaymentSimulation(orderData?.orderId);
      setCurrentStatus('CONFIRMED');
      if (onAddToast) {
        onAddToast({
          type: 'success',
          message: '🎉 Webhook MoMo/VietQR đã xác nhận tiền về tài khoản ký quỹ! Đơn hàng chuyển sang ĐÃ THANH TOÁN (CONFIRMED) & giữ kho CAS.'
        });
      }
    } catch (err) {
      if (onAddToast) {
        onAddToast({ type: 'error', message: 'Lỗi mô phỏng thanh toán.' });
      }
    } finally {
      setIsSimulating(false);
    }
  };

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    if (onAddToast) {
      onAddToast({ type: 'success', message: `Đã sao chép ${fieldName} vào bộ nhớ tạm!` });
    }
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div style={{ maxWidth: '780px', margin: '32px auto', paddingBottom: '60px' }}>
      {/* 1. Main Status Card */}
      <div className="squircle-card" style={{ padding: '40px 32px', textAlign: 'center', marginBottom: '24px' }}>
        
        {/* TRẠNG THÁI 1: PENDING_PAYMENT (Chờ thanh toán MoMo / VietQR) */}
        {currentStatus === 'PENDING_PAYMENT' && (
          <>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                animation: 'scaleUp 300ms ease'
              }}
            >
              <Clock size={40} />
            </div>

            <div style={{ display: 'inline-block', background: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: 800, padding: '4px 12px', borderRadius: '9999px', marginBottom: '8px', letterSpacing: '0.04em' }}>
              TRẠNG THÁI: PENDING_PAYMENT (CHỜ THANH TOÁN)
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>
              Đơn Hàng Đang Chờ Ký Quỹ Thanh Toán
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto 20px', lineHeight: 1.6 }}>
              Hệ thống đang giữ chỗ kho nguyên tử cho bạn. Vui lòng quét mã QR bên dưới để chuyển tiền vào <strong>Tài khoản Ký quỹ Sàn / Shop (Escrow)</strong> trong vòng <strong>15 phút</strong>. Sàn chỉ chuyển tiền cho người bán sau khi bạn nhận hàng thành công.
            </p>

            {/* Countdown timer pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#fee2e2',
                color: '#991b1b',
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 750,
                marginBottom: '24px',
                border: '1px solid #fecaca'
              }}
            >
              <Clock size={16} />
              Thời gian giữ đơn còn lại: <span style={{ fontSize: '16px', fontFamily: 'monospace' }}>{formatCountdown(secondsLeft)}</span>
            </div>
          </>
        )}

        {/* TRẠNG THÁI 2: EXPIRED (Hết hạn thanh toán) */}
        {currentStatus === 'EXPIRED' && (
          <>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <AlertCircle size={40} />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: '#b91c1c' }}>
              Đơn Hàng Đã Hết Hạn Thanh Toán
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 24px', lineHeight: 1.6 }}>
              Đã quá 15 phút mà hệ thống chưa nhận được tiền thanh toán. Đơn hàng đã tự động bị hủy và hoàn trả số lượng hàng vào kho để phục vụ khách hàng khác.
            </p>
          </>
        )}

        {/* TRẠNG THÁI 3: CONFIRMED / PAID (Đã đặt hàng thành công / Đã thanh toán) */}
        {currentStatus === 'CONFIRMED' && (
          <>
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

            <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>
              {isOnlinePayment ? 'Thanh Toán & Đặt Hàng Thành Công!' : 'Đặt Hàng Thành Công!'}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 20px' }}>
              {isOnlinePayment
                ? 'Tiền đã được ký quỹ an toàn vào tài khoản Sàn/Shop. Gian hàng đã nhận được thông báo và đang tiến hành đóng gói hàng giao cho bạn.'
                : 'Cảm ơn bạn đã lựa chọn mua sắm tại Aura Beauty Mall. Email xác nhận đơn hàng cùng chi tiết bảo hành chính hãng đã được gửi đến hộp thư của bạn.'}
            </p>
          </>
        )}

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
            style={{ color: 'var(--accent)', display: 'flex', padding: '2px', background: 'none', border: 'none', cursor: 'pointer' }}
            title="Sao chép"
          >
            {copiedField === 'Mã đơn' ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

        {/* QR Escrow Section (Hiển thị khi PENDING_PAYMENT hoặc phương thức online) */}
        {currentStatus === 'PENDING_PAYMENT' && isOnlinePayment && (
          <div
            style={{
              background: isMomo ? '#fdf2f8' : '#f0fdf4',
              border: `1.5px solid ${isMomo ? '#fbcfe8' : '#bbf7d0'}`,
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              textAlign: 'left',
              marginBottom: '28px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>{isMomo ? '💖' : '📱'}</span>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: isMomo ? '#be185d' : '#166534' }}>
                  {isMomo ? 'Quét Mã QR Ví MoMo (Ký Quỹ Đơn Hàng)' : 'Chuyển Khoản Ngân Hàng VietQR 24/7 (Ký Quỹ Sàn)'}
                </h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                <ShieldCheck size={14} style={{ color: '#10b981' }} /> Bảo hiểm giao dịch 100%
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', alignItems: 'center' }}>
              {/* Dynamic QR image */}
              <div style={{ textAlign: 'center' }}>
                <img
                  src={orderData?.bankInfo?.qrUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=AURA_ESCROW'}
                  alt="Mã QR Ký Quỹ"
                  style={{
                    width: '180px',
                    height: '180px',
                    borderRadius: '12px',
                    border: `1px solid ${isMomo ? '#f472b6' : '#86efac'}`,
                    boxShadow: 'var(--shadow-sm)',
                    margin: '0 auto',
                    background: '#ffffff'
                  }}
                />
                <p style={{ fontSize: '11px', color: isMomo ? '#be185d' : '#166534', marginTop: '6px', fontWeight: 600 }}>
                  {isMomo ? 'Mở app MoMo quét mã thanh toán' : 'Mở app Ngân hàng bất kỳ để quét QR'}
                </p>
              </div>

              {/* Bank Details Table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: '#4b5563', fontSize: '12px' }}>Tài khoản ký quỹ:</span>
                  <p style={{ fontWeight: 650, margin: '2px 0 0' }}>{orderData?.bankInfo?.bankName || 'Ví Điện Tử MoMo'}</p>
                </div>

                <div>
                  <span style={{ color: '#4b5563', fontSize: '12px' }}>Chủ tài khoản thụ hưởng:</span>
                  <p style={{ fontWeight: 700, margin: '2px 0 0', color: '#0f172a', fontSize: '12.5px' }}>
                    {orderData?.bankInfo?.accountHolder || 'CONG TY CP THUONG MAI AURA BEAUTY MALL - TAI KHOAN KY QUY SHOP'}
                  </p>
                </div>

                <div>
                  <span style={{ color: '#4b5563', fontSize: '12px' }}>Số tài khoản / Số ví MoMo:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <strong style={{ fontSize: '15px', color: isMomo ? '#db2777' : '#0f172a' }}>
                      {orderData?.bankInfo?.accountNumber || '0901234567'}
                    </strong>
                    <button
                      onClick={() => handleCopy(orderData?.bankInfo?.accountNumber || '0901234567', 'Số tài khoản')}
                      style={{ color: '#0066ff', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </div>

                <div>
                  <span style={{ color: '#4b5563', fontSize: '12px' }}>Số tiền chính xác cần chuyển:</span>
                  <p style={{ fontSize: '17px', fontWeight: 850, color: isMomo ? '#e11d48' : '#15803d', margin: '2px 0 0' }}>
                    {(orderData?.finalTotal || orderData?.totalAmount || 0).toLocaleString('vi-VN')} đ
                  </p>
                </div>

                <div>
                  <span style={{ color: '#4b5563', fontSize: '12px' }}>Nội dung chuyển tiền (Bắt buộc giữ nguyên):</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <code style={{ background: isMomo ? '#fce7f3' : '#dcfce7', color: isMomo ? '#9d174d' : '#14532d', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                      {orderData?.bankInfo?.transferContent || 'AURA ' + orderData?.orderId}
                    </code>
                    <button
                      onClick={() => handleCopy(orderData?.bankInfo?.transferContent || 'AURA ' + orderData?.orderId, 'Nội dung')}
                      style={{ color: '#0066ff', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </div>

                {/* Simulation button for Webhook / Callback */}
                <button
                  onClick={handleSimulatePaymentWebhook}
                  disabled={isSimulating}
                  style={{
                    background: isMomo ? 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' : '#15803d',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    padding: '10px 18px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  <Zap size={14} />
                  {isSimulating ? 'Đang gọi Webhook đối soát...' : '⚡ Giả Lập Khách Đã Chuyển Tiền (Webhook MoMo)'}
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
              <p style={{ fontWeight: 600 }}>{orderData?.recipientName || 'Khách Hàng'} ({orderData?.phone || '0901234567'})</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Địa chỉ nhận hàng:</span>
              <p style={{ fontWeight: 600 }}>{orderData?.shippingAddress || 'TP. Hồ Chí Minh'}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Phương thức thanh toán:</span>
              <p style={{ fontWeight: 600, color: currentStatus === 'PENDING_PAYMENT' ? '#d97706' : '#10b981' }}>
                {isMomo ? 'Ví MoMo (Ký quỹ sàn)' : orderData?.paymentMethod === 'QR' ? 'VietQR Tự Động (Ký quỹ)' : orderData?.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : orderData?.paymentMethod}
              </p>
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
