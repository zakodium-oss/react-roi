import { ReactNode, useMemo, useReducer, useRef } from 'react';
import { KbsProvider } from 'react-kbs';

import { CommittedRoi } from '../types/Roi';
import { createRoiFromCommittedRoi } from '../utilities/rois';

import {
  committedRoisContext,
  PanZoomContext,
  panZoomContext,
  roiContainerRefContext,
  roiDispatchContext,
  roisContext,
  roiStateContext,
} from './contexts';
import { ReactRoiState, roiReducer } from './roiReducer';
import { initialSize, isSizeObserved } from './updaters/initialPanZoom';

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
  return {
    mode: 'select',
    action: 'idle',
    targetSize: initialSize,
    containerSize: initialSize,
    selectedRoi: undefined,
    committedRois,
    rois: committedRois.map((committedRoi) =>
      createRoiFromCommittedRoi(committedRoi, initialSize),
    ),
    panZoom: {
      scale: 1,
      translation: [0, 0],
    },
    initialPanZoom: {
      scale: 1,
      translation: [0, 0],
    },
    zoomDomain: zoom,
  };
}

export function RoiProvider<T>(props: RoiProviderProps<T>) {
  const { children, initialRois = [], minZoom = 0.6, maxZoom = 10 } = props;

  const roiInitialState = createInitialState<T>(initialRois, {
    min: minZoom,
    max: maxZoom,
  });

  const [state, dispatch] = useReducer(roiReducer, roiInitialState);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    rois,
    committedRois,
    mode,
    selectedRoi,
    panZoom,
    initialPanZoom,
    targetSize,
    containerSize,
  } = state;
  const roiState = useMemo(() => {
    return {
      mode,
      selectedRoi,
    };
  }, [mode, selectedRoi]);

  const panzoomContextValue: PanZoomContext = useMemo(() => {
    return {
      panZoom,
      initialPanZoom,
      // We memoize this here to minimize the number of times we need to render the container
      isReady: isSizeObserved({ targetSize, containerSize }),
    };
  }, [panZoom, initialPanZoom, targetSize, containerSize]);

  return (
    <KbsProvider>
      <roiContainerRefContext.Provider value={containerRef}>
        <panZoomContext.Provider value={panzoomContextValue}>
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
