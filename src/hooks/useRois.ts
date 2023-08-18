import { useContext } from 'react';

import { RoisContext } from '../context/RoiContext';
import { Roi } from '../types/Roi';

export function useRois<T>(ids?: string[]) {
  const rois = useContext<Array<Roi<T>>>(RoisContext);
  // TODO: show error if context do not exist
  if (ids) {
    return rois.filter((roi) => ids.includes(roi.id));
  } else {
    return rois;
  }
}
