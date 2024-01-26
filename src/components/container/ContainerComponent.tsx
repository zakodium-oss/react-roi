import useResizeObserver from '@react-hook/resize-observer';
import {
  CSSProperties,
  Dispatch,
  MutableRefObject,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import {
  OnFinishDrawCallback,
  OnFinishUpdateCallback,
  RoiAction,
  RoiMode,
  useRoiState,
} from '../..';
import { LockContext, lockContext } from '../../context/contexts';
import {
  EndActionPayload,
  ReactRoiState,
  RoiReducerAction,
} from '../../context/roiReducer';
import { useCurrentState } from '../../hooks/useCurrentState';
import { useIsKeyDown } from '../../hooks/useIsKeyDown';
import { usePanZoomTransform } from '../../hooks/usePanZoom';
import { useRoiContainerRef } from '../../hooks/useRoiContainerRef';
import { useRoiDispatch } from '../../hooks/useRoiDispatch';
import { assert } from '../../utilities/assert';
import {
  createCommittedRoiFromRoiIfValid,
  roiHasChanged,
} from '../../utilities/rois';
import { throttle } from '../../utilities/throttle';

interface ContainerProps<TData = unknown> {
  target: JSX.Element & { ref?: MutableRefObject<HTMLImageElement> };
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  id?: string;
  noUnselection?: boolean;
  lockZoom: boolean;
  lockPan: boolean;
  minNewRoiSize?: number;
  onDrawFinish?: OnFinishDrawCallback<TData>;
  onMoveFinish?: OnFinishUpdateCallback<TData>;
  onResizeFinish?: OnFinishUpdateCallback<TData>;
}

export function ContainerComponent<TData = unknown>(
  props: ContainerProps<TData>,
) {
  const {
    target,
    children,
    style,
    className,
    id,
    noUnselection,
    lockZoom,
    lockPan,
    minNewRoiSize = 1,
  } = props;

  const isAltKeyDown = useIsKeyDown('Alt');
  const roiDispatch = useRoiDispatch();
  const roiState = useRoiState();
  const panZoomTransform = usePanZoomTransform();
  const ref = useRoiContainerRef();
  const stateRef = useCurrentState();
  const onDrawFinishRef = useRef(props.onDrawFinish);
  const onMoveFinish = useRef(props.onMoveFinish);
  const onResizeFinish = useRef(props.onResizeFinish);

  useEffect(() => {
    onDrawFinishRef.current = props.onDrawFinish;
    onMoveFinish.current = props.onMoveFinish;
    onResizeFinish.current = props.onResizeFinish;
  }, [props.onDrawFinish, props.onResizeFinish, props.onMoveFinish]);

  useResizeObserver(ref, (entry) => {
    const { width, height } = entry.contentRect;
    if (width === 0 || height === 0) return;
    roiDispatch({
      type: 'SET_CONTAINER_SIZE',
      payload: {
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      },
    });
  });

  useEffect(() => {
    function onMouseMove(event: MouseEvent) {
      roiDispatch({
        type: 'MOUSE_MOVE',
        payload: event,
      });
    }

    function onMouseUp() {
      const endPayload = {
        noUnselection,
        minNewRoiSize,
      };
      const hasCancelled = callMouseUpLifeCycleHooks(
        stateRef.current,
        roiDispatch,
        {
          onDrawFinish: onDrawFinishRef.current,
          onMoveFinish: onMoveFinish.current,
          onResizeFinish: onResizeFinish.current,
        },
        endPayload,
      );

      if (!hasCancelled) {
        roiDispatch({
          type: 'END_ACTION',
          payload: endPayload,
        });
      }
    }

    const onZoom = throttle((event: WheelEvent) => {
      roiDispatch({
        type: 'ZOOM',
        payload: {
          scale: event.deltaY > 0 ? 0.92 : 1 / 0.92,
          clientX: event.clientX,
          clientY: event.clientY,
          refBoundingClientRect: ref.current.getBoundingClientRect(),
        },
      });
    }, 25);

    function onWheel(event: WheelEvent) {
      if (!event.altKey || lockZoom) return;
      event.preventDefault();
      event.stopPropagation();
      onZoom(event);
    }

    const containerElement = ref.current;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    containerElement.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      containerElement.removeEventListener('wheel', onWheel);
    };
  }, [roiDispatch, ref, lockZoom, minNewRoiSize, noUnselection, stateRef]);

  const lockContextValue = useMemo<LockContext>(() => {
    return { lockPan, lockZoom };
  }, [lockPan, lockZoom]);

  return (
    <lockContext.Provider value={lockContextValue}>
      <div
        id={id}
        ref={ref}
        style={{
          ...style,
          position: 'relative',
          overflow: 'hidden',
          margin: 0,
          padding: 0,
          cursor: getCursor(
            roiState.mode,
            isAltKeyDown,
            roiState.action,
            lockPan,
          ),
          userSelect: 'none',
        }}
        className={className}
        onDoubleClick={() => {
          roiDispatch({ type: 'RESET_ZOOM' });
        }}
        onMouseDown={(event) => {
          const containerBoundingRect = ref.current.getBoundingClientRect();
          roiDispatch({
            type: 'START_DRAW',
            payload: {
              event,
              containerBoundingRect,
              isPanZooming: event.altKey,
              lockPan,
              noUnselection,
            },
          });
        }}
      >
        <div
          style={{
            transform: panZoomTransform,
            transformOrigin: '0 0',
          }}
        >
          {target}

          <div
            style={{
              userSelect: 'none',
              width: '100%',
              height: '100%',
              position: 'absolute',
              margin: 0,
              padding: 0,
              top: 0,
              left: 0,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </lockContext.Provider>
  );
}

function getCursor(
  mode: RoiMode,
  altKey: boolean,
  action: RoiAction,
  lockPan: boolean,
): CSSProperties['cursor'] {
  if (action !== 'idle') {
    if (action === 'drawing') {
      return 'crosshair';
    } else if (action === 'panning') {
      return 'grab';
    } else {
      // action === resizing || action === moving
      // In this case the cursor set on the box has the priority.
      // Because it's a child element [See: getCursor from Box.ts]
      return 'auto';
    }
  }

  // No action, return cursor based on mode, lockPan and altKey
  if (mode === 'select' && lockPan) {
    return 'default';
  }

  if (altKey && !lockPan) {
    return 'grab';
  }

  return mode !== 'select' ? 'crosshair' : 'grab';
}

function callMouseUpLifeCycleHooks(
  state: ReactRoiState,
  roiDispatch: Dispatch<RoiReducerAction>,
  callbacks: {
    onDrawFinish?: OnFinishDrawCallback;
    onMoveFinish?: OnFinishUpdateCallback;
    onResizeFinish?: OnFinishUpdateCallback;
  },
  options: EndActionPayload,
) {
  const cancelAction = {
    type: 'CANCEL_ACTION',
    payload: { noUnselection: options.noUnselection },
  } as const;
  switch (state.action) {
    case 'drawing':
      if (callbacks.onDrawFinish) {
        const roi = state.rois.find((roi) => roi.action.type === 'drawing');
        assert(roi, 'An roi in the "drawing" state should exist while drawing');
        const committedRoi = createCommittedRoiFromRoiIfValid(
          roi,
          {
            targetSize: state.targetSize,
            minNewRoiSize: options.minNewRoiSize,
          },
          'resize',
        );
        roiDispatch(cancelAction);
        if (committedRoi) {
          callbacks.onDrawFinish(committedRoi);
        }
        return true;
      }
      return false;
    case 'moving':
      if (callbacks.onMoveFinish) {
        const roi = state.rois.find((roi) => roi.action.type === 'moving');
        assert(roi, 'An roi in the "moving" state should exist while moving');
        const committedRoi = createCommittedRoiFromRoiIfValid(
          roi,
          {
            targetSize: state.targetSize,
            minNewRoiSize: options.minNewRoiSize,
          },
          'move',
        );
        roiDispatch(cancelAction);
        if (committedRoi && roiHasChanged(state, committedRoi)) {
          const { id, ...updateData } = committedRoi;
          callbacks.onMoveFinish(id, updateData);
        }
        return true;
      }
      return false;
    case 'resizing':
      if (callbacks.onResizeFinish) {
        const roi = state.rois.find((roi) => roi.action.type === 'resizing');
        assert(roi, 'An roi in the "resizing" state should exist while moving');
        const committedRoi = createCommittedRoiFromRoiIfValid(
          roi,
          {
            targetSize: state.targetSize,
            minNewRoiSize: options.minNewRoiSize,
          },
          'resize',
        );
        roiDispatch(cancelAction);
        if (committedRoi && roiHasChanged(state, committedRoi)) {
          const { id, ...updateData } = committedRoi;
          callbacks.onResizeFinish(id, updateData);
          return true;
        }
      }
      return false;

    default:
      return false;
  }
}
