import { useContext, useMemo } from 'react';

import { RoiDispatchContext } from '../context/RoiContext';
import { CommittedRoi } from '../types/CommittedRoi';

export function useRoiActions<T = unknown>() {
  const roiDispatch = useContext(RoiDispatchContext);
  const actions = useMemo(() => {
    return {
      createRoi: (roi: CommittedRoi<T> & { id: string }) =>
        roiDispatch({ type: 'addRoi', payload: roi }),
      updateRoi: (
        selectedRoi: string,
        updatedData: Partial<CommittedRoi<T>>,
      ) => {
        roiDispatch({
          type: 'updateRoi',
          payload: { id: selectedRoi, updatedData },
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
