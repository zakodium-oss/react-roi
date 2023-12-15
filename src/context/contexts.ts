import { createContext, Dispatch, MutableRefObject } from 'react';

import { PanZoom, RoiState, Size } from '..';
import { CommittedRoi, Roi } from '../types/Roi';

import type { RoiReducerAction } from './roiReducer';
import { initialSize } from './updaters/initialPanZoom';

export const roiStateContext = createContext<RoiState | null>(null);

export interface LockContext {
  lockPan: boolean;
  lockZoom: boolean;
}

export const lockContext = createContext<LockContext>({
  lockPan: false,
  lockZoom: false,
});

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
    width: initialSize.width,
    height: initialSize.height,
  },
  containerSize: {
    width: initialSize.width,
    height: initialSize.height,
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
