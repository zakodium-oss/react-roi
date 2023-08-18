import { useContext } from 'react';

import { RoiStateContext } from '../context/RoiContext';
import { RoiContainerState } from '../types';

export function useRoiState<T>() {
  /**
   * selected roi
   * ratio
   * mode
   */
  const state =
    useContext<Omit<RoiContainerState<T>, 'commitedRois' | 'rois'>>(
      RoiStateContext,
    );
  return state;
}
