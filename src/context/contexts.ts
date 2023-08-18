import { Dispatch, createContext } from 'react';

import { CommittedRoi } from '../types/CommittedRoi';
import { Roi } from '../types/Roi';

import type { ReactRoiState, RoiReducerAction } from './roiReducer';

export const roiStateContext = createContext<Omit<
  ReactRoiState,
  'commitedRois' | 'rois'
> | null>(null);

export const roiDispatchContext =
  createContext<Dispatch<RoiReducerAction> | null>(null);

export const commitedRoisContext = createContext<CommittedRoi[] | null>(null);

export const roisContext = createContext<Array<Roi<any>> | null>(null);
