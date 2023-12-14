import { useContext } from 'react';

import { panZoomContext } from '../context/contexts';
import { computeTotalPanZoom } from '../utilities/panZoom';

export function usePanZoom() {
  return useContext(panZoomContext);
}

export function usePanZoomTransform() {
  const panZoom = computeTotalPanZoom(usePanZoom());
  return `matrix(${panZoom.scale}, 0, 0, ${panZoom.scale}, ${panZoom.translation[0]}, ${panZoom.translation[1]})`;
}
