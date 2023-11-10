import { CSSProperties, ReactNode } from 'react';

import { useRoiState } from '../hooks';
import { useRoiDispatch } from '../hooks/useRoiDispatch';

export interface BoxAnnotationProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style?: CSSProperties;
  className?: string;
  label?: ReactNode;
}

export function Box({
  id,
  x,
  y,
  width,
  height,
  style,
  label,
  className,
}: BoxAnnotationProps) {
  const roiDispatch = useRoiDispatch();
  const roiState = useRoiState();

  return (
    <div
      id={id}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        cursor: roiState.mode === 'draw' ? 'crosshair' : 'grab',
        ...style,
      }}
      className={className}
      onMouseDown={(event) => {
        if (event.altKey) {
          return;
        }
        roiDispatch({
          type: 'SELECT_BOX_AND_START_MOVE',
          payload: {
            id,
          },
        });
        if (roiState.mode === 'select') {
          // By preventing the event to fire on the container, we prevent
          // the drawing of a new ROI to start.
          event.stopPropagation();
        }
      }}
    >
      {label}
    </div>
  );
}
