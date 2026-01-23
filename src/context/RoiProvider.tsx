import type { ReactNode } from 'react';
import { useEffect, useMemo, useReducer, useRef } from 'react';

import type {
  BoundaryStrategy,
  OnChangeCallback,
  OnCommitCallback,
  PanZoom,
  PanZoomWithOrigin,
  ResizeStrategy,
  RoiMode,
  RoiState,
} from '../index.js';
import type { CommittedRoiProperties } from '../types/CommittedRoi.js';
import { getIdentityPanzoom } from '../utilities/panZoom.ts';
import { createRoiFromCommittedRoi } from '../utilities/rois.js';
import { normalizeAngle } from '../utilities/rotate.js';

import type { ActionCallbacks, PanZoomContext } from './contexts.js';
import {
  callbacksRefContext,
  committedRoisContext,
  panZoomContext,
  roiContainerRefContext,
  roiDispatchContext,
  roiStateContext,
  roiStateRefContext,
  roisContext,
} from './contexts.js';
import type { CommitBoxStrategy, ReactRoiState } from './roiReducer.js';
import { roiReducer } from './roiReducer.js';
import { initialSize } from './updaters/initialPanZoom.js';

export interface RoiProviderInitialConfig<TData> {
  mode?: RoiMode;
  zoom?: {
    /**
     * The initial zoom level.
     * The scaling and translation apply on the coordinate system of the container.
     * Therefore, translations are in device pixels.
     * The origin is the fixed point of the scaling transformation, before the translation applies:
     *   - 'top-left': the top left corner of the container
     *   - 'center': the center of the container
     * @default { scale: 1, translation: [0, 0]}
     */
    initial?: Partial<PanZoomWithOrigin>;
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
  /**
   * On commit, ROI's position will be updated such as to satisfy the given boundary strategy:
   * - `inside_auto`: the whole ROI must be inside the target. If not, it will be moved or resized accordingly, or reverted.
   * - `inside`: the whole ROI must be inside the target. If not, it will be reverted.
   * - `partially_inside`: at least part of the ROI must be inside the target. If not, it will be reverted.
   * - `none`: no boundary check is performed. The ROI can be anywhere.
   * @default 'inside_auto'
   */
  commitRoiBoundaryStrategy?: BoundaryStrategy;
  /**
   * Defines how the target should fit within the container at initialization.
   * - `none`: The target is not transformed relative to the container. The top-left corner of the target matches the
   *           top-left corner of the container.
   * - `contain`: The target is transformed such as the full target is visible in the container. The center of the
   *              target matches the center of the container.
   * - `cover`: The target is scaled down such that one of the dimensions is fitting the container exactly, or not
   *            scaled at all if the target is smaller than the container. The center of the target matches the center
   *            of the container.
   * - `center`: The center of the target matches the center of the container, without scaling the target.
   */
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
  rois?: Array<CommittedRoiProperties<TData>>;
  selectedRoiId?: string;
  /**
   * When in rotate_selected mode, this defines how much the mouse movement transnlates to a rotation angle.
   * It is expressed in number of pixels for a full 360 degree rotation.
   * @default 1200
   */
  rotationResolution?: number;
}

interface RoiProviderProps<TData> {
  children: ReactNode;
  initialConfig?: RoiProviderInitialConfig<TData>;
  onCommit?: OnCommitCallback<TData>;

  onChange?: OnChangeCallback<TData>;

  /**
   * Called after zoom or pan actions
   * @param zoom The new pan and zoom state.
   */
  onAfterZoomChange?: (zoom: PanZoom) => void;
}

type CreateInitialConfigParam<T> = Required<
  Omit<RoiProviderInitialConfig<T>, 'selectedRoiId'>
> & {
  zoom: Required<Required<RoiProviderInitialConfig<T>['zoom']>>;
  selectedRoiId?: string;
};

function createInitialState<T>(
  initialConfig: CreateInitialConfigParam<T>,
): ReactRoiState<T> {
  return {
    mode: initialConfig.mode,
    action: 'idle',
    isContainerInitialized: false,
    isTargetInitialized: false,
    resizeStrategy: initialConfig.resizeStrategy,
    commitRoiBoxStrategy: initialConfig.commitRoiBoxStrategy,
    commitRoiBoundaryStrategy: initialConfig.commitRoiBoundaryStrategy,
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
    panZoom: getIdentityPanzoom(),
    basePanZoom: getIdentityPanzoom(),
    startPanZoom: {
      scale: initialConfig.zoom.initial?.scale ?? 1,
      translation: initialConfig.zoom.initial?.translation ?? [0, 0],
      origin: initialConfig.zoom.initial?.origin ?? 'top-left',
    },
    zoomDomain: initialConfig.zoom,
    rotationResolution: initialConfig.rotationResolution,
  };
}

export function RoiProvider<TData>(props: RoiProviderProps<TData>) {
  const {
    children,
    initialConfig = {},
    onAfterZoomChange,
    onCommit,
    onChange,
  } = props;
  const {
    rois: initialRois = [],
    mode: initialMode = 'hybrid',
    zoom = {},
    selectedRoiId,
    commitRoiBoundaryStrategy = 'inside_auto',
    resizeStrategy = 'contain',
    commitRoiBoxStrategy = 'round',
    rotationResolution = 1200,
  } = initialConfig;

  const { spaceAroundTarget = 0.5 } = zoom;
  // Choose the most appropriate min / max based on different parameters
  const min = Math.min(zoom.min ?? 1, zoom.initial?.scale ?? 1);
  const max = Math.max(zoom.max ?? 200, zoom.initial?.scale ?? 1);
  const [state, dispatch] = useReducer(roiReducer, null, () =>
    createInitialState<TData>({
      mode: initialMode,
      rois: initialRois,
      zoom: {
        min,
        max,
        spaceAroundTarget,
        initial: initialConfig.zoom?.initial ?? {
          ...getIdentityPanzoom(),
          origin: 'top-left',
        },
      },
      commitRoiBoundaryStrategy,
      resizeStrategy,
      commitRoiBoxStrategy,
      selectedRoiId,
      rotationResolution,
    }),
  );
  const stateRef = useRef(state);
  const containerRef = useRef<HTMLDivElement>(null);
  const callbacksRef = useRef<ActionCallbacks<TData>>({
    onZoom: onAfterZoomChange,
    onAfterChange: onCommit,
    onChange,
  });

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    callbacksRef.current = {
      onZoom: onAfterZoomChange,
      onAfterChange: onCommit,
      onChange,
    };
  }, [onAfterZoomChange, onCommit, onChange]);

  const {
    rois,
    committedRois,
    mode,
    selectedRoi,
    panZoom,
    basePanZoom,
    startPanZoom,
    targetSize,
    containerSize,
    isTargetInitialized,
    isContainerInitialized,
    action,
  } = state;
  const roiState: RoiState = useMemo(() => {
    return {
      mode,
      selectedRoi,
      action,
    };
  }, [mode, selectedRoi, action]);

  const isReady = isTargetInitialized && isContainerInitialized;
  const panzoomContextValue: PanZoomContext = useMemo(() => {
    return {
      targetSize,
      containerSize,
      panZoom,
      basePanZoom,
      startPanZoom,
      // We memoize this here to minimize the number of times we need to render the container
      isReady,
    };
  }, [panZoom, basePanZoom, startPanZoom, isReady, targetSize, containerSize]);

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
