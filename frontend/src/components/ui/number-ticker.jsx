import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export function NumberTicker({
  value = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1200,
  className,
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const startRef = useRef(0);
  const startTimeRef = useRef(null);
  const targetRef = useRef(value);

  useEffect(() => {
    targetRef.current = Number(value) || 0;
    startRef.current = displayValue;
    startTimeRef.current = null;

    let animationFrameId;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = startRef.current + (targetRef.current - startRef.current) * ease;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetRef.current);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  const formatted = new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(displayValue);

  return (
    <span className={cn('tabular-nums font-semibold tracking-tight', className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
