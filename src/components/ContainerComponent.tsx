import useResizeObserver from '@react-hook/resize-observer';
import { MutableRefObject, useEffect, useRef } from 'react';

import { roiContainerRefContext } from '../context/contexts';
import { useRoiState } from '../hooks';
import { useRoiDispatch } from '../hooks/useRoiDispatch';

interface ContainerProps {
  target: JSX.Element & { ref?: MutableRefObject<HTMLImageElement> };
  children: JSX.Element;
}

export function ContainerComponent({ target, children }: ContainerProps) {
  const roiDispatch = useRoiDispatch();
  const roiState = useRoiState();
  const ref = useRef<HTMLDivElement>(null);
  useResizeObserver(ref, (entry) => {
    roiDispatch({
      type: 'setSize',
      payload: {
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      },
    });
  });

  useEffect(() => {
    function onMouseMove(event: MouseEvent) {
      roiDispatch({
        type: 'onMouseMove',
        payload: event,
      });
    }

    function onMouseUp() {
      roiDispatch({
        type: 'onMouseUp',
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
          margin: 0,
          padding: 0,
          cursor: roiState.mode === 'draw' ? 'crosshair' : 'default',
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
          onMouseDown={(event) => {
            const containerBoundingRect = ref.current.getBoundingClientRect();
            roiDispatch({
              type: 'onMouseDown',
              payload: { event, containerBoundingRect },
            });
          }}
        >
          {children}
        </div>
      </div>
    </roiContainerRefContext.Provider>
  );
}
