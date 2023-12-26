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
    /**
     * The minimum zoom level allowed.
     * @default 1
     */
    min: number;
    /**
     * The maximum zoom level allowed.
     * @default 10
     */
    max: number;
    /**
     * When zooming and panning the target, some of the empty space around the target can become visible within the container.
     * This option controls how much of that space is allowed to be visible, expressed as a number between 0 and 1
     * which represents the percentage of the container's available space.
     * @default 0.5
     */
    spaceAroundTarget?: number;
  };
  resizeStrategy?: ResizeStrategy;
  rois?: Array<CommittedRoi<T>>;
  selectedRoiId?: string;
}

interface RoiProviderProps<T> {
  children: ReactNode;
  initialConfig?: RoiProviderInitialConfig<T>;
}

type CreateInitialConfigParam<T> = Required<RoiProviderInitialConfig<T>> & {
  zoom: Required<RoiProviderInitialConfig<T>['zoom']>;
};

function createInitialState<T>(
  initialConfig: CreateInitialConfigParam<T>,
): ReactRoiState<T> {
  return {
    mode: 'select',
    action: 'idle',
    resizeStrategy: initialConfig.resizeStrategy,
    targetSize: initialSize,
    containerSize: initialSize,
    selectedRoi: initialConfig.selectedRoiId,
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
    zoom: { min = 1, max = 20, spaceAroundTarget = 0.5 } = {},
    selectedRoiId,
    resizeStrategy = 'contain',
  } = initialConfig;
  const roiInitialState = createInitialState<T>({
    rois: initialRois,
    zoom: {
      min,
      max,
      spaceAroundTarget,
    },
    resizeStrategy,
    selectedRoiId,
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
