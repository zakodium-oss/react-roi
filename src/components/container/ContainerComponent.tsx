import useResizeObserver from '@react-hook/resize-observer';
import { produce } from 'immer';
import type { CSSProperties, JSX, MutableRefObject, ReactNode } from 'react';
import { useEffect, useMemo, useRef } from 'react';

import type { ActionCallbacks, LockContext } from '../../context/contexts.js';
import { lockContext } from '../../context/contexts.js';
import type {
  EndActionPayload,
  PointerMovePayload,
  ReactRoiState,
} from '../../context/roiReducer.js';
import { endAction } from '../../context/updaters/endAction.js';
import { pointerMove } from '../../context/updaters/pointerMove.js';
import { resetZoomAction, zoomAction } from '../../context/updaters/zoom.js';
import useCallbacksRef from '../../hooks/useCallbacksRef.js';
import { useCurrentState } from '../../hooks/useCurrentState.js';
import { useIsKeyDown } from '../../hooks/useIsKeyDown.js';
import { usePanZoomTransform } from '../../hooks/usePanZoom.js';
import { useRoiContainerRef } from '../../hooks/useRoiContainerRef.js';
import { useRoiDispatch } from '../../hooks/useRoiDispatch.js';
import type { Actions, ReactRoiAction, RoiMode } from '../../index.js';
import { useActions, useRoiState } from '../../index.js';
import { assert, assertUnreachable } from '../../utilities/assert.js';
import { roiHasChanged } from '../../utilities/rois.js';
import { throttle } from '../../utilities/throttle.js';

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

  // TODO: https://github.com/zakodium-oss/react-roi/issues/164
  // @ts-expect-error This can be ignored for now
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
        if (stateRef.current && callbacksRef.current?.onZoom) {
          const newState = produce(stateRef.current, (draft) =>
            zoomAction(draft, zoomPayload),
          );
          callbacksRef.current.onZoom(newState.panZoom);
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
          if (stateRef.current && callbacksRef.current?.onZoom) {
            const newState = produce(stateRef.current, (draft) =>
              resetZoomAction(draft),
            );
            callbacksRef.current.onZoom(newState.panZoom);
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
  if (callbacks.onChange) {
    const selectedRoi = state.rois.find((roi) => roi.id === state.selectedRoi);
    if (!selectedRoi || selectedRoi.action.type === 'idle') {
      return;
    }
    const newState = produce(state, (draft) => {
      pointerMove(draft, payload);
      endAction(draft, endPayload);
    });

    // It is possible that the roi does not exist (eg. drawing a new, too small ROI)
    const newRoi = newState.committedRois.find(
      (roi) => roi.id === state.selectedRoi,
    );

    const previousRoi = state.committedRois.find(
      (committedRoi) => committedRoi.id === state.selectedRoi,
    );

    if (roiHasChanged(previousRoi, newRoi)) {
      callbacks.onChange({
        roi: newRoi ?? null,
        actions,
        actionType: selectedRoi.action.type,
        roisBeforeCommit: state.committedRois,
      });
    }
  }
}

function callPointerUpActionHooks(
  state: ReactRoiState,
  callbacks: ActionCallbacks,
  payload: EndActionPayload,
  actions: Actions,
) {
  if (callbacks.onAfterChange) {
    switch (state.action) {
      case 'drawing':
      case 'moving':
      case 'resizing':
      case 'rotating':
        {
          const roi = state.rois.find(
            (roi) => roi.action.type === state.action,
          );
          assert(
            roi,
            `An ROI in the current "${state.action} state should exist`,
          );
          const newState = produce(state, (draft) => {
            endAction(draft, payload);
          });

          // It is possible that the roi does not exist (eg. drawing a new, too small ROI)
          const newRoi = newState.committedRois.find(
            (newRoi) => newRoi.id === roi.id,
          );
          const previousRoi = state.committedRois.find(
            (committedRoi) => committedRoi.id === roi.id,
          );

          if (newRoi) {
            if (roiHasChanged(previousRoi, newRoi)) {
              callbacks.onAfterChange({
                roi: newRoi,
                actions,
                actionType: state.action,
                roisBeforeCommit: state.committedRois,
              });
            }
          }
        }
        break;

      case 'panning': {
        callbacks.onZoom?.(state.panZoom);
        break;
      }
      case 'idle': {
        break;
      }
      default:
        assertUnreachable(state.action);
    }
  }
}
