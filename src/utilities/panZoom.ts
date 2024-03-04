import { Box, PanZoom } from '../index';

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

export function applyTransformToBox(panzoom: PanZoom, box: Box): Box {
  const x2 = box.x + box.width;
  const y2 = box.y + box.height;
  const x = applyTransformX(panzoom, box.x);
  const y = applyTransformY(panzoom, box.y);
  return {
    x,
    y,
    width: applyTransformX(panzoom, x2) - x,
    height: applyTransformY(panzoom, y2) - y,
    angle: box.angle,
  };
}

/**
 * Multiplies the initial transform with the zoom transform
 **/
export function computeTotalPanZoom(state: {
  panZoom: PanZoom;
  initialPanZoom: PanZoom;
}): PanZoom {
  const {
    panZoom: { scale: s1, translation: t1 },
    initialPanZoom: { scale: s2, translation: t2 },
  } = state;
  return {
    scale: s1 * s2,
    translation: [s1 * t2[0] + t1[0], s1 * t2[1] + t1[1]],
  };
}
