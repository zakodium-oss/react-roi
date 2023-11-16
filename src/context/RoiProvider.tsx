import { ReactNode, useMemo, useReducer, useRef } from 'react';
import { KbsProvider } from 'react-kbs';

import { CommittedRoi } from '../types/Roi';
import { createRoiFromCommittedRoi } from '../utilities/rois';

import {
  committedRoisContext,
  panZoomContext,
  roiContainerRefContext,
  roiDispatchContext,
  roisContext,
  roiStateContext,
} from './contexts';
import { ReactRoiState, roiReducer } from './roiReducer';

interface RoiProviderProps<T> {
  children: ReactNode;
  initialRois?: Array<CommittedRoi<T>>;
  minZoom?: number;
  maxZoom?: number;
}

function createInitialState<T>(
  committedRois: Array<CommittedRoi<T>>,
  zoom: { min: number; max: number },
): ReactRoiState<T> {
  const size = { width: 1, height: 1 };

  return {
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
    zoomDomain: zoom,
  };
}

export function RoiProvider<T>(props: RoiProviderProps<T>) {
  const { children, initialRois = [], minZoom = 1, maxZoom = 10 } = props;

  const roiInitialState = createInitialState<T>(initialRois, {
    min: minZoom,
    max: maxZoom,
  });

  const [state, dispatch] = useReducer(roiReducer, roiInitialState);
  const containerRef = useRef<HTMLDivElement>(null);

  const { rois, committedRois, mode, selectedRoi, panZoom } = state;
  const roiState = useMemo(() => {
    return {
      mode,
      selectedRoi,
    };
  }, [mode, selectedRoi]);

  return (
    <KbsProvider>
      <roiContainerRefContext.Provider value={containerRef}>
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
      </roiContainerRefContext.Provider>
    </KbsProvider>
  );
}
