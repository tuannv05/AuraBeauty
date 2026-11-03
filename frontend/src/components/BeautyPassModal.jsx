import React, { useState } from 'react';
import {
  X,
  Crown,
  Sparkles,
  Gift,
  Award,
  CheckCircle2,
  Lock,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Percent,
  Clock,
  ShieldCheck
} from 'lucide-react';

const TIERS = [
  {
    id: 'MEMBER',
    name: 'Thành Viên Chuẩn (Member)',
    minSpend: 0,
    pointRate: '1% (100k = 10 điểm)',
    perks: ['Tích điểm mọi đơn hàng', 'Voucher chào mừng 30.000đ', 'Tư vấn Dược sĩ AI 24/7'],
    color: '#64748b',
    badgeBg: '#f1f5f9'
  },
  {
    id: 'SILVER',
    name: 'Thành Viên Bạc (Silver Pass)',
    minSpend: 3000000,
    pointRate: '2% (100k = 20 điểm)',
    perks: ['Gấp đôi tích điểm', 'Quà tặng sinh nhật Minisize', 'Freeship đơn từ 149k', 'Ưu tiên đổi voucher tuần'],
    color: '#94a3b8',
    badgeBg: '#f8fafc'
  },
  {
    id: 'GOLD',
    name: 'Thành Viên Vàng (Gold VIP)',
    minSpend: 8000000,
    pointRate: '3% (100k = 30 điểm)',
    perks: ['Freeship mọi đơn hàng không giới hạn', 'Quà sinh nhật Fullsize cao cấp', 'Ưu tiên ghép nối Bác sĩ Da liễu 1-1', 'Tham gia Private Flash Sale trước 2 giờ'],
    color: '#d97706',
    badgeBg: '#fef3c7'
  },
  {
    id: 'DIAMOND',
    name: 'Hội Viên Kim Cương (Diamond Black)',
    minSpend: 15000000,
    pointRate: '5% (100k = 50 điểm)',
    perks: ['Tích lũy tối đa 5%', 'Hộp quà Brand Box độc quyền mỗi quý', 'Hỗ trợ đổi trả tận nhà 14 ngày', 'Vé mời sự kiện Beauty VIP Workshop'],
    color: '#0f172a',
    badgeBg: '#e2e8f0'
  }
];

export default function BeautyPassModal({
  isOpen,
  onClose,
  user,
  onAddToast
}) {
  if (!isOpen) return null;

  const currentSpend = user?.spentAmount || 4200000; // default sample 4.2M -> Silver
  const currentPoints = user?.beautyPoints || 420; // 420 points

  // Determine current tier
  let activeTier = TIERS[0];
  let nextTier = TIERS[1];
  if (currentSpend >= 15000000) {
    activeTier = TIERS[3];
    nextTier = null;
  } else if (currentSpend >= 8000000) {
    activeTier = TIERS[2];
    nextTier = TIERS[3];
  } else if (currentSpend >= 3000000) {
    activeTier = TIERS[1];
    nextTier = TIERS[2];
  }

  const spendProgress = nextTier
    ? Math.min(100, Math.round(((currentSpend - activeTier.minSpend) / (nextTier.minSpend - activeTier.minSpend)) * 100))
    : 100;

  const [redeemedVouchers, setRedeemedVouchers] = useState([]);

  const handleRedeemVoucher = (code, pts, value) => {
    if (currentPoints < pts) {
      if (onAddToast) onAddToast({ type: 'warning', message: 'Bạn không đủ điểm thưởng để đổi voucher này!' });
      return;
    }
    if (redeemedVouchers.includes(code)) {
      if (onAddToast) onAddToast({ type: 'info', message: 'Bạn đã đổi mã này rồi, hãy dùng ở bước thanh toán!' });
      return;
    }
    setRedeemedVouchers((prev) => [...prev, code]);
    if (onAddToast) {
      onAddToast({
        type: 'success',
        message: `Đổi thành công mã giảm ${value.toLocaleString('vi-VN')}đ (${code})! Đã lưu vào ví voucher.`
      });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 200ms ease'
      }}
    >
      <div
        style={{
          width: '840px',
          maxWidth: '100%',
          maxHeight: '92vh',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
            color: '#ffffff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(245, 158, 11, 0.4)'
              }}
            >
              <Crown size={22} style={{ color: '#ffffff' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                Aura Beauty Pass™
                <span style={{ fontSize: '11px', background: 'rgba(245, 158, 11, 0.25)', color: '#fef08a', padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                  Hội Viên Tinh Hoa
                </span>
              </h3>
              <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '2px 0 0 0' }}>
                Chuẩn Sephora Beauty Insider: Tích điểm đổi quà, freeship vô tận và đặc quyền sinh nhật
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#cbd5e1',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Card VIP Header */}
          <div
            style={{
              borderRadius: '20px',
              padding: '24px',
              background: activeTier.id === 'GOLD' || activeTier.id === 'DIAMOND'
                ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)'
                : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#ffffff',
              boxShadow: '0 12px 28px -5px rgba(0,0,0,0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#cbd5e1', fontWeight: 650 }}>
                  Thẻ Hội Viên Điện Tử (E-Membership)
                </span>
                <h2 style={{ fontSize: '22px', fontWeight: 850, margin: '4px 0 6px 0', color: '#ffffff' }}>
                  {user?.name || 'Nguyễn Văn Mua'}
                </h2>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 750, color: '#fbcfe8' }}>
                  <Crown size={14} /> {activeTier.name}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: '#cbd5e1' }}>Điểm khả dụng:</span>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#fde047', lineHeight: 1.1 }}>
                  {currentPoints} <span style={{ fontSize: '15px', fontWeight: 700 }}>pts</span>
                </div>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>≈ {currentPoints * 100} ₫ giá trị quy đổi</span>
              </div>
            </div>

            {/* Progress to next tier */}
            {nextTier && (
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: '#cbd5e1' }}>
                    Chi tiêu tích lũy: <strong style={{ color: '#fff' }}>{currentSpend.toLocaleString('vi-VN')} ₫</strong>
                  </span>
                  <span style={{ color: '#fbcfe8', fontWeight: 700 }}>
                    Còn {(nextTier.minSpend - currentSpend).toLocaleString('vi-VN')} ₫ để thăng hạng {nextTier.name.split(' ')[2]}
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${spendProgress}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #ec4899, #f59e0b)',
                      borderRadius: '999px',
                      transition: 'width 0.5s ease'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 4 Tiers Comparison */}
          <div>
            <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
              Quyền lợi 4 phân hạng thành viên:
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {TIERS.map((tier) => {
                const isCurrent = activeTier.id === tier.id;
                return (
                  <div
                    key={tier.id}
                    style={{
                      padding: '14px',
                      borderRadius: '16px',
                      border: isCurrent ? '2px solid #ec4899' : '1px solid #e2e8f0',
                      background: isCurrent ? '#fdf2f8' : '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative'
                    }}
                  >
                    {isCurrent && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-10px',
                          right: '12px',
                          background: '#ec4899',
                          color: '#ffffff',
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '10px'
                        }}
                      >
                        Hạng của bạn
                      </span>
                    )}

                    <div style={{ fontSize: '13px', fontWeight: 800, color: isCurrent ? '#db2777' : '#0f172a', marginBottom: '4px' }}>
                      {tier.name.split('(')[0]}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '10px' }}>
                      Từ {tier.minSpend.toLocaleString('vi-VN')} ₫
                    </div>

                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#059669', marginBottom: '8px' }}>
                      Tích {tier.pointRate}
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '11px', color: '#334155' }}>
                      {tier.perks.map((p, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                          <CheckCircle2 size={13} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Point Redemption Store */}
          <div>
            <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
              Đổi điểm lấy Voucher độc quyền (Rewards Store):
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              {[
                { code: 'BEAUTY50K', pts: 250, value: 50000, desc: 'Giảm 50k cho đơn từ 299k' },
                { code: 'BEAUTY100K', pts: 450, value: 100000, desc: 'Giảm 100k cho đơn từ 599k' },
                { code: 'BEAUTY200K', pts: 800, value: 200000, desc: 'Giảm 200k cho đơn từ 999k' }
              ].map((v) => {
                const isClaimed = redeemedVouchers.includes(v.code);
                const canClaim = currentPoints >= v.pts;

                return (
                  <div
                    key={v.code}
                    style={{
                      padding: '14px',
                      borderRadius: '16px',
                      border: '1px dashed #cbd5e1',
                      background: '#f8fafc',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '10px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '15px', fontWeight: 850, color: '#e11d48' }}>
                          -{v.value.toLocaleString('vi-VN')} ₫
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b', background: '#fef3c7', padding: '2px 6px', borderRadius: '8px' }}>
                          {v.pts} điểm
                        </span>
                      </div>
                      <p style={{ fontSize: '11.5px', color: '#64748b', margin: '4px 0 0 0' }}>
                        {v.desc}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isClaimed || !canClaim}
                      onClick={() => handleRedeemVoucher(v.code, v.pts, v.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '10px',
                        border: 'none',
                        background: isClaimed ? '#10b981' : canClaim ? '#0f172a' : '#cbd5e1',
                        color: '#ffffff',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: isClaimed || !canClaim ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isClaimed ? '✓ Đã đổi vào ví' : canClaim ? 'Đổi Voucher Ngay' : 'Chưa đủ điểm'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
