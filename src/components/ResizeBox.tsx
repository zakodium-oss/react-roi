import { useContext } from 'react';
import { Rectangle } from '../types/Rectangle';
import { DataContext, DataObject } from '../context/DataContext';

import './css/ResizeBox.css';
import { EventActions, EventStateType } from '../context/EventReducer';
import { getPointers } from '../utilities/getPointers';
import { getReferencePointers } from '../utilities/getReferencePointers';

export function ResizeBox({
  id,
  rectangle,
  eventDispatch,
  eventState,
  rect,
}: {
  id: string | number;
  object: DataObject;
  rectangle: Rectangle;
  eventState: EventStateType;
  eventDispatch: React.Dispatch<EventActions>;
  delta: {
    width: number;
    height: number;
  };
  rect: {
    offsetLeft: number;
    offsetTop: number;
  };
}) {
  const { state } = useContext(DataContext);
  const index = state.objects.findIndex((item) => item.id === id);
  const currentRectangle =
    index !== -1
      ? state.objects[index].rectangle
      : {
          origin: { column: 0, row: 0 },
          width: 0,
          height: 0,
        };
  const pointers = getPointers(currentRectangle);

  function onMouseDown(position: number) {
    const objIndex = state.objects.findIndex((obj) => obj.id === id);
    const points = getReferencePointers(
      state.objects[objIndex].rectangle,
      eventState.delta,
      position,
      rect
    );
    eventDispatch({
      type: 'setDynamicState',
      payload: { resize: true, drag: false, position },
    });
    eventDispatch({
      type: 'setStartPoint',
      payload: { x: points?.p0.x || 0, y: points?.p0.y || 0 },
    });
    eventDispatch({
      type: 'setCurrentPoint',
      payload: { x: points?.p1.x || 0, y: points!?.p1.y || 0 },
    });
  }

  return (
    <>
      <rect
        x={rectangle.origin.column - 8}
        y={rectangle.origin.row - 8}
        width={rectangle.width + 16}
        height={rectangle.height + 16}
        style={{
          padding: '10px',
          fill: 'transparent',
          stroke: '#44aaff',
          strokeDasharray: 8,
          strokeWidth: 8,
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
