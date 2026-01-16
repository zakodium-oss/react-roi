import type { ReactRoiState } from '../context/roiReducer.tsx';
import type { PanZoom } from '../index.js';

import type { Point } from './point.ts';

export function getIdentityPanzoom(): PanZoom {
  return {
    scale: 1,
    translation: [0, 0],
  };
}

// Inverse of scale * x + t0
export function applyInverseX(panzoom: PanZoom, x: number) {
  return (x - panzoom.translation[0]) / panzoom.scale;
}

// Inverse of scale * y + t1
export function applyInverseY(panzoom: PanZoom, y: number) {
  return (y - panzoom.translation[1]) / panzoom.scale;
}

export function applyTransformX(panzoom: PanZoom, x: number) {
  return panzoom.scale * x + panzoom.translation[0];
}

export function applyTransformY(panzoom: PanZoom, y: number) {
  return panzoom.scale * y + panzoom.translation[1];
}

/**
 * Multiplies the initial transform with the zoom transform
 **/
export function computeTotalPanZoom(state: {
  panZoom: PanZoom;
  basePanZoom: PanZoom;
}): PanZoom {
  const {
    panZoom: { scale: s1, translation: t1 },
    basePanZoom: { scale: s2, translation: t2 },
  } = state;
  return {
    scale: s1 * s2,
    translation: [s1 * t2[0] + t1[0], s1 * t2[1] + t1[1]],
  };
}

export function zoomTo(
  draft: ReactRoiState,
  factor: number,
  point: Point,
): PanZoom {
  const { min: minZoom, max: maxZoom } = draft.zoomDomain;
  const { panZoom } = draft;
  const { scale, translation } = panZoom;
  // We apply the inverse transformation to the pointer position
  // To obtain the coordinates in the original coordinate system
  const originalX = applyInverseX(panZoom, point.x);
  const originalY = applyInverseY(panZoom, point.y);

  const scaleNew = Math.max(minZoom, Math.min(scale * factor, maxZoom));

  // Compute the new translation so that transforming the point under the pointer
  // remains at the same position before and after the zoom.
  //     affine(originalX) = affine_new(originalX)
  //     translation_new = (scale - scale_new) * originalX + translation
  const translationNew: [number, number] = [
    (scale - scaleNew) * originalX + translation[0],
    (scale - scaleNew) * originalY + translation[1],
  ];

  return {
    scale: scaleNew,
    translation: translationNew,
  };
}
