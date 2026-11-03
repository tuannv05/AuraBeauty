import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  Plus,
  Trash2,
  ChevronRight,
  Info,
  Droplets,
  Layers,
  ShoppingBag
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../api';

const DEFAULT_MORNING_STEPS = [
  { id: 'm1', stepNum: 1, name: 'Sữa rửa mặt tạo bọt dịu nhẹ pH 5.5', product: MOCK_PRODUCTS[4], time: '07:00', duration: '1 phút' },
  { id: 'm2', stepNum: 2, name: 'Toner cân bằng & Nước hoa hồng', product: null, customText: 'Nước hoa hồng không cồn làm dịu', time: '07:02', duration: '30 giây' },
  { id: 'm3', stepNum: 3, name: 'Serum Cấp nước Hyaluronic Acid tầng sâu', product: MOCK_PRODUCTS[0], time: '07:04', duration: '2 phút' },
  { id: 'm4', stepNum: 4, name: 'Kem chống nắng quang phổ rộng SPF50+ PA++++', product: MOCK_PRODUCTS[3], time: '07:08', duration: '2 dải ngón tay' }
];

const DEFAULT_EVENING_STEPS = [
  { id: 'e1', stepNum: 1, name: 'Tẩy trang Micellar làm sạch sâu bã nhờn', product: null, customText: 'Nước tẩy trang dịu nhẹ Bioderma/LRP', time: '21:30', duration: '2 phút' },
  { id: 'e2', stepNum: 2, name: 'Sữa rửa mặt Ceramide củng cố màng lipid', product: MOCK_PRODUCTS[4], time: '21:33', duration: '1 phút' },
  { id: 'e3', stepNum: 3, name: 'Serum Giảm mụn & Phục hồi thâm đỏ', product: MOCK_PRODUCTS[1], time: '21:36', duration: '3 giọt' },
  { id: 'e4', stepNum: 4, name: 'Tinh chất ốc sên tái tạo màng ẩm', product: MOCK_PRODUCTS[2], time: '21:40', duration: '2 lần bơm' }
];

// Active ingredients clash rules matrix
const INCI_CONFLICTS = [
  {
    actives: ['Retinol', 'BHA (Salicylic Acid)'],
    severity: 'high',
    title: 'Xung Đột Nồng Độ Axit & Bong Tróc',
    warning: 'Không nên thoa Retinol và BHA trong cùng một buổi tối. Cả 2 hoạt chất đều có tính bạt sừng mạnh, dễ gây rát đỏ và suy yếu hàng rào bảo vệ da.',
    recommendation: 'Áp dụng phương pháp Skin Cycling: Đêm 1 dùng BHA tẩy tế bào chết $\\rightarrow$ Đêm 2 dùng Retinol $\\rightarrow$ Đêm 3 & 4 phục hồi với B5/Ceramide.'
  },
  {
    actives: ['Vitamin C (L-AA)', 'Niacinamide'],
    severity: 'medium',
    title: 'Lệch Độ pH Sinh Lý',
    warning: 'Vitamin C dạng L-AA cần pH thấp (< 3.5) để hoạt động, trong khi Niacinamide bền vững ở pH 5.5 - 6.5. Dùng sát nhau có thể giảm hiệu năng và gây đỏ bừng mặt tạm thời.',
    recommendation: 'Dùng Vitamin C vào buổi sáng trước kem chống nắng để tăng cường chống oxy hóa; dùng Niacinamide vào buổi tối để kiềm dầu mờ thâm.'
  },
  {
    actives: ['AHA (Glycolic Acid)', 'Retinol'],
    severity: 'high',
    title: 'Nguy Cơ Quá Tải Biểu Bì',
    warning: 'Tẩy da chết hóa học AHA kết hợp Retinol cùng lúc có thể phá vỡ màng lipid tự nhiên.',
    recommendation: 'Dùng cách ngày hoặc dùng AHA buổi sáng và Retinol buổi tối có kẹp kem dưỡng ẩm.'
  }
];

export default function RoutineSchedulerView({
  skinProfile,
  onAddToCart,
  onAddToast,
  onSelectProduct
}) {
  const [activeTab, setActiveTab] = useState('morning'); // 'morning', 'evening', 'conflicts', 'calendar'
  const [currentDay, setCurrentDay] = useState(14); // Day 14 of 28
  const [completedSteps, setCompletedSteps] = useState({ m1: true, m2: true, m3: true, m4: false });

  const toggleStepDone = (id) => {
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!completedSteps[id] && onAddToast) {
      onAddToast({ type: 'success', message: 'Tuyệt vời! Đã hoàn thành một bước chăm sóc da hôm nay.' });
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Top Banner */}
      <div
        style={{
          borderRadius: '24px',
          padding: '28px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '24px',
          boxShadow: '0 12px 30px -5px rgba(15,23,42,0.25)'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(236,72,153,0.2)', color: '#f472b6', padding: '3px 12px', borderRadius: '16px', fontSize: '11.5px', fontWeight: 750, marginBottom: '8px' }}>
            <Sparkles size={13} /> Chu Trình Dưỡng Da Chu Kỳ 28 Ngày Y Khoa
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 850, margin: '0 0 8px 0', letterSpacing: '-0.01em' }}>
            Routine Cá Nhân Hóa & Bộ Kiểm Soát Xung Đột Hoạt Chất
          </h2>
          <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0, lineHeight: 1.5, maxWidth: '600px' }}>
            Hệ thống tự động sắp xếp thứ tự bôi thoa Sáng/Tối, ngăn ngừa xung đột giữa BHA, Retinol, Vitamin C và Niacinamide để bảo vệ hàng rào màng lipid da của bạn.
          </p>
        </div>

        {/* 28-day streak circle */}
        <div
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '20px',
            padding: '16px 20px',
            textAlign: 'center',
            flexShrink: 0
          }}
        >
          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
            Tiến độ chu kỳ thay da
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#f472b6', margin: '4px 0' }}>
            {currentDay} <span style={{ fontSize: '16px', fontWeight: 650, color: '#cbd5e1' }}>/ 28 ngày</span>
          </div>
          <div style={{ fontSize: '11px', color: '#34d399', fontWeight: 700 }}>
            🔥 Chuỗi 14 ngày kiên trì
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('morning')}
          style={{
            padding: '10px 20px',
            borderRadius: '14px',
            border: 'none',
            background: activeTab === 'morning' ? '#fef3c7' : '#f8fafc',
            color: activeTab === 'morning' ? '#b45309' : '#64748b',
            fontSize: '13px',
            fontWeight: 750,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Sun size={17} style={{ color: '#f59e0b' }} /> Chu Trình Sáng (Bảo Vệ)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('evening')}
          style={{
            padding: '10px 20px',
            borderRadius: '14px',
            border: 'none',
            background: activeTab === 'evening' ? '#eff6ff' : '#f8fafc',
            color: activeTab === 'evening' ? '#1d4ed8' : '#64748b',
            fontSize: '13px',
            fontWeight: 750,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Moon size={17} style={{ color: '#3b82f6' }} /> Chu Trình Tối (Đặc Trị & Phục Hồi)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('conflicts')}
          style={{
            padding: '10px 20px',
            borderRadius: '14px',
            border: 'none',
            background: activeTab === 'conflicts' ? '#fff1f2' : '#f8fafc',
            color: activeTab === 'conflicts' ? '#e11d48' : '#64748b',
            fontSize: '13px',
            fontWeight: 750,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <AlertTriangle size={17} style={{ color: '#e11d48' }} /> Cảnh Báo Xung Đột Hoạt Chất ({INCI_CONFLICTS.length})
        </button>
      </div>

      {/* Tab: MORNING ROUTINE */}
      {activeTab === 'morning' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '12px 18px', background: '#fefce8', border: '1px solid #fef08a', borderRadius: '14px', fontSize: '12.5px', color: '#854d0e', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={16} style={{ flexShrink: 0 }} />
            <span>
              <strong>Nguyên tắc buổi sáng:</strong> Tập trung vào Làm sạch nhẹ dịu $\rightarrow$ Cấp ẩm mỏng nhẹ $\rightarrow$ Chống nắng phổ rộng bảo vệ da trước tia UV và ánh sáng xanh màn hình.
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {DEFAULT_MORNING_STEPS.map((s) => {
              const isDone = !!completedSteps[s.id];
              return (
                <div
                  key={s.id}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '18px',
                    border: isDone ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                    background: isDone ? '#f0fdf4' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                      type="button"
                      onClick={() => toggleStepDone(s.id)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: isDone ? 'none' : '2px solid #cbd5e1',
                        background: isDone ? '#10b981' : '#ffffff',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      {isDone && <CheckCircle2 size={18} />}
                    </button>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, background: '#fef3c7', color: '#b45309', padding: '1px 7px', borderRadius: '8px' }}>
                          Bước {s.stepNum}
                        </span>
                        <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                          <Clock size={11} style={{ display: 'inline', verticalAlign: '-1px' }} /> {s.time} ({s.duration})
                        </span>
                      </div>
                      <h4 style={{ fontSize: '14.5px', fontWeight: 750, color: '#0f172a', margin: '4px 0 2px 0' }}>
                        {s.name}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                        {s.product ? s.product.name : s.customText}
                      </p>
                    </div>
                  </div>

                  {s.product ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={s.product.images[0]}
                        alt={s.product.name}
                        style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'contain', background: '#f8fafc', padding: '2px', border: '1px solid #e2e8f0' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectProduct) onSelectProduct(s.product);
                        }}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          padding: '6px 12px',
                          borderRadius: '10px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Chi tiết →
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (onAddToast) onAddToast({ type: 'info', message: 'Bạn có thể chọn sản phẩm từ danh mục để gán vào bước này!' });
                      }}
                      style={{
                        background: '#fdf2f8',
                        color: '#db2777',
                        border: '1px solid #fbcfe8',
                        padding: '6px 12px',
                        borderRadius: '10px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      + Gán sản phẩm
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: EVENING ROUTINE */}
      {activeTab === 'evening' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '12px 18px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', fontSize: '12.5px', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={16} style={{ flexShrink: 0 }} />
            <span>
              <strong>Nguyên tắc buổi tối:</strong> Làm sạch kép (Double Cleansing) $\rightarrow$ Cân bằng $\rightarrow$ Đặc trị hoạt chất bạt sừng/tái tạo (BHA/Retinol/Niacinamide) $\rightarrow$ Khóa ẩm nuôi dưỡng màng Ceramide qua đêm.
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {DEFAULT_EVENING_STEPS.map((s) => {
              const isDone = !!completedSteps[s.id];
              return (
                <div
                  key={s.id}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '18px',
                    border: isDone ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                    background: isDone ? '#f0fdf4' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                      type="button"
                      onClick={() => toggleStepDone(s.id)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: isDone ? 'none' : '2px solid #cbd5e1',
                        background: isDone ? '#10b981' : '#ffffff',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      {isDone && <CheckCircle2 size={18} />}
                    </button>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, background: '#dbeafe', color: '#1e40af', padding: '1px 7px', borderRadius: '8px' }}>
                          Bước {s.stepNum}
                        </span>
                        <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                          <Clock size={11} style={{ display: 'inline', verticalAlign: '-1px' }} /> {s.time} ({s.duration})
                        </span>
                      </div>
                      <h4 style={{ fontSize: '14.5px', fontWeight: 750, color: '#0f172a', margin: '4px 0 2px 0' }}>
                        {s.name}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                        {s.product ? s.product.name : s.customText}
                      </p>
                    </div>
                  </div>

                  {s.product ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={s.product.images[0]}
                        alt={s.product.name}
                        style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'contain', background: '#f8fafc', padding: '2px', border: '1px solid #e2e8f0' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectProduct) onSelectProduct(s.product);
                        }}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          padding: '6px 12px',
                          borderRadius: '10px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Chi tiết →
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (onAddToast) onAddToast({ type: 'info', message: 'Bạn có thể chọn sản phẩm từ danh mục để gán vào bước này!' });
                      }}
                      style={{
                        background: '#fdf2f8',
                        color: '#db2777',
                        border: '1px solid #fbcfe8',
                        padding: '6px 12px',
                        borderRadius: '10px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      + Gán sản phẩm
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: CONFLICT DETECTOR */}
      {activeTab === 'conflicts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ padding: '14px 20px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '16px', color: '#9f1239' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={18} /> Hệ Thống Kiểm Tra Xung Đột Hoạt Chất Tự Động
            </h4>
            <p style={{ fontSize: '12.5px', margin: 0, lineHeight: 1.5 }}>
              Aura Beauty Mall áp dụng ma trận đối chiếu bảng thành phần INCI chuẩn Y khoa để cảnh báo người dùng không kết hợp các thành phần kỵ nhau, bảo vệ tối đa sức khỏe làn da.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {INCI_CONFLICTS.map((cf, idx) => (
              <div
                key={idx}
                style={{
                  padding: '20px',
                  borderRadius: '18px',
                  border: '1px solid #fecdd3',
                  background: '#ffffff',
                  boxShadow: '0 4px 12px rgba(239,68,68,0.06)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ background: '#e11d48', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '10px' }}>
                      Cảnh báo: {cf.actives.join(' ⚡ ')}
                    </span>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {cf.title}
                    </h4>
                  </div>
                  <span style={{ fontSize: '11.5px', color: '#e11d48', fontWeight: 700 }}>
                    Mức độ: {cf.severity === 'high' ? 'Nghiêm trọng (High)' : 'Lưu ý (Moderate)'}
                  </span>
                </div>

                <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: '0 0 10px 0' }}>
                  {cf.warning}
                </p>

                <div style={{ padding: '10px 14px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0', fontSize: '12px', color: '#065f46', lineHeight: 1.5 }}>
                  <strong>💡 Giải pháp khoa học từ Dược sĩ:</strong> {cf.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
