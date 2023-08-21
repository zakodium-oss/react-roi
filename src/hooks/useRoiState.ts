import { useContext } from 'react';

import { roiStateContext } from '../context/contexts';
import { RoiContainerState } from '../types';

export function useRoiState() {
  /**
   * selected roi
   * ratio
   * mode
   */
  const state = useContext<RoiContainerState>(roiStateContext);
  if (!state) {
    throw new Error('useRoiState must be used within a RoiProvider');
  }
  return state;
}
