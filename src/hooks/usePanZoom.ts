import { useContext } from 'react';

import { panZoomContext } from '../context/contexts';

export function usePanZoom() {
  return useContext(panZoomContext);
}

export function usePanZoomTransform() {
  const { scale, translation } = usePanZoom();
  return `matrix(${scale}, 0, 0, ${scale}, ${translation[0]}, ${translation[1]})`;
}
