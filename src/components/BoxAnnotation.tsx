import { useContext } from 'react';

import { RoiDispatchContext } from '../context/RoiContext';
import { Rectangle } from '../types/Rectangle';

type BoxAnnotationProps = {
  id?: number | string;
  rectangle: Rectangle;
  options?: BoxAnnotationOptions;
};

export function BoxAnnotation({
  id,
  rectangle,
  options = {},
}: BoxAnnotationProps): JSX.Element {
  const {
    rgba = [0, 0, 0, 0.5],
    label,
    stroke = 'black',
    strokeWidth = 1,
    strokeDasharray = 0,
    strokeDashoffset = 0,
    zIndex,
  } = options;
  const { roiDispatch } = useContext(RoiDispatchContext);
  const { height, width, origin } = rectangle;
  return (
    <>
      <rect
        cursor={'grab'}
        x={origin.column}
        y={origin.row}
        width={width}
        height={height}
        style={{
          fill: `rgba(${rgba.join(',')})`,
          stroke,
          strokeWidth,
          strokeDasharray,
          strokeDashoffset,
          zIndex,
        }}
        onMouseDownCapture={(event) => {
          if (id) {
            roiDispatch({
              type: 'selectBoxAnnotation',
              payload: { id: id as string, event },
            });
          }
        }}
      />
      {label && (
        <text
          x={origin.column + width / 2}
          y={origin.row + height / 2}
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
          {`${label}`}
        </text>
      )}
    </>
  );
}

type BoxAnnotationOptions = {
  rgba?: number[];
  label?: string;
  stroke?: string;
  strokeDasharray?: number | string;
  strokeDashoffset?: number | string;
  strokeWidth?: number | string;
  zIndex?: number | undefined;
};
