import { useMemo } from 'react';

import { CommittedRoi } from '../types/CommittedRoi';

import { useRoiDispatch } from './useRoiDispatch';

export function useRoiActions<T = unknown>() {
  const roiDispatch = useRoiDispatch();
  const actions = useMemo(() => {
    return {
      createRoi: (roi: CommittedRoi<T>) =>
        roiDispatch({ type: 'addRoi', payload: roi }),
      updateRoi: (
        selectedRoi: string,
        updatedData: Partial<Omit<CommittedRoi<T>, 'id'>>,
      ) => {
        roiDispatch({
          type: 'updateRoi',
          payload: { ...updatedData, id: selectedRoi },
        });
      },
      removeRoi: (selectedRoi: string) => {
        roiDispatch({ type: 'removeRoi', payload: selectedRoi });
      },
      setMode: (mode: 'select' | 'draw') =>
        roiDispatch({ type: 'setMode', payload: mode }),
    };
  }, [roiDispatch]);
  return actions;
}
