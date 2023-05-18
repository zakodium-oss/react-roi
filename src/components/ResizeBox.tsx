import { Rectangle } from '../types/Rectangle';

import './css/ResizeBox.css';
import {
  DrawActions,
  EventActions,
  EventStateType,
} from '../context/EventReducer';
import { getPointers } from '../utilities/getPointers';
import { getReferencePointers } from '../utilities/getReferencePointers';
import { Delta } from '../types/Delta';
import { DataObject } from '../types/DataObject';
import { ObjectStateType } from '../context/ObjectContext';
import { PositionAction, PositionStateType } from '../context/PositionContext';
import { DynamicAction } from '../context/DynamicContext';

export function ResizeBox({
  object,
  rectangle,
  positionDispatch,
  dynamicDispatch,
  positionState,
  rect,
}: {
  object: DataObject;
  rectangle: Rectangle;
  positionState: PositionStateType;
  positionDispatch: React.Dispatch<PositionAction>;
  dynamicDispatch: React.Dispatch<DynamicAction>;
  delta: Delta;
  rect: {
    offsetLeft: number;
    offsetTop: number;
  };
}) {
  const currentRectangle =
    positionState.object !== undefined
      ? positionState.object.rectangle
      : {
          origin: { column: 0, row: 0 },
          width: 0,
          height: 0,
        };
  const pointers = getPointers(currentRectangle);

  function onMouseDown(position: number) {
    const points = getReferencePointers(
      object.rectangle,
      positionState.delta,
      position,
      rect
    );
    object.selected = true;
    dynamicDispatch({
      type: 'setAction',
      payload: DrawActions.RESIZE,
    });
    positionDispatch({
      type: 'setPosition',
      payload: {
        startPoint: { x: points?.p0.x || 0, y: points?.p0.y || 0 },
        endPoint: { x: points?.p1.x || 0, y: points!?.p1.y || 0 },
      },
    });
  }

  return (
    <>
      <rect
        x={rectangle.origin.column - 1}
        y={rectangle.origin.row - 1}
        width={rectangle.width + 2}
        height={rectangle.height + 2}
        style={{
          padding: '10px',
          fill: 'transparent',
          stroke: '#44aaff',
          strokeDasharray: 4,
          strokeWidth: 4,
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
