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
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../api';
import { PRESET_MODELS } from '../features/vto/VirtualTryOnModal';

// Dedicated Clinical Dermatological Diagnostic Profiles for the 3 Standard Studio Models
const MODEL_DIAGNOSTIC_PROFILES = {
  'model-1-warm': {
    skinScore: 78,
    skinType: 'Da Hỗn Hợp Thiên Dầu (Oily-Dehydrated)',
    skinConcerns: ['Mụn ẩn bã nhờn vùng chữ T', 'Thâm mụn sau viêm (PIE)', 'Lỗ chân lông vùng cánh mũi'],
    metrics: [
      { name: 'Chỉ số bã nhờn (Sebum)', score: 72, level: 'Thừa dầu vùng T', status: 'warning', icon: '💧' },
      { name: 'Mụn viêm & mụn ẩn', score: 65, level: 'Mức độ nhẹ - trung bình', status: 'warning', icon: '🌿' },
      { name: 'Hàng rào màng ẩm (Barrier)', score: 84, level: 'Khá khỏe mạnh', status: 'good', icon: '🛡️' },
      { name: 'Sắc tố thâm nám (Melanin)', score: 70, level: 'Vết thâm mới cần phục hồi', status: 'warning', icon: '✨' },
      { name: 'Độ đàn hồi & Nếp nhăn', score: 92, level: 'Rất tốt (Dưới 25 tuổi)', status: 'good', icon: '🌸' }
    ],
    prescribedRoutine: [
      MOCK_PRODUCTS[1] || MOCK_PRODUCTS[0],
      MOCK_PRODUCTS[0],
      MOCK_PRODUCTS[3] || MOCK_PRODUCTS[0]
    ]
  },
  'model-2-fair': {
    skinScore: 85,
    skinType: 'Da Nhạy Cảm Sáng Màu (Sensitive & Fair)',
    skinConcerns: ['Đỏ da mao mạch gò má', 'Dễ kích ứng khi đổi thời tiết', 'Cần tăng cường màng lipid B5'],
    metrics: [
      { name: 'Chỉ số bã nhờn (Sebum)', score: 88, level: 'Rất cân bằng', status: 'good', icon: '💧' },
      { name: 'Mụn viêm & mụn ẩn', score: 86, level: 'Làn da sạch mịn', status: 'good', icon: '🌿' },
      { name: 'Hàng rào màng ẩm (Barrier)', score: 68, level: 'Cần phục hồi cấp ẩm B5', status: 'warning', icon: '🛡️' },
      { name: 'Sắc tố thâm nám (Melanin)', score: 90, level: 'Sáng hồng, ít hắc tố', status: 'good', icon: '✨' },
      { name: 'Độ đàn hồi & Nếp nhăn', score: 94, level: 'Rất săn chắc', status: 'good', icon: '🌸' }
    ],
    prescribedRoutine: [
      MOCK_PRODUCTS[2] || MOCK_PRODUCTS[0],
      MOCK_PRODUCTS[0],
      MOCK_PRODUCTS[3] || MOCK_PRODUCTS[1]
    ]
  },
  'model-3-medium': {
    skinScore: 89,
    skinType: 'Da Thường Khỏe Mạnh (Balanced & Healthy)',
    skinConcerns: ['Bảo vệ chống oxy hóa', 'Duy trì màng bảo vệ tự nhiên', 'Cấp ẩm nhẹ ban đêm'],
    metrics: [
      { name: 'Chỉ số bã nhờn (Sebum)', score: 85, level: 'Cân bằng lý tưởng', status: 'good', icon: '💧' },
      { name: 'Mụn viêm & mụn ẩn', score: 88, level: 'Không có ổ viêm', status: 'good', icon: '🌿' },
      { name: 'Hàng rào màng ẩm (Barrier)', score: 90, level: 'Màng lipid vững chắc', status: 'good', icon: '🛡️' },
      { name: 'Sắc tố thâm nám (Melanin)', score: 82, level: 'Đều màu, sáng khỏe', status: 'good', icon: '✨' },
      { name: 'Độ đàn hồi & Nếp nhăn', score: 91, level: 'Căng bóng tự nhiên', status: 'good', icon: '🌸' }
    ],
    prescribedRoutine: [
      MOCK_PRODUCTS[0],
      MOCK_PRODUCTS[3] || MOCK_PRODUCTS[0],
      MOCK_PRODUCTS[1] || MOCK_PRODUCTS[0]
    ]
  }
};

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
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Mock analysis result based on scanning
  const [analysisResult, setAnalysisResult] = useState(null);

  // Stop camera tracks cleanly on unmount or when modal is closed
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      let stream = null;
      // Tier 1: Ideal 720p 16:9 for modern laptop webcams
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: false
        });
      } catch (tier1Err) {
        // Tier 2: Flexible user-facing video
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
            audio: false
          });
        } catch (tier2Err) {
          // Tier 3: Basic video true
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
        }
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(e => console.warn('Autoplay prevented:', e));
        };
        setIsCameraActive(true);
      }
    } catch (err) {
      console.warn('Cannot open webcam:', err);
      let message = 'Không thể mở Camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        message = 'Trình duyệt chưa được cấp quyền Camera. Vui lòng nhấn vào biểu tượng ổ khóa 🔒 trên thanh địa chỉ và chọn "Cho phép" (Allow Camera).';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        message = 'Không tìm thấy thiết bị Webcam trên laptop/máy tính của bạn.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        message = 'Webcam đang bị phần mềm khác (Zoom, Teams, Meet hoặc tab khác) chiếm dụng.';
      } else {
        message = `Không thể kết nối webcam: ${err.message || 'Lỗi thiết bị'}.`;
      }
      setCameraError(message);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
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

  const handleSelectModel = (model) => {
    setCapturedImage(model.img);
    stopCamera();
    const profile = MODEL_DIAGNOSTIC_PROFILES[model.id] || MODEL_DIAGNOSTIC_PROFILES['model-1-warm'];
    startAnalysis(profile);
  };

  const startAnalysis = (customResult = null) => {
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
      setAnalysisResult(customResult || MODEL_DIAGNOSTIC_PROFILES['model-1-warm']);
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

        {/* Camera error notification banner */}
        {cameraError && (
          <div
            style={{
              padding: '10px 24px',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              borderBottom: '1px solid rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              fontSize: '12.5px',
              color: '#b91c1c'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
              <span>{cameraError}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={startCamera}
                style={{
                  background: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '3px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Thử lại
              </button>
              <button
                type="button"
                onClick={() => setCameraError(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '11px',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Bỏ qua
              </button>
            </div>
          </div>
        )}

        {/* Body Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* STEP 1: CAPTURE / UPLOAD / SMART FALLBACK STUDIO */}
          {step === 'capture' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '24px', alignItems: 'start' }}>
              {/* Left Viewfinder */}
              <div
                style={{
                  height: '380px',
                  background: 'linear-gradient(135deg, #090d16 0%, #0f172a 100%)',
                  borderRadius: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #1e293b',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
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
                  <div style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
                    <div style={{ width: '110px', height: '140px', border: '2px dashed #ec4899', borderRadius: '50%', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Camera size={34} style={{ color: '#ec4899' }} />
                    </div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#f1f5f9' }}>Khung Scan Biểu Bì Chuẩn 3D</div>
                    <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '4px' }}>
                      Bật webcam hoặc chọn người mẫu chuẩn bên phải để bắt đầu quét
                    </div>
                  </div>
                )}

                {/* Oval scanning guide overlay */}
                <div
                  style={{
                    position: 'absolute',
                    width: '180px',
                    height: '240px',
                    border: '2px solid rgba(16, 185, 129, 0.65)',
                    borderRadius: '50%',
                    boxShadow: '0 0 24px rgba(16, 185, 129, 0.35)',
                    pointerEvents: 'none'
                  }}
                />

                {/* Live stream badge */}
                {isCameraActive && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(6px)',
                      color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      borderRadius: '20px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                    Webcam Live HD
                  </div>
                )}
              </div>

              {/* Right Options & Smart Fallback Studio */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Phương thức quét phân tích làn da:
                  </h4>
                  <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.45, margin: '4px 0 0 0' }}>
                    Thuật toán AI Computer Vision sẽ lập bản đồ 468 điểm tọa độ biểu bì để đo lường độ phản chiếu bã nhờn, mật độ melanin và vi điểm mụn ẩn.
                  </p>
                </div>

                {/* Primary Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {isCameraActive ? (
                    <button
                      type="button"
                      onClick={capturePhotoFromVideo}
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '13px',
                        fontSize: '13.5px',
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={startCamera}
                        style={{
                          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '12px',
                          fontSize: '13px',
                          fontWeight: 750,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 12px rgba(15,23,42,0.2)'
                        }}
                      >
                        <Camera size={16} /> Bật Webcam Laptop
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          color: '#334155',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <Upload size={16} /> Tải ảnh lên
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
                  <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                  <span style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: 650, textTransform: 'uppercase' }}>
                    Hoặc chọn Người mẫu chuẩn Studio (Khuyên dùng)
                  </span>
                  <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                </div>

                {/* 3 PRESET MODELS STUDIO (ZERO-BLANK SCREEN GUARANTEE) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {PRESET_MODELS.map((model) => {
                    const isWarm = model.skinTone === 'WARM';
                    const isCool = model.skinTone === 'COOL';
                    const badgeBg = isWarm ? '#fef3c7' : isCool ? '#ede9fe' : '#e0f2fe';
                    const badgeColor = isWarm ? '#b45309' : isCool ? '#6d28d9' : '#0369a1';
                    const subDesc = isWarm ? 'Châu Á / Dầu mụn' : isCool ? 'Trắng hồng / Nhạy cảm' : 'Khỏe khoắn / Cân bằng';

                    return (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => handleSelectModel(model)}
                        style={{
                          padding: '10px 8px',
                          borderRadius: '14px',
                          border: '1.5px solid #e2e8f0',
                          background: '#f8fafc',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          gap: '6px',
                          transition: 'all 150ms ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#10b981';
                          e.currentTarget.style.backgroundColor = '#ffffff';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(16,185,129,0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{ position: 'relative', width: '54px', height: '54px', borderRadius: '50%', overflow: 'hidden', border: `2px solid ${model.skinHex}` }}>
                          <img
                            src={model.img}
                            alt={model.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '8px',
                            background: badgeBg,
                            color: badgeColor
                          }}
                        >
                          Tone {model.skinTone}
                        </span>
                        <div style={{ fontSize: '11.5px', fontWeight: 750, color: '#1e293b', lineHeight: 1.2 }}>
                          {model.id === 'model-1-warm' ? 'Mẫu 1 (Ấm)' : model.id === 'model-2-fair' ? 'Mẫu 2 (Sáng)' : 'Mẫu 3 (Tự Nhiên)'}
                        </div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>
                          {subDesc}
                        </div>
                      </button>
                    );
                  })}
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
