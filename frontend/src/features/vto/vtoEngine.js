// frontend/src/features/vto/vtoEngine.js
/**
 * Master VTO Engine Façade (Aura Virtual Try-On 2.0)
 * Seamlessly connects modular engines and provides 100% backward compatibility
 */

export * from './constants/faceMeshIndices';
export * from './engine/oneEuroFilter';
export * from './engine/colorSpaceUtils';
export * from './engine/skinToneDetector';
export * from './engine/makeupPbrRenderer';

import {
  renderLipstick,
  renderBlush,
  renderFoundation,
  renderEyeshadow
} from './engine/makeupPbrRenderer';

/**
 * Backward compatibility wrapper for single-category rendering
 */
export function renderVirtualMakeup(ctx, landmarks, options = {}, width, height) {
  if (!landmarks || landmarks.length < 400 || !ctx) return;
  const category = (options.category || 'LIPSTICK').toUpperCase();

  switch (category) {
    case 'BLUSH':
      renderBlush(ctx, landmarks, options, width, height);
      break;
    case 'FOUNDATION':
      renderFoundation(ctx, landmarks, options, width, height);
      break;
    case 'EYESHADOW':
      renderEyeshadow(ctx, landmarks, options, width, height);
      break;
    case 'LIPSTICK':
    default:
      renderLipstick(ctx, landmarks, options, width, height);
      break;
  }
}
