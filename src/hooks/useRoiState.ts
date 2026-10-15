import { useContext } from 'react';

import { RoiStateContext } from '../context/contexts.js';

export function useRoiState() {
  const state = useContext(RoiStateContext);
  if (!state) {
    throw new Error('useRoiState must be used within a RoiProvider');
  }
  return state;
}
