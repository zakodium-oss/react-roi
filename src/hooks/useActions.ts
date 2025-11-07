import { produce } from 'immer';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useMemo } from 'react';

import type {
  CancelActionPayload,
  CreateUpdateRoiOptions,
  ZoomIntoROIOptions,
} from '../context/roiReducer.js';
import { zoomAction } from '../context/updaters/zoom.js';
import type { CommittedRoi, CommittedRoiProperties } from '../index.js';
import type { RoiMode } from '../types/utils.js';
import type { Point } from '../utilities/point.js';

import useCallbacksRef from './useCallbacksRef.js';
import { useCurrentState } from './useCurrentState.js';
import { useRoiContainerRef } from './useRoiContainerRef.js';
import { useRoiDispatch } from './useRoiDispatch.js';

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
      zoomIntoROI: (
        roiOrPoints: CommittedRoi | Point[],
        options: ZoomIntoROIOptions = { margin: 0.2 },
      ) => {
        roiDispatch({
          type: 'ZOOM_INTO_ROI',
          payload: {
            roiOrPoints,
            options,
          },
        });
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

        if (stateRef.current && callbacksRef.current?.onZoom) {
          const newState = produce(stateRef.current, (draft) =>
            zoomAction(draft, zoomPayload),
          );
          callbacksRef.current.onZoom(newState.panZoom);
        }
      },
      createRoi: (roi: CommittedRoiProperties<TData>) => {
        roiDispatch({
          type: 'CREATE_ROI',
          payload: roi,
        });
      },
      updateRoi: (
        selectedRoi: string,
        updatedData: UpdateData<TData>,
        options?: CreateUpdateRoiOptions,
      ) => {
        roiDispatch({
          type: 'UPDATE_ROI',
          payload: { ...updatedData, id: selectedRoi, options },
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

export type Actions<TData = unknown> = ReturnType<typeof useActions<TData>>;
