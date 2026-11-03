import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function AnimatedBadge({
  children,
  variant = 'default',
  pulse = false,
  className,
}) {
  const variants = {
    default: 'bg-neutral-100 text-neutral-800 border-neutral-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const dotColors = {
    default: 'bg-neutral-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-blue-500',
    purple: 'bg-purple-500',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border shadow-xs transition-colors',
        variants[variant] || variants.default,
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <motion.span
            animate={{ scale: [1, 1.8, 1], opacity: [0.75, 0, 0.75] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className={cn(
              'absolute inline-flex h-full w-full rounded-full opacity-75',
              dotColors[variant] || dotColors.default
            )}
          />
          <span
            className={cn(
              'relative inline-flex rounded-full h-2 w-2',
              dotColors[variant] || dotColors.default
            )}
          />
        </span>
      )}
      {children}
    </span>
  );
}
