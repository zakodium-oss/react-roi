import useResizeObserver from '@react-hook/resize-observer';
import { CSSProperties, MutableRefObject, ReactNode, useEffect } from 'react';

import { useRoiState } from '../../hooks';
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
}

export function ContainerComponent({
  target,
  children,
  style,
  className,
  id,
}: ContainerProps) {
  const roiDispatch = useRoiDispatch();
  const roiState = useRoiState();
  const panZoomTransform = usePanZoomTransform();
  const ref = useRoiContainerRef();

  useResizeObserver(ref, (entry) => {
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
      if (!event.altKey) return;
      event.preventDefault();
      event.stopPropagation();
      onZoom(event);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    ref.current.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('wheel', onWheel);
    };
  }, [roiDispatch, ref]);

  return (
    <div
      id={id}
      ref={ref}
      style={{
        ...style,
        position: 'relative',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        cursor: roiState.mode === 'draw' ? 'crosshair' : 'default',
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
  );
}