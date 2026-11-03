import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Droplets,
  Flame,
  Award,
  ArrowRight
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../api';

export default function SkinScannerModal({
  isOpen,
  onClose,
  onUpdateSkinProfile,
  onAddToCart,
  onAddToast,
  onSelectProduct
}) {
  if (!isOpen) return null;

  const [step, setStep] = useState('capture'); // 'capture', 'analyzing', 'result'
  const [analyzingProgress, setAnalyzingProgress] = useState(0);
  const [analyzingStatus, setAnalyzingStatus] = useState('Khởi tạo mô hình AI...');
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Mock analysis result based on scanning
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: 'user' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      console.warn('Cannot open webcam:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhotoFromVideo = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, 640, 640);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(dataUrl);
    stopCamera();
    startAnalysis();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCapturedImage(url);
      stopCamera();
      startAnalysis();
    }
  };

  const handleSelectDemoSelfie = () => {
    setCapturedImage('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80');
    stopCamera();
    startAnalysis();
  };

  const startAnalysis = () => {
    setStep('analyzing');
    setAnalyzingProgress(10);
    setAnalyzingStatus('Đang quét lưới điểm gương mặt (Face Landmark 468)...');

    setTimeout(() => {
      setAnalyzingProgress(35);
      setAnalyzingStatus('Đo đạc độ phản chiếu bã nhờn & lỗ chân lông vùng chữ T...');
    }, 700);

    setTimeout(() => {
      setAnalyzingProgress(65);
      setAnalyzingStatus('Phân tích mật độ hắc tố Melanin & vi điểm thâm sưng viêm...');
    }, 1400);

    setTimeout(() => {
      setAnalyzingProgress(90);
      setAnalyzingStatus('Tổng hợp phác đồ dược mỹ phẩm chuẩn Y khoa...');
    }, 2100);

    setTimeout(() => {
      setAnalyzingProgress(100);
      setAnalysisResult({
        skinScore: 78,
        skinType: 'Hỗn hợp thiên dầu (Oily-Dehydrated)',
        skinConcerns: ['Mụn ẩn bã nhờn', 'Thâm mụn sau viêm (PIE)', 'Lỗ chân lông vùng mũi'],
        metrics: [
          { name: 'Chỉ số bã nhờn (Sebum)', score: 72, level: 'Thừa dầu vùng T', status: 'warning', icon: '💧' },
          { name: 'Mụn viêm & mụn ẩn', score: 65, level: 'Mức độ nhẹ - trung bình', status: 'warning', icon: '🌿' },
          { name: 'Hàng rào màng ẩm (Barrier)', score: 84, level: 'Khá khỏe mạnh', status: 'good', icon: '🛡️' },
          { name: 'Sắc tố thâm nám (Melanin)', score: 70, level: 'Vết thâm mới cần phục hồi', status: 'warning', icon: '✨' },
          { name: 'Độ đàn hồi & Nếp nhăn', score: 92, level: 'Rất tốt (Dưới 25 tuổi)', status: 'good', icon: '🌸' }
        ],
        prescribedRoutine: [
          MOCK_PRODUCTS[1], // La Roche-Posay Effaclar Duo+M
          MOCK_PRODUCTS[0], // Innisfree Green Tea Seed Serum
          MOCK_PRODUCTS[3]  // Anessa Perfect UV Sunscreen
        ]
      });
      setStep('result');
    }, 2800);
  };

  const handleApplyToSkinProfile = () => {
    if (onUpdateSkinProfile && analysisResult) {
      onUpdateSkinProfile({
        skinType: 'oily',
        concerns: ['acne', 'pores', 'dark_spots'],
        sensitivity: 'medium',
        skinScore: analysisResult.skinScore
      });
    }
    if (onAddToast) {
      onAddToast({
        type: 'success',
        message: 'Đã cập nhật Hồ sơ làn da (Skin Profile) thành công từ kết quả AI Scanner!'
      });
    }
    onClose();
  };

  const handleAddFullRoutineToCart = () => {
    if (!analysisResult?.prescribedRoutine) return;
    analysisResult.prescribedRoutine.forEach((prod) => {
      if (onAddToCart) {
        onAddToCart({
          id: prod.id,
          name: prod.name,
          variantTitle: prod.variants[0].title,
          variantSku: prod.variants[0].sku,
          shopId: prod.shopId,
          price: prod.variants[0].price,
          quantity: 1,
          image: prod.images[0]
        });
      }
    });
    if (onAddToast) {
      onAddToast({
        type: 'success',
        message: 'Đã thêm trọn bộ 3 sản phẩm theo phác đồ AI vào giỏ hàng thành công!'
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
          width: '880px',
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
            padding: '16px 24px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(16,185,129,0.4)'
              }}
            >
              <Sparkles size={20} style={{ color: '#ffffff' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                Aura AI Skin Scanner
                <span style={{ fontSize: '11px', background: 'rgba(16,185,129,0.2)', color: '#34d399', padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.4)' }}>
                  Computer Vision Da Liễu
                </span>
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Phân tích tình trạng biểu bì, mụn, thâm, bã nhờn và đề xuất phác đồ chuẩn y khoa
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
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
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* STEP 1: CAPTURE / UPLOAD */}
          {step === 'capture' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'center' }}>
              {/* Left Viewfinder */}
              <div
                style={{
                  height: '360px',
                  background: '#090d16',
                  borderRadius: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isCameraActive ? (
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
                    <div style={{ width: '120px', height: '150px', border: '2px dashed #ec4899', borderRadius: '50%', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Camera size={36} style={{ color: '#ec4899' }} />
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>Khung canh chuẩn khuôn mặt</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Chụp nơi đủ sáng, không đeo kính râm</div>
                  </div>
                )}

                {/* Oval scanning guide overlay */}
                <div
                  style={{
                    position: 'absolute',
                    width: '180px',
                    height: '240px',
                    border: '2px solid rgba(16, 185, 129, 0.6)',
                    borderRadius: '50%',
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
                    pointerEvents: 'none'
                  }}
                />
              </div>

              {/* Right Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Chọn cách chụp ảnh khuôn mặt:
                </h4>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                  Thuật toán Computer Vision sẽ quét 468 điểm tọa độ trên gương mặt để đo lường độ phản chiếu bã nhờn, mật độ sắc tố melanin và tình trạng mụn ẩn.
                </p>

                {isCameraActive ? (
                  <button
                    type="button"
                    onClick={capturePhotoFromVideo}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '14px',
                      padding: '14px',
                      fontSize: '14px',
                      fontWeight: 750,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(16,185,129,0.3)'
                    }}
                  >
                    <Camera size={18} /> Chụp & Bắt Đầu Phân Tích Ngay
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startCamera}
                    style={{
                      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '14px',
                      padding: '14px',
                      fontSize: '14px',
                      fontWeight: 750,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Camera size={18} /> Bật Webcam Thiết Bị
                  </button>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>hoặc</span>
                  <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#334155',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Upload size={16} /> Tải ảnh chân dung
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />

                  <button
                    type="button"
                    onClick={handleSelectDemoSelfie}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1px solid #fbcfe8',
                      background: '#fdf2f8',
                      color: '#db2777',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Sparkles size={16} /> Dùng ảnh mẫu thử
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ANALYZING ANIMATION */}
          {step === 'analyzing' && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 24px auto' }}>
                <img
                  src={capturedImage}
                  alt="Captured"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', border: '4px solid #10b981' }}
                />
                {/* Laser scan line animation */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: '#10b981',
                    boxShadow: '0 0 12px #10b981',
                    top: `${analyzingProgress}%`,
                    transition: 'top 0.3s ease'
                  }}
                />
              </div>

              <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                AI Đang Quét & Chẩn Đoán Làn Da...
              </h4>
              <p style={{ fontSize: '13px', color: '#10b981', fontWeight: 650, marginBottom: '20px' }}>
                {analyzingStatus}
              </p>

              {/* Progress bar */}
              <div style={{ width: '320px', height: '8px', background: '#e2e8f0', borderRadius: '999px', margin: '0 auto', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${analyzingProgress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #10b981, #059669)',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginTop: '8px', display: 'block' }}>
                {analyzingProgress}%
              </span>
            </div>
          )}

          {/* STEP 3: DETAILED MEDICAL RESULT */}
          {step === 'result' && analysisResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Top Banner: Score & Type */}
              <div
                style={{
                  padding: '20px 24px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  border: '1px solid #bbf7d0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      background: '#10b981',
                      color: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 14px rgba(16,185,129,0.35)'
                    }}
                  >
                    <span style={{ fontSize: '24px', fontWeight: 900, lineHeight: 1 }}>{analysisResult.skinScore}</span>
                    <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase' }}>Điểm da</span>
                  </div>

                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 750, color: '#047857', textTransform: 'uppercase' }}>
                      Kết quả chẩn đoán AI:
                    </div>
                    <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#064e3b', margin: '2px 0 6px 0' }}>
                      {analysisResult.skinType}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {analysisResult.skinConcerns.map((c, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '11px',
                            fontWeight: 650,
                            background: '#ffffff',
                            color: '#065f46',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            border: '1px solid #a7f3d0'
                          }}
                        >
                          • {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleApplyToSkinProfile}
                  style={{
                    background: '#047857',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '10px 18px',
                    fontSize: '12.5px',
                    fontWeight: 750,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexShrink: 0
                  }}
                >
                  <CheckCircle2 size={16} /> Đồng bộ vào Hồ Sơ Da
                </button>
              </div>

              {/* 5 Clinical Metrics Grid */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                  Phân tích 5 chỉ số biểu bì da liễu:
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                  {analysisResult.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px',
                        borderRadius: '14px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '20px', marginBottom: '4px' }}>{m.icon}</div>
                      <div style={{ fontSize: '11.5px', fontWeight: 750, color: '#1e293b', marginBottom: '4px' }}>
                        {m.name}
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 850, color: m.status === 'good' ? '#10b981' : '#f59e0b', marginBottom: '2px' }}>
                        {m.score}/100
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>{m.level}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prescribed Routine Products */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Phác đồ 3 bước điều trị được AI đề xuất (Chính hãng CBMP):
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddFullRoutineToCart}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '6px 14px',
                      fontSize: '11.5px',
                      fontWeight: 750,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <ShoppingBag size={14} /> Thêm cả bộ vào giỏ hàng
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                  {analysisResult.prescribedRoutine.map((prod, pIdx) => (
                    <div
                      key={prod.id}
                      style={{
                        padding: '12px',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                        background: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <div style={{ position: 'relative', height: '140px', borderRadius: '10px', overflow: 'hidden', marginBottom: '8px' }}>
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            top: '6px',
                            left: '6px',
                            background: '#0f172a',
                            color: '#ffffff',
                            fontSize: '10px',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '10px'
                          }}
                        >
                          Bước {pIdx + 1}
                        </span>
                      </div>

                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#ec4899', textTransform: 'uppercase' }}>
                        {prod.brand}
                      </div>
                      <h5
                        style={{
                          fontSize: '12px',
                          fontWeight: 750,
                          color: '#0f172a',
                          margin: '2px 0 6px 0',
                          lineHeight: 1.35,
                          height: '32px',
                          overflow: 'hidden'
                        }}
                      >
                        {prod.name}
                      </h5>
                      <div style={{ fontSize: '13px', fontWeight: 850, color: '#e11d48', marginTop: 'auto' }}>
                        {prod.variants[0].price.toLocaleString('vi-VN')} ₫
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectProduct) onSelectProduct(prod);
                          onClose();
                        }}
                        style={{
                          marginTop: '8px',
                          padding: '6px',
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#334155',
                          cursor: 'pointer'
                        }}
                      >
                        Xem chi tiết →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
