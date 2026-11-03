import React, { useState, useEffect } from 'react';
import { ShieldCheck, Settings, X } from 'lucide-react';

export default function CookieBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('cosmepoly_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cosmepoly_cookie_consent', JSON.stringify({ necessary: true, analytics: true, marketing: true }));
    setIsOpen(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem('cosmepoly_cookie_consent', JSON.stringify({ necessary: true, analytics, marketing }));
    setIsCustomizeOpen(false);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(20, 20, 20, 0.96)',
          backdropFilter: 'blur(10px)',
          color: '#ffffff',
          padding: '14px 20px',
          zIndex: 990,
          boxShadow: '0 -4px 24px rgba(0,0,0,0.2)',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '50%', color: '#60a5fa' }}>
              <ShieldCheck size={20} />
            </div>
            <p style={{ fontSize: '13px', lineHeight: 1.4, color: '#e5e7eb' }}>
              Chúng tôi sử dụng cookie nhằm tối ưu hóa trải nghiệm tìm kiếm mỹ phẩm, đề xuất routine da liễu phù hợp và bảo mật giỏ hàng. Bằng việc tiếp tục, bạn đồng ý với{' '}
              <a href="#privacy" style={{ textDecoration: 'underline', color: '#93c5fd' }}>Chính sách bảo mật</a> của Aura Beauty Mall.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsCustomizeOpen(true)}
              className="btn-pill-soft"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#ffffff', fontSize: '13px', padding: '8px 18px' }}
            >
              <Settings size={14} /> Tùy chỉnh
            </button>
            <button
              onClick={handleAcceptAll}
              className="btn-pill-primary"
              style={{ background: '#ffffff', color: '#141414', fontSize: '13px', padding: '8px 22px' }}
            >
              Đồng ý tất cả
            </button>
          </div>
        </div>
      </div>

      {/* Customize Modal */}
      {isCustomizeOpen && (
        <div className="modal-backdrop" onClick={() => setIsCustomizeOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', width: '90%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 650 }}>Cài Đặt Quyền Riêng Tư Cookie</h3>
              <button onClick={() => setIsCustomizeOpen(false)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Bạn có thể tùy chỉnh các danh mục cookie theo nhu cầu cá nhân.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--canvas-soft)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>Cookie Thiết Yếu (Bắt buộc)</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Cần thiết cho giỏ hàng, đăng nhập và bảo mật giao dịch.</p>
                </div>
                <span className="badge-pill badge-neutral">Luôn bật</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--canvas-soft)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>Cookie Phân Tích & Hiệu Năng</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Thu thập thống kê ẩn danh để cải tiến tốc độ và độ mượt mà.</p>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--canvas-soft)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>Cookie Cá Nhân Hóa & Đề Xuất</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Gợi ý sản phẩm và voucher giảm giá dựa trên loại da của bạn.</p>
                </div>
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn-pill-outline" onClick={() => setIsCustomizeOpen(false)}>Hủy</button>
              <button className="btn-pill-primary" onClick={handleSaveCustom}>Lưu Tùy Chọn</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
