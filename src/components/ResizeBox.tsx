import { Rectangle } from '../types/Rectangle';

import './css/ResizeBox.css';
import { getPointers } from '../utilities/getPointers';
import { getReferencePointers } from '../utilities/getReferencePointers';
import { Delta } from '../types/Delta';
import { PositionAction, PositionStateType } from '../context/PositionContext';
import {
  DynamicAction,
  DynamicActions,
  DynamicStateType,
} from '../context/DynamicContext';
import { ObjectActions, ObjectStateType } from '../context/ObjectContext';
import { getRectangle } from '../utilities/getRectangle';
import { getRectangleFromPoints } from '../utilities/getRectangleFromPoints';
import { selectObject } from './callbacks/selectObject';

export function ResizeBox({
  objectState,
  objectDispatch,
  positionState,
  dynamicState,
  positionDispatch,
  dynamicDispatch,
  rect,
}: {
  objectState: ObjectStateType;
  objectDispatch: React.Dispatch<ObjectActions>;
  positionState: PositionStateType;
  positionDispatch: React.Dispatch<PositionAction>;
  dynamicState: DynamicStateType;
  dynamicDispatch: React.Dispatch<DynamicAction>;
  delta: Delta;
  rect: {
    offsetLeft: number;
    offsetTop: number;
  };
}) {
  const object = objectState.objects.find(
    (obj) => obj.id === dynamicState.objectID
  );
  function onMouseDown(position: number) {
    const points = getReferencePointers(
      object?.rectangle as Rectangle,
      positionState.delta,
      position,
      rect
    );
    positionDispatch({
      type: 'setPosition',
      payload: {
        startPoint: { x: points?.p0.x || 0, y: points?.p0.y || 0 },
        endPoint: { x: points?.p1.x || 0, y: points!?.p1.y || 0 },
      },
    });
    dynamicDispatch({
      type: 'setAction',
      payload: DynamicActions.RESIZE,
    });
  }

  let rectangle = getRectangle(
    getRectangleFromPoints(positionState.startPoint, positionState.endPoint),
    positionState.delta,
    rect
  );
  if (object && dynamicState.action === DynamicActions.SLEEP) {
    rectangle = object.rectangle;
  }
  const pointers = getPointers(rectangle);
  return (
    <>
      <rect
        x={rectangle.origin.column - 1}
        y={rectangle.origin.row - 1}
        width={rectangle.width + 2}
        height={rectangle.height + 2}
        style={{
          padding: '10px',
          fill: dynamicState.isMouseDown ? 'rgba(0,0,0,0.4)' : 'black',
          stroke: 'black',
          strokeWidth: 2,
        }}
        onMouseDownCapture={(event) => {
          selectObject(
            dynamicState.objectID,
            event,
            rect,
            objectState,
            objectDispatch,
            positionState,
            dynamicState,
            dynamicDispatch
          );
        }}
      ></rect>

      {pointers.map((pointer) => (
        <rect
          key={`pointer-${pointer.position}`}
          x={pointer.cx - 8}
          y={pointer.cy - 8}
          width={16}
          height={16}
          className="circle"
          onMouseDownCapture={() => onMouseDown(pointer.position)}
        ></rect>
      ))}
    </>
  );
}
