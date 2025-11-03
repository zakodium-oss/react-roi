import { useContext } from 'react';

import { roisContext } from '../context/contexts.js';
import type { Roi } from '../types/Roi.js';

export function useRois<T>() {
  const rois = useContext(roisContext);
  if (!rois) {
    throw new Error('useRois must be used within a RoiProvider');
  }
  return rois as Array<Roi<T>>;
}
