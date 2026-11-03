import React, { useState } from 'react';
import { Sparkles, Check, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { MOCK_COMBOS, MOCK_PRODUCTS } from '../api';

export default function CombosView({ onAddToCart, onAddToast, onNavigateHome }) {
  const [selectedCombo, setSelectedCombo] = useState(MOCK_COMBOS[0]);
  const [activeItems, setActiveItems] = useState([true, true, true]);

  const handleAddComboToCart = (combo) => {
    combo.products.forEach((cp) => {
      const fullProd = MOCK_PRODUCTS.find((p) => p.id === cp.id);
      if (fullProd) {
        onAddToCart(fullProd, fullProd.variants[0], 1);
      }
    });
    onAddToast({ type: 'success', message: `Đã thêm toàn bộ [${combo.name}] vào giỏ hàng với giá ưu đãi!` });
  };

  return (
    <div style={{ marginTop: '20px', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
        <span className="badge-pill badge-neutral" style={{ marginBottom: '10px' }}>
          🎁 Combo & Routine Làm Đẹp
        </span>
        <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.01em', marginBottom: '8px' }}>
          Bộ Sưu Tập Skincare Liệu Trình Toàn Diện
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Tiết kiệm lên đến 25% so với mua lẻ từng sản phẩm. Mỗi chu trình được thiết kế chuẩn y khoa bởi chuyên gia da liễu.
        </p>
      </div>

      {/* Combos Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
        {MOCK_COMBOS.map((combo) => (
          <div
            key={combo.id}
            className="squircle-card"
            style={{
              padding: '0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'relative', height: '240px' }}>
              <img src={combo.image} alt={combo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span className="badge-pill badge-sale" style={{ position: 'absolute', top: '14px', left: '14px', fontSize: '12px' }}>
                {combo.badge}
              </span>
            </div>

            <div style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{combo.name}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: '16px' }}>
                {combo.description}
              </p>

              {/* Items in Combo */}
              <div style={{ background: 'var(--canvas-soft)', padding: '14px', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Gồm các bước chăm sóc:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {combo.products.map((p, pIdx) => (
                    <div key={pIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Check size={14} style={{ color: '#10b981' }} /> {p.name}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.price.toLocaleString('vi-VN')} đ</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Savings */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
                <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink)' }}>
                  {combo.comboPrice.toLocaleString('vi-VN')} đ
                </span>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  {combo.originalPrice.toLocaleString('vi-VN')} đ
                </span>
                <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 700 }}>
                  ({combo.savingsText})
                </span>
              </div>

              <button
                onClick={() => handleAddComboToCart(combo)}
                className="btn-pill-primary"
                style={{ width: '100%', padding: '12px', fontSize: '14px' }}
              >
                <ShoppingBag size={16} /> Thêm cả bộ combo vào giỏ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
