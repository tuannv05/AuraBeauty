// frontend/src/components/ui/AuraIntroOverlay.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Sparkles, Dna, ArrowRight } from 'lucide-react';

const INTRO_DURATION_MS = 1350;

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

  useEffect(() => {
    if (!isVisible) return;

    // Hard fallback timer: guarantees auto-dismissal even if tab is unfocused or requestAnimationFrame throttled
    const fallbackTimer = setTimeout(() => {
      handleDismiss();
    }, INTRO_DURATION_MS + 250);

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

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          key="aura-luxury-intro-curtain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            y: '-100%',
            opacity: 0,
            transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
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
            backgroundColor: '#08080a',
            color: '#ffffff',
            overflow: 'hidden',
            userSelect: 'none',
            cursor: 'pointer'
          }}
        >
          {/* Ambient Lighting & High-Fashion Aura Glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 42%, rgba(255, 171, 185, 0.18) 0%, rgba(229, 192, 123, 0.12) 35%, rgba(8, 8, 10, 0.98) 72%)',
              pointerEvents: 'none'
            }}
          />

          {/* Top Bar: Skip Button */}
          <div
            style={{
              position: 'absolute',
              top: '24px',
              right: '28px',
              zIndex: 10
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
                gap: '6px',
                padding: '6px 16px',
                borderRadius: '9999px',
                fontSize: '11.5px',
                fontWeight: 650,
                letterSpacing: '0.04em',
                color: 'rgba(255, 255, 255, 0.85)',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                transition: 'all 200ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              Bỏ qua (Skip) <ArrowRight size={13} />
            </button>
          </div>

          {/* Central Luxury Jewel Emblem & Haute Couture Reveal */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '0 24px',
              maxWidth: '720px'
            }}
          >
            {/* Jewel Diamond Monogram with Golden Light Trace */}
            <motion.div
              initial={{ scale: 0.82, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{ marginBottom: '22px', position: 'relative' }}
            >
              <div
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, rgba(255, 171, 185, 0.28) 0%, rgba(229, 192, 123, 0.22) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 16px 38px rgba(255, 171, 185, 0.28)',
                  backdropFilter: 'blur(16px)'
                }}
              >
                <svg width="38" height="38" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <motion.path
                    d="M20 3L35 15L20 37L5 15L20 3Z"
                    stroke="url(#aura-gold-prism)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                  />
                  <motion.path
                    d="M5 15H35M20 3V37M10 15L20 37M30 15L20 37"
                    stroke="rgba(255, 255, 255, 0.65)"
                    strokeWidth="1.2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.8 }}
                    transition={{ duration: 0.8, delay: 0.15, ease: 'easeInOut' }}
                  />
                  <defs>
                    <linearGradient id="aura-gold-prism" x1="5" y1="3" x2="35" y2="37" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFABB9" />
                      <stop offset="0.45" stopColor="#FFFFFF" />
                      <stop offset="1" stopColor="#E5C07B" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </motion.div>

            {/* Haute Couture Brand Typography */}
            <motion.h1
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              style={{
                fontSize: 'clamp(28px, 5.5vw, 44px)',
                fontWeight: 900,
                letterSpacing: '0.22em',
                lineHeight: 1.15,
                margin: '0 0 10px 0',
                background: 'linear-gradient(90deg, #FFFFFF 0%, #FFD1D9 30%, #F5D79E 65%, #FFFFFF 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textTransform: 'uppercase',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              Aura Beauty Mall
            </motion.h1>

            <motion.p
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.75)',
                letterSpacing: '0.18em',
                fontWeight: 400,
                textTransform: 'uppercase',
                margin: '0 0 24px 0'
              }}
            >
              Sàn TMĐT Mỹ Phẩm Đa Người Bán & Công Nghệ Derma-Tech
            </motion.p>

            {/* 3 Staggered Crystal Badges */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '24px'
              }}
            >
              {[
                {
                  icon: <ShieldCheck size={13} style={{ color: '#38bdf8' }} />,
                  text: '100% Chính Hãng CBMP',
                  border: 'rgba(56, 189, 248, 0.28)',
                  bg: 'rgba(56, 189, 248, 0.08)'
                },
                {
                  icon: <Sparkles size={13} style={{ color: '#f472b6' }} />,
                  text: 'AR Try-On 60 FPS',
                  border: 'rgba(244, 114, 182, 0.28)',
                  bg: 'rgba(244, 114, 182, 0.08)'
                },
                {
                  icon: <Dna size={13} style={{ color: '#34d399' }} />,
                  text: 'Trợ Lý AI Phân Tích INCI',
                  border: 'rgba(52, 211, 153, 0.28)',
                  bg: 'rgba(52, 211, 153, 0.08)'
                }
              ].map((badge, idx) => (
                <motion.div
                  key={idx}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.3 + idx * 0.1 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 13px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 650,
                    color: '#ffffff',
                    background: badge.bg,
                    border: `1px solid ${badge.border}`,
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  {badge.icon}
                  <span>{badge.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Hairline Gold Laser Progress Bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'rgba(255, 255, 255, 0.08)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #FFABB9 0%, #E5C07B 50%, #FFABB9 100%)',
                boxShadow: '0 0 12px rgba(255, 171, 185, 0.9)',
                transition: 'width 25ms linear'
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
