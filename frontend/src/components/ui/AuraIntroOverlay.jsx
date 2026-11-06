// frontend/src/components/ui/AuraIntroOverlay.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles, Dna } from 'lucide-react';

/**
 * AuraIntroOverlay — 5-Scene Master Timeline Intro
 * 
 * Luxury Feminine Rose & Champagne Peony Theme:
 * - Radiant feminine champagne rose & blush silk atmosphere
 * - Precise 5-scene SVG mask cutting choreography
 * - Flawless letter tracking without horizontal clipping
 * - Escape key & Skip button support
 * - Caches in sessionStorage('aura_intro_seen_v3')
 */

const INTRO_DURATION_MS = 3100; // Nhanh hơn 0.5s (từ 3.6s -> 3.1s) theo yêu cầu người dùng

export default function AuraIntroOverlay({ isOpen = true, onComplete }) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    setIsVisible(isOpen);
    if (isOpen) {
      startTimeRef.current = null;
      setProgress(0);
    }
  }, [isOpen]);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem('aura_intro_seen_v3', 'true');
    } catch (e) {}
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  // Keyboard shortcut: Escape to dismiss instantly
  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleDismiss();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  // Master timeline driver with safety fallback
  useEffect(() => {
    if (!isVisible) return;

    const fallbackTimer = setTimeout(() => {
      handleDismiss();
    }, INTRO_DURATION_MS + 350);

    const tick = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const pct = Math.min(100, (elapsed / INTRO_DURATION_MS) * 100);
      setProgress(pct);

      if (elapsed < INTRO_DURATION_MS) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        handleDismiss();
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      clearTimeout(fallbackTimer);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isVisible]);

  const auraLetters = ['A', 'U', 'R', 'A'];
  const beautyLetters = ['B', 'E', 'A', 'U', 'T', 'Y'];
  const mallLetters = ['M', 'A', 'L', 'L'];

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          key="aura-master-intro-curtain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            y: '-100%',
            opacity: 0,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
          }}
          onClick={handleDismiss}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            // Radiant, feminine luxury champagne rose & silk blush
            background: 'radial-gradient(circle at 50% 45%, #FFFFFF 0%, #FFF1F4 28%, #FFE1E8 60%, #FFB6C6 100%)',
            color: '#1E1B22',
            overflow: 'hidden',
            userSelect: 'none',
            cursor: 'pointer'
          }}
        >
          {/* 1. Luminous Rose Bloom & Soft Petal Aura Glows */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 45%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 182, 193, 0.35) 45%, rgba(244, 63, 94, 0.15) 85%)',
              pointerEvents: 'none'
            }}
          />

          {/* Floating Soft Silk Highlights */}
          <div
            style={{
              position: 'absolute',
              top: '-15%',
              left: '-10%',
              width: '55vw',
              height: '55vw',
              background: 'radial-gradient(circle, rgba(255, 192, 203, 0.45) 0%, transparent 65%)',
              pointerEvents: 'none',
              filter: 'blur(50px)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-15%',
              right: '-10%',
              width: '55vw',
              height: '55vw',
              background: 'radial-gradient(circle, rgba(244, 63, 94, 0.25) 0%, transparent 65%)',
              pointerEvents: 'none',
              filter: 'blur(50px)'
            }}
          />

          {/* Top Bar: Skip Button with Pink Luxury Glassmorphism */}
          <div
            style={{
              position: 'absolute',
              top: '24px',
              right: '28px',
              zIndex: 20
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 20px',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 182, 193, 0.8)',
                borderRadius: '9999px',
                color: '#BE123C',
                fontSize: '12.5px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 16px rgba(244, 63, 94, 0.12)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.borderColor = '#F43F5E';
                e.currentTarget.style.boxShadow = '0 6px 22px rgba(244, 63, 94, 0.24)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
                e.currentTarget.style.borderColor = 'rgba(255, 182, 193, 0.8)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(244, 63, 94, 0.12)';
              }}
            >
              <span>Bỏ qua</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* 2. Main Stage: The 5-Scene SVG Mask Choreography */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '94vw',
              padding: '20px'
            }}
          >
            <svg
              viewBox="0 0 740 180"
              style={{
                width: '100%',
                maxWidth: '700px',
                height: 'auto',
                overflow: 'visible'
              }}
            >
              <defs>
                {/* Feminine French Rose & Peony Gradient */}
                <linearGradient id="aura-intro-iso-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFA5BA" />
                  <stop offset="40%" stopColor="#F43F5E" />
                  <stop offset="100%" stopColor="#BE123C" />
                </linearGradient>

                {/* Master SVG Mask: Cutting through the Rhombus (In Local Coordinate Space) */}
                <mask id="aura-intro-master-mask">
                  <rect x="-150" y="-150" width="300" height="300" fill="#FFFFFF" />

                  {/* Scene 3: 3 SVG Cutting Ellipses sweeping in */}
                  {/* Ellipse 1 */}
                  <motion.ellipse
                    initial={{ cx: 80, cy: 90, rx: 90, ry: 90, strokeWidth: 40, opacity: 0 }}
                    animate={{ cx: 0, cy: -38, rx: 58, ry: 58, strokeWidth: 2.4, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    fill="none"
                    stroke="#000000"
                  />

                  {/* Ellipse 2 */}
                  <motion.ellipse
                    initial={{ cx: 80, cy: 90, rx: 90, ry: 90, strokeWidth: 40, opacity: 0 }}
                    animate={{ cx: 36, cy: -18, rx: 58, ry: 58, strokeWidth: 2.4, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.60, ease: [0.16, 1, 0.3, 1] }}
                    fill="none"
                    stroke="#000000"
                  />

                  {/* Ellipse 3 */}
                  <motion.ellipse
                    initial={{ cx: 80, cy: 90, rx: 90, ry: 90, strokeWidth: 40, opacity: 0 }}
                    animate={{ cx: 22, cy: 30, rx: 58, ry: 58, strokeWidth: 2.4, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
                    fill="none"
                    stroke="#000000"
                  />

                  {/* Scene 4: 3 Nodal Intersection Circles */}
                  <motion.circle
                    cx={10}
                    cy={-10}
                    r={5}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.95, ease: [0.65, 0, 0.35, 1] }}
                    fill="#000000"
                  />
                  <motion.circle
                    cx={-12}
                    cy={12}
                    r={4.2}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 1.05, ease: [0.65, 0, 0.35, 1] }}
                    fill="#000000"
                  />
                  <motion.circle
                    cx={18}
                    cy={16}
                    r={4.5}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 1.15, ease: [0.65, 0, 0.35, 1] }}
                    fill="#000000"
                  />
                </mask>
              </defs>

              {/* =========================================================================
                  SCENE 1 & 2: #iso Rhombus Morph & Rotation in Rose Glow
                  ========================================================================= */}
              <g transform="translate(115, 90)">
                <motion.rect
                  id="iso"
                  x="-45"
                  y="-45"
                  width="90"
                  height="90"
                  initial={{
                    rx: 45,
                    ry: 45,
                    rotate: 90,
                    scale: 0,
                    opacity: 0
                  }}
                  animate={{
                    rx: [45, 45, 14, 14],
                    ry: [45, 45, 14, 14],
                    rotate: [90, 45, -45, -45],
                    scale: [0, 1.06, 1, 1],
                    opacity: [0, 1, 1, 1]
                  }}
                  transition={{
                    duration: 1.15,
                    times: [0, 0.45, 0.85, 1],
                    ease: 'easeInOut'
                  }}
                  fill="url(#aura-intro-iso-gradient)"
                  mask="url(#aura-intro-master-mask)"
                  style={{
                    transformOrigin: '0px 0px',
                    filter: 'drop-shadow(0 8px 24px rgba(244, 63, 94, 0.45)) drop-shadow(0 2px 8px rgba(255, 105, 180, 0.6))'
                  }}
                />
              </g>

              {/* =========================================================================
                  SCENE 5: Staggered Elastic Text Entrance (.word) in Chic Pink Typography
                  ========================================================================= */}
              <g transform="translate(195, 98)">
                {/* AURA (Deep Luxury Ink Noir) */}
                {auraLetters.map((char, index) => (
                  <motion.text
                    key={`aura-${index}`}
                    x={index * 34}
                    y="0"
                    className="word"
                    initial={{ opacity: 0, scale: 0.8, x: -16 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 240,
                      damping: 15,
                      delay: 1.15 + index * 0.06
                    }}
                    style={{
                      fontFamily: "'Inter', -apple-system, sans-serif",
                      fontSize: '44px',
                      fontWeight: 900,
                      letterSpacing: '-0.02em',
                      fill: '#1E1B22',
                      textAnchor: 'start'
                    }}
                  >
                    {char}
                  </motion.text>
                ))}

                {/* BEAUTY (Iconic French Peony Rose) */}
                {beautyLetters.map((char, index) => (
                  <motion.text
                    key={`beauty-${index}`}
                    x={146 + index * 30}
                    y="0"
                    className="word"
                    initial={{ opacity: 0, scale: 0.8, x: -16 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 240,
                      damping: 15,
                      delay: 1.40 + index * 0.05
                    }}
                    style={{
                      fontFamily: "'Inter', -apple-system, sans-serif",
                      fontSize: '44px',
                      fontWeight: 900,
                      letterSpacing: '-0.02em',
                      fill: '#F43F5E',
                      textAnchor: 'start',
                      filter: 'drop-shadow(0 2px 10px rgba(244, 63, 94, 0.35))'
                    }}
                  >
                    {char}
                  </motion.text>
                ))}

                {/* MALL (Deep Plum Velvet) */}
                {mallLetters.map((char, index) => (
                  <motion.text
                    key={`mall-${index}`}
                    x={336 + index * 24}
                    y="0"
                    className="word"
                    initial={{ opacity: 0, scale: 0.8, x: -16 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 240,
                      damping: 15,
                      delay: 1.70 + index * 0.05
                    }}
                    style={{
                      fontFamily: "'Inter', -apple-system, sans-serif",
                      fontSize: '32px',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      fill: '#4C1D2F',
                      textAnchor: 'start'
                    }}
                  >
                    {char}
                  </motion.text>
                ))}

                {/* TM Symbol in Peony Rose */}
                <motion.text
                  x={440}
                  y="-18"
                  className="word"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 280,
                    damping: 15,
                    delay: 1.95
                  }}
                  style={{
                    fontFamily: "'Inter', -apple-system, sans-serif",
                    fontSize: '15px',
                    fontWeight: 900,
                    fill: '#F43F5E'
                  }}
                >
                  ™
                </motion.text>

                {/* Subtitle: High-Fashion Women's Beauty Credential */}
                <motion.text
                  x="2"
                  y="28"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 0.95, y: 0 }}
                  transition={{ duration: 0.5, delay: 2.05 }}
                  style={{
                    fontFamily: "'Inter', -apple-system, sans-serif",
                    fontSize: '11.5px',
                    fontWeight: 750,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fill: '#83274A'
                  }}
                >
                  SÀN TMĐT MỸ PHẨM CHÍNH HÃNG PHÁI ĐẸP • CHUẨN Y KHOA CBMP
                </motion.text>
              </g>
            </svg>

            {/* 3. Three Quality Guarantee Badges in White & Rose Glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.95 }}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginTop: '28px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 18px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(255, 182, 193, 0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  color: '#4C1D2F',
                  fontWeight: 700,
                  boxShadow: '0 4px 16px rgba(244, 63, 94, 0.12)'
                }}
              >
                <Sparkles size={14} style={{ color: '#F43F5E' }} />
                <span>AR Try-On 60 FPS PBR</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 18px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(255, 182, 193, 0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  color: '#4C1D2F',
                  fontWeight: 700,
                  boxShadow: '0 4px 16px rgba(244, 63, 94, 0.12)'
                }}
              >
                <Dna size={14} style={{ color: '#DB2777' }} />
                <span>AI Da Liễu Phân Tích INCI</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 18px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(255, 182, 193, 0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  color: '#4C1D2F',
                  fontWeight: 700,
                  boxShadow: '0 4px 16px rgba(244, 63, 94, 0.12)'
                }}
              >
                <ShieldCheck size={14} style={{ color: '#E11D48' }} />
                <span>100% Chính Hãng Bộ Y Tế</span>
              </div>
            </motion.div>
          </div>

          {/* 4. Bottom Progress Line with Radiant Rose Ombre */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'rgba(255, 182, 193, 0.3)'
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #FDA4AF, #F43F5E, #E11D48, #9F1239)',
                boxShadow: '0 0 14px rgba(244, 63, 94, 0.7)',
                transition: 'width 0.08s linear'
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
