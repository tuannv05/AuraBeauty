import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function SpringButton({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  onClick,
  ...props
}) {
  const variants = {
    primary:
      'bg-neutral-900 text-white hover:bg-neutral-800 border-neutral-900 shadow-sm',
    secondary:
      'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 border-neutral-200/80',
    outline:
      'bg-white text-neutral-800 hover:bg-neutral-50 border-neutral-300',
    rose:
      'bg-rose-500 text-white hover:bg-rose-600 border-rose-500 shadow-sm shadow-rose-200',
    ghost:
      'bg-transparent text-neutral-700 hover:bg-neutral-100 border-transparent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-full gap-1.5',
    md: 'px-4 py-2 text-sm rounded-full gap-2',
    lg: 'px-6 py-2.5 text-base rounded-full gap-2.5',
  };

  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.025, y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center font-semibold border transition-colors outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
