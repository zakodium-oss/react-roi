import { useContext } from 'react';

import { RoiContext, RoiStateProps } from '../context/RoiContext';
import { RoiStateType } from '../types';

export function useRoiState<T>(): RoiStateType<T> {
  const { roiState } = useContext<RoiStateProps<T>>(RoiContext);
  return roiState;
}
