import { useContext } from 'react';

import { roiStateContext } from '../context/contexts.js';

export function useRoiState() {
  const state = useContext(roiStateContext);
  if (!state) {
    throw new Error('useRoiState must be used within a RoiProvider');
  }
  return state;
}
