import { useContext } from 'react';

import { roiStateContext } from '../context/contexts';
import { RoiContainerState } from '../types';

export function useRoiState<T>() {
  /**
   * selected roi
   * ratio
   * mode
   */
  const state =
    useContext<Omit<RoiContainerState<T>, 'commitedRois' | 'rois'>>(
      roiStateContext,
    );
  return state;
}
