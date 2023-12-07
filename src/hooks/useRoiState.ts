import { useContext } from 'react';

import { RoiState } from '..';
import { roiStateContext } from '../context/contexts';

export function useRoiState() {
  /**
   * selected roi
   * ratio
   * mode
   */
  const state = useContext<RoiState>(roiStateContext);
  if (!state) {
    throw new Error('useRoiState must be used within a RoiProvider');
  }
  return state;
}
