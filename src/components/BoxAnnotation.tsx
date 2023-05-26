import { useContext } from 'react';
import {
  DynamicAction,
  DynamicActions,
  DynamicContext,
  DynamicStateType,
} from '../context/DynamicContext';
import { ObjectContext } from '../context/ObjectContext';
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
  const { objectState } = useContext(ObjectContext);
  const { height, width, origin } = rectangle;
  const object = objectState.objects.find(
    (obj) => obj.id === objectID
  ) as DataObject;
  return (
    <rect
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseDownCapture={(event) =>
        onMouseDownCapture(
          object,
          objectID as number,
          dynamicState,
          dynamicDispatch,
          event
        )
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
  objectID: number,
  dynamicState: DynamicStateType,
  dynamicDispatch: React.Dispatch<DynamicAction>,
  event: any
) {
  const { ratio, offset, delta } = dynamicState;
  {
    const scaledRectangle = getScaledRectangle(
      object.rectangle,
      ratio as Ratio,
      offset as Offset
    );
    dynamicDispatch({
      type: 'setDynamicState',
      payload: {
        action: DynamicActions.DRAG,
        delta: {
          dx: event.clientX - scaledRectangle.origin.column,
          dy: event.clientY - scaledRectangle.origin.row,
        },
        objectID: objectID as number,
      },
    });
    dynamicDispatch({ type: 'setObjectID', payload: objectID });
    const position = dragRectangle(
      scaledRectangle,
      {
        x: scaledRectangle.origin.column + delta.dx,
        y: scaledRectangle.origin.row + delta.dy,
      },
      delta
    );
    dynamicDispatch({ type: 'setPosition', payload: position });
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
