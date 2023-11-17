import { useContext } from 'react';

import { panZoomContext } from '../context/contexts';

export function usePanZoom() {
  return useContext(panZoomContext);
}

export function usePanZoomTransform() {
  const {
    panZoom: { scale: s1, translation: t1 },
    initialPanZoom: { scale: s2, translation: t2 },
  } = usePanZoom();
  const scale = s1 * s2;

  // return `matrix(${scale}, 0, 0, ${scale}, ${t1[0]}, ${t1[1]})`;
  return `matrix(${scale}, 0, 0, ${scale}, ${s1 * t2[0] + t1[0]}, ${
    s1 * t2[1] + t1[1]
  })`;
}
