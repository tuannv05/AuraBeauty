import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * MotionCard — Luxury Derma-Tech Interactive Card
 * Features:
 * - Spring-physics elevation & 3D tilt lift
 * - Interactive Radial Spotlight Glow tracking mouse coordinates
 * - Border luminance accent on hover
 */
export function MotionCard({
  children,
  className,
  hoverScale = 1.01,
  tapScale = 0.985,
  glow = true,
  glowColor = 'rgba(255, 171, 185, 0.22)',
  style,
  ...props
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      whileHover={{
        scale: hoverScale,
        y: -5,
        boxShadow: '0 20px 40px -15px rgba(244, 63, 94, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.04)',
      }}
      whileTap={{ scale: tapScale }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 24,
      }}
      className={cn(
        'group relative bg-white rounded-2xl border border-neutral-200/80 transition-all duration-200 hover:border-rose-300 overflow-hidden',
        className
      )}
      style={style}
      {...props}
    >
      {/* Radial Spotlight Glow Cursor Follower */}
      {glow && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.25s ease',
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 75%)`,
            zIndex: 1,
          }}
        />
      )}

      {/* Content wrapper */}
      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    </motion.div>
  );
}
