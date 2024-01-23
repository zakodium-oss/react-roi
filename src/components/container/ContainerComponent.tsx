import useResizeObserver from '@react-hook/resize-observer';
import {
  CSSProperties,
  MutableRefObject,
  ReactNode,
  useEffect,
  useMemo,
} from 'react';

import { RoiAction, RoiMode, useRoiState } from '../..';
import { LockContext, lockContext } from '../../context/contexts';
import { useIsKeyDown } from '../../hooks/useIsKeyDown';
import { usePanZoomTransform } from '../../hooks/usePanZoom';
import { useRoiContainerRef } from '../../hooks/useRoiContainerRef';
import { useRoiDispatch } from '../../hooks/useRoiDispatch';
import { throttle } from '../../utilities/throttle';

interface ContainerProps {
  target: JSX.Element & { ref?: MutableRefObject<HTMLImageElement> };
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  id?: string;
  noUnselection?: boolean;
  lockZoom: boolean;
  lockPan: boolean;
  minNewRoiSize?: number;
}

export function ContainerComponent(props: ContainerProps) {
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
      roiDispatch({
        type: 'END_ACTION',
        payload: {
          noUnselection,
          minNewRoiSize,
        },
      });
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
  }, [roiDispatch, ref, lockZoom, minNewRoiSize, noUnselection]);

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
