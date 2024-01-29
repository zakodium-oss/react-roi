import { KeyboardEvent as ReactKeyboardEvent, useMemo } from 'react';

import { CancelActionPayload } from '../context/roiReducer';
import { CommittedRoi } from '../types/Roi';
import { RoiMode } from '../types/utils';

import { useRoiContainerRef } from './useRoiContainerRef';
import { useRoiDispatch } from './useRoiDispatch';

export type UpdateData<TData = unknown> = Partial<
  Omit<CommittedRoi<TData>, 'id'>
>;
export function useActions<TData = unknown>() {
  const roiDispatch = useRoiDispatch();
  const ref = useRoiContainerRef();

  return useMemo(() => {
    return {
      cancelAction: (
        event: KeyboardEvent | ReactKeyboardEvent,
        options: CancelActionPayload,
      ) => {
        event.preventDefault();

        if (event.isTrusted) {
          roiDispatch({
            type: 'CANCEL_ACTION',
            payload: options,
          });
        }
      },
      zoom: (factor: number) => {
        if (!ref?.current) return;
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
      createRoi: (roi: CommittedRoi<TData>) => {
        roiDispatch({
          type: 'CREATE_ROI',
          payload: roi,
        });
      },
      updateRoi: (selectedRoi: string, updatedData: UpdateData<TData>) => {
        roiDispatch({
          type: 'UPDATE_ROI',
          payload: { ...updatedData, id: selectedRoi },
        });
      },
      removeRoi: (selectedRoi: string) => {
        roiDispatch({ type: 'REMOVE_ROI', payload: selectedRoi });
      },
      selectRoi: (selectedRoi: string | null) => {
        roiDispatch({ type: 'SELECT_ROI', payload: selectedRoi });
      },
      setMode: (mode: RoiMode) =>
        roiDispatch({ type: 'SET_MODE', payload: mode }),
    };
  }, [roiDispatch, ref]);
}
