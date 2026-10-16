import { use } from 'react';

import { RoiStateContext } from '../context/contexts.js';

export function useRoiState() {
  const state = use(RoiStateContext);
  if (!state) {
    throw new Error('useRoiState must be used within a RoiProvider');
  }
  return state;
}
