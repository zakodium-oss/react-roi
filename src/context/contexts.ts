import type { Dispatch, RefObject } from 'react';
import { createContext } from 'react';

import type {
  CommittedRoiProperties,
  OnChangeCallback,
  OnCommitCallback,
  PanZoom,
  PanZoomWithOrigin,
  RoiState,
  Size,
} from '../index.js';
import type { Roi } from '../types/Roi.js';
import type { ResolvedContainerInteractions } from '../types/interactions.js';
import { defaultContainerInteractions } from '../types/interactions.js';
import { getIdentityPanzoom } from '../utilities/panZoom.ts';

import type { ReactRoiState, RoiReducerAction } from './roiReducer.js';
import { initialSize } from './updaters/initialPanZoom.js';

export const RoiStateContext = createContext<RoiState | null>(null);

export const ContainerInteractionsContext =
  createContext<ResolvedContainerInteractions>(defaultContainerInteractions);

export const RoiDispatchContext =
  createContext<Dispatch<RoiReducerAction> | null>(null);

export const CommittedRoisContext = createContext<
  CommittedRoiProperties[] | null
>(null);

export const RoisContext = createContext<Roi[] | null>(null);

export const RoiContainerRefContext =
  createContext<RefObject<HTMLDivElement | null> | null>(null);

export interface PanZoomContextValues {
  panZoom: PanZoom;
  basePanZoom: PanZoom;
  startPanZoom: PanZoomWithOrigin;
  isReady: boolean;
  targetSize: Size;
  containerSize: Size;
}

export const PanZoomContext = createContext<PanZoomContextValues>({
  targetSize: {
    width: initialSize.width,
    height: initialSize.height,
  },
  containerSize: {
    width: initialSize.width,
    height: initialSize.height,
  },
  panZoom: getIdentityPanzoom(),
  basePanZoom: getIdentityPanzoom(),
  startPanZoom: {
    ...getIdentityPanzoom(),
    origin: 'top-left',
  },
  isReady: false,
});

export const RoiStateRefContext =
  createContext<RefObject<ReactRoiState> | null>(null);

export interface ActionCallbacks<TData = unknown> {
  onAfterChange?: OnCommitCallback<TData>;
  onChange?: OnChangeCallback<TData>;
  onZoom?: (zoom: PanZoom) => void;
}
export const CallbacksRefContext = createContext<RefObject<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ActionCallbacks<any>
> | null>(null);
