import { Dispatch, MutableRefObject, createContext } from 'react';

import { CommittedRoi, Roi } from '../types/Roi';

import type { ReactRoiState, RoiReducerAction } from './roiReducer';

export const roiStateContext = createContext<Omit<
  ReactRoiState,
  'committedRois' | 'rois' | 'size'
> | null>(null);

export const roiDispatchContext =
  createContext<Dispatch<RoiReducerAction> | null>(null);

export const committedRoisContext = createContext<CommittedRoi[] | null>(null);

export const roisContext = createContext<Roi[] | null>(null);

export const roiContainerRefContext =
  createContext<MutableRefObject<HTMLDivElement> | null>(null);
