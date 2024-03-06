import { ReactNode, useEffect, useMemo, useReducer, useRef } from 'react';

import {
  AfterDrawCallback,
  AfterUpdateCallback,
  PanZoom,
  ResizeStrategy,
  RoiMode,
  RoiState,
} from '..';
import { CommittedRoi } from '../types/Roi';
import { createRoiFromCommittedRoi } from '../utilities/rois';
import { normalizeAngle } from '../utilities/rotate';

import {
  ActionCallbacks,
  callbacksRefContext,
  committedRoisContext,
  PanZoomContext,
  panZoomContext,
  roiContainerRefContext,
  roiDispatchContext,
  roisContext,
  roiStateContext,
  roiStateRefContext,
} from './contexts';
import { CommitBoxStrategy, ReactRoiState, roiReducer } from './roiReducer';
import { initialSize, isSizeObserved } from './updaters/initialPanZoom';

export interface RoiProviderInitialConfig<TData> {
  mode?: RoiMode;
  zoom?: {
    /**
     * The initial zoom level.
     * @default { scale: 1, translation: [0, 0]}
     */
    initial?: PanZoom;
    /**
     * The minimum zoom level allowed.
     * @default 1
     */
    min?: number;
    /**
     * The maximum zoom level allowed.
     * @default 10
     */
    max?: number;
    /**
     * When zooming and panning the target, some of the empty space around the target can become visible within the container.
     * This option controls how much of that space is allowed to be visible, expressed as a number between 0 and 1
     * which represents the percentage of the container's available space.
     * @default 0.5
     */
    spaceAroundTarget?: number;
  };
  resizeStrategy?: ResizeStrategy;
  /**
   * How should the roi be updated before committing it when created / moved / resized / rotated.
   * It affects the final values of `x`, `y`, `width`, and `height` box properties in the committed ROI.
   * 'exact' will keep the exact, non-rounded values. This results in floating point numbers in the box properties.
   * 'round' will try as much as possible to keep integers:
   *  - If the angle of rotation is 0, then x, y, width and height will be integers
   *  - If the angle of rotation is not 0, then only width and height will be integers
   * @default 'exact'
   *
   */
  commitRoiBoxStrategy?: CommitBoxStrategy;
  rois?: Array<CommittedRoi<TData>>;
  selectedRoiId?: string;
}

interface RoiProviderProps<TData> {
  children: ReactNode;
  initialConfig?: RoiProviderInitialConfig<TData>;
  /**
   * Called right after the ROI has finished being drawn and has been created.
   * @param roi The ROI that was just drawn. The position and size are already normalized and bounded to the target size.
   */
  onAfterDraw?: AfterDrawCallback<TData>;
  /**
   * Called right after the ROI has finished moving.
   * @param roi The ROI that was just moved. The position and size are already normalized and bounded to the target size.
   */
  onAfterMove?: AfterUpdateCallback<TData>;
  /**
   * Called right before the ROI has finished resizing.
   * @param roi The ROI that was just resized. The position and size are already normalized and bounded to the target size.
   */
  onAfterResize?: AfterUpdateCallback<TData>;
  /**
   * Called when after zoom or pan actions
   * @param zoom
   */
  onAfterZoomChange?: (zoom: PanZoom) => void;
}

type CreateInitialConfigParam<T> = Required<
  Omit<RoiProviderInitialConfig<T>, 'selectedRoiId'>
> & {
  zoom: Required<RoiProviderInitialConfig<T>['zoom']>;
  selectedRoiId?: string;
};

function createInitialState<T>(
  initialConfig: CreateInitialConfigParam<T>,
): ReactRoiState<T> {
  return {
    mode: initialConfig.mode,
    action: 'idle',
    resizeStrategy: initialConfig.resizeStrategy,
    commitRoiBoxStrategy: initialConfig.commitRoiBoxStrategy || 'exact',
    targetSize: initialSize,
    containerSize: initialSize,
    selectedRoi: initialConfig.selectedRoiId,
    committedRois: initialConfig.rois,
    rois: initialConfig.rois
      .map((committedRoi) => ({
        ...committedRoi,
        angle: normalizeAngle(committedRoi.angle),
      }))
      .map((committedRoi) => createRoiFromCommittedRoi(committedRoi)),
    panZoom: initialConfig.zoom.initial,
    initialPanZoom: {
      scale: 1,
      translation: [0, 0],
    },
    zoomDomain: initialConfig.zoom,
  };
}

export function RoiProvider<TData>(props: RoiProviderProps<TData>) {
  const {
    children,
    initialConfig = {},
    onAfterZoomChange,
    onAfterDraw,
    onAfterResize,
    onAfterMove,
  } = props;
  const {
    rois: initialRois = [],
    mode: initialMode = 'hybrid',
    zoom: { min = 1, max = 200, spaceAroundTarget = 0.5 } = {},
    selectedRoiId,
    resizeStrategy = 'contain',
    commitRoiBoxStrategy = 'exact',
  } = initialConfig;

  const [state, dispatch] = useReducer(roiReducer, null, () =>
    createInitialState<TData>({
      mode: initialMode,
      rois: initialRois,
      zoom: {
        min,
        max,
        spaceAroundTarget,
        initial: initialConfig.zoom?.initial ?? {
          scale: 1,
          translation: [0, 0],
        },
      },
      resizeStrategy,
      commitRoiBoxStrategy,
      selectedRoiId,
    }),
  );
  const stateRef = useRef(state);
  const containerRef = useRef<HTMLDivElement>(null);
  const callbacksRef = useRef<ActionCallbacks<TData>>({
    onAfterZoomChange,
    onAfterDraw,
    onAfterResize,
    onAfterMove,
  });

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    callbacksRef.current = {
      onAfterZoomChange,
      onAfterDraw,
      onAfterResize,
      onAfterMove,
    };
  }, [onAfterZoomChange, onAfterDraw, onAfterResize, onAfterMove]);

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
    <callbacksRefContext.Provider value={callbacksRef}>
      <roiStateRefContext.Provider value={stateRef}>
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
      </roiStateRefContext.Provider>
    </callbacksRefContext.Provider>
  );
}
