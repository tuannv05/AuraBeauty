// frontend/src/components/ui/AuraIntroOverlay.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles, Dna } from 'lucide-react';

/**
 * AuraIntroOverlay — 5-Scene Master Timeline Intro (React 18 + Framer Motion)
 * 
 * Re-creates the iconic 5-scene master SVG mask morphing & cutting animation:
 * - Scene 1 & 2: Rhombus scale & morph from circle (rx: 50) to rotated diamond (rx: 15, rot: -45deg)
 * - Scene 3: 3 SVG <mask id="..."> cutting ellipses sweeping in and thinning strokeWidth 60 -> 2
 * - Scene 4: 3 nodal intersection circles staggering into existence
 * - Scene 5: Letters stagger in with spring elasticity (Elastic.easeOut)
 * - Final Scene: Smooth luxury curtain reveal into homepage
 * 
 * Performance & Guardrails:
 * - 100% Pure React 18 + Framer Motion (Zero jQuery / GSAP legacy)
 * - Escape key & Skip button support
 * - Automatically stores sessionStorage('aura_intro_seen_v3')
 * - GPU friendly & cleanly unmounts upon completion
 */

const INTRO_DURATION_MS = 2100; // ~2.1s optimal for full 5-scene master choreography

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

  // Letters for Scene 5 Staggered Elastic Entrance
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
            backgroundColor: '#070709',
            color: '#ffffff',
            overflow: 'hidden',
            userSelect: 'none',
            cursor: 'pointer'
          }}
        >
          {/* 1. Ambient Lighting & Deep Space Luxury Glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 45%, rgba(255, 171, 185, 0.22) 0%, rgba(245, 158, 11, 0.14) 35%, rgba(7, 7, 9, 0.98) 75%)',
              pointerEvents: 'none'
            }}
          />

          {/* Top Bar: Skip Button */}
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
                padding: '8px 18px',
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '9999px',
                color: '#e2e8f0',
                fontSize: '12px',
                fontWeight: 650,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
                e.currentTarget.style.borderColor = 'rgba(255, 171, 185, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
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
              maxWidth: '92vw',
              padding: '20px'
            }}
          >
            <svg
              viewBox="0 0 740 180"
              style={{
                width: '100%',
                maxWidth: '680px',
                height: 'auto',
                overflow: 'visible'
              }}
            >
              <defs>
                {/* Luxury Multi-stop Gold & Rose Gradient */}
                <linearGradient id="aura-intro-iso-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFABB9" />
                  <stop offset="45%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#FDE68A" />
                </linearGradient>

                {/* Master SVG Mask: Cutting through the Rhombus */}
                <mask id="aura-intro-master-mask">
                  {/* #alpha: Base Solid White Fill */}
                  <rect x="-200" y="-200" width="1000" height="600" fill="#FFFFFF" />

                  {/* Scene 3: 3 SVG Cutting Ellipses (Sweep & Thin) */}
                  {/* Ellipse 1 */}
                  <motion.ellipse
                    initial={{
                      cx: 140 + 100,
                      cy: 90 + 150,
                      rx: 180,
                      ry: 180,
                      strokeWidth: 60,
                      opacity: 0
                    }}
                    animate={{
                      cx: 140 + 6,
                      cy: 90 - 64,
                      rx: 140,
                      ry: 140,
                      strokeWidth: 2.2,
                      opacity: 1
                    }}
                    transition={{
                      duration: 0.7,
                      delay: 0.45,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    fill="none"
                    stroke="#000000"
                  />

                  {/* Ellipse 2 */}
                  <motion.ellipse
                    initial={{
                      cx: 140 + 100,
                      cy: 90 + 150,
                      rx: 180,
                      ry: 180,
                      strokeWidth: 60,
                      opacity: 0
                    }}
                    animate={{
                      cx: 140 + 138,
                      cy: 90 - 80,
                      rx: 140,
                      ry: 140,
                      strokeWidth: 2.2,
                      opacity: 1
                    }}
                    transition={{
                      duration: 0.7,
                      delay: 0.62,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    fill="none"
                    stroke="#000000"
                  />

                  {/* Ellipse 3 */}
                  <motion.ellipse
                    initial={{
                      cx: 140 + 100,
                      cy: 90 + 150,
                      rx: 180,
                      ry: 180,
                      strokeWidth: 60,
                      opacity: 0
                    }}
                    animate={{
                      cx: 140 + 190,
                      cy: 90 + 15,
                      rx: 140,
                      ry: 140,
                      strokeWidth: 2.2,
                      opacity: 1
                    }}
                    transition={{
                      duration: 0.7,
                      delay: 0.78,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    fill="none"
                    stroke="#000000"
                  />

                  {/* Scene 4: 3 Nodal Intersection Circles (Staggered Entrance) */}
                  <motion.circle
                    cx={140 + 16}
                    cy={90 - 14}
                    r={6.5}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.85,
                      ease: [0.65, 0, 0.35, 1]
                    }}
                    fill="#000000"
                  />
                  <motion.circle
                    cx={140 - 18}
                    cy={90 + 18}
                    r={5.5}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.95,
                      ease: [0.65, 0, 0.35, 1]
                    }}
                    fill="#000000"
                  />
                  <motion.circle
                    cx={140 + 28}
                    cy={90 + 22}
                    r={6}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 1.05,
                      ease: [0.65, 0, 0.35, 1]
                    }}
                    fill="#000000"
                  />
                </mask>
              </defs>

              {/* =========================================================================
                  SCENE 1 & 2: #iso Rhombus Morph & Rotation
                  - Starts as circle (rx: 46), scale: 0 -> 1, rot: 90deg -> -45deg, rx: 46 -> 14
                  ========================================================================= */}
              <g transform="translate(140, 90)">
                <motion.rect
                  id="iso"
                  x="-46.6"
                  y="-46.6"
                  width="93.2"
                  height="93.2"
                  initial={{
                    rx: 46.6,
                    ry: 46.6,
                    rotate: 90,
                    scale: 0,
                    opacity: 0
                  }}
                  animate={{
                    rx: [46.6, 46.6, 14, 14],
                    ry: [46.6, 46.6, 14, 14],
                    rotate: [90, 45, -45, -45],
                    scale: [0, 1.05, 1, 1],
                    opacity: [0, 1, 1, 1]
                  }}
                  transition={{
                    duration: 1.0,
                    times: [0, 0.45, 0.85, 1],
                    ease: 'easeInOut'
                  }}
                  fill="url(#aura-intro-iso-gradient)"
                  mask="url(#aura-intro-master-mask)"
                  style={{
                    transformOrigin: '0px 0px',
                    filter: 'drop-shadow(0 0 16px rgba(255,171,185,0.5))'
                  }}
                />
              </g>

              {/* =========================================================================
                  SCENE 5: Staggered Elastic Text Entrance (.word)
                  ========================================================================= */}
              <g transform="translate(240, 98)">
                {/* AURA */}
                {auraLetters.map((char, index) => (
                  <motion.text
                    key={`aura-${index}`}
                    x={index * 38}
                    y="0"
                    className="word"
                    initial={{ opacity: 0, scale: 0.8, x: -16 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 14,
                      delay: 0.95 + index * 0.05
                    }}
                    style={{
                      fontFamily: "'Inter', -apple-system, sans-serif",
                      fontSize: '44px',
                      fontWeight: 900,
                      letterSpacing: '-0.02em',
                      fill: '#FFFFFF',
                      textAnchor: 'start'
                    }}
                  >
                    {char}
                  </motion.text>
                ))}

                {/* BEAUTY */}
                {beautyLetters.map((char, index) => (
                  <motion.text
                    key={`beauty-${index}`}
                    x={162 + index * 32}
                    y="0"
                    className="word"
                    initial={{ opacity: 0, scale: 0.8, x: -16 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 14,
                      delay: 1.15 + index * 0.05
                    }}
                    style={{
                      fontFamily: "'Inter', -apple-system, sans-serif",
                      fontSize: '44px',
                      fontWeight: 900,
                      letterSpacing: '-0.02em',
                      fill: '#FFABB9',
                      textAnchor: 'start'
                    }}
                  >
                    {char}
                  </motion.text>
                ))}

                {/* MALL */}
                {mallLetters.map((char, index) => (
                  <motion.text
                    key={`mall-${index}`}
                    x={364 + index * 26}
                    y="0"
                    className="word"
                    initial={{ opacity: 0, scale: 0.8, x: -16 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 14,
                      delay: 1.4 + index * 0.05
                    }}
                    style={{
                      fontFamily: "'Inter', -apple-system, sans-serif",
                      fontSize: '32px',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      fill: '#FDE68A',
                      textAnchor: 'start'
                    }}
                  >
                    {char}
                  </motion.text>
                ))}

                {/* TM Symbol */}
                <motion.text
                  x={474}
                  y="-18"
                  className="word"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 15,
                    delay: 1.62
                  }}
                  style={{
                    fontFamily: "'Inter', -apple-system, sans-serif",
                    fontSize: '15px',
                    fontWeight: 900,
                    fill: '#FFABB9'
                  }}
                >
                  ™
                </motion.text>

                {/* Subtitle: High-Fashion Credential */}
                <motion.text
                  x="2"
                  y="30"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 0.85, y: 0 }}
                  transition={{ duration: 0.45, delay: 1.65 }}
                  style={{
                    fontFamily: "'Inter', -apple-system, sans-serif",
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fill: '#CBD5E1'
                  }}
                >
                  DERMA-TECH MULTI-VENDOR MALL • OFFICIAL CBMP
                </motion.text>
              </g>
            </svg>

            {/* 3. Three Quality Guarantee Badges (Staggered Fade-in) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 1.5 }}
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
                  padding: '6px 14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '9999px',
                  fontSize: '11.5px',
                  color: '#e2e8f0',
                  fontWeight: 600
                }}
              >
                <Sparkles size={13} style={{ color: '#FFABB9' }} />
                <span>AR Try-On 60 FPS PBR</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '9999px',
                  fontSize: '11.5px',
                  color: '#e2e8f0',
                  fontWeight: 600
                }}
              >
                <Dna size={13} style={{ color: '#F59E0B' }} />
                <span>AI RAG Phân Tích INCI</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '9999px',
                  fontSize: '11.5px',
                  color: '#e2e8f0',
                  fontWeight: 600
                }}
              >
                <ShieldCheck size={13} style={{ color: '#10B981' }} />
                <span>100% CBMP Bộ Y Tế</span>
              </div>
            </motion.div>
          </div>

          {/* 4. Bottom Progress Line */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'rgba(255, 255, 255, 0.08)'
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #FFABB9, #F59E0B, #10B981)',
                transition: 'width 0.08s linear'
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
