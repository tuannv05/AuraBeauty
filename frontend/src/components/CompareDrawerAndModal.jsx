import React, { useState } from 'react';
import { X, Scale, Plus, ShoppingBag, Check, AlertCircle } from 'lucide-react';

export default function CompareDrawerAndModal({
  compareList,
  onRemoveFromCompare,
  onClearCompare,
  onAddToCart,
  onSelectProduct
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onlyDifferences, setOnlyDifferences] = useState(false);

  if (!compareList || compareList.length === 0) return null;

  const ATTRIBUTES = [
    { key: 'brand', label: 'Thương hiệu' },
    { key: 'origin', label: 'Xuất xứ' },
    { key: 'category', label: 'Danh mục' },
    { key: 'skinTypes', label: 'Loại da phù hợp', format: (p) => p.targetSkinTypes?.join(', ') || 'Mọi loại da' },
    { key: 'concerns', label: 'Công dụng chính', format: (p) => p.concerns?.join(', ') || 'Dưỡng da' },
    {
      key: 'inci',
      label: 'Hoạt chất vàng (INCI)',
      format: (p) => p.inciIngredients?.slice(0, 3).map((i) => i.name).join(' • ') || '—'
    },
    {
      key: 'comedogenic',
      label: 'Nguy cơ bít tắc mụn',
      format: (p) => {
        const maxScore = Math.max(...(p.inciIngredients?.map((i) => i.comedogenicRating) || [0]));
        return `${maxScore}/5 (Cực thấp)`;
      }
    },
    { key: 'cbmp', label: 'Số CBMP Bộ Y Tế', format: (p) => p.registrationNumber || 'Đang cập nhật' }
  ];

  return (
    <>
      {/* Sticky Bottom Compare Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--ink)',
          color: '#ffffff',
          borderRadius: 'var(--radius-full)',
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 12px 32px rgba(20, 20, 20, 0.35)',
          zIndex: 880,
          animation: 'scaleUp 180ms ease',
          maxWidth: '92vw'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Scale size={18} style={{ color: '#60a5fa' }} />
          <span style={{ fontSize: '13px', fontWeight: 650 }}>
            So sánh ({compareList.length}/4)
          </span>
        </div>

        {/* Selected Product Thumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {compareList.map((prod) => (
            <div
              key={prod.id}
              style={{
                position: 'relative',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                background: '#ffffff'
              }}
              title={prod.name}
            >
              <img src={prod.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
              <button
                onClick={(e) => { e.stopPropagation(); onRemoveFromCompare(prod.id); }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.45)',
                  color: '#ffffff',
                  opacity: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'opacity 150ms'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-pill-primary"
            style={{
              background: '#ffffff',
              color: '#141414',
              padding: '6px 16px',
              fontSize: '12px'
            }}
          >
            So sánh ngay
          </button>
          <button
            onClick={onClearCompare}
            style={{ color: '#9ca3af', fontSize: '12px', padding: '4px' }}
            title="Xóa tất cả"
          >
            Xóa
          </button>
        </div>
      </div>

      {/* Full Comparison Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '1080px',
              maxWidth: '96vw',
              maxHeight: '88vh',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Bảng So Sánh Chi Tiết Sản Phẩm</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Đối chiếu thông số kỹ thuật, hoạt chất INCI và độ an toàn theo tiêu chuẩn da liễu.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={onlyDifferences}
                    onChange={(e) => setOnlyDifferences(e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Chỉ hiện điểm khác nhau
                </label>
                <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)', padding: '4px' }}>
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Comparison Table */}
            <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                {/* Sticky Product Row */}
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--hairline)' }}>
                    <th style={{ width: '180px', padding: '12px', fontSize: '13px', color: 'var(--text-muted)', background: 'var(--canvas)' }}>
                      Tiêu chí đối chiếu
                    </th>
                    {compareList.map((prod) => (
                      <th
                        key={prod.id}
                        style={{
                          width: `${100 / (compareList.length + 1)}%`,
                          padding: '12px',
                          background: 'var(--canvas)',
                          verticalAlign: 'top'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => onRemoveFromCompare(prod.id)}
                            style={{ color: 'var(--text-faint)', padding: '2px' }}
                            title="Xóa khỏi so sánh"
                          >
                            <X size={15} />
                          </button>
                        </div>
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'contain', background: '#f8fafc', padding: '4px', margin: '0 auto 8px', display: 'block' }}
                        />
                        <h4 style={{ fontSize: '13px', fontWeight: 650, textAlign: 'center', marginBottom: '4px' }}>
                          {prod.name}
                        </h4>
                        <p style={{ fontSize: '14px', fontWeight: 750, color: 'var(--ink)', textAlign: 'center', marginBottom: '10px' }}>
                          {prod.variants[0].price.toLocaleString('vi-VN')} đ
                        </p>
                        <button
                          onClick={() => onAddToCart(prod, prod.variants[0])}
                          className="btn-pill-primary"
                          style={{ width: '100%', padding: '6px 12px', fontSize: '12px' }}
                        >
                          <ShoppingBag size={14} /> Thêm giỏ
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Attribute Rows */}
                <tbody>
                  {ATTRIBUTES.map((attr, idx) => {
                    const values = compareList.map((p) => (attr.format ? attr.format(p) : p[attr.key]));
                    const isDifferent = new Set(values).size > 1;

                    if (onlyDifferences && !isDifferent) return null;

                    return (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: '1px solid var(--hairline-soft)',
                          background: isDifferent ? 'rgba(0, 102, 255, 0.03)' : 'transparent'
                        }}
                      >
                        <td style={{ padding: '12px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                          {attr.label}
                        </td>
                        {values.map((val, vIdx) => (
                          <td
                            key={vIdx}
                            style={{
                              padding: '12px',
                              fontSize: '13px',
                              color: 'var(--ink)',
                              background: isDifferent ? 'rgba(0, 102, 255, 0.02)' : 'transparent'
                            }}
                          >
                            {val}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
