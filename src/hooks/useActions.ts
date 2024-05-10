import { produce } from 'immer';
import { KeyboardEvent as ReactKeyboardEvent, useMemo } from 'react';

import { CommittedRoiProperties } from '..';
import { CancelActionPayload } from '../context/roiReducer';
import { zoomAction } from '../context/updaters/zoom';
import { RoiMode } from '../types/utils';

import useCallbacksRef from './useCallbacksRef';
import { useCurrentState } from './useCurrentState';
import { useRoiContainerRef } from './useRoiContainerRef';
import { useRoiDispatch } from './useRoiDispatch';

export type UpdateData<TData = unknown> = Partial<
  Omit<CommittedRoiProperties<TData>, 'id'>
>;
export function useActions<TData = unknown>() {
  const roiDispatch = useRoiDispatch();
  const containerRef = useRoiContainerRef();
  const callbacksRef = useCallbacksRef();
  const stateRef = useCurrentState();

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
        if (!containerRef?.current) return;
        const refBound = containerRef.current.getBoundingClientRect();
        const zoomPayload = {
          clientX: refBound.width / 2,
          clientY: refBound.height / 2,
          scale: factor,
          containerBoundingRect: refBound,
        };
        roiDispatch({
          type: 'ZOOM',
          payload: zoomPayload,
        });

        if (stateRef.current && callbacksRef.current?.onAfterZoomChange) {
          const newState = produce(stateRef.current, (draft) =>
            zoomAction(draft, zoomPayload),
          );
          callbacksRef.current.onAfterZoomChange(newState.panZoom);
        }
      },
      createRoi: (roi: CommittedRoiProperties<TData>) => {
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
  }, [roiDispatch, containerRef, stateRef, callbacksRef]);
}

export type Actions = ReturnType<typeof useActions>;
