import { CSSProperties, useContext } from 'react';

import { RoiDispatchContext, RoiStateContext } from '../context/RoiContext';

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
  const roiDispatch = useContext(RoiDispatchContext);
  const roiState = useContext(RoiStateContext);
  return (
    <rect
      id={id}
      cursor={roiState.mode === 'draw' ? 'crosshair' : 'grab'}
      x={x}
      y={y}
      width={width}
      height={height}
      style={style}
      onMouseDown={(event) => {
        roiDispatch({
          type: 'selectBoxAnnotation',
          payload: { id, event },
        });
        if (roiState.mode === 'select') event.stopPropagation();
      }}
    />
  );
}
