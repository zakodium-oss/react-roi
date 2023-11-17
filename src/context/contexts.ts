import { createContext, Dispatch, MutableRefObject } from 'react';

import { PanZoom } from '../types';
import { CommittedRoi, Roi } from '../types/Roi';

import type { ReactRoiState, RoiReducerAction } from './roiReducer';

export const roiStateContext = createContext<Pick<
  ReactRoiState,
  'mode' | 'selectedRoi'
> | null>(null);

export const roiDispatchContext =
  createContext<Dispatch<RoiReducerAction> | null>(null);

export const committedRoisContext = createContext<CommittedRoi[] | null>(null);

export const roisContext = createContext<Roi[] | null>(null);

export const roiContainerRefContext =
  createContext<MutableRefObject<HTMLDivElement> | null>(null);

export interface PanZoomContext {
  panZoom: PanZoom;
  initialPanZoom: PanZoom;
  isReady: boolean;
}

export const panZoomContext = createContext<PanZoomContext>({
  panZoom: {
    scale: 1,
    translation: [0, 0],
  },
  initialPanZoom: {
    scale: 1,
    translation: [0, 0],
  },
  isReady: false,
});
