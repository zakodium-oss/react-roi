import { ReactNode, useMemo, useReducer, useRef } from 'react';

import type { ResizeStrategy, RoiState } from '..';
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

export interface RoiProviderInitialConfig<T> {
  zoom?: {
    min: number;
    max: number;
  };
  resizeStrategy?: ResizeStrategy;
  rois?: Array<CommittedRoi<T>>;
}

interface RoiProviderProps<T> {
  children: ReactNode;
  initialConfig?: RoiProviderInitialConfig<T>;
}

function createInitialState<T>(
  initialConfig: Required<RoiProviderInitialConfig<T>>,
): ReactRoiState<T> {
  return {
    mode: 'select',
    action: 'idle',
    resizeStrategy: initialConfig.resizeStrategy,
    targetSize: initialSize,
    containerSize: initialSize,
    selectedRoi: undefined,
    committedRois: initialConfig.rois,
    rois: initialConfig.rois.map((committedRoi) =>
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
    zoomDomain: initialConfig.zoom,
  };
}

export function RoiProvider<T>(props: RoiProviderProps<T>) {
  const { children, initialConfig = {} } = props;
  const {
    rois: initialRois = [],
    zoom: { min: minZoom = 1, max: maxZoom = 10 } = {},
    resizeStrategy = 'contain',
  } = initialConfig;
  const roiInitialState = createInitialState<T>({
    rois: initialRois,
    zoom: {
      min: minZoom,
      max: maxZoom,
    },
    resizeStrategy,
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
    action,
  } = state;
  const roiState: RoiState = useMemo(() => {
    return {
      mode,
      selectedRoi,
      action,
    };
  }, [mode, selectedRoi, action]);

  const panzoomContextValue: PanZoomContext = useMemo(() => {
    return {
      targetSize,
      containerSize,
      panZoom,
      initialPanZoom,
      // We memoize this here to minimize the number of times we need to render the container
      isReady: isSizeObserved({ targetSize, containerSize }),
    };
  }, [panZoom, initialPanZoom, targetSize, containerSize]);

  return (
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
  );
}
