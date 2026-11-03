import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Truck, ShieldCheck, PhoneCall, MapPin, CheckCircle2,
  Copy, ArrowRight, Clock, Star, ExternalLink, Sparkles, MessageSquare
} from 'lucide-react';
import { MotionCard, AnimatedBadge, SpringButton } from './ui';

export function TopBarModals({
  activeModal, // 'freeship' | 'authenticity' | 'hotline' | 'showrooms' | null
  onClose,
  onAddToast,
  onNavigateFlashSale,
  onOpenAiChat
}) {
  if (!activeModal) return null;

  return (
    <AnimatePresence>
      <div
        className="modal-backdrop"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '16px'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            position: 'relative',
            padding: '28px'
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#f1f5f9',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
          >
            <X size={18} />
          </button>

          {/* =========================================================================
              MODAL 1: CHÍNH SÁCH FREESHIP TOÀN QUỐC
              ========================================================================= */}
          {activeModal === 'freeship' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck size={26} />
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Chính Sách Freeship Toàn Quốc
                  </h3>
                  <AnimatedBadge variant="success" pulse>Áp Dụng Cho Mọi Đơn Từ 199.000₫</AnimatedBadge>
                </div>
              </div>

              <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
                Aura Beauty Mall liên kết cùng các đơn vị vận chuyển hàng đầu (GHTK, GHN, Shopee Xpress) áp dụng chính sách trợ giá vận chuyển 100% không giới hạn số lần mua.
              </p>

              <h4 style={{ fontSize: '14px', fontWeight: 750, color: '#0f172a', marginBottom: '10px' }}>
                Danh Sách Mã Vận Chuyển Khả Dụng:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {[
                  { code: 'FREESHIP199K', min: '199.000₫', disc: 'Giảm tối đa 30.000₫ phí ship', exp: '31/12/2026' },
                  { code: 'FREESHIPMAX', min: '499.000₫', disc: 'Freeship 100% toàn quốc', exp: '31/12/2026' },
                  { code: 'NOW2H', min: '399.000₫', disc: 'Trợ giá 50k giao hỏa tốc 2H nội thành', exp: 'Hàng ngày' }
                ].map((v) => (
                  <div
                    key={v.code}
                    style={{
                      border: '1.5px dashed #10b981',
                      borderRadius: '12px',
                      padding: '14px 18px',
                      background: '#f0fdf4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#047857' }}>{v.code}</span>
                        <span style={{ fontSize: '11px', background: '#d1fae5', color: '#065f46', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>Đơn từ {v.min}</span>
                      </div>
                      <p style={{ fontSize: '12.5px', color: '#374151', margin: '4px 0 0 0' }}>{v.disc}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(v.code);
                        onAddToast({ type: 'success', message: `Đã sao chép mã [${v.code}] vào khay nhớ tạm!` });
                      }}
                      className="btn-pill-primary"
                      style={{ fontSize: '12px', padding: '6px 14px', background: '#059669' }}
                    >
                      <Copy size={13} /> Sao chép
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <SpringButton variant="primary" onClick={onClose}>
                  Đã Hiểu & Tiếp Tục Mua Sắm
                </SpringButton>
              </div>
            </div>
          )}

          {/* =========================================================================
              MODAL 2: CAM KẾT CHÍNH HÃNG 100% & BẢO HÀNH ĐỀN BÙ 200%
              ========================================================================= */}
          {activeModal === 'authenticity' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fff1f2', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Cam Kết 100% Chính Hãng & Đền 200%
                  </h3>
                  <AnimatedBadge variant="danger" pulse>Bảo Chứng Số CBMP Bộ Y Tế</AnimatedBadge>
                </div>
              </div>

              <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, marginBottom: '18px' }}>
                Tất cả mỹ phẩm trên Aura Beauty Mall được thẩm định pháp lý nghiêm ngặt qua 3 tầng: Giấy Phép Kinh Doanh, Giấy Công Bố Mỹ Phẩm (CBMP) do Cục Quản Lý Dược cấp, và Thư ủy quyền phân phối chính hãng.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
                    <CheckCircle2 size={16} style={{ color: '#10b981' }} /> Kiểm Định Tem Chống Giả
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Mỗi sản phẩm có tem vỡ hologram hoặc mã QR kiểm tra trực tiếp từ tổng đài hãng.</p>
                </div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
                    <CheckCircle2 size={16} style={{ color: '#e11d48' }} /> Đền Bù 200% Giá Trị
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Nếu phát hiện hàng giả, sàn hoàn lại 100% tiền mua và đền bù thêm 100% giá trị qua quỹ bảo chứng.</p>
                </div>
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '14px', marginBottom: '20px' }}>
                <h5 style={{ fontSize: '12.5px', fontWeight: 750, color: '#92400e', margin: '0 0 4px 0' }}>Quy Trình Xử Lý Khiếu Nại Hàng Giả:</h5>
                <ol style={{ fontSize: '12px', color: '#78350f', paddingLeft: '18px', margin: 0, lineHeight: 1.5 }}>
                  <li>Chụp ảnh sản phẩm, tem phụ tiếng Việt và mã vạch gửi về mục Khiếu Nại.</li>
                  <li>Hội đồng thẩm định độc lập phối hợp văn phòng đại diện hãng tại Việt Nam kiểm tra.</li>
                  <li>Hoàn tiền và bồi thường ngay trong vòng 24 giờ sau khi có kết luận.</li>
                </ol>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <SpringButton variant="primary" onClick={onClose}>
                  Tôi Đã An Tâm Mua Hàng
                </SpringButton>
              </div>
            </div>
          )}

          {/* =========================================================================
              MODAL 3: TRUNG TÂM HỖ TRỢ CSKH 24/7 & KẾT NỐI AI
              ========================================================================= */}
          {activeModal === 'hotline' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PhoneCall size={26} />
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Trung Tâm Hỗ Trợ Khách Hàng 24/7
                  </h3>
                  <AnimatedBadge variant="info" pulse>Sẵn Sàng Hỗ Trợ Mọi Lúc</AnimatedBadge>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                <div style={{ border: '1px solid #bfdbfe', background: '#f8fafc', borderRadius: '14px', padding: '18px', textAlign: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Hotline Miễn Cước Toàn Quốc:</span>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#2563eb', margin: '6px 0' }}>1900 6868</div>
                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>● Trực ban 24/7 (Cước 0đ/phút)</span>
                  <div style={{ marginTop: '12px' }}>
                    <a
                      href="tel:19006868"
                      className="btn-pill-primary"
                      style={{ fontSize: '12px', padding: '6px 16px', display: 'inline-flex', background: '#2563eb' }}
                    >
                      Gọi ngay 1900 6868
                    </a>
                  </div>
                </div>

                <div style={{ border: '1px solid #fbcfe8', background: '#fdf2f8', borderRadius: '14px', padding: '18px', textAlign: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#be185d', fontWeight: 600 }}>Trợ Lý Da Liễu AI Advisor:</span>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#be185d', margin: '6px 0' }}>Tư Vấn Hoạt Chất & Routine</div>
                  <span style={{ fontSize: '11px', color: '#475569' }}>Trả lời phân tích thành phần INCI sau 1 giây</span>
                  <div style={{ marginTop: '12px' }}>
                    <button
                      onClick={() => {
                        onClose();
                        if (onOpenAiChat) onOpenAiChat();
                      }}
                      className="btn-pill-primary"
                      style={{ fontSize: '12px', padding: '6px 16px', background: '#ec4899', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Sparkles size={14} /> Mở Chat Cố Vấn AI
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.6, background: '#f8fafc', borderRadius: '12px', padding: '14px', marginBottom: '20px' }}>
                <strong>Kênh hỗ trợ khác:</strong>
                <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
                  <li>Email khiếu nại & xử lý bảo hành: <code>support@aurabeauty.vn</code> (Phản hồi trong 2 giờ)</li>
                  <li>Fanpage & Zalo OA: Aura Beauty Mall Official (Xanh chính thức)</li>
                  <li>Trụ sở: Tòa nhà Bitexco Financial Tower, Quận 1, TP. Hồ Chí Minh</li>
                </ul>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <SpringButton variant="outline" onClick={onClose}>
                  Đóng Cửa Sổ
                </SpringButton>
              </div>
            </div>
          )}

          {/* =========================================================================
              MODAL 4: HỆ THỐNG SHOWROOM & FLAGSHIP STORE TOÀN QUỐC
              ========================================================================= */}
          {activeModal === 'showrooms' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={26} />
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Hệ Thống Showroom & Flagship Store
                  </h3>
                  <AnimatedBadge variant="warning">8 Cửa Hàng Trải Nghiệm Chuẩn Quốc Tế</AnimatedBadge>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
                Khách hàng có thể đến trực tiếp các Showroom để soi da công nghệ cao 3D miễn phí, trải nghiệm Virtual Try-On trên màn hình tương tác và mua hàng chính hãng.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px', marginBottom: '20px' }}>
                {[
                  { city: 'TP. HỒ CHÍ MINH', name: 'Flagship Store Quận 1', addr: '68 Nguyễn Huệ, Phường Bến Nghé, Quận 1', time: '08:30 - 22:30', phone: '028 3822 6868' },
                  { city: 'TP. HỒ CHÍ MINH', name: 'Aura Beauty Mall Crescent Mall', addr: 'Tầng 2, Crescent Mall, Phú Mỹ Hưng, Quận 7', time: '09:00 - 22:00', phone: '028 5413 8899' },
                  { city: 'HÀ NỘI', name: 'Flagship Store Tràng Tiền', addr: '24 Tràng Tiền, Quận Hoàn Kiếm, Hà Nội', time: '08:30 - 22:30', phone: '024 3936 6868' },
                  { city: 'HÀ NỘI', name: 'Aura Beauty Mall Lotte West Lake', addr: 'Tầng 1, Lotte Mall Tây Hồ, 272 Võ Chí Công', time: '09:00 - 22:00', phone: '024 3719 8899' },
                  { city: 'ĐÀ NẴNG', name: 'Showroom Bạch Đằng', addr: '158 Bạch Đằng, Quận Hải Châu, Đà Nẵng', time: '08:30 - 22:00', phone: '0236 388 6868' },
                  { city: 'CẦN THƠ', name: 'Showroom Vincom Xuân Khánh', addr: '209 Đường 30/4, Quận Ninh Kiều, Cần Thơ', time: '09:00 - 22:00', phone: '0292 376 6868' }
                ].map((s, idx) => (
                  <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#ec4899' }}>{s.city}</span>
                      <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>● Mở cửa: {s.time}</span>
                    </div>
                    <h5 style={{ fontSize: '14px', fontWeight: 750, color: '#0f172a', margin: '4px 0 2px 0' }}>{s.name}</h5>
                    <p style={{ fontSize: '12.5px', color: '#475569', margin: '0 0 4px 0' }}>{s.addr}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748b' }}>
                      <span>Hotline: <strong>{s.phone}</strong></span>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(s.addr)}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#2563eb', fontWeight: 650, display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                      >
                        Chỉ đường <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <SpringButton variant="primary" onClick={onClose}>
                  Đóng Danh Sách
                </SpringButton>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
