import type { RefObject } from 'react';
import { use } from 'react';

import { RoiStateRefContext } from '../context/contexts.js';
import type { ReactRoiState } from '../context/roiReducer.js';

export function useCurrentState<T>() {
  const context = use(RoiStateRefContext);
  if (context === null) {
    throw new Error('useStateRef must be used within a RoiProvider');
  }
  return context as RefObject<ReactRoiState<T>>;
}
