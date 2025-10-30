import { createContext, Dispatch, RefObject } from 'react';

import {
  CommittedRoiProperties,
  OnChangeCallback,
  PanZoom,
  RoiState,
  Size,
} from '..';
import { Roi } from '../types/Roi';

import { ReactRoiState, RoiReducerAction } from './roiReducer';
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

export const committedRoisContext = createContext<
  CommittedRoiProperties[] | null
>(null);

export const roisContext = createContext<Roi[] | null>(null);

export const roiContainerRefContext =
  createContext<RefObject<HTMLDivElement> | null>(null);

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

export const roiStateRefContext =
  createContext<RefObject<ReactRoiState> | null>(null);

export interface ActionCallbacks<TData = unknown> {
  onAfterDraw?: OnChangeCallback<TData>;
  onAfterMove?: OnChangeCallback<TData>;
  onAfterResize?: OnChangeCallback<TData>;
  onAfterRotate?: OnChangeCallback<TData>;
  onChangeDraw?: OnChangeCallback<TData>;
  onChangeMove?: OnChangeCallback<TData>;
  onChangeResize?: OnChangeCallback<TData>;
  onChangeRotate?: OnChangeCallback<TData>;
  onAfterZoomChange?: (zoom: PanZoom) => void;
}
export const callbacksRefContext = createContext<RefObject<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ActionCallbacks<any>
> | null>(null);
