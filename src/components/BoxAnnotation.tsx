import { useContext } from 'react';
import {
  DynamicAction,
  DynamicActions,
  DynamicContext,
  DynamicStateType,
} from '../context/DynamicContext';
import { DataObject } from '../types/DataObject';
import { Offset } from '../types/Offset';
import { Ratio } from '../types/Ratio';
import { Rectangle } from '../types/Rectangle';
import { dragRectangle } from '../utilities/dragRectangle';
import { getScaledRectangle } from '../utilities/getScaledRectangle';

type BoxAnnotationProps = {
  objectID: number | string | undefined;
  rectangle: Rectangle;
  options?: BoxAnnotationOptions;
  onMouseDown?: (event: any) => void;
  onMouseUp?: (event: any) => void;
};

export function BoxAnnotation({
  objectID,
  rectangle,
  options,
  onMouseDown,
  onMouseUp,
}: BoxAnnotationProps): JSX.Element {
  const defaultOptions = {
    strokeWidth: 1,
    stroke: 'black',
    fill: 'black',
    strokeDasharray: 0,
    strokeDashoffset: 0,
  };
  const { dynamicState, dynamicDispatch } = useContext(DynamicContext);
  const { height, width, origin } = rectangle;
  const object = dynamicState.getObject({ id: objectID as number });
  return (
    <rect
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseDownCapture={(event) =>
        onMouseDownCapture(object, dynamicState, dynamicDispatch, event)
      }
      x={origin.column}
      y={origin.row}
      width={width}
      height={height}
      style={{ ...defaultOptions, ...options }}
    ></rect>
  );
}

function onMouseDownCapture(
  object: DataObject,
  dynamicState: DynamicStateType,
  dynamicDispatch: React.Dispatch<DynamicAction>,
  event: React.MouseEvent
) {
  if (object) {
    const { ratio, offset, delta } = dynamicState;
    const scaledRectangle = getScaledRectangle(
      object.rectangle,
      ratio as Ratio,
      offset as Offset
    );

    const position = dragRectangle(
      scaledRectangle,
      {
        x: scaledRectangle.origin.column + delta.dx,
        y: scaledRectangle.origin.row + delta.dy,
      },
      delta
    );
    dynamicDispatch({
      type: 'setDynamicState',
      payload: {
        objectID: object.id as number,
        action: DynamicActions.DRAG,
        delta: {
          dx: event.clientX - scaledRectangle.origin.column,
          dy: event.clientY - scaledRectangle.origin.row,
        },
        ...position,
      },
    });
  }
}

type BoxAnnotationOptions = {
  strokeWidth?: number | string;
  stroke?: string;
  fill?: string;
  strokeDasharray?: number | string;
  strokeDashoffset?: number | string;
  zIndex?: number | undefined;
};
