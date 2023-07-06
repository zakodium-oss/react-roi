import { useContext } from 'react';

import { RoiContext } from '../context/RoiContext';
import { RoiStateType } from '../types';

export function useGetRoiState(): RoiStateType {
  const { roiState } = useContext(RoiContext);
  return roiState;
}
