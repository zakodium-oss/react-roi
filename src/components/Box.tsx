import { CSSProperties, ReactNode } from 'react';

import { useRoiState } from '../hooks';
import { useRoiDispatch } from '../hooks/useRoiDispatch';
import { RoiMode } from '../types';

export interface BoxAnnotationProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style?: CSSProperties;
  className?: string;
  label?: ReactNode;
  readOnly: boolean;
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
  readOnly,
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
        cursor: getCursor(roiState.mode, readOnly),
        ...style,
      }}
      className={className}
      onMouseDown={(event) => {
        if (event.altKey || readOnly) {
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

function getCursor(mode: RoiMode, readOnly: boolean): CSSProperties['cursor'] {
  if (readOnly) return 'default';
  return mode === 'draw' ? 'crosshair' : 'grab';
}
