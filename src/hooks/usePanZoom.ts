import { useContext } from 'react';

import { panZoomContext } from '../context/contexts';
import { computeTotalPanZoom } from '../utilities/panZoom';

export function usePanZoom() {
  return useContext(panZoomContext);
}

export function usePanZoomTransform() {
  // const {
  //   panZoom: { scale: s1, translation: t1 },
  //   initialPanZoom: { scale: s2, translation: t2 },
  // } = usePanZoom();
  // const scale = s1 * s2;

  const panZoom = computeTotalPanZoom(usePanZoom());
  // return `matrix(${scale}, 0, 0, ${scale}, ${t1[0]}, ${t1[1]})`;
  return `matrix(${panZoom.scale}, 0, 0, ${panZoom.scale}, ${panZoom.translation[0]}, ${panZoom.translation[1]})`;
}
