// frontend/src/components/ui/AuraIntroOverlay.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldCheck, Dna, ArrowRight } from 'lucide-react';

const INTRO_STORAGE_KEY = 'aura_intro_seen_v2';
const INTRO_DURATION_MS = 1400;

export default function AuraIntroOverlay({ onComplete, forceShow = false }) {
  const [isVisible, setIsVisible] = useState(() => forceShow);

  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(null);
  const animFrameRef = useRef(null);

  // Synchronize when parent triggers replay
  useEffect(() => {
    if (forceShow) {
      setIsVisible(true);
      startTimeRef.current = null;
      setProgress(0);
    }
  }, [forceShow]);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, 'true');
    } catch {}
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  useEffect(() => {
    if (!isVisible) return;

    // Hard fallback timer: guarantees auto-dismissal even if tab is unfocused or requestAnimationFrame throttled
    const fallbackTimer = setTimeout(() => {
      handleDismiss();
    }, INTRO_DURATION_MS + 200);

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

  // If not visible, return null immediately so it never occupies the DOM or blocks pointer events
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="aura-intro-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: '-100%',
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
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
            backgroundColor: '#09090b',
            color: '#ffffff',
            overflow: 'hidden',
            userSelect: 'none',
            pointerEvents: isVisible ? 'auto' : 'none',
            cursor: 'pointer'
          }}
        >
          {/* Subtle Luxury Radial Glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 45%, rgba(255, 171, 185, 0.14) 0%, rgba(212, 175, 55, 0.08) 35%, rgba(9, 9, 11, 0.98) 75%)',
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
              onClick={handleDismiss}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 650,
                color: 'rgba(255, 255, 255, 0.8)',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                cursor: 'pointer',
                transition: 'all 180ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              Bỏ qua (Skip) <ArrowRight size={13} />
            </button>
          </div>

          {/* Central Luxury Emblem & Typographic Reveal */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '0 24px',
              maxWidth: '680px'
            }}
          >
            {/* Animated SVG Diamond & Monogram */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ marginBottom: '20px' }}
            >
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '22px',
                  background: 'linear-gradient(135deg, rgba(255, 171, 185, 0.25) 0%, rgba(212, 175, 55, 0.2) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 12px 32px rgba(255, 171, 185, 0.25)',
                  backdropFilter: 'blur(12px)'
                }}
              >
                <svg width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Aura Diamond Emblem */}
                  <motion.path
                    d="M20 4L34 16L20 36L6 16L20 4Z"
                    stroke="url(#aura-gold-grad)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                  />
                  {/* Inner Facet */}
                  <motion.path
                    d="M6 16H34M20 4V36M11 16L20 36M29 16L20 36"
                    stroke="rgba(255, 255, 255, 0.55)"
                    strokeWidth="1.2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.75 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeInOut' }}
                  />
                  <defs>
                    <linearGradient id="aura-gold-grad" x1="6" y1="4" x2="34" y2="36" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFABB9" />
                      <stop offset="0.5" stopColor="#FFFFFF" />
                      <stop offset="1" stopColor="#E5C07B" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </motion.div>

            {/* Editorial Brand Name with Shimmer */}
            <motion.h1
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                fontSize: 'clamp(28px, 5vw, 42px)',
                fontWeight: 850,
                letterSpacing: '0.12em',
                lineHeight: 1.15,
                margin: '0 0 10px 0',
                background: 'linear-gradient(90deg, #FFFFFF 0%, #FFABB9 40%, #E5C07B 70%, #FFFFFF 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textTransform: 'uppercase'
              }}
            >
              Aura Beauty Mall
            </motion.h1>

            <motion.p
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                fontSize: '13.5px',
                color: 'rgba(255, 255, 255, 0.7)',
                letterSpacing: '0.04em',
                fontWeight: 350,
                margin: '0 0 24px 0'
              }}
            >
              Hệ sinh thái Mỹ phẩm Đa Người Bán & Công nghệ Làm đẹp Đột phá
            </motion.p>

            {/* 3 Staggered Assurance Badges */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '28px'
              }}
            >
              {[
                {
                  icon: <ShieldCheck size={14} style={{ color: '#38bdf8' }} />,
                  text: '100% Chính Hãng CBMP Bộ Y Tế',
                  border: 'rgba(56, 189, 248, 0.25)',
                  bg: 'rgba(56, 189, 248, 0.08)'
                },
                {
                  icon: <Sparkles size={14} style={{ color: '#f472b6' }} />,
                  text: 'Thử Son & Makeup AR 60FPS',
                  border: 'rgba(244, 114, 182, 0.25)',
                  bg: 'rgba(244, 114, 182, 0.08)'
                },
                {
                  icon: <Dna size={14} style={{ color: '#34d399' }} />,
                  text: 'Trợ Lý AI Phân Tích INCI',
                  border: 'rgba(52, 211, 153, 0.25)',
                  bg: 'rgba(52, 211, 153, 0.08)'
                }
              ].map((badge, idx) => (
                <motion.div
                  key={idx}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.35 + idx * 0.12 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '11.5px',
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

          {/* Bottom Hairline Progress Bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'rgba(255, 255, 255, 0.1)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #FFABB9 0%, #E5C07B 50%, #FFABB9 100%)',
                boxShadow: '0 0 10px rgba(255, 171, 185, 0.8)',
                transition: 'width 30ms linear'
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
