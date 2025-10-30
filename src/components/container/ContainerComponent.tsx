import useResizeObserver from '@react-hook/resize-observer';
import { produce } from 'immer';
import {
  CSSProperties,
  JSX,
  MutableRefObject,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import {
  Actions,
  ReactRoiAction,
  RoiMode,
  useActions,
  useRoiState,
} from '../..';
import {
  ActionCallbacks,
  LockContext,
  lockContext,
} from '../../context/contexts';
import {
  EndActionPayload,
  PointerMovePayload,
  ReactRoiState,
} from '../../context/roiReducer';
import { pointerMove } from '../../context/updaters/pointerMove';
import { resetZoomAction, zoomAction } from '../../context/updaters/zoom';
import useCallbacksRef from '../../hooks/useCallbacksRef';
import { useCurrentState } from '../../hooks/useCurrentState';
import { useIsKeyDown } from '../../hooks/useIsKeyDown';
import { usePanZoomTransform } from '../../hooks/usePanZoom';
import { useRoiContainerRef } from '../../hooks/useRoiContainerRef';
import { useRoiDispatch } from '../../hooks/useRoiDispatch';
import { assert, assertUnreachable } from '../../utilities/assert';
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
  zoomWithoutModifierKey?: boolean;
  minNewRoiSize?: number;
  getNewRoiData?: () => TData;
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
    zoomWithoutModifierKey = false,
    minNewRoiSize = 1,
  } = props;

  const isAltKeyDown = useIsKeyDown('Alt');
  const roiDispatch = useRoiDispatch();
  const roiState = useRoiState();
  const panZoomTransform = usePanZoomTransform();
  const actions = useActions();

  // Refs
  const containerRef = useRoiContainerRef();
  const callbacksRef = useCallbacksRef();
  const stateRef = useCurrentState();

  const getNewRoiData = useRef(props.getNewRoiData);

  // TODO: useEffectEvent once we migrate to React 19
  useEffect(() => {
    getNewRoiData.current = props.getNewRoiData;
  }, [props.getNewRoiData]);

  useResizeObserver(containerRef, (entry) => {
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
    function onPointerMove(event: PointerEvent) {
      if (!stateRef.current || !containerRef?.current) return;
      const endPayload = {
        noUnselection: noUnselection || false,
        minNewRoiSize,
      };
      const movePayload = {
        event,
        containerBoundingRect: containerRef.current.getBoundingClientRect(),
      };
      roiDispatch({
        type: 'POINTER_MOVE',
        payload: movePayload,
      });
      callPointerMoveActionHooks(
        stateRef.current,
        callbacksRef.current || {},
        movePayload,
        endPayload,
        actions,
      );
    }

    function onPointerUp() {
      if (!stateRef.current) return;
      const endPayload = {
        noUnselection: noUnselection || false,
        minNewRoiSize,
      };
      roiDispatch({
        type: 'END_ACTION',
        payload: endPayload,
      });
      callPointerUpActionHooks(
        stateRef.current,
        callbacksRef.current || {},
        endPayload,
        actions,
      );
    }

    const onZoom = throttle((event: WheelEvent) => {
      if (containerRef?.current) {
        const zoomPayload = {
          scale: event.deltaY > 0 ? 0.92 : 1 / 0.92,
          clientX: event.clientX,
          clientY: event.clientY,
          containerBoundingRect: containerRef.current.getBoundingClientRect(),
        };
        roiDispatch({
          type: 'ZOOM',
          payload: zoomPayload,
        });
        if (stateRef.current && callbacksRef.current?.onAfterZoomChange) {
          const newState = produce(stateRef.current, (draft) =>
            zoomAction(draft, zoomPayload),
          );
          callbacksRef.current.onAfterZoomChange(newState.panZoom);
        }
      }
    }, 25);

    function onWheel(event: WheelEvent) {
      if ((!event.altKey && !zoomWithoutModifierKey) || lockZoom) return;
      event.preventDefault();
      event.stopPropagation();
      onZoom(event);
    }

    const containerElement = containerRef?.current;

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    containerElement?.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      containerElement?.removeEventListener('wheel', onWheel);
    };
  }, [
    roiDispatch,
    containerRef,
    callbacksRef,
    lockZoom,
    minNewRoiSize,
    noUnselection,
    stateRef,
    actions,
    zoomWithoutModifierKey,
  ]);

  const lockContextValue = useMemo<LockContext>(() => {
    return { lockPan, lockZoom };
  }, [lockPan, lockZoom]);

  return (
    <lockContext.Provider value={lockContextValue}>
      <div
        id={id}
        ref={containerRef}
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
          WebkitUserSelect: 'none',
          touchAction: 'none',
        }}
        className={className}
        onDoubleClick={() => {
          roiDispatch({ type: 'RESET_ZOOM' });
          if (stateRef.current && callbacksRef.current?.onAfterZoomChange) {
            const newState = produce(stateRef.current, (draft) =>
              resetZoomAction(draft),
            );
            callbacksRef.current.onAfterZoomChange(newState.panZoom);
          }
        }}
        onPointerDown={(event) => {
          if (containerRef?.current) {
            // Left mouse button
            if (event.button === 0) {
              const containerBoundingRect =
                containerRef.current.getBoundingClientRect();
              roiDispatch({
                type: 'START_DRAW',
                payload: {
                  event,
                  containerBoundingRect,
                  isPanZooming: event.altKey,
                  lockPan,
                  noUnselection,
                  data: getNewRoiData.current?.(),
                },
              });
            } else if (!lockPan) {
              roiDispatch({ type: 'START_PAN' });
            }
          }
        }}
      >
        <div
          style={{
            transform: panZoomTransform,
            transformOrigin: '0 0',
          }}
        >
          {target}
        </div>
        <div
          onContextMenu={(event) => event.preventDefault()}
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
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
    </lockContext.Provider>
  );
}

function getCursor(
  mode: RoiMode,
  altKey: boolean,
  action: ReactRoiAction,
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

function callPointerMoveActionHooks(
  state: ReactRoiState,
  callbacks: ActionCallbacks,
  payload: PointerMovePayload,
  endPayload: EndActionPayload,
  actions: Actions,
) {
  if (
    callbacks.onChangeDraw ||
    callbacks.onChangeMove ||
    callbacks.onChangeResize ||
    callbacks.onChangeRotate
  ) {
    const newState = produce(state, (draft) => {
      pointerMove(draft, payload);
    });
    const roi = newState.rois.find((roi) => roi.id === state.selectedRoi);
    assert(roi);
    const committedRoi = createCommittedRoiFromRoiIfValid(roi, {
      targetSize: state.targetSize,
      minNewRoiSize: endPayload.minNewRoiSize,
      strategy: 'resize',
      commitStrategy: state.commitRoiBoxStrategy,
    });
    if (committedRoi) {
      switch (state.action) {
        case 'moving':
          if (callbacks.onChangeMove) {
            callbacks.onChangeMove(committedRoi, actions, state.committedRois);
          }
          break;
        case 'drawing':
          if (callbacks.onChangeDraw) {
            callbacks.onChangeDraw(committedRoi, actions, state.committedRois);
          }
          break;
        case 'rotating':
          if (callbacks.onChangeRotate) {
            callbacks.onChangeRotate(
              committedRoi,
              actions,
              state.committedRois,
            );
          }
          break;
        case 'resizing':
          if (callbacks.onChangeResize) {
            callbacks.onChangeResize(
              committedRoi,
              actions,
              state.committedRois,
            );
          }
          break;
        default:
          break;
      }
    }
  }
}

function callPointerUpActionHooks(
  state: ReactRoiState,
  callbacks: ActionCallbacks,
  payload: EndActionPayload,
  actions: Actions,
) {
  switch (state.action) {
    case 'drawing': {
      if (callbacks.onAfterDraw) {
        const roi = state.rois.find((roi) => roi.action.type === 'drawing');
        assert(roi, 'An roi in the "drawing" state should exist while drawing');
        const committedRoi = createCommittedRoiFromRoiIfValid(roi, {
          targetSize: state.targetSize,
          minNewRoiSize: payload.minNewRoiSize,
          strategy: 'resize',
          commitStrategy: state.commitRoiBoxStrategy,
        });
        if (committedRoi) {
          callbacks.onAfterDraw(committedRoi, actions, state.committedRois);
        }
      }
      break;
    }
    case 'moving': {
      if (callbacks.onAfterMove) {
        const roi = state.rois.find((roi) => roi.action.type === 'moving');
        assert(roi, 'An roi in the "moving" state should exist while moving');
        const committedRoi = createCommittedRoiFromRoiIfValid(roi, {
          targetSize: state.targetSize,
          minNewRoiSize: payload.minNewRoiSize,
          strategy: 'move',
          commitStrategy: state.commitRoiBoxStrategy,
        });
        if (committedRoi && roiHasChanged(state, committedRoi)) {
          callbacks.onAfterMove(committedRoi, actions, state.committedRois);
        }
      }
      break;
    }
    case 'rotating': {
      if (callbacks.onAfterRotate) {
        const roi = state.rois.find((roi) => roi.action.type === 'rotating');
        assert(roi, 'An roi in the "moving" state should exist while moving');
        const committedRoi = createCommittedRoiFromRoiIfValid(roi, {
          targetSize: state.targetSize,
          minNewRoiSize: payload.minNewRoiSize,
          strategy: 'move',
          commitStrategy: state.commitRoiBoxStrategy,
        });
        if (committedRoi && roiHasChanged(state, committedRoi)) {
          callbacks.onAfterRotate(committedRoi, actions, state.committedRois);
        }
      }
      break;
    }
    case 'resizing': {
      if (callbacks.onAfterResize) {
        const roi = state.rois.find((roi) => roi.action.type === 'resizing');
        assert(roi, 'An roi in the "resizing" state should exist while moving');
        const committedRoi = createCommittedRoiFromRoiIfValid(roi, {
          targetSize: state.targetSize,
          minNewRoiSize: payload.minNewRoiSize,
          strategy: 'resize',
          commitStrategy: state.commitRoiBoxStrategy,
        });
        if (committedRoi && roiHasChanged(state, committedRoi)) {
          callbacks.onAfterResize(committedRoi, actions, state.committedRois);
        }
      }
      break;
    }
    case 'panning': {
      callbacks.onAfterZoomChange?.(state.panZoom);
      break;
    }
    case 'idle': {
      break;
    }
    default:
      assertUnreachable(state.action);
  }
}
