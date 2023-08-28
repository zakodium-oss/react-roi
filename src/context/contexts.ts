import { Dispatch, MutableRefObject, createContext } from 'react';

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
  scale: number;
  translation: [number, number];
}
export const panZoomContext = createContext<PanZoomContext>({
  scale: 1.5,
  translation: [0, 0],
});
