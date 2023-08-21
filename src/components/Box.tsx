import { CSSProperties } from 'react';

import { useRoiState } from '../hooks';
import { useRoiDispatch } from '../hooks/useRoiDispatch';

interface BoxAnnotationProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style?: CSSProperties;
  label?: string;
}

export function Box({
  id,
  x,
  y,
  width,
  height,
  style,
  label,
}: BoxAnnotationProps): JSX.Element {
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
      onMouseDown={(event) => {
        roiDispatch({
          type: 'SELECT_BOX_AND_START_MOVE',
          payload: {
            id,
          },
        });
        if (roiState.mode === 'select') event.stopPropagation();
      }}
    >
      {label}
    </div>
  );
}
