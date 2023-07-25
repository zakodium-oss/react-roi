import { useContext, CSSProperties } from 'react';

import { RoiDispatchContext } from '../context/RoiContext';
import { Roi } from '../types/Roi';

type RoiBoxProps = {
  id?: string;
  roi: Roi;
  boxStyle?: CSSProperties;
};

export function RoiBox({ roi, boxStyle }: RoiBoxProps): JSX.Element {
  const { id, height, width, x, y, isResizing, isMoving, style, editStyle } =
    roi;
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
        style={boxStyle ? boxStyle : isMoving || isResizing ? editStyle : style}
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
        event.stopPropagation();
      }}
    />
  );
}
