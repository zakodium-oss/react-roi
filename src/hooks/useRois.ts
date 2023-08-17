import { useContext } from 'react';

import { RoisContext } from '../context/RoiContext';
import { Roi } from '../types/Roi';

export function useRois<T>() {
  const rois = useContext<Array<Roi<T>>>(RoisContext);
  // TODO: show error if context do not exist
  return rois;
}
