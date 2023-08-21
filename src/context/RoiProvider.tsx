import { useMemo, useReducer } from 'react';
import { KbsProvider } from 'react-kbs';

import { CommittedRoi } from '../types/Roi';
import { createRoiFromCommittedRoi } from '../utilities/rois';

import {
  roisContext,
  roiDispatchContext,
  committedRoisContext,
  roiStateContext,
} from './contexts';
import { ReactRoiState, roiReducer } from './roiReducer';

interface RoiProviderProps<T> {
  children: JSX.Element;
  initialRois?: Array<CommittedRoi<T>>;
}

function createInitialState<T>(
  committedRois: Array<CommittedRoi<T>>,
): ReactRoiState<T> {
  const size = { width: 1, height: 1 };
  const roiInitialState: ReactRoiState<T> = {
    mode: 'select',
    size,
    selectedRoi: undefined,
    committedRois,
    rois: committedRois.map((committedRoi) =>
      createRoiFromCommittedRoi(committedRoi, size),
    ),
  };
  return roiInitialState;
}

export function RoiProvider<T>({
  children,
  initialRois = [],
}: RoiProviderProps<T>) {
  const roiInitialState = createInitialState<T>(initialRois);
  const [state, dispatch] = useReducer(roiReducer, roiInitialState);
  const { rois, committedRois: commitedRois, mode, selectedRoi } = state;
  const roiState = useMemo(() => {
    return {
      mode,
      selectedRoi,
    };
  }, [mode, selectedRoi]);

  const roiDispatch = useMemo(() => {
    return dispatch;
  }, [dispatch]);

  const commitedRoisState = useMemo(() => {
    return commitedRois;
  }, [commitedRois]);

  const roisState = useMemo(() => {
    return rois;
  }, [rois]);

  return (
    <KbsProvider>
      <roiDispatchContext.Provider value={roiDispatch}>
        <roisContext.Provider value={roisState}>
          <committedRoisContext.Provider value={commitedRoisState}>
            <roiStateContext.Provider value={roiState}>
              {children}
            </roiStateContext.Provider>
          </committedRoisContext.Provider>
        </roisContext.Provider>
      </roiDispatchContext.Provider>
    </KbsProvider>
  );
}
