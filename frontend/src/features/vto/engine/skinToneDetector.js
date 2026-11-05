// frontend/src/features/vto/engine/skinToneDetector.js
/**
 * Skin Tone & Undertone Extractor using 5-point CIELAB ITA° measurement
 */
import { SKIN_SAMPLE_POINTS } from '../constants/faceMeshIndices';
import { rgbToLab, calculateITA, classifyUndertone, rgbToHex } from './colorSpaceUtils';

/**
 * Extracts skin pixels from 2D canvas at 5 anatomically stable landmarks:
 * Forehead (10, 151), Cheeks (118, 347), Chin (199)
 * Returns { hex, ita, undertone, rgb }
 */
export function detectSkinTone(ctx, landmarks, width, height) {
  if (!landmarks || landmarks.length < 400 || !ctx) {
    return { hex: '#E8C6A8', ita: 34.5, undertone: 'WARM' };
  }

  let totalR = 0, totalG = 0, totalB = 0, sampleCount = 0;

  for (const idx of SKIN_SAMPLE_POINTS) {
    const pt = landmarks[idx];
    if (!pt) continue;

    const cx = Math.floor(pt.x * width);
    const cy = Math.floor(pt.y * height);

    if (cx < 2 || cx >= width - 2 || cy < 2 || cy >= height - 2) continue;

    try {
      const imgData = ctx.getImageData(cx - 2, cy - 2, 5, 5).data;
      for (let i = 0; i < imgData.length; i += 4) {
        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

        // Filter out extreme highlights (>245) or deep shadows (<35)
        if (luminance > 35 && luminance < 245) {
          totalR += r;
          totalG += g;
          totalB += b;
          sampleCount++;
        }
      }
    } catch {
      // Cross-origin image fallback
      return { hex: '#E8C6A8', ita: 34.5, undertone: 'WARM' };
    }
  }

  if (sampleCount === 0) {
    return { hex: '#E8C6A8', ita: 34.5, undertone: 'WARM' };
  }

  const avgR = Math.round(totalR / sampleCount);
  const avgG = Math.round(totalG / sampleCount);
  const avgB = Math.round(totalB / sampleCount);

  const lab = rgbToLab(avgR, avgG, avgB);
  const ita = calculateITA(lab.L, lab.b);
  const undertone = classifyUndertone(ita, lab.b);
  const hex = rgbToHex(avgR, avgG, avgB);

  return {
    hex,
    hexColor: hex,
    ita: Math.round(ita * 10) / 10,
    itaAngle: Math.round(ita * 10) / 10,
    undertone,
    rgb: { r: avgR, g: avgG, b: avgB }
  };
}

/**
 * Backward compatibility alias for analyzeSkinToneFromCanvas
 */
export function analyzeSkinToneFromCanvas(ctx, landmarks, width, height) {
  return detectSkinTone(ctx, landmarks, width, height);
}

