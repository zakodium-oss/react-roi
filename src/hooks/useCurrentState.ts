import { RefObject, useContext } from 'react';

import { roiStateRefContext } from '../context/contexts';
import { ReactRoiState } from '../context/roiReducer';

export function useCurrentState<T>() {
  const context = useContext(roiStateRefContext);
  if (context === null) {
    throw new Error('useStateRef must be used within a RoiProvider');
  }
  return context as RefObject<ReactRoiState<T>>;
}
