import { createContext, Dispatch, MutableRefObject } from 'react';

import { PanZoom, RoiState, Size } from '../types';
import { CommittedRoi, Roi } from '../types/Roi';

import type { RoiReducerAction } from './roiReducer';

export const roiStateContext = createContext<RoiState | null>(null);

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
  targetSize: Size;
  containerSize: Size;
}

export const panZoomContext = createContext<PanZoomContext>({
  targetSize: {
    width: 0,
    height: 0,
  },
  containerSize: {
    width: 0,
    height: 0,
  },
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
