import { DynamicAction, DynamicActions } from '../context/DynamicContext';
import { ObjectActions, ObjectStateType } from '../context/ObjectContext';
import { PositionAction, PositionStateType } from '../context/PositionContext';
import { Rectangle } from '../types/Rectangle';
import { getReferencePointers } from '../utilities/getReferencePointers';
import { getScaledRectangle } from '../utilities/getScaledRectangle';

export function BoxAnnotation({
  objectID,
  rectangle,
  rect,
  options,
  objectState,
  objectDispatch,
  positionState,
  positionDispatch,
  dynamicDispatch,
  onMouseDown,
  onMouseUp,
}: {
  objectID: number | string | undefined;
  rectangle: Rectangle;
  rect: {
    offsetLeft: number;
    offsetTop: number;
  };
  options?: {
    strokeWidth?: number | string;
    stroke?: string;
    fill?: string;
    strokeDasharray?: number | string;
    strokeDashoffset?: number | string;
    zIndex?: number | undefined;
  };
  objectState: ObjectStateType;
  objectDispatch: React.Dispatch<ObjectActions>;
  positionState: PositionStateType;
  positionDispatch?: React.Dispatch<PositionAction>;
  dynamicDispatch?: React.Dispatch<DynamicAction>;
  onMouseDown?: (event: any) => void;
  onMouseUp?: (event: any) => void;
}): JSX.Element {
  const defaultOptions = {
    strokeWidth: 1,
    stroke: 'black',
    fill: 'black',
    strokeDasharray: 0,
    strokeDashoffset: 0,
  };
  const { height, width, origin } = rectangle;
  const object = objectState.objects.find((obj) => obj.id === objectID);
  return (
    <rect
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseDownCapture={(event) => {
        if (!positionDispatch || !dynamicDispatch) return;
        if (!object) return;
        const scaledRectangle = getScaledRectangle(
          object?.rectangle,
          positionState.delta,
          rect
        );
        const points = getReferencePointers(
          object?.rectangle as Rectangle,
          positionState.delta,
          2,
          rect
        );
        dynamicDispatch({
          type: 'setDynamicState',
          payload: {
            isMouseDown: false,
            action: DynamicActions.DRAG,
            point: {
              x: event.clientX,
              y: event.clientY,
            },
            delta: {
              dx: event.clientX - scaledRectangle.origin.column,
              dy: event.clientY - scaledRectangle.origin.row,
            },
            objectID: objectID as number,
          },
        });
        // objectID !== undefined ??
        objectDispatch({
          type: 'updateSelection',
          payload: { id: objectID as number, selected: true },
        });
      }}
      x={origin.column}
      y={origin.row}
      width={width}
      height={height}
      style={{ ...defaultOptions, ...options }}
    ></rect>
  );
}
