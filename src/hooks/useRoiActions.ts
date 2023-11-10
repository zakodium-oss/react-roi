import { useMemo } from 'react';

import { CommittedRoi } from '../types/Roi';

import { useRoiDispatch } from './useRoiDispatch';

export type UpdateData<T = unknown> = Partial<Omit<CommittedRoi<T>, 'id'>>;
export function useRoiActions<T = unknown>() {
  const roiDispatch = useRoiDispatch();

  return useMemo(() => {
    return {
      createRoi: (roi: CommittedRoi<T>) => {
        roiDispatch({
          type: 'CREATE_ROI',
          payload: roi,
        });
      },
      updateRoi: (selectedRoi: string, updatedData: UpdateData<T>) => {
        roiDispatch({
          type: 'UPDATE_ROI',
          payload: { ...updatedData, id: selectedRoi },
        });
      },
      removeRoi: (selectedRoi: string) => {
        roiDispatch({ type: 'REMOVE_ROI', payload: selectedRoi });
      },
      setMode: (mode: 'select' | 'draw') =>
        roiDispatch({ type: 'SET_MODE', payload: mode }),
    };
  }, [roiDispatch]);
}
