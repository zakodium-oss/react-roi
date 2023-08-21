import { useMemo } from 'react';

import { CommittedRoi } from '../types/Roi';

import { useRoiDispatch } from './useRoiDispatch';

export function useRoiActions<T = unknown>() {
  const roiDispatch = useRoiDispatch();

  const actions = useMemo(() => {
    return {
      createRoi: (roi: CommittedRoi<T>) => {
        roiDispatch({
          type: 'CREATE_ROI',
          payload: roi,
        });
      },
      updateRoi: (
        selectedRoi: string,
        updatedData: Partial<Omit<CommittedRoi<T>, 'id'>>,
      ) => {
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
  return actions;
}
