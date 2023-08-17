import { useContext } from 'react';

import { RoiStateContext } from '../context/RoiContext';
import { RoiContainerState } from '../types';

export function useRoiState<T>(): RoiContainerState<T> {
  /**
   * selected roi
   * ratio
   * mode
   */
  const state = useContext<RoiContainerState<T>>(RoiStateContext);
  return state;
}
