import { CSSProperties, useContext } from 'react';

import { RoiDispatchContext, RoiContext, Modes } from '../context/RoiContext';

interface BoxAnnotationProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style?: CSSProperties;
}

export function BoxAnnotation({
  id,
  x,
  y,
  width,
  height,
  style,
}: BoxAnnotationProps): JSX.Element {
  const { roiDispatch } = useContext(RoiDispatchContext);
  const { roiState } = useContext(RoiContext);
  return (
    <rect
      id={id}
      cursor={roiState.mode === Modes.DRAW ? 'crosshair' : 'grab'}
      x={x}
      y={y}
      width={width}
      height={height}
      style={style}
      onMouseDown={(event) => {
        if (id) {
          roiDispatch({
            type: 'selectBoxAnnotation',
            payload: { id, event },
          });
          if (roiState.mode === Modes.SELECT) event.stopPropagation();
        }
      }}
    />
  );
}
