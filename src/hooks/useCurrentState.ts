import type { RefObject } from 'react';
import { useContext } from 'react';

import { roiStateRefContext } from '../context/contexts.js';
import type { ReactRoiState } from '../context/roiReducer.js';

export function useCurrentState<T>() {
  const context = useContext(roiStateRefContext);
  if (context === null) {
    throw new Error('useStateRef must be used within a RoiProvider');
  }
  return context as RefObject<ReactRoiState<T>>;
}
