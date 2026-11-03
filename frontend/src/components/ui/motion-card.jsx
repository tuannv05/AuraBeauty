import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function MotionCard({
  children,
  className,
  hoverScale = 1.015,
  tapScale = 0.985,
  glow = false,
  glowColor = 'rgba(236, 72, 153, 0.15)',
  ...props
}) {
  return (
    <motion.div
      whileHover={{
        scale: hoverScale,
        y: -2,
        boxShadow: glow
          ? `0 12px 30px -10px ${glowColor}, 0 4px 12px rgba(0,0,0,0.06)`
          : '0 12px 24px -8px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04)',
      }}
      whileTap={{ scale: tapScale }}
      transition={{
        type: 'spring',
        stiffness: 380,
        damping: 24,
      }}
      className={cn(
        'relative bg-white rounded-2xl border border-neutral-200/80 p-5 transition-colors overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
