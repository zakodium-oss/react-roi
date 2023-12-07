import { useMemo } from 'react';

import { CommittedRoi } from '../types/Roi';

import { useRoiContainerRef } from './useRoiContainerRef';
import { useRoiDispatch } from './useRoiDispatch';

export type UpdateData<T = unknown> = Partial<Omit<CommittedRoi<T>, 'id'>>;
export function useActions<T = unknown>() {
  const roiDispatch = useRoiDispatch();
  const ref = useRoiContainerRef();

  return useMemo(() => {
    return {
      cancelAction: (event: KeyboardEvent) => {
        event.preventDefault();

        if (event.isTrusted) {
          roiDispatch({
            type: 'CANCEL_ACTION',
          });
        }
      },
      zoom: (factor: number) => {
        if (!ref.current) return;
        const refBound = ref.current.getBoundingClientRect();

        roiDispatch({
          type: 'ZOOM',
          payload: {
            clientX: refBound.width / 2,
            clientY: refBound.height / 2,
            scale: factor,
            refBoundingClientRect: refBound,
          },
        });
      },
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
  }, [roiDispatch, ref]);
}
