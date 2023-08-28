import { useMemo, useReducer } from 'react';
import { KbsProvider } from 'react-kbs';

import { CommittedRoi } from '../types/Roi';
import { createRoiFromCommittedRoi } from '../utilities/rois';

import {
  roisContext,
  roiDispatchContext,
  committedRoisContext,
  roiStateContext,
  panZoomContext,
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
    action: 'idle',
    size,
    selectedRoi: undefined,
    committedRois,
    rois: committedRois.map((committedRoi) =>
      createRoiFromCommittedRoi(committedRoi, size),
    ),
    panZoom: {
      scale: 1,
      translation: [0, 0],
    },
  };
  return roiInitialState;
}

export function RoiProvider<T>({
  children,
  initialRois = [],
}: RoiProviderProps<T>) {
  const roiInitialState = createInitialState<T>(initialRois);
  const [state, dispatch] = useReducer(roiReducer, roiInitialState);
  const { rois, committedRois, mode, selectedRoi, panZoom } = state;
  const roiState = useMemo(() => {
    return {
      mode,
      selectedRoi,
    };
  }, [mode, selectedRoi]);

  return (
    <KbsProvider>
      <panZoomContext.Provider value={panZoom}>
        <roiDispatchContext.Provider value={dispatch}>
          <roisContext.Provider value={rois}>
            <committedRoisContext.Provider value={committedRois}>
              <roiStateContext.Provider value={roiState}>
                {children}
              </roiStateContext.Provider>
            </committedRoisContext.Provider>
          </roisContext.Provider>
        </roiDispatchContext.Provider>
      </panZoomContext.Provider>
    </KbsProvider>
  );
}
