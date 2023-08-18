import { useMemo, useReducer } from 'react';
import { KbsProvider } from 'react-kbs';

import { CommittedRoi } from '../types/CommittedRoi';

import {
  roisContext,
  roiDispatchContext,
  commitedRoisContext,
  roiStateContext,
} from './contexts';
import { ReactRoiState, roiReducer } from './roiReducer';

interface RoiProviderProps<T> {
  children: JSX.Element;
  initialRois?: Array<CommittedRoi<T>>;
}

function createInitialState<T>(
  commitedRois: Array<CommittedRoi<T>>,
): ReactRoiState<T> {
  const roiInitialState: ReactRoiState<T> = {
    mode: 'select',
    ratio: { x: 1, y: 1 },
    selectedRoi: undefined,
    commitedRois,
    rois: commitedRois.map((roi) => ({
      id: roi.id,
      label: roi.label,
      editStyle: roi.editStyle,
      style: roi.style,
      data: roi.data,
      action: 'idle',
      actionData: {
        delta: undefined,
        endPoint: { x: roi.x + roi.width, y: roi.y + roi.height },
        startPoint: { x: roi.x, y: roi.y },
        pointerIndex: undefined,
      },
    })),
  };
  return roiInitialState;
}

export function RoiProvider<T>({
  children,
  initialRois = [],
}: RoiProviderProps<T>) {
  const roiInitialState = createInitialState<T>(initialRois);
  const [state, dispatch] = useReducer(roiReducer<T>, roiInitialState);
  const { rois, commitedRois, mode, ratio, selectedRoi } = state;
  const roiState = useMemo(() => {
    return {
      mode,
      ratio,
      selectedRoi,
    };
  }, [mode, ratio, selectedRoi]);

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
          <commitedRoisContext.Provider value={commitedRoisState}>
            <roiStateContext.Provider value={roiState}>
              {children}
            </roiStateContext.Provider>
          </commitedRoisContext.Provider>
        </roisContext.Provider>
      </roiDispatchContext.Provider>
    </KbsProvider>
  );
}
