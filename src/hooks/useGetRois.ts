import { useContext } from 'react';

import { RoiContext } from '../context/RoiContext';
import { RoiObject } from '../types';

export function useGetRois(): RoiObject[] {
  const { roiState } = useContext(RoiContext);
  return roiState.rois;
}
