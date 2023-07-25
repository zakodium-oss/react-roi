import { useContext } from 'react';

import { RoiDispatchContext } from '../context/RoiContext';
import { CommittedRoi } from '../types/CommittedRoi';
import { Roi } from '../types/Roi';

interface RoiActionsType<T> {
  createRoi: (roi: Partial<CommittedRoi<T>> & { id: string }) => void;
  updateRoi: (selectedRoi: string, updatedData: Partial<Roi<T>>) => void;
  removeRoi: (selectedRoi: string, updatedData: Partial<Roi<T>>) => void;
  setMode: (mode: 'select' | 'draw') => void;
}

export function useRoiActions<T = unknown>(): RoiActionsType<T> {
  const { roiDispatch } = useContext(RoiDispatchContext);
  return {
    createRoi: (roi: Partial<CommittedRoi<T>> & { id: string }) => roiDispatch({ type: 'addRoi', payload: roi }),
    updateRoi: (selectedRoi: string, updatedData: Partial<Roi<T>>) => {
      roiDispatch({ type: 'updateRoi', payload: { id: selectedRoi, updatedData } })
    },
    removeRoi: (selectedRoi: string) => {
      roiDispatch({ type: 'removeRoi', payload: selectedRoi })
    },
    setMode: (mode: 'select' | 'draw') => roiDispatch({ type: 'setMode', payload: mode })
  };
}
