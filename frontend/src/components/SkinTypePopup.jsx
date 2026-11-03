import React, { useState, useEffect } from 'react';
import { Sparkles, Droplets, Sun, Check, X } from 'lucide-react';

export default function SkinTypePopup({ onSelectSkinType }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('');

  const SKIN_OPTIONS = [
    {
      id: 'OILY',
      title: 'Da Dầu (Oily)',
      icon: '💧',
      desc: 'Bóng dầu toàn mặt, lỗ chân lông to, dễ nổi mụn trứng cá và mụn cám.'
    },
    {
      id: 'DRY',
      title: 'Da Khô (Dry)',
      icon: '🏜️',
      desc: 'Thiếu ẩm, bề mặt sần sùi, dễ bong tróc và có cảm giác căng rát.'
    },
    {
      id: 'COMBINATION',
      title: 'Da Hỗn Hợp (Combination)',
      icon: '⚖️',
      desc: 'Đổ dầu nhiều vùng chữ T (trán, mũi, cằm) nhưng hai bên má lại khô.'
    },
    {
      id: 'SENSITIVE',
      title: 'Da Nhạy Cảm (Sensitive)',
      icon: '🌸',
      desc: 'Thành mạch mỏng, dễ ửng đỏ, châm chích khi đổi thời tiết hoặc mỹ phẩm.'
    },
    {
      id: 'NORMAL',
      title: 'Da Thường (Normal)',
      icon: '✨',
      desc: 'Cân bằng dầu - ẩm lý tưởng, nền da mịn màng, khỏe khoắn ít khuyết điểm.'
    }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('cosmepoly_user_skintype');
    const dismissed = localStorage.getItem('cosmepoly_skintype_dismissed');
    if (!saved && !dismissed) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSelect = (skinId) => {
    setSelected(skinId);
    setTimeout(() => {
      localStorage.setItem('cosmepoly_user_skintype', skinId);
      onSelectSkinType(skinId);
      setIsOpen(false);
    }, 250);
  };

  const handleDismiss = () => {
    localStorage.setItem('cosmepoly_skintype_dismissed', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleDismiss}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px', width: '92%', padding: '28px', textAlign: 'center' }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleDismiss} style={{ color: 'var(--text-muted)', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ width: '48px', height: '48px', background: 'var(--canvas-soft)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
          <Sparkles size={24} style={{ color: 'var(--ink)' }} />
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
          Làn Da Của Bạn Thuộc Loại Nào?
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '440px', margin: '0 auto 24px' }}>
          Chọn loại da để Aura Beauty Mall tự động đề xuất các sản phẩm tương thích và cảnh báo thành phần gây kích ứng (Comedogenic Rating) dành riêng cho bạn.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', textAlign: 'left', marginBottom: '24px' }}>
          {SKIN_OPTIONS.map((item) => {
            const isChosen = selected === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item.id)}
                style={{
                  border: isChosen ? '2px solid var(--ink)' : '1px solid var(--hairline)',
                  background: isChosen ? 'var(--canvas-soft)' : 'var(--canvas)',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 180ms ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '20px' }}>{item.icon}</span>
                  {isChosen && (
                    <span style={{ background: 'var(--ink)', color: '#ffffff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={12} />
                    </span>
                  )}
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 650, marginBottom: '4px' }}>{item.title}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.35 }}>{item.desc}</p>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleDismiss}
          style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'underline' }}
        >
          Để sau, tôi muốn tự khám phá
        </button>
      </div>
    </div>
  );
}
