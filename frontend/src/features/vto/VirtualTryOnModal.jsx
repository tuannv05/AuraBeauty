// frontend/src/features/vto/VirtualTryOnModal.jsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Sparkles,
  X,
  Camera,
  Upload,
  ShoppingBag,
  Bot,
  Check,
  ZoomIn,
  User,
  Sliders,
  Sparkle
} from 'lucide-react';
import { apiSaveSkinProfile } from '../../api';
import {
  renderCompleteMakeupLook,
  analyzeSkinToneFromCanvas,
  hexToRgba
} from './vtoEngine';
import { LIP_OUTER_LOOP } from './faceLandmarks';
import presetLandmarksData from './presetLandmarks.json';

// High-resolution models with 478 MediaPipe 3D landmarks
export const PRESET_MODELS = [
  {
    id: 'model-1-warm',
    name: 'Mẫu 1: Tone Ấm (Asian Warm)',
    skinTone: 'WARM',
    skinHex: '#E8C6A8',
    itaAngle: 34.5,
    fileName: 'model1_warm.jpg',
    img: '/models/model1_warm.jpg',
    landmarks: presetLandmarksData['model1_warm.jpg']
  },
  {
    id: 'model-2-fair',
    name: 'Mẫu 2: Tone Sáng (Fair Radiant)',
    skinTone: 'COOL',
    skinHex: '#F6DDD0',
    itaAngle: 42.0,
    fileName: 'model2_fair.jpg',
    img: '/models/model2_fair.jpg',
    landmarks: presetLandmarksData['model2_fair.jpg']
  },
  {
    id: 'model-3-medium',
    name: 'Mẫu 3: Tone Tự Nhiên (Neutral Medium)',
    skinTone: 'NEUTRAL',
    skinHex: '#E2B895',
    itaAngle: 28.5,
    fileName: 'model3_medium.jpg',
    img: '/models/model3_medium.jpg',
    landmarks: presetLandmarksData['model3_medium.jpg']
  }
];

// Default Catalog for 4 categories
export const DEFAULT_VTO_CATALOG = {
  LIPSTICK: {
    categoryName: 'Son môi',
    icon: '💄',
    defaultProduct: {
      id: 'prod-vto-lip',
      name: 'Son Lì Cao Cấp Velvet Matte Lip Tint',
      price: 290000,
      brand: 'Aura Cosmetics'
    },
    shades: [
      { skuCode: 'LIP-01', shadeName: '01 Ruby Matte (Đỏ Nhung)', hexColor: '#9B111E', finishType: 'MATTE', opacity: 0.85, glossiness: 0.05, shimmerIntensity: 0.0, bestUndertone: 'ALL' },
      { skuCode: 'LIP-02', shadeName: '02 Brick Velvet (Đỏ Gạch)', hexColor: '#B84A39', finishType: 'VELVET', opacity: 0.82, glossiness: 0.15, shimmerIntensity: 0.0, bestUndertone: 'WARM' },
      { skuCode: 'LIP-03', shadeName: '03 Peach Gloss (Cam Đào Mọng)', hexColor: '#E06D77', finishType: 'GLOSSY', opacity: 0.75, glossiness: 0.85, shimmerIntensity: 0.2, bestUndertone: 'WARM' },
      { skuCode: 'LIP-04', shadeName: '04 Berry Plum (Hồng Mận MLBB)', hexColor: '#722F37', finishType: 'SATIN', opacity: 0.82, glossiness: 0.40, shimmerIntensity: 0.0, bestUndertone: 'COOL' },
      { skuCode: 'LIP-05', shadeName: '05 Pomeloco (Cam San Hô)', hexColor: '#E8614D', finishType: 'MATTE', opacity: 0.80, glossiness: 0.10, shimmerIntensity: 0.0, bestUndertone: 'WARM' },
      { skuCode: 'LIP-06', shadeName: '06 Rosiental (Hoa Hồng Khô)', hexColor: '#C84B56', finishType: 'VELVET', opacity: 0.82, glossiness: 0.20, shimmerIntensity: 0.0, bestUndertone: 'ALL' }
    ]
  },
  BLUSH: {
    categoryName: 'Phấn má',
    icon: '🌸',
    defaultProduct: {
      id: 'prod-vto-blush',
      name: 'Phấn Má Hồng Mịn Nhẹ Soft Glow',
      price: 240000,
      brand: 'Aura Cosmetics'
    },
    shades: [
      { skuCode: 'BLUSH-01', shadeName: '01 Coral Sunset', hexColor: '#F28482', finishType: 'MATTE', opacity: 0.38, glossiness: 0.0, shimmerIntensity: 0.0, bestUndertone: 'WARM' },
      { skuCode: 'BLUSH-02', shadeName: '02 Baby Pink', hexColor: '#F4978E', finishType: 'SATIN', opacity: 0.35, glossiness: 0.2, shimmerIntensity: 0.1, bestUndertone: 'COOL' },
      { skuCode: 'BLUSH-03', shadeName: '03 Warm Terracotta', hexColor: '#CD6A51', finishType: 'MATTE', opacity: 0.34, glossiness: 0.0, shimmerIntensity: 0.0, bestUndertone: 'WARM' }
    ]
  },
  FOUNDATION: {
    categoryName: 'Kem nền',
    icon: '🧴',
    defaultProduct: {
      id: 'prod-vto-found',
      name: 'Kem Nền Che Phủ Tự Nhiên Perfect Cover',
      price: 450000,
      brand: 'Aura Cosmetics'
    },
    shades: [
      { skuCode: 'FND-21N', shadeName: '21N Ivory (Sáng)', hexColor: '#F3D6C6', finishType: 'SATIN', opacity: 0.28, glossiness: 0.1, shimmerIntensity: 0.0, bestUndertone: 'COOL' },
      { skuCode: 'FND-23W', shadeName: '23W Sand (Tự Nhiên)', hexColor: '#E5B899', finishType: 'MATTE', opacity: 0.32, glossiness: 0.0, shimmerIntensity: 0.0, bestUndertone: 'WARM' },
      { skuCode: 'FND-25N', shadeName: '25N Honey (Ấm)', hexColor: '#D8A47F', finishType: 'SATIN', opacity: 0.30, glossiness: 0.1, shimmerIntensity: 0.0, bestUndertone: 'WARM' }
    ]
  },
  EYESHADOW: {
    categoryName: 'Phấn mắt',
    icon: '✨',
    defaultProduct: {
      id: 'prod-vto-eye',
      name: 'Bảng Phấn Mắt 4 Ô Shimmer & Matte',
      price: 320000,
      brand: 'Aura Cosmetics'
    },
    shades: [
      { skuCode: 'EYE-01', shadeName: '01 Bronze Gold', hexColor: '#A66E4E', finishType: 'SHIMMER', opacity: 0.50, glossiness: 0.3, shimmerIntensity: 0.8, bestUndertone: 'WARM' },
      { skuCode: 'EYE-02', shadeName: '02 Dusty Rose', hexColor: '#C48B9F', finishType: 'MATTE', opacity: 0.50, glossiness: 0.0, shimmerIntensity: 0.0, bestUndertone: 'COOL' },
      { skuCode: 'EYE-03', shadeName: '03 Champagne Glow', hexColor: '#D4AF37', finishType: 'SHIMMER', opacity: 0.45, glossiness: 0.4, shimmerIntensity: 0.9, bestUndertone: 'ALL' }
    ]
  }
};

/**
 * Calculates macro bounding crop around lips and maps all landmarks to the cropped viewport.
 */
function computeMacroTransform(landmarks) {
  if (!landmarks || landmarks.length === 0) return null;

  const xs = LIP_OUTER_LOOP.map(i => landmarks[i].x);
  const ys = LIP_OUTER_LOOP.map(i => landmarks[i].y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const span = Math.max(maxX - minX, maxY - minY);
  const cropSize = Math.min(0.55, span * 2.3);

  const cropX = Math.max(0, Math.min(1 - cropSize, cx - cropSize / 2));
  const cropY = Math.max(0, Math.min(1 - cropSize, cy - cropSize / 2));

  const macroLandmarks = landmarks.map(pt => ({
    x: (pt.x - cropX) / cropSize,
    y: (pt.y - cropY) / cropSize,
    z: pt.z
  }));

  return { cropX, cropY, cropSize, macroLandmarks };
}

export default function VirtualTryOnModal({
  isOpen,
  onClose,
  initialProduct = null,
  initialVariant = null,
  currentUser = null,
  onAddToCart = () => {},
  onAddToast = () => {}
}) {
  // Input mode: 'preset' (model photos) | 'camera' (webcam) | 'upload' (user photo)
  const [mode, setMode] = useState('preset');
  const [selectedModel, setSelectedModel] = useState(PRESET_MODELS[0]);
  const [isMacroView, setIsMacroView] = useState(false); // Default to full portrait view so user sees complete look, easily toggleable!
  const [uploadedImgUrl, setUploadedImgUrl] = useState(null);
  const [uploadedLandmarks, setUploadedLandmarks] = useState(null);

  // Active Category tab: 'LIPSTICK' | 'BLUSH' | 'FOUNDATION' | 'EYESHADOW'
  const [activeTab, setActiveTab] = useState('LIPSTICK');

  // Active looks for multi-shop mix & match
  const [activeLooks, setActiveLooks] = useState({
    LIPSTICK: DEFAULT_VTO_CATALOG.LIPSTICK.shades[0],
    BLUSH: null,
    FOUNDATION: null,
    EYESHADOW: null
  });

  const [activeProducts, setActiveProducts] = useState({
    LIPSTICK: DEFAULT_VTO_CATALOG.LIPSTICK.defaultProduct,
    BLUSH: DEFAULT_VTO_CATALOG.BLUSH.defaultProduct,
    FOUNDATION: DEFAULT_VTO_CATALOG.FOUNDATION.defaultProduct,
    EYESHADOW: DEFAULT_VTO_CATALOG.EYESHADOW.defaultProduct
  });

  // Split-slider (Before / After) comparison
  const [isSplitView, setIsSplitView] = useState(false);
  const [splitPos, setSplitPos] = useState(50); // percentage 0 to 100

  // Skin Analysis Result
  const [detectedSkin, setDetectedSkin] = useState({
    hexColor: PRESET_MODELS[0].skinHex,
    undertone: PRESET_MODELS[0].skinTone,
    itaAngle: PRESET_MODELS[0].itaAngle
  });
  const [isSavingSkin, setIsSavingSkin] = useState(false);
  const [skinSaveSuccess, setSkinSaveSuccess] = useState(false);

  // AI Advisor SSE Drawer
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState([]);
  const [isAiStreaming, setIsAiStreaming] = useState(false);

  // Refs
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const cachedImgRef = useRef(null);
  const landmarkerRef = useRef(null);
  const [cameraError, setCameraError] = useState(null);

  // Initialize with initialProduct & initialVariant when modal opens
  useEffect(() => {
    if (!initialProduct) return;

    const vto = initialProduct.vtoConfig;
    if (vto && vto.category && vto.shades && vto.shades.length > 0) {
      const rawCat = String(vto.category || '').toUpperCase();
      const cat = DEFAULT_VTO_CATALOG[rawCat] ? rawCat : 'LIPSTICK';
      setActiveTab(cat);

      // Match chosen variant if provided
      let targetShade = vto.shades[0];
      if (initialVariant) {
        const vSku = initialVariant.skuCode || initialVariant.sku;
        const vName = initialVariant.name || initialVariant.title || initialVariant.attributes?.Shade;
        const matched = vto.shades.find(
          (s) => (vSku && s.skuCode === vSku) ||
                 (vName && s.shadeName && (vName.includes(s.shadeName) || s.shadeName.includes(vName)))
        );
        if (matched) targetShade = matched;
      }

      setActiveLooks(prev => ({ ...prev, [cat]: targetShade }));
      setActiveProducts(prev => ({ ...prev, [cat]: initialProduct }));
    } else {
      const catName = (initialProduct.category || '').toLowerCase();
      const prodName = (initialProduct.name || '').toLowerCase();
      let detectedCat = null;
      if (catName.includes('son') || prodName.includes('son') || prodName.includes('lip')) detectedCat = 'LIPSTICK';
      else if (catName.includes('má') || catName.includes('blush') || prodName.includes('má')) detectedCat = 'BLUSH';
      else if (catName.includes('nền') || catName.includes('cushion') || catName.includes('bb') || prodName.includes('cushion')) detectedCat = 'FOUNDATION';
      else if (catName.includes('mắt') || catName.includes('shadow') || prodName.includes('mắt')) detectedCat = 'EYESHADOW';

      if (detectedCat) {
        setActiveTab(detectedCat);
        setActiveLooks(prev => ({ ...prev, [detectedCat]: DEFAULT_VTO_CATALOG[detectedCat].shades[0] }));
        setActiveProducts(prev => ({ ...prev, [detectedCat]: initialProduct }));
      } else {
        // If product is skincare/bodycare, keep elegant default VTO lipstick
        setActiveTab('LIPSTICK');
        setActiveLooks(prev => ({ ...prev, LIPSTICK: DEFAULT_VTO_CATALOG.LIPSTICK.shades[0] }));
        setActiveProducts(prev => ({ ...prev, LIPSTICK: DEFAULT_VTO_CATALOG.LIPSTICK.defaultProduct }));
      }
    }
  }, [initialProduct, initialVariant, isOpen]);

  // Update skin analysis when model changes
  useEffect(() => {
    if (mode === 'preset' && selectedModel) {
      setDetectedSkin({
        hexColor: selectedModel.skinHex,
        undertone: selectedModel.skinTone,
        itaAngle: selectedModel.itaAngle
      });
    }
  }, [mode, selectedModel]);

  // Main canvas render frame using MediaPipe landmarks
  const renderCurrentFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width || 500;
    const h = canvas.height || 500;
    ctx.clearRect(0, 0, w, h);

    const splitRatio = isSplitView ? splitPos / 100 : 1.0;

    // 1. Draw Background Image or Video
    if (mode === 'camera' && videoRef.current && videoRef.current.readyState >= 2) {
      ctx.save();
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0, w, h);
      ctx.restore();

      // In camera mode, if landmarker has results
      if (landmarkerRef.current) {
        try {
          const res = landmarkerRef.current.detectForVideo(videoRef.current, performance.now());
          if (res.faceLandmarks && res.faceLandmarks.length > 0) {
            const rawLandmarks = res.faceLandmarks[0];
            // Mirror x coordinate because video is mirrored
            const mirrored = rawLandmarks.map(p => ({ x: 1 - p.x, y: p.y, z: p.z }));
            renderCompleteMakeupLook(ctx, mirrored, w, h, activeLooks, splitRatio);
          }
        } catch (e) {}
      }
    } else if (mode === 'upload' && cachedImgRef.current) {
      const img = cachedImgRef.current;
      ctx.drawImage(img, 0, 0, w, h);

      if (uploadedLandmarks) {
        renderCompleteMakeupLook(ctx, uploadedLandmarks, w, h, activeLooks, splitRatio);
      }
    } else if (cachedImgRef.current && selectedModel) {
      // PRESET MODEL MODE: Using exact 478 MediaPipe landmarks
      const img = cachedImgRef.current;
      const landmarks = selectedModel.landmarks || presetLandmarksData[selectedModel.fileName];

      if (!landmarks) {
        ctx.drawImage(img, 0, 0, w, h);
        return;
      }

      if (isMacroView) {
        // CẬN MÔI (MACRO CLOSE-UP LIP VIEW)
        const macro = computeMacroTransform(landmarks);
        if (macro) {
          const naturalW = img.naturalWidth || 500;
          const naturalH = img.naturalHeight || 500;
          const sx = macro.cropX * naturalW;
          const sy = macro.cropY * naturalH;
          const sw = macro.cropSize * naturalW;
          const sh = macro.cropSize * naturalH;

          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
          renderCompleteMakeupLook(ctx, macro.macroLandmarks, w, h, activeLooks, splitRatio);
        } else {
          ctx.drawImage(img, 0, 0, w, h);
          renderCompleteMakeupLook(ctx, landmarks, w, h, activeLooks, splitRatio);
        }
      } else {
        // TOÀN MẶT (FULL PORTRAIT VIEW)
        ctx.drawImage(img, 0, 0, w, h);
        renderCompleteMakeupLook(ctx, landmarks, w, h, activeLooks, splitRatio);
      }
    }
  }, [mode, selectedModel, isMacroView, isSplitView, splitPos, activeLooks, uploadedLandmarks]);

  // Camera Management
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: 'user' },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setMode('camera');
        setIsMacroView(false);
      }
    } catch (err) {
      console.warn('Webcam error:', err);
      setCameraError('Không thể mở Camera (thiết bị không có webcam hoặc chưa cấp quyền). Vui lòng chọn ảnh mẫu cận môi bên dưới.');
      setMode('preset');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Image preloading without CORS restriction
  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'camera') return;

    const img = new Image();
    img.src = mode === 'upload' && uploadedImgUrl ? uploadedImgUrl : selectedModel.img;
    img.onload = () => {
      cachedImgRef.current = img;
      renderCurrentFrame();
    };
    if (img.complete) {
      cachedImgRef.current = img;
      renderCurrentFrame();
    }
  }, [isOpen, mode, selectedModel, uploadedImgUrl, renderCurrentFrame]);

  // Render loop
  useEffect(() => {
    if (!isOpen) return;
    let animId;
    if (mode === 'camera') {
      const loop = () => {
        renderCurrentFrame();
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);
    } else {
      renderCurrentFrame();
    }
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isOpen, mode, renderCurrentFrame]);

  // File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImgUrl(url);
      setMode('upload');
      setIsMacroView(false);
      stopCamera();

      // Use model 1 landmarks as initial fallback for uploaded photo
      setUploadedLandmarks(presetLandmarksData['model1_warm.jpg']);
    }
  };

  // Save detected skin tone to user account profile
  const handleSaveSkinProfile = async () => {
    setIsSavingSkin(true);
    setSkinSaveSuccess(false);
    try {
      await apiSaveSkinProfile(currentUser, {
        skinToneHex: detectedSkin.hexColor,
        skinUndertone: detectedSkin.undertone,
        itaAngle: detectedSkin.itaAngle
      });
      setSkinSaveSuccess(true);
      if (onAddToast) {
        onAddToast({
          type: 'success',
          message: `Đã lưu hồ sơ da: Tone ${detectedSkin.undertone} (${detectedSkin.hexColor}) vào tài khoản!`
        });
      }
      setTimeout(() => setSkinSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save skin profile:', err);
    } finally {
      setIsSavingSkin(false);
    }
  };

  // Launch AI Advisor SSE Stream for current shade
  const handleAskAiAdvisor = () => {
    const currentLook = activeLooks[activeTab];
    if (!currentLook) return;

    setIsAiDrawerOpen(true);
    setIsAiStreaming(true);

    const product = activeProducts[activeTab] || { name: DEFAULT_VTO_CATALOG[activeTab]?.defaultProduct?.name || 'Son Môi', id: 'vto-item' };
    setAiChatMessages([{ role: 'ASSISTANT', content: '' }]);

    const params = new URLSearchParams({
      q: `Nhận xét màu ${currentLook.shadeName} của sản phẩm ${product.name}`,
      vtoShadeName: currentLook.shadeName,
      vtoHexColor: currentLook.hexColor,
      vtoFinishType: currentLook.finishType || 'MATTE',
      detectedUndertone: detectedSkin.undertone,
      productId: product.id,
      productName: product.name,
      skinType: currentUser?.skinType || 'COMBINATION'
    });

    const eventSource = new EventSource(`/api/advisor/chat?${params.toString()}`);

    eventSource.onmessage = (event) => {
      setAiChatMessages(prev => {
        const last = prev[prev.length - 1] || { role: 'ASSISTANT', content: '' };
        return [...prev.slice(0, -1), { ...last, content: last.content + event.data }];
      });
    };

    eventSource.onerror = () => {
      eventSource.close();
      setIsAiStreaming(false);
    };

    setTimeout(() => {
      eventSource.close();
      setIsAiStreaming(false);
    }, 12000);
  };

  // Add all active look items to Cart
  const handleBuyActiveLook = () => {
    const itemsToAdd = [];
    Object.entries(activeLooks).forEach(([catKey, shade]) => {
      if (shade) {
        const prod = activeProducts[catKey] || DEFAULT_VTO_CATALOG[catKey].defaultProduct;
        itemsToAdd.push({
          id: prod.id,
          name: prod.name,
          shopId: prod.shopId || 'shop-001',
          image: prod.images?.[0] || 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=200&auto=format&fit=crop&q=80',
          variantSku: shade.skuCode,
          variantTitle: shade.shadeName,
          price: prod.price || (prod.variants?.[0]?.price) || 290000,
          quantity: 1
        });
      }
    });

    if (itemsToAdd.length === 0) return;

    itemsToAdd.forEach(item => onAddToCart(item));
    if (onAddToast) {
      onAddToast({
        type: 'success',
        message: `Đã thêm trọn bộ ${itemsToAdd.length} món trang điểm AR vào giỏ hàng!`
      });
    }
  };

  const selectShade = (catKey, shade) => {
    setActiveLooks(prev => ({ ...prev, [catKey]: shade }));
  };

  const removeShade = (catKey) => {
    setActiveLooks(prev => ({ ...prev, [catKey]: null }));
  };

  if (!isOpen) return null;

  const currentTabShades = (activeProducts[activeTab]?.vtoConfig?.shades)
    || DEFAULT_VTO_CATALOG[activeTab]?.shades
    || DEFAULT_VTO_CATALOG.LIPSTICK.shades;

  const activeLookCount = Object.values(activeLooks).filter(Boolean).length;
  const totalActivePrice = Object.entries(activeLooks).reduce((sum, [catKey, shade]) => {
    if (!shade) return sum;
    const p = activeProducts[catKey] || DEFAULT_VTO_CATALOG[catKey]?.defaultProduct || DEFAULT_VTO_CATALOG.LIPSTICK.defaultProduct;
    return sum + (p.price || (p.variants?.[0]?.price) || 290000);
  }, 0);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1500,
        backgroundColor: 'rgba(10, 15, 30, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 200ms ease'
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '1120px',
          maxWidth: '98vw',
          height: '92vh',
          maxHeight: '860px',
          backgroundColor: '#0f172a',
          border: '1px solid #334155',
          borderRadius: '24px',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.7)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '14px 24px',
            backgroundColor: '#020617',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#ffffff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f43f5e 0%, #d97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(244, 63, 94, 0.35)',
                color: '#ffffff'
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#ffffff', letterSpacing: '-0.01em' }}>
                  Aura Virtual Try-On
                </h2>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 750,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(244, 63, 94, 0.2)',
                    color: '#fda4af',
                    border: '1px solid rgba(244, 63, 94, 0.35)'
                  }}
                >
                  MediaPipe 478 3D AI
                </span>
              </div>
              <p style={{ fontSize: '11.5px', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Khớp chuẩn từng đường viền môi & khuôn mặt • Không lem • Giữ nguyên vân môi tự nhiên
              </p>
            </div>
          </div>

          {/* Top Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* View Zoom Toggle (Toàn mặt vs Cận môi) */}
            {mode === 'preset' && (
              <div
                style={{
                  backgroundColor: '#1e293b',
                  padding: '3px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: '1px solid #334155'
                }}
              >
                <button
                  onClick={() => setIsMacroView(false)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '7px',
                    fontSize: '11.5px',
                    fontWeight: 650,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: !isMacroView ? '#e11d48' : 'transparent',
                    color: !isMacroView ? '#ffffff' : '#cbd5e1',
                    boxShadow: !isMacroView ? '0 2px 8px rgba(225, 29, 72, 0.4)' : 'none',
                    transition: 'all 150ms ease'
                  }}
                >
                  <User size={13} /> 👤 Toàn Mặt
                </button>
                <button
                  onClick={() => setIsMacroView(true)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '7px',
                    fontSize: '11.5px',
                    fontWeight: 650,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: isMacroView ? '#e11d48' : 'transparent',
                    color: isMacroView ? '#ffffff' : '#cbd5e1',
                    boxShadow: isMacroView ? '0 2px 8px rgba(225, 29, 72, 0.4)' : 'none',
                    transition: 'all 150ms ease'
                  }}
                >
                  <ZoomIn size={13} /> 🔍 Cận Môi
                </button>
              </div>
            )}

            {/* Input Mode Selector */}
            <div
              style={{
                backgroundColor: '#1e293b',
                padding: '3px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                border: '1px solid #334155'
              }}
            >
              <button
                onClick={() => { stopCamera(); setMode('preset'); }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '7px',
                  fontSize: '11.5px',
                  fontWeight: 650,
                  backgroundColor: mode === 'preset' ? '#e11d48' : 'transparent',
                  color: mode === 'preset' ? '#ffffff' : '#cbd5e1',
                  transition: 'all 150ms ease'
                }}
              >
                🖼️ Ảnh Mẫu
              </button>
              <button
                onClick={startCamera}
                style={{
                  padding: '6px 12px',
                  borderRadius: '7px',
                  fontSize: '11.5px',
                  fontWeight: 650,
                  backgroundColor: mode === 'camera' ? '#e11d48' : 'transparent',
                  color: mode === 'camera' ? '#ffffff' : '#cbd5e1',
                  transition: 'all 150ms ease'
                }}
              >
                📹 Webcam
              </button>
            </div>

            {/* Before / After Split Toggle */}
            <button
              onClick={() => setIsSplitView(!isSplitView)}
              style={{
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '11.5px',
                fontWeight: 650,
                border: isSplitView ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid #334155',
                backgroundColor: isSplitView ? 'rgba(245, 158, 11, 0.15)' : '#1e293b',
                color: isSplitView ? '#fcd34d' : '#cbd5e1',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 150ms ease'
              }}
            >
              ⬌ {isSplitView ? 'Tắt So Sánh' : 'So Sánh'}
            </button>

            {/* Close Button */}
            <button
              onClick={() => { stopCamera(); onClose(); }}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                color: '#cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#334155'; e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1e293b'; e.currentTarget.style.color = '#cbd5e1'; }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Camera error notification if any */}
        {cameraError && (
          <div
            style={{
              padding: '8px 20px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#fef3c7',
              fontSize: '11.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>⚠️ {cameraError}</span>
            <button
              onClick={() => setCameraError(null)}
              style={{ textDecoration: 'underline', fontWeight: 650, color: '#fcd34d' }}
            >
              Đã hiểu
            </button>
          </div>
        )}

        {/* Main Workspace Body */}
        <div style={{ position: 'relative', flex: 1, display: 'flex', overflow: 'hidden', backgroundColor: '#020617' }}>
          {/* Left: Viewport */}
          <div
            style={{
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              overflow: 'hidden',
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Hidden video stream */}
            <video ref={videoRef} playsInline muted style={{ display: 'none' }} />

            {/* Canvas Viewport */}
            <div
              style={{
                position: 'relative',
                width: '500px',
                maxWidth: '100%',
                aspectRatio: '1 / 1',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
                border: '1px solid #1e293b',
                backgroundColor: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <canvas
                ref={canvasRef}
                width={500}
                height={500}
                style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'crosshair', display: 'block' }}
              />

              {/* Floating Skin Tone Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  zIndex: 10,
                  backgroundColor: 'rgba(15, 23, 42, 0.92)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(51, 65, 85, 0.8)',
                  borderRadius: '14px',
                  padding: '8px 14px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: '2px solid rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    backgroundColor: detectedSkin.hexColor
                  }}
                />
                <div style={{ fontSize: '11px' }}>
                  <div style={{ fontWeight: 600 }}>
                    Tông da: <span style={{ color: '#fda4af', fontWeight: 800 }}>{detectedSkin.undertone}</span>
                    <span style={{ color: '#94a3b8', fontWeight: 400, marginLeft: '4px' }}>({detectedSkin.itaAngle}°)</span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                    Mã màu: <code style={{ color: '#cbd5e1', fontFamily: 'monospace' }}>{detectedSkin.hexColor}</code>
                  </div>
                </div>

                <button
                  onClick={handleSaveSkinProfile}
                  disabled={isSavingSkin}
                  style={{
                    marginLeft: '8px',
                    padding: '4px 10px',
                    backgroundColor: skinSaveSuccess ? '#10b981' : '#e11d48',
                    color: '#ffffff',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(225, 29, 72, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {isSavingSkin ? 'Đang lưu...' : skinSaveSuccess ? '✓ Đã Lưu' : '💾 Lưu Hồ Sơ'}
                </button>
              </div>

              {/* Split Slider Bar */}
              {isSplitView && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    backgroundColor: 'rgba(15, 23, 42, 0.92)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid #334155',
                    borderRadius: '999px',
                    padding: '8px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>Mộc</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={splitPos}
                    onChange={(e) => setSplitPos(parseInt(e.target.value))}
                    style={{ width: '160px', accentColor: '#e11d48', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#fda4af' }}>Makeup</span>
                </div>
              )}

              {/* Model Switcher Toolbar (Preset Mode) */}
              {mode === 'preset' && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'rgba(15, 23, 42, 0.90)',
                    backdropFilter: 'blur(8px)',
                    padding: '5px 8px',
                    borderRadius: '12px',
                    border: '1px solid #334155',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
                  }}
                >
                  {PRESET_MODELS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModel(m)}
                      style={{
                        padding: '4px 10px',
                        fontSize: '11px',
                        borderRadius: '8px',
                        fontWeight: 650,
                        backgroundColor: selectedModel.id === m.id ? '#e11d48' : '#1e293b',
                        color: selectedModel.id === m.id ? '#ffffff' : '#94a3b8',
                        cursor: 'pointer',
                        transition: 'all 120ms ease'
                      }}
                    >
                      {m.name.split(':')[0]}
                    </button>
                  ))}
                  <label
                    style={{
                      cursor: 'pointer',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: 600,
                      borderRadius: '8px',
                      backgroundColor: '#1e293b',
                      color: '#cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Upload size={12} /> Tải ảnh
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Categories, Shades & Controls */}
          <div
            style={{
              width: '380px',
              maxWidth: '40%',
              backgroundColor: 'rgba(15, 23, 42, 0.98)',
              borderLeft: '1px solid #1e293b',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '16px',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Category Tabs */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 750, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '8px', display: 'block' }}>
                  1. Chọn Vùng Trang Điểm (Mix & Match)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', backgroundColor: '#020617', padding: '4px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                  {Object.entries(DEFAULT_VTO_CATALOG).map(([catKey, info]) => {
                    const isActive = activeTab === catKey;
                    const hasLook = !!activeLooks[catKey];
                    return (
                      <button
                        key={catKey}
                        onClick={() => {
                          setActiveTab(catKey);
                          // For blush/foundation/eyeshadow, make sure full face is visible
                          if (catKey !== 'LIPSTICK' && isMacroView) {
                            setIsMacroView(false);
                          }
                        }}
                        style={{
                          position: 'relative',
                          padding: '8px 4px',
                          textAlign: 'center',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 650,
                          backgroundColor: isActive ? '#e11d48' : 'transparent',
                          color: isActive ? '#ffffff' : '#cbd5e1',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px',
                          cursor: 'pointer',
                          transition: 'all 150ms ease'
                        }}
                      >
                        <span style={{ fontSize: '15px' }}>{info.icon}</span>
                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '100%', fontSize: '10.5px' }}>{info.categoryName}</span>
                        {hasLook && (
                          <span style={{ position: 'absolute', top: '4px', right: '4px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current Product Info */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '14px',
                  backgroundColor: '#020617',
                  border: '1px solid #1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ minWidth: 0, flex: 1, marginRight: '8px' }}>
                  <div style={{ fontSize: '10.5px', color: '#fda4af', fontWeight: 750, textTransform: 'uppercase' }}>
                    {DEFAULT_VTO_CATALOG[activeTab]?.categoryName || 'Son môi'}
                  </div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {activeProducts[activeTab]?.name || DEFAULT_VTO_CATALOG[activeTab]?.defaultProduct?.name || 'Son Lì Cao Cấp'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    {(activeProducts[activeTab]?.price || activeProducts[activeTab]?.variants?.[0]?.price || DEFAULT_VTO_CATALOG[activeTab]?.defaultProduct?.price || 290000)?.toLocaleString('vi-VN')} đ
                  </div>
                </div>

                {activeLooks[activeTab] ? (
                  <button
                    onClick={() => removeShade(activeTab)}
                    style={{
                      fontSize: '11px',
                      color: '#94a3b8',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      backgroundColor: '#1e293b',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#f43f5e'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
                  >
                    Bỏ màu
                  </button>
                ) : (
                  <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>Chưa chọn</span>
                )}
              </div>

              {/* Shade Palette Selector */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 750, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>
                    2. Chọn Sắc Độ & Chất Liệu
                  </label>
                  <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                    {currentTabShades.length} mã màu
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
                  {currentTabShades.map((shade) => {
                    const isSelected = activeLooks[activeTab]?.skuCode === shade.skuCode;
                    return (
                      <button
                        key={shade.skuCode}
                        onClick={() => selectShade(activeTab, shade)}
                        style={{
                          padding: '8px',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid #e11d48' : '1px solid #1e293b',
                          backgroundColor: isSelected ? 'rgba(225, 29, 72, 0.15)' : '#020617',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          transition: 'all 120ms ease'
                        }}
                      >
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            flexShrink: 0,
                            border: '2px solid rgba(255,255,255,0.4)',
                            backgroundColor: shade.hexColor
                          }}
                        />
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: '11px', fontWeight: 750, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {shade.shadeName}
                          </div>
                          <div style={{ fontSize: '9.5px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <span style={{ color: '#cbd5e1' }}>{shade.finishType}</span>
                            <span>•</span>
                            <span style={{ color: '#fda4af' }}>{shade.bestUndertone}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fine-Tuning Sliders */}
              {activeLooks[activeTab] && (
                <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#020617', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 750, textTransform: 'uppercase', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sliders size={12} /> Tinh chỉnh hoàn thiện
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#cbd5e1', marginBottom: '4px' }}>
                      <span>Độ đậm (Opacity)</span>
                      <span>{Math.round((activeLooks[activeTab].opacity || 0.78) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={activeLooks[activeTab].opacity || 0.78}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setActiveLooks(prev => ({
                          ...prev,
                          [activeTab]: { ...prev[activeTab], opacity: val }
                        }));
                      }}
                      style={{ width: '100%', accentColor: '#e11d48', cursor: 'pointer' }}
                    />
                  </div>

                  {activeTab === 'LIPSTICK' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#cbd5e1', marginBottom: '4px' }}>
                        <span>Độ bóng (Glossiness)</span>
                        <span>{Math.round((activeLooks[activeTab].glossiness || 0.2) * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="1.0"
                        step="0.05"
                        value={activeLooks[activeTab].glossiness || 0.2}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setActiveLooks(prev => ({
                            ...prev,
                            [activeTab]: { ...prev[activeTab], glossiness: val }
                          }));
                        }}
                        style={{ width: '100%', accentColor: '#e11d48', cursor: 'pointer' }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Ask AI Advisor Button */}
              {activeLooks[activeTab] && (
                <button
                  onClick={handleAskAiAdvisor}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                    color: '#ffffff',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
                    cursor: 'pointer'
                  }}
                >
                  <Bot size={15} />
                  <span>Hỏi AI: Màu này có hợp tông da {detectedSkin.undertone}?</span>
                </button>
              )}
            </div>

            {/* Bottom Actions: Active Look Summary & Buy All */}
            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', color: '#cbd5e1' }}>
                <span>Đang thử:</span>
                <span style={{ fontWeight: 750, color: '#ffffff' }}>
                  {activeLookCount} món ({totalActivePrice.toLocaleString('vi-VN')} đ)
                </span>
              </div>

              <button
                onClick={handleBuyActiveLook}
                disabled={activeLookCount === 0}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#e11d48',
                  color: '#ffffff',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  opacity: activeLookCount === 0 ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(225, 29, 72, 0.4)',
                  cursor: activeLookCount === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <ShoppingBag size={16} />
                <span>Thêm trọn bộ vào giỏ ({activeLookCount})</span>
              </button>
            </div>
          </div>

          {/* AI Advisor SSE Chat Drawer Slide-over */}
          {isAiDrawerOpen && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: '380px',
                maxWidth: '100%',
                backgroundColor: '#0f172a',
                borderLeft: '1px solid #334155',
                boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
                zIndex: 30,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#020617',
                  borderBottom: '1px solid #1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: '#ffffff'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bot size={18} style={{ color: '#a78bfa' }} />
                  <div style={{ fontSize: '12px', fontWeight: 750 }}>Trợ Lý Da Liễu & AR Makeup AI</div>
                </div>
                <button
                  onClick={() => setIsAiDrawerOpen(false)}
                  style={{ color: '#94a3b8', fontSize: '11px', padding: '4px 8px', borderRadius: '6px', backgroundColor: '#1e293b', cursor: 'pointer' }}
                >
                  Đóng ✕
                </button>
              </div>

              <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px', lineHeight: 1.6, color: '#e2e8f0' }}>
                {aiChatMessages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(2, 6, 23, 0.85)',
                      border: '1px solid #1e293b',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {msg.content || (
                      <span style={{ color: '#64748b', fontStyle: 'italic' }}>Đang phân tích sắc độ màu và cấu trúc da...</span>
                    )}
                  </div>
                ))}
                {isAiStreaming && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fda4af', fontSize: '11.5px', fontStyle: 'italic' }}>
                    <Sparkle size={12} />
                    <span>AI đang phân tích thời gian thực...</span>
                  </div>
                )}
              </div>

              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#020617',
                  borderTop: '1px solid #1e293b',
                  fontSize: '11px',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>Dữ liệu pgvector SSE</span>
                <button
                  onClick={handleAskAiAdvisor}
                  disabled={isAiStreaming}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    borderRadius: '6px',
                    cursor: isAiStreaming ? 'not-allowed' : 'pointer'
                  }}
                >
                  Phân tích lại
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
