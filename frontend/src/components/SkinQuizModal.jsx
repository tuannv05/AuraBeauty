import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, ArrowLeft } from 'lucide-react';

export default function SkinQuizModal({ isOpen, onClose, onCompleteQuiz, onAddToast }) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    skinType: 'COMBINATION',
    concern: 'Mụn & thâm',
    sensitivity: 'Nhẹ',
    budget: 'Trung bình'
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Completed
      onCompleteQuiz(answers);
      onAddToast({ type: 'success', message: '🎉 Đã lưu kết quả Routine da liễu cá nhân hóa thành công!' });
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px', width: '92%', padding: '28px', position: 'relative' }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)' }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--canvas-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
            <Sparkles size={22} style={{ color: '#0066ff' }} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Trắc Nghiệm Routine Da Trong 1 Phút</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Bước {step} trên 4: Khảo sát thói quen & thể trạng da</p>

          {/* Progress bar */}
          <div style={{ width: '100%', height: '4px', background: 'var(--hairline)', borderRadius: '9999px', marginTop: '12px', overflow: 'hidden' }}>
            <div style={{ width: `${(step / 4) * 100}%`, height: '100%', background: 'var(--ink)', transition: 'width 250ms ease' }} />
          </div>
        </div>

        {/* Step 1: Skin Type */}
        {step === 1 && (
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 650, marginBottom: '14px' }}>1. Da bạn cảm thấy thế nào vào giữa ngày?</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {[
                { id: 'OILY', label: 'Bóng nhờn toàn mặt, đặc biệt vùng chữ T và trán' },
                { id: 'DRY', label: 'Căng rát, sần sùi hoặc bong tróc vảy nhỏ' },
                { id: 'COMBINATION', label: 'Đổ dầu vùng mũi/trán nhưng hai má lại bình thường hoặc khô' },
                { id: 'SENSITIVE', label: 'Dễ châm chích, ửng đỏ khi ra nắng hoặc đổi mỹ phẩm' },
                { id: 'NORMAL', label: 'Khá cân bằng, không quá khô cũng không quá dầu' }
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setAnswers({ ...answers, skinType: opt.id })}
                  style={{
                    padding: '12px 16px',
                    border: answers.skinType === opt.id ? '2px solid var(--ink)' : '1px solid var(--hairline)',
                    borderRadius: 'var(--radius-sm)',
                    background: answers.skinType === opt.id ? 'var(--canvas-soft)' : 'var(--canvas)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{opt.label}</span>
                  {answers.skinType === opt.id && <Check size={16} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Main Concern */}
        {step === 2 && (
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 650, marginBottom: '14px' }}>2. Vấn đề da bạn muốn cải thiện nhất hiện nay?</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {[
                'Mụn viêm sưng, mụn đầu đen & thâm mụn',
                'Lỗ chân lông to & bít tắc bã nhờn',
                'Khô tróc, mất nước & da thiếu sức sống',
                'Lão hóa sớm, nếp nhăn đuôi mắt & chảy xệ',
                'Da xỉn màu, đốm nâu tàn nhang do nắng'
              ].map((opt) => (
                <div
                  key={opt}
                  onClick={() => setAnswers({ ...answers, concern: opt })}
                  style={{
                    padding: '12px 16px',
                    border: answers.concern === opt ? '2px solid var(--ink)' : '1px solid var(--hairline)',
                    borderRadius: 'var(--radius-sm)',
                    background: answers.concern === opt ? 'var(--canvas-soft)' : 'var(--canvas)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{opt}</span>
                  {answers.concern === opt && <Check size={16} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Sensitivity */}
        {step === 3 && (
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 650, marginBottom: '14px' }}>3. Tiền sử kích ứng với thành phần mỹ phẩm?</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {[
                'Rất hiếm khi kích ứng, da khỏe',
                'Dị ứng với cồn khô (Alcohol Denat) và hương liệu nồng',
                'Đang dùng treatment (Tretinoin/AHA/BHA) cần phục hồi màng ẩm',
                'Da cực kỳ nhạy cảm, chỉ dùng được dược mỹ phẩm thuần chay'
              ].map((opt) => (
                <div
                  key={opt}
                  onClick={() => setAnswers({ ...answers, sensitivity: opt })}
                  style={{
                    padding: '12px 16px',
                    border: answers.sensitivity === opt ? '2px solid var(--ink)' : '1px solid var(--hairline)',
                    borderRadius: 'var(--radius-sm)',
                    background: answers.sensitivity === opt ? 'var(--canvas-soft)' : 'var(--canvas)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{opt}</span>
                  {answers.sensitivity === opt && <Check size={16} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Budget */}
        {step === 4 && (
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 650, marginBottom: '14px' }}>4. Ngân sách dự kiến cho một chu trình skincare?</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {[
                'Tiết kiệm sinh viên (Dưới 500.000đ / bộ)',
                'Tiêu chuẩn hiệu quả (500.000đ – 1.200.000đ)',
                'Dược mỹ phẩm cao cấp quốc tế (Trên 1.500.000đ)'
              ].map((opt) => (
                <div
                  key={opt}
                  onClick={() => setAnswers({ ...answers, budget: opt })}
                  style={{
                    padding: '12px 16px',
                    border: answers.budget === opt ? '2px solid var(--ink)' : '1px solid var(--hairline)',
                    borderRadius: 'var(--radius-sm)',
                    background: answers.budget === opt ? 'var(--canvas-soft)' : 'var(--canvas)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{opt}</span>
                  {answers.budget === opt && <Check size={16} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="btn-pill-soft"
              style={{ fontSize: '13px' }}
            >
              <ArrowLeft size={14} /> Quay lại
            </button>
          ) : <div />}

          <button
            onClick={handleNext}
            className="btn-pill-primary"
            style={{ fontSize: '13px', padding: '10px 22px' }}
          >
            {step === 4 ? 'Xem Routine của tôi' : 'Tiếp theo'} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
