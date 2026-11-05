// frontend/src/features/vto/engine/colorSpaceUtils.js
/**
 * Color Space Math & Geometry Utilities
 * Handles sRGB <-> CIELAB conversions, ITA calculation, and Canvas path builders
 */

/**
 * Traces a closed path on 2D canvas context from landmark indices
 */
export function tracePath(ctx, indices, landmarks, width, height) {
  indices.forEach((idx, i) => {
    const pt = landmarks[idx];
    if (!pt) return;
    const x = pt.x * width;
    const y = pt.y * height;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
}

/**
 * Traces indices directly onto a Path2D object (used for evenodd clipping)
 */
export function tracePathToPath2D(path2d, indices, landmarks, width, height) {
  indices.forEach((idx, i) => {
    const pt = landmarks[idx];
    if (!pt) return;
    const x = pt.x * width;
    const y = pt.y * height;
    if (i === 0) path2d.moveTo(x, y);
    else path2d.lineTo(x, y);
  });
  path2d.closePath();
}

/**
 * Converts HEX color (#RRGGBB or #RGB) to RGBA string
 */
export function hexToRgba(hex, alpha = 1) {
  let c = (hex || '#9B111E').replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(ch => ch + ch).join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) {
    return `rgba(155, 17, 30, ${alpha})`;
  }
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Converts RGB components [0..255] to #RRGGBB string
 */
export function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Converts sRGB [0..255] to CIELAB (L*, a*, b*) under D65 standard illuminant
 */
export function rgbToLab(r, g, b) {
  let rL = r / 255;
  let gL = g / 255;
  let bL = b / 255;

  rL = rL > 0.04045 ? Math.pow((rL + 0.055) / 1.055, 2.4) : rL / 12.92;
  gL = gL > 0.04045 ? Math.pow((gL + 0.055) / 1.055, 2.4) : gL / 12.92;
  bL = bL > 0.04045 ? Math.pow((bL + 0.055) / 1.055, 2.4) : bL / 12.92;

  let X = rL * 0.4124564 + gL * 0.3575761 + bL * 0.1804375;
  let Y = rL * 0.2126729 + gL * 0.7151522 + bL * 0.0721750;
  let Z = rL * 0.0193339 + gL * 0.1191920 + bL * 0.9503041;

  // D65 reference white points
  X = X / 0.95047;
  Y = Y / 1.00000;
  Z = Z / 1.08883;

  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fX = f(X);
  const fY = f(Y);
  const fZ = f(Z);

  const L = Math.max(0, 116 * fY - 16);
  const a = 500 * (fX - fY);
  const bVal = 200 * (fY - fZ);

  return { L, a, b: bVal };
}

/**
 * Computes Individual Typology Angle (ITA) in degrees
 * Formula: ITA° = (arctan((L* - 50) / b*) * 180) / π
 */
export function calculateITA(L, b) {
  if (Math.abs(b) < 0.001) b = 0.001;
  const rad = Math.atan2(L - 50, b);
  return (rad * 180) / Math.PI;
}

/**
 * Classifies skin undertone from ITA° and chromatic b* component
 */
export function classifyUndertone(ita, b) {
  if (b > 17.0) return 'WARM';
  if (b < 12.0) return 'COOL';
  return 'NEUTRAL';
}
