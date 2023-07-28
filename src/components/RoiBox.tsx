import { useContext, CSSProperties } from 'react';

import { RoiContext, RoiDispatchContext } from '../context/RoiContext';
import { Roi } from '../types/Roi';
import { getScaledRectangle } from '../utilities/getScaledRectangle';

interface RoiBoxProps {
  id?: string;
  roi: Roi;
}

export function RoiBox({ roi }: RoiBoxProps): JSX.Element {
  const { roiState } = useContext(RoiContext);
  const { id, isResizing, isMoving, style } = roi;
  const { x, y, width, height } = getScaledRectangle(roi, roiState.ratio);
  return (
    <>
      {roi.label && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          alignmentBaseline="middle"
          textAnchor="middle"
          stroke="none"
          fill="black"
          style={{
            fontSize: Math.floor(width / 5),
            fontWeight: 'bold',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {`${roi.label}`}
        </text>
      )}
      <BoxAnnotation
        id={id}
        x={x}
        y={y}
        width={width}
        height={height}
        style={isMoving || isResizing ? { opacity: 0 } : style}
      />
    </>
  );
}

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
  return (
    <rect
      id={id}
      cursor={'grab'}
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
        }
      }}
    />
  );
}
