import { PanZoomContext } from '../context/contexts';

export function applyTransformX(panZoom: PanZoomContext, x: number) {
  return panZoom.scale * x + panZoom.translation[0];
}

export function applyTransformY(panZoom: PanZoomContext, y: number) {
  return panZoom.scale * y + panZoom.translation[1];
}

export function applyInverseX(panzoom: PanZoomContext, x: number) {
  return (x - panzoom.translation[0]) / panzoom.scale;
}

export function applyInverseY(panzoom: PanZoomContext, y: number) {
  return (y - panzoom.translation[1]) / panzoom.scale;
}
