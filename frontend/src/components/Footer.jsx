import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, Send, CheckCircle2, ShieldCheck, Lock, ExternalLink } from 'lucide-react';
import { FooterInfoModal } from './FooterInfoModal';
import { AuraBrandLogo } from './ui';

export default function Footer({ onAddToast, onNavigateTracking, onOpenSellerRegistration }) {
  const [email, setEmail] = useState('');
  const [supportOpen, setSupportOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [subscribedEmails, setSubscribedEmails] = useState(['test@example.com']);
  const [activeArticle, setActiveArticle] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    const clean = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!clean || !emailRegex.test(clean)) {
      onAddToast({ type: 'error', message: 'Vui lòng nhập định dạng email hợp lệ (ví dụ: name@domain.com).' });
      return;
    }

    if (subscribedEmails.includes(clean.toLowerCase())) {
      onAddToast({ type: 'warning', message: 'Email này đã đăng ký nhận bản tin trước đó rồi!' });
      return;
    }

    setSubscribedEmails([...subscribedEmails, clean.toLowerCase()]);
    setEmail('');
    onAddToast({
      type: 'success',
      message: '🎉 Đăng ký thành công! Nhận ngay mã giảm 10% [NEW10] cho đơn hàng đầu tiên.'
    });
  };

  return (
    <footer style={{ background: '#141414', color: '#ffffff', paddingTop: '64px', paddingBottom: '32px', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', marginTop: '48px' }}>
      <div className="container">
        {/* Main 4-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          
          {/* CỘT 1: VỀ AURA BEAUTY MALL */}
          <div>
            <div style={{ marginBottom: '18px' }}>
              <AuraBrandLogo variant="light" size="md" />
            </div>
            <div
              onClick={() => setAboutOpen(!aboutOpen)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: '14px' }}
            >
              <h4 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' }}>Về Aura Beauty Mall</h4>
              <span className="mobile-only-toggle" style={{ display: 'none' }}>
                {aboutOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </div>
            <ul
              className={aboutOpen ? 'footer-list-open' : 'footer-list'}
              style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#9ca3af' }}
            >
              <li>
                <button onClick={() => setActiveArticle('gioi-thieu')} style={{ background: 'none', border: 'none', color: '#9ca3af', textAlign: 'left', cursor: 'pointer', padding: 0 }} onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')} onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}>
                  Giới thiệu sàn Aura Beauty Mall
                </button>
              </li>
              <li>
                <button onClick={() => setActiveArticle('quy-che')} style={{ background: 'none', border: 'none', color: '#9ca3af', textAlign: 'left', cursor: 'pointer', padding: 0 }} onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')} onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}>
                  Quy chế hoạt động & CBMP Bộ Y Tế
                </button>
              </li>
              <li>
                <button onClick={() => setActiveArticle('cam-ket-200')} style={{ background: 'none', border: 'none', color: '#f43f5e', textAlign: 'left', cursor: 'pointer', padding: 0, fontWeight: 650 }} onMouseEnter={(e) => (e.currentTarget.style.color = '#fda4af')} onMouseLeave={(e) => (e.currentTarget.style.color = '#f43f5e')}>
                  🛡️ Cam kết 100% chính hãng (Đền 200%)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveArticle('tuyen-dung')} style={{ background: 'none', border: 'none', color: '#9ca3af', textAlign: 'left', cursor: 'pointer', padding: 0 }} onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')} onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}>
                  Tuyển dụng nhân tài & Hợp tác
                </button>
              </li>
              <li style={{ paddingTop: '8px' }}>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
                  GPKD: 0108923482 do Sở KH&ĐT cấp ngày 15/03/2024.
                </p>
              </li>
            </ul>
          </div>

          {/* CỘT 2: HỖ TRỢ KHÁCH HÀNG */}
          <div>
            <div
              onClick={() => setSupportOpen(!supportOpen)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: '14px' }}
            >
              <h4 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' }}>Hỗ Trợ Khách Hàng</h4>
              <span className="mobile-only-toggle" style={{ display: 'none' }}>
                {supportOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </div>
            <ul
              className={supportOpen ? 'footer-list-open' : 'footer-list'}
              style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#9ca3af' }}
            >
              <li>
                <button onClick={() => setActiveArticle('huong-dan-mua-hang')} style={{ background: 'none', border: 'none', color: '#9ca3af', textAlign: 'left', cursor: 'pointer', padding: 0 }} onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')} onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}>
                  Hướng dẫn đặt hàng & chọn shade màu
                </button>
              </li>
              <li>
                <button onClick={() => setActiveArticle('chinh-sach-doi-tra')} style={{ background: 'none', border: 'none', color: '#9ca3af', textAlign: 'left', cursor: 'pointer', padding: 0 }} onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')} onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}>
                  Chính sách đổi trả trong 7 ngày
                </button>
              </li>
              <li>
                <button onClick={() => setActiveArticle('van-chuyen-2h')} style={{ background: 'none', border: 'none', color: '#9ca3af', textAlign: 'left', cursor: 'pointer', padding: 0 }} onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')} onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}>
                  Chính sách vận chuyển siêu tốc 2H
                </button>
              </li>
              <li>
                <button onClick={onNavigateTracking} style={{ color: '#93c5fd', textAlign: 'left', padding: 0, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 650 }}>
                  📦 Tra cứu đơn hàng trực tuyến
                </button>
              </li>
              <li>
                <button onClick={() => setActiveArticle('bao-mat-cookie')} style={{ background: 'none', border: 'none', color: '#9ca3af', textAlign: 'left', cursor: 'pointer', padding: 0 }} onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')} onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}>
                  Chính sách bảo mật thông tin & Cookie
                </button>
              </li>
              <li>
                <button onClick={() => setActiveArticle('faq')} style={{ background: 'none', border: 'none', color: '#9ca3af', textAlign: 'left', cursor: 'pointer', padding: 0 }} onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')} onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}>
                  Câu hỏi thường gặp (FAQ)
                </button>
              </li>
            </ul>
          </div>

          {/* CỘT 3: DÀNH CHO ĐỐI TÁC & NGƯỜI BÁN */}
          <div>
            <div
              onClick={() => setPartnerOpen(!partnerOpen)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: '14px' }}
            >
              <h4 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' }}>Dành Cho Đối Tác</h4>
              <span className="mobile-only-toggle" style={{ display: 'none' }}>
                {partnerOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </div>
            <ul
              className={partnerOpen ? 'footer-list-open' : 'footer-list'}
              style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#9ca3af' }}
            >
              <li>
                <button onClick={() => setActiveArticle('mo-gian-hang')} style={{ background: 'none', border: 'none', color: '#f472b6', textAlign: 'left', cursor: 'pointer', padding: 0, fontWeight: 700 }} onMouseEnter={(e) => (e.currentTarget.style.color = '#fbcfe8')} onMouseLeave={(e) => (e.currentTarget.style.color = '#f472b6')}>
                  🏪 Đăng ký mở gian hàng Official Mall
                </button>
              </li>
              <li>
                <button onClick={() => setActiveArticle('bieu-phi-hoa-hong')} style={{ background: 'none', border: 'none', color: '#9ca3af', textAlign: 'left', cursor: 'pointer', padding: 0 }} onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')} onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}>
                  Quy định & Biểu phí hoa hồng sàn (10%)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveArticle('cam-nang-ban-hang')} style={{ background: 'none', border: 'none', color: '#9ca3af', textAlign: 'left', cursor: 'pointer', padding: 0 }} onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')} onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}>
                  Cẩm nang bán hàng mỹ phẩm an toàn
                </button>
              </li>
              <li>
                <button onClick={() => setActiveArticle('api-kho-van')} style={{ background: 'none', border: 'none', color: '#38bdf8', textAlign: 'left', cursor: 'pointer', padding: 0, fontFamily: 'monospace' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#7dd3fc')} onMouseLeave={(e) => (e.currentTarget.style.color = '#38bdf8')}>
                  ⚡ Hệ thống API kết nối kho vận (OpenAPI)
                </button>
              </li>
            </ul>
          </div>

          {/* CỘT 4: BẢN TIN & CHỨNG NHẬN */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase', marginBottom: '14px' }}>
              Nhận Ưu Đãi Làm Đẹp
            </h4>
            <p style={{ fontSize: '13px', color: '#9ca3af', lineHeight: 1.5, marginBottom: '14px' }}>
              Đăng ký để nhận voucher 10%, thông báo flash sale độc quyền và cẩm nang routine da chuẩn y khoa.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  borderColor: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-full)',
                  padding: '10px 18px',
                  fontSize: '13px'
                }}
              />
              <button
                type="submit"
                className="btn-pill-primary"
                style={{ background: '#ffffff', color: '#141414', fontSize: '13px', padding: '10px 18px' }}
              >
                Đăng ký ngay <Send size={14} />
              </button>
            </form>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setActiveArticle('bo-cong-thuong')}
                style={{ background: 'rgba(5, 150, 105, 0.2)', border: '1px solid #059669', color: '#34d399', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <CheckCircle2 size={13} /> Bộ Công Thương
              </button>
              <button
                onClick={() => setActiveArticle('pci-dss')}
                style={{ background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #2563eb', color: '#60a5fa', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Lock size={13} /> PCI-DSS Level 1
              </button>
            </div>
          </div>
        </div>

        {/* Thanh bản quyền & Đối tác */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>Phương thức thanh toán:</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge-pill badge-neutral" style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: 'none' }}>Visa</span>
              <span className="badge-pill badge-neutral" style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: 'none' }}>MasterCard</span>
              <span className="badge-pill badge-neutral" style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: 'none' }}>VietQR</span>
              <span className="badge-pill badge-neutral" style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: 'none' }}>MoMo</span>
              <span className="badge-pill badge-neutral" style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: 'none' }}>COD</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
              © 2026 Aura Beauty Mall (WebBanMP). All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info Modal */}
      <FooterInfoModal
        articleSlug={activeArticle}
        onClose={() => setActiveArticle(null)}
        onOpenSellerRegistration={onOpenSellerRegistration}
      />

      <style>{`
        @media (max-width: 768px) {
          .mobile-only-toggle {
            display: inline-block !important;
          }
          .footer-list {
            display: none !important;
          }
          .footer-list-open {
            display: flex !important;
          }
        }
      `}</style>
    </footer>
  );
}
