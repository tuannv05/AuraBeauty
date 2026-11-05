// frontend/src/features/vto/engine/makeupPbrRenderer.js
/**
 * Physical-Based Rendering (PBR) Makeup Engine
 * Multi-layer rendering for Lipstick, Blush, Foundation, and Eyeshadow
 * Features:
 * - 'evenodd' tooth-mask clipping (zero color bleeding into teeth)
 * - Natural lip texture preservation
 * - Continuous dewy specular sheen (zero firefly dots)
 * - Full-lip & Korean Ombré gradient lip styles
 * - Before/After split ratio clipping
 */

import {
  LIP_OUTER_LOOP,
  LIP_INNER_LOOP,
  LOWER_LIP_HIGHLIGHTS,
  UPPER_LIP_HIGHLIGHTS,
  CHEEK_CENTERS,
  EYESHADOW_LEFT,
  EYESHADOW_RIGHT,
  FACE_OVAL,
  EYE_LEFT_HOLE,
  EYE_RIGHT_HOLE
} from '../constants/faceMeshIndices';

import { hexToRgba, tracePath, tracePathToPath2D } from './colorSpaceUtils';

/**
 * 1. LIPSTICK PBR RENDERER
 */
export function renderLipstick(ctx, landmarks, options = {}, width, height) {
  if (!landmarks || landmarks.length < 400 || !ctx) return;

  const {
    hexColor = '#C72C48',
    finishType = 'MATTE',
    opacity = 0.78,
    glossiness = 0.2,
    shimmerIntensity = 0.0,
    lipStyle = 'full' // 'full' or 'gradient' (ombré)
  } = options;

  const op = Math.max(0.1, Math.min(1.0, opacity));
  const finish = String(finishType || 'MATTE').toUpperCase();

  ctx.save();

  // Create combined Path2D for tooth-mask clipping using 'evenodd' rule
  const lipPath = new Path2D();
  tracePathToPath2D(lipPath, LIP_OUTER_LOOP, landmarks, width, height);
  tracePathToPath2D(lipPath, LIP_INNER_LOOP, landmarks, width, height);

  ctx.clip(lipPath, 'evenodd');

  // Calculate lip bounding box & centers for gradient/shading calculations
  const pt0 = landmarks[0];
  const pt17 = landmarks[17];
  const pt13 = landmarks[13];
  const pt14 = landmarks[14];
  const pt61 = landmarks[61];
  const pt291 = landmarks[291];
  const pt84 = landmarks[84];
  const pt314 = landmarks[314];

  if (!pt0 || !pt17 || !pt61 || !pt291) {
    ctx.restore();
    return;
  }

  const lipCenterY = ((pt13 ? pt13.y : pt0.y) + (pt14 ? pt14.y : pt17.y)) / 2 * height;
  const lipWidth = Math.abs(pt291.x - pt61.x) * width;
  const lipHeight = Math.abs(pt17.y - pt0.y) * height;

  // --- LAYER 1: Deep Pigment Base (Multiply) to lock color into lip valleys ---
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.filter = `blur(${Math.max(1.0, width * 0.002)}px)`;
  const multAlpha = finish === 'MATTE' ? op * 0.72 : op * 0.60;
  ctx.fillStyle = hexToRgba(hexColor, multAlpha);
  ctx.fill(lipPath, 'evenodd');
  ctx.restore();

  // --- LAYER 2: Luminous Surface Tint (Soft-Light) with 1.5px feathering mask ---
  ctx.save();
  ctx.globalCompositeOperation = 'soft-light';
  ctx.filter = `blur(${Math.max(1.5, width * 0.003)}px)`;
  ctx.fillStyle = hexToRgba(hexColor, Math.min(1.0, op * 0.85));
  ctx.fill(lipPath, 'evenodd');
  ctx.restore();

  // --- LAYER 3: Korean Ombré / Gradient or Full Style Shading ---
  if (lipStyle === 'gradient') {
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    const innerGrad = ctx.createRadialGradient(
      (pt61.x + pt291.x) / 2 * width,
      lipCenterY,
      Math.max(2, lipHeight * 0.15),
      (pt61.x + pt291.x) / 2 * width,
      lipCenterY,
      Math.max(10, lipWidth * 0.42)
    );
    innerGrad.addColorStop(0, hexToRgba(hexColor, op * 0.80));
    innerGrad.addColorStop(0.55, hexToRgba(hexColor, op * 0.45));
    innerGrad.addColorStop(1, hexToRgba(hexColor, 0.0));
    ctx.fillStyle = innerGrad;
    ctx.fill(lipPath, 'evenodd');
    ctx.restore();
  } else if (finish === 'VELVET' || finish === 'MATTE') {
    // Velvet soft blur diffusion
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.filter = `blur(${Math.max(1, width * 0.003)}px)`;
    ctx.fillStyle = hexToRgba(hexColor, finish === 'VELVET' ? op * 0.35 : op * 0.28);
    ctx.fill(lipPath, 'evenodd');
    ctx.restore();
  }

  // --- LAYER 4: Continuous Dewy Specular Reflection (Glossy, Dewy & Satin) ---
  const isGlossy = finish === 'GLOSSY' || finish === 'DEWY' || finish === 'SATIN' || glossiness > 0.3;
  if (isGlossy && pt84 && pt314) {
    const gloss = Math.max(0.15, Math.min(1.0, glossiness || 0.5));
    ctx.save();

    // 1. Lower-lip central cushion sheen
    const lxCenter = (pt84.x + pt314.x) / 2 * width;
    const lyCenter = (pt17.y * 0.65 + (pt14 ? pt14.y : pt17.y) * 0.35) * height;
    const lipCushionW = Math.abs(pt314.x - pt84.x) * width * 0.65;
    const lipCushionH = Math.max(3, Math.abs(pt17.y - (pt14 ? pt14.y : pt17.y)) * height * 0.32);

    ctx.filter = `blur(${Math.max(2.5, width * 0.007)}px)`;
    ctx.globalCompositeOperation = 'soft-light';

    const cushionGrad = ctx.createRadialGradient(
      lxCenter, lyCenter, Math.max(1, lipCushionH * 0.2),
      lxCenter, lyCenter, Math.max(4, lipCushionW)
    );
    cushionGrad.addColorStop(0, `rgba(255, 255, 255, ${Math.min(0.38, gloss * 0.42)})`);
    cushionGrad.addColorStop(0.65, `rgba(255, 250, 252, ${Math.min(0.20, gloss * 0.22)})`);
    cushionGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = cushionGrad;
    ctx.beginPath();
    ctx.ellipse(lxCenter, lyCenter, lipCushionW, lipCushionH, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Continuous horizontal dewy band for high gloss
    if (gloss > 0.4) {
      ctx.globalCompositeOperation = 'screen';
      ctx.filter = `blur(${Math.max(1.8, width * 0.005)}px)`;
      const dewyGrad = ctx.createLinearGradient(
        lxCenter - lipCushionW * 0.6, lyCenter,
        lxCenter + lipCushionW * 0.6, lyCenter
      );
      dewyGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      dewyGrad.addColorStop(0.5, `rgba(255, 250, 252, ${Math.min(0.30, gloss * 0.32)})`);
      dewyGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = dewyGrad;
      ctx.beginPath();
      ctx.ellipse(lxCenter, lyCenter, lipCushionW * 0.55, Math.max(1.8, lipCushionH * 0.4), 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Cupid's bow subtle sheen on upper lip
    const uxCenter = pt0.x * width;
    const uyCenter = (pt0.y * 0.75 + (pt13 ? pt13.y : pt0.y) * 0.25) * height;
    ctx.globalCompositeOperation = 'soft-light';
    ctx.filter = `blur(${Math.max(1.5, width * 0.004)}px)`;
    const bowGrad = ctx.createRadialGradient(
      uxCenter, uyCenter, 1,
      uxCenter, uyCenter, Math.max(3, lipWidth * 0.12)
    );
    bowGrad.addColorStop(0, `rgba(255, 255, 255, ${Math.min(0.25, gloss * 0.28)})`);
    bowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = bowGrad;
    ctx.beginPath();
    ctx.ellipse(uxCenter, uyCenter, Math.max(2, lipWidth * 0.08), Math.max(1.5, lipHeight * 0.15), 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // --- LAYER 5: Micro-Shimmer Particles (Shimmer Finish) ---
  if (finish === 'SHIMMER' || shimmerIntensity > 0.1) {
    const shim = Math.max(0.1, shimmerIntensity || 0.4);
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.filter = `blur(${Math.max(1, width * 0.002)}px)`;
    ctx.fillStyle = `rgba(255, 245, 230, ${Math.min(0.35, shim * 0.45)})`;
    ctx.fill(lipPath, 'evenodd');
    ctx.restore();
  }

  ctx.restore();
}

/**
 * 2. BLUSH PBR RENDERER
 */
export function renderBlush(ctx, landmarks, options = {}, width, height) {
  if (!landmarks || landmarks.length < 400 || !ctx) return;

  const { hexColor = '#F472B6', opacity = 0.45 } = options;
  const op = Math.max(0.05, Math.min(1.0, opacity));

  ctx.save();
  ctx.globalCompositeOperation = 'soft-light';
  ctx.filter = `blur(${Math.max(3.0, width * 0.008)}px)`;

  const leftPt = landmarks[CHEEK_CENTERS.LEFT];
  const rightPt = landmarks[CHEEK_CENTERS.RIGHT];
  const nosePt = landmarks[4];
  const chinPt = landmarks[152];

  if (!leftPt || !rightPt) {
    ctx.restore();
    return;
  }

  const faceHeight = Math.abs((chinPt ? chinPt.y : 1) - (landmarks[10] ? landmarks[10].y : 0)) * height;
  const radius = Math.max(20, faceHeight * 0.14);

  [leftPt, rightPt].forEach(pt => {
    const cx = pt.x * width;
    const cy = pt.y * height;

    const grad = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius);
    grad.addColorStop(0, hexToRgba(hexColor, op * 0.9));
    grad.addColorStop(0.5, hexToRgba(hexColor, op * 0.45));
    grad.addColorStop(1, hexToRgba(hexColor, 0));

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

/**
 * 3. FOUNDATION PBR RENDERER
 */
export function renderFoundation(ctx, landmarks, options = {}, width, height) {
  if (!landmarks || landmarks.length < 400 || !ctx) return;

  const { hexColor = '#F3D2B5', opacity = 0.35 } = options;
  const op = Math.max(0.05, Math.min(0.65, opacity));

  ctx.save();
  ctx.globalCompositeOperation = 'soft-light';
  ctx.filter = `blur(${Math.max(2.0, width * 0.005)}px)`;

  const facePath = new Path2D();
  tracePathToPath2D(facePath, FACE_OVAL, landmarks, width, height);
  tracePathToPath2D(facePath, EYE_LEFT_HOLE, landmarks, width, height);
  tracePathToPath2D(facePath, EYE_RIGHT_HOLE, landmarks, width, height);
  tracePathToPath2D(facePath, LIP_OUTER_LOOP, landmarks, width, height);

  ctx.clip(facePath, 'evenodd');

  ctx.fillStyle = hexToRgba(hexColor, op);
  ctx.fill(facePath, 'evenodd');

  ctx.restore();
}

/**
 * 4. EYESHADOW PBR RENDERER
 */
export function renderEyeshadow(ctx, landmarks, options = {}, width, height) {
  if (!landmarks || landmarks.length < 400 || !ctx) return;

  const {
    hexColor = '#9333EA',
    opacity = 0.50,
    finishType = 'MATTE',
    shimmerIntensity = 0.0
  } = options;
  const op = Math.max(0.05, Math.min(1.0, opacity));
  const finish = String(finishType || '').toUpperCase();

  ctx.save();
  ctx.globalCompositeOperation = 'soft-light';
  ctx.filter = `blur(${Math.max(2, width * 0.006)}px)`;

  // Left eye
  ctx.beginPath();
  tracePath(ctx, EYESHADOW_LEFT, landmarks, width, height);
  ctx.fillStyle = hexToRgba(hexColor, op * 0.75);
  ctx.fill();

  // Right eye
  ctx.beginPath();
  tracePath(ctx, EYESHADOW_RIGHT, landmarks, width, height);
  ctx.fillStyle = hexToRgba(hexColor, op * 0.75);
  ctx.fill();

  // Shimmer eyelid highlight
  if (finish === 'SHIMMER' || shimmerIntensity > 0.1) {
    const shim = Math.max(0.15, Math.min(1.0, shimmerIntensity || 0.5));
    ctx.globalCompositeOperation = 'screen';
    ctx.filter = `blur(${Math.max(1.5, width * 0.004)}px)`;
    ctx.fillStyle = `rgba(255, 245, 225, ${Math.min(0.35, shim * 0.4)})`;

    ctx.beginPath();
    tracePath(ctx, EYESHADOW_LEFT, landmarks, width, height);
    ctx.fill();

    ctx.beginPath();
    tracePath(ctx, EYESHADOW_RIGHT, landmarks, width, height);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * MASTER MULTI-LAYER MAKEUP COMPOSITOR
 * Supports Before/After split ratio clipping
 */
export function renderCompleteMakeupLook(ctx, landmarks, width, height, activeLooks = {}, splitRatio = 1.0) {
  if (!ctx || !landmarks) return;

  ctx.save();

  // Apply Before / After horizontal split view clipping if splitRatio < 1.0
  if (splitRatio < 1.0) {
    const splitX = width * splitRatio;
    ctx.beginPath();
    ctx.rect(splitX, 0, width - splitX, height);
    ctx.clip();
  }

  // Render foundation first
  if (activeLooks.FOUNDATION) {
    renderFoundation(ctx, landmarks, activeLooks.FOUNDATION, width, height);
  }

  // Render blush
  if (activeLooks.BLUSH) {
    renderBlush(ctx, landmarks, activeLooks.BLUSH, width, height);
  }

  // Render eyeshadow
  if (activeLooks.EYESHADOW) {
    renderEyeshadow(ctx, landmarks, activeLooks.EYESHADOW, width, height);
  }

  // Render lipstick on top
  if (activeLooks.LIPSTICK) {
    renderLipstick(ctx, landmarks, activeLooks.LIPSTICK, width, height);
  }

  ctx.restore();

  // Render vertical dividing line for Before / After
  if (splitRatio < 1.0 && splitRatio > 0.0) {
    const splitX = width * splitRatio;
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.moveTo(splitX, 0);
    ctx.lineTo(splitX, height);
    ctx.stroke();

    // Small split handle diamond
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(splitX, height / 2, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
