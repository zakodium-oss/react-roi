import { use } from 'react';

import { RoisContext } from '../context/contexts.js';
import type { Roi } from '../types/Roi.js';

export function useRois<T>() {
  const rois = use(RoisContext);
  if (!rois) {
    throw new Error('useRois must be used within a RoiProvider');
  }
  return rois as Array<Roi<T>>;
}
