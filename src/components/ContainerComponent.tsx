import useResizeObserver from '@react-hook/resize-observer';
import {
  MutableRefObject,
  WheelEvent,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import { roiContainerRefContext } from '../context/contexts';
import { useRoiState } from '../hooks';
import { usePanZoomTransform } from '../hooks/usePanZoom';
import { useRoiDispatch } from '../hooks/useRoiDispatch';
import { throttle } from '../utilities/throttle';

interface ContainerProps {
  target: JSX.Element & { ref?: MutableRefObject<HTMLImageElement> };
  children: JSX.Element;
}

export function ContainerComponent({ target, children }: ContainerProps) {
  const roiDispatch = useRoiDispatch();
  const roiState = useRoiState();
  const panZoomTransform = usePanZoomTransform();
  const ref = useRef<HTMLDivElement>(null);

  const onWheel = useMemo(() => {
    return throttle((event: WheelEvent) => {
      if (!event.altKey) return;
      event.stopPropagation();
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
  }, [roiDispatch]);
  useResizeObserver(ref, (entry) => {
    roiDispatch({
      type: 'SET_SIZE',
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
      });
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  });

  return (
    <roiContainerRefContext.Provider value={ref}>
      <div
        ref={ref}
        style={{
          position: 'relative',
          overflow: 'hidden',
          margin: 0,
          padding: 0,
          cursor: roiState.mode === 'draw' ? 'crosshair' : 'default',
          userSelect: 'none',
        }}
        onDoubleClick={() => {
          roiDispatch({ type: 'RESET_ZOOM' });
        }}
        onWheel={onWheel}
        onMouseDown={(event) => {
          const containerBoundingRect = ref.current.getBoundingClientRect();
          roiDispatch({
            type: 'START_DRAW',
            payload: {
              event,
              containerBoundingRect,
              isPanZooming: event.altKey,
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
    </roiContainerRefContext.Provider>
  );
}
