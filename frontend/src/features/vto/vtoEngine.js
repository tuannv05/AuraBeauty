// frontend/src/features/vto/vtoEngine.js
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
  EYE_RIGHT_HOLE,
  SKIN_SAMPLE_POINTS
} from './faceLandmarks';

/**
 * Traces a closed path on 2D canvas from landmark indices.
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
 * Helper to convert HEX color to RGBA string
 */
export function hexToRgba(hex, alpha = 1) {
  let c = (hex || '#9B111E').replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(ch => ch + ch).join('');
  }
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Helper to convert RGB to HEX string
 */
export function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Converts sRGB [0..255] to CIELAB (L*, a*, b*)
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

  X = X / 0.95047;
  Y = Y / 1.00000;
  Z = Z / 1.08883;

  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fX = f(X);
  const fY = f(Y);
  const fZ = f(Z);

  const L = 116 * fY - 16;
  const a = 500 * (fX - fY);
  const bVal = 200 * (fY - fZ);

  return { L, a, b: bVal };
}

/**
 * Samples skin color from 5 key facial coordinates (forehead, cheeks, chin),
 * calculates CIELAB & Individual Typology Angle (ITA), and detects Undertone.
 */
export function analyzeSkinToneFromCanvas(ctx, landmarks, width, height) {
  if (!landmarks || landmarks.length === 0) {
    return { hexColor: '#E8C6A8', undertone: 'NEUTRAL', itaAngle: 32.0 };
  }

  let totalR = 0, totalG = 0, totalB = 0;
  let validPoints = 0;

  for (const idx of SKIN_SAMPLE_POINTS) {
    const pt = landmarks[idx];
    if (!pt) continue;
    const cx = Math.floor(pt.x * width);
    const cy = Math.floor(pt.y * height);

    if (cx >= 0 && cx < width && cy >= 0 && cy < height) {
      try {
        const sample = ctx.getImageData(Math.max(0, cx - 2), Math.max(0, cy - 2), 5, 5);
        const data = sample.data;
        let patchR = 0, patchG = 0, patchB = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          patchR += data[i];
          patchG += data[i + 1];
          patchB += data[i + 2];
          count++;
        }
        if (count > 0) {
          totalR += patchR / count;
          totalG += patchG / count;
          totalB += patchB / count;
          validPoints++;
        }
      } catch (err) {
        // Tainted canvas fallback
      }
    }
  }

  if (validPoints === 0) {
    return { hexColor: '#E8C6A8', undertone: 'NEUTRAL', itaAngle: 32.0 };
  }

  const avgR = totalR / validPoints;
  const avgG = totalG / validPoints;
  const avgB = totalB / validPoints;

  const hexColor = rgbToHex(avgR, avgG, avgB);
  const { L, a, b } = rgbToLab(avgR, avgG, avgB);

  const itaAngle = Math.round(((Math.atan2(L - 50, b) * 180) / Math.PI) * 10) / 10;

  let undertone = 'NEUTRAL';
  if (b - a > 4.5 || (b > 15 && a > 0)) {
    undertone = 'WARM';
  } else if (a - b > 1.5 || b < 9) {
    undertone = 'COOL';
  } else {
    undertone = 'NEUTRAL';
  }

  return { hexColor, undertone, itaAngle };
}

/**
 * Complete PBR multi-layer blending for:
 * - LIPSTICK (Matte / Velvet / Satin / Glossy / Shimmer) with cavity cutout
 * - BLUSH (Left & Right apples with soft radial blur)
 * - FOUNDATION (Skin mesh overlay avoiding eyes and mouth)
 * - EYESHADOW (Left & Right upper eyelids)
 * With Split-Slider (Before / After) clipping.
 */
export function renderCompleteMakeupLook(ctx, landmarks, width, height, activeLooks = {}, splitRatio = 1.0) {
  if (!landmarks || landmarks.length === 0) return;

  ctx.save();

  // If Before/After split slider is active (splitRatio < 1.0),
  // clip makeup rendering to the right side (After)
  if (splitRatio < 1.0 && splitRatio > 0.0) {
    const splitX = width * splitRatio;
    ctx.beginPath();
    ctx.rect(splitX, 0, width - splitX, height);
    ctx.clip();
  }

  // 1. FOUNDATION LAYER
  if (activeLooks.FOUNDATION) {
    const f = activeLooks.FOUNDATION;
    const hex = f.hexColor || '#E5B899';
    const opacity = f.opacity || 0.28;

    ctx.save();
    ctx.beginPath();
    tracePath(ctx, FACE_OVAL, landmarks, width, height);
    tracePath(ctx, EYE_LEFT_HOLE, landmarks, width, height);
    tracePath(ctx, EYE_RIGHT_HOLE, landmarks, width, height);
    tracePath(ctx, LIP_OUTER_LOOP, landmarks, width, height);

    ctx.fillStyle = hexToRgba(hex, opacity * 0.65);
    ctx.globalCompositeOperation = 'soft-light';
    ctx.filter = 'blur(8px)';
    ctx.fill('evenodd');
    ctx.restore();
  }

  // 2. BLUSH LAYER
  if (activeLooks.BLUSH) {
    const b = activeLooks.BLUSH;
    const hex = b.hexColor || '#F28482';
    const opacity = b.opacity || 0.35;

    const leftCenter = landmarks[CHEEK_CENTERS.LEFT];
    const rightCenter = landmarks[CHEEK_CENTERS.RIGHT];

    if (leftCenter && rightCenter) {
      const lx = leftCenter.x * width;
      const ly = leftCenter.y * height;
      const rx = rightCenter.x * width;
      const ry = rightCenter.y * height;

      // Distance estimation for blush spot radius
      const eyeL = landmarks[159] || leftCenter;
      const eyeR = landmarks[386] || rightCenter;
      const eyeDist = Math.hypot((eyeR.x - eyeL.x) * width, (eyeR.y - eyeL.y) * height);
      const cheekRadius = Math.max(16, eyeDist * 0.32);

      ctx.save();
      ctx.globalCompositeOperation = 'soft-light';
      ctx.filter = 'blur(10px)';

      // Left cheek radial gradient
      const gradL = ctx.createRadialGradient(lx, ly, cheekRadius * 0.1, lx, ly, cheekRadius);
      gradL.addColorStop(0, hexToRgba(hex, opacity * 1.0));
      gradL.addColorStop(0.5, hexToRgba(hex, opacity * 0.45));
      gradL.addColorStop(1, hexToRgba(hex, 0));
      ctx.fillStyle = gradL;
      ctx.beginPath();
      ctx.arc(lx, ly, cheekRadius, 0, Math.PI * 2);
      ctx.fill();

      // Right cheek radial gradient
      const gradR = ctx.createRadialGradient(rx, ry, cheekRadius * 0.1, rx, ry, cheekRadius);
      gradR.addColorStop(0, hexToRgba(hex, opacity * 1.0));
      gradR.addColorStop(0.5, hexToRgba(hex, opacity * 0.45));
      gradR.addColorStop(1, hexToRgba(hex, 0));
      ctx.fillStyle = gradR;
      ctx.beginPath();
      ctx.arc(rx, ry, cheekRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // 3. EYESHADOW LAYER
  if (activeLooks.EYESHADOW) {
    const e = activeLooks.EYESHADOW;
    const hex = e.hexColor || '#A66E4E';
    const opacity = e.opacity || 0.45;

    ctx.save();
    ctx.filter = 'blur(4px)';

    // Pass 1: Base color tone
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = hexToRgba(hex, opacity * 0.65);
    ctx.beginPath();
    tracePath(ctx, EYESHADOW_LEFT, landmarks, width, height);
    ctx.fill();
    ctx.beginPath();
    tracePath(ctx, EYESHADOW_RIGHT, landmarks, width, height);
    ctx.fill();

    // Pass 2: Soft light radiance
    ctx.globalCompositeOperation = 'soft-light';
    ctx.fillStyle = hexToRgba(hex, opacity * 0.85);
    ctx.beginPath();
    tracePath(ctx, EYESHADOW_LEFT, landmarks, width, height);
    ctx.fill();
    ctx.beginPath();
    tracePath(ctx, EYESHADOW_RIGHT, landmarks, width, height);
    ctx.fill();

    // Pass 3: Shimmer particles for glitter/metallic eyeshadow
    if (e.shimmerIntensity && e.shimmerIntensity > 0.3) {
      ctx.filter = 'blur(1.5px)';
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = hexToRgba('#FFF8E7', e.shimmerIntensity * 0.6);
      ctx.beginPath();
      tracePath(ctx, EYESHADOW_LEFT, landmarks, width, height);
      ctx.fill();
      ctx.beginPath();
      tracePath(ctx, EYESHADOW_RIGHT, landmarks, width, height);
      ctx.fill();
    }

    ctx.restore();
  }

  // 4. LIPSTICK LAYER (Multi-pass realistic pigment infusion)
  if (activeLooks.LIPSTICK) {
    const lip = activeLooks.LIPSTICK;
    const hex = lip.hexColor || '#9B111E';
    const opacity = lip.opacity || 0.78;
    const gloss = lip.glossiness || 0.2;
    const shimmer = lip.shimmerIntensity || 0;
    const finish = lip.finishType || 'MATTE';

    ctx.save();

    // 4a. Layer 1: Pigment Infusion (source-over with smooth feathered edge)
    ctx.filter = 'blur(1.4px)';
    ctx.beginPath();
    tracePath(ctx, LIP_OUTER_LOOP, landmarks, width, height);
    tracePath(ctx, LIP_INNER_LOOP, landmarks, width, height);

    ctx.fillStyle = hexToRgba(hex, Math.min(1.0, opacity * 0.68));
    ctx.globalCompositeOperation = 'source-over';
    ctx.fill('evenodd');

    // 4b. Layer 2: Texture & Depth Blend (multiply maintains natural lip creases)
    ctx.fillStyle = hexToRgba(hex, Math.min(1.0, opacity * 0.58));
    ctx.globalCompositeOperation = 'multiply';
    ctx.fill('evenodd');

    // 4c. Layer 3: Velvet / Satin Depth
    if (finish === 'VELVET') {
      ctx.fillStyle = hexToRgba(hex, opacity * 0.25);
      ctx.globalCompositeOperation = 'soft-light';
      ctx.fill('evenodd');
    }

    // 4d. Layer 4: Natural Continuous Dewy Specular Reflection (Glossy & Satin)
    // Loại bỏ hoàn toàn 13 đốm sáng tròn trắng rời rạc (hiệu ứng đom đóm)
    // Thay thế bằng dải phản quang elip mềm mại tự nhiên dọc theo lòng môi dưới và nhân trung
    if ((gloss > 0.15 || finish === 'GLOSSY' || finish === 'SATIN') && finish !== 'MATTE') {
      const pt14 = landmarks[14] || landmarks[17];
      const pt17 = landmarks[17];
      const pt84 = landmarks[84];
      const pt314 = landmarks[314];

      if (pt17 && pt84 && pt314) {
        ctx.save();

        // 1. Dải bắt sáng lòng môi dưới (Plump lower-lip cushion highlight)
        const lxCenter = (pt84.x + pt314.x) / 2 * width;
        const lyCenter = (pt17.y * 0.65 + (pt14 ? pt14.y : pt17.y) * 0.35) * height;
        const lipCushionW = Math.max(14, Math.abs(pt314.x - pt84.x) * width * 0.45);
        const lipCushionH = Math.max(3, Math.abs(pt17.y - (pt14 ? pt14.y : pt17.y)) * height * 0.32);

        // Soft dewy sheen with soft-light so it blends smoothly into the underlying lipstick
        ctx.filter = `blur(${Math.max(2.5, width * 0.007)}px)`;
        ctx.globalCompositeOperation = 'soft-light';

        const maxGlareAlpha = Math.min(0.40, gloss * 0.42);
        const glareGrad = ctx.createRadialGradient(lxCenter, lyCenter, 1, lxCenter, lyCenter, lipCushionW);
        glareGrad.addColorStop(0, `rgba(255, 248, 250, ${maxGlareAlpha})`);
        glareGrad.addColorStop(0.45, `rgba(255, 240, 245, ${maxGlareAlpha * 0.6})`);
        glareGrad.addColorStop(0.85, `rgba(255, 235, 240, ${maxGlareAlpha * 0.15})`);
        glareGrad.addColorStop(1, 'rgba(255, 235, 240, 0)');

        ctx.fillStyle = glareGrad;
        ctx.beginPath();
        ctx.ellipse(lxCenter, lyCenter, lipCushionW, lipCushionH, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. Nếu là chất son siêu bóng (GLOSSY cao cấp), thêm vệt bắt sáng căng mọng trong suốt (không dùng đốm trắng)
        if (finish === 'GLOSSY' && gloss > 0.45) {
          ctx.globalCompositeOperation = 'screen';
          ctx.filter = `blur(${Math.max(1.8, width * 0.005)}px)`;
          const dewyGrad = ctx.createLinearGradient(lxCenter - lipCushionW * 0.6, lyCenter, lxCenter + lipCushionW * 0.6, lyCenter);
          dewyGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          dewyGrad.addColorStop(0.5, `rgba(255, 250, 252, ${Math.min(0.32, gloss * 0.35)})`);
          dewyGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = dewyGrad;
          ctx.beginPath();
          ctx.ellipse(lxCenter, lyCenter, lipCushionW * 0.55, Math.max(1.8, lipCushionH * 0.4), 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // 3. Ánh sáng nhẹ ở đỉnh viền nhân trung (Cupid's bow - landmark 0), lan tỏa tự nhiên, không thành hạt
        if (finish === 'GLOSSY' && gloss > 0.35 && landmarks[0]) {
          const pt0 = landmarks[0];
          const cxCupid = pt0.x * width;
          const cyCupid = pt0.y * height + 1;
          const rCupid = Math.max(3, width * 0.008);

          ctx.globalCompositeOperation = 'soft-light';
          ctx.filter = 'blur(2px)';
          const cupidGrad = ctx.createRadialGradient(cxCupid, cyCupid, 0.5, cxCupid, cyCupid, rCupid);
          cupidGrad.addColorStop(0, `rgba(255, 248, 250, ${Math.min(0.28, gloss * 0.30)})`);
          cupidGrad.addColorStop(1, 'rgba(255, 248, 250, 0)');

          ctx.fillStyle = cupidGrad;
          ctx.beginPath();
          ctx.arc(cxCupid, cyCupid, rCupid, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // 4e. Layer 5: Micro-shimmer (Ánh nhũ mịn tự nhiên, phủ đều thay vì chấm hạt đom đóm)
    if ((shimmer > 0.15 || finish === 'SHIMMER') && finish !== 'MATTE') {
      ctx.save();
      ctx.filter = 'blur(1.2px)';
      ctx.globalCompositeOperation = 'soft-light';
      ctx.fillStyle = `rgba(255, 240, 215, ${Math.min(0.35, shimmer * 0.45)})`;
      ctx.beginPath();
      tracePath(ctx, LIP_OUTER_LOOP, landmarks, width, height);
      tracePath(ctx, LIP_INNER_LOOP, landmarks, width, height);
      ctx.fill('evenodd');
      ctx.restore();
    }

    ctx.restore();
  }

  ctx.restore();

  // 5. SPLIT-SLIDER DIVIDER LINE
  if (splitRatio < 1.0 && splitRatio > 0.0) {
    const splitX = width * splitRatio;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(splitX, 0);
    ctx.lineTo(splitX, height);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 6;
    ctx.stroke();

    // Center handle circle
    ctx.beginPath();
    ctx.arc(splitX, height / 2, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#e11d48';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner icon
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⬌', splitX, height / 2);

    // Labels
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 5;
    ctx.fillText('MỘC', Math.max(25, splitX - 35), 25);
    ctx.fillText('MAKEUP', Math.min(width - 40, splitX + 42), 25);

    ctx.restore();
  }
}
