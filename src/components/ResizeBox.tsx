import { useContext } from 'react';
import { Rectangle } from '../types/Rectangle';
import { DragContext } from '../context/DragContext';

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
  const { state } = useContext(DragContext);
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
    console.log({ objIndex, points });
    eventDispatch({
      type: 'setResizerState',
      payload: { active: true, position, id: eventState.object },
    });
    eventDispatch({
      type: 'setStartPosition',
      payload: { x: points!.p0.x, y: points!.p0.y },
    });
    eventDispatch({
      type: 'setCurrentPosition',
      payload: { x: points!.p1.x, y: points!.p1.y },
    });
  }

  return (
    <>
      <rect
        x={rectangle.origin.column}
        y={rectangle.origin.row}
        width={rectangle.width}
        height={rectangle.height}
        style={{
          fill: 'transparent',
          stroke: '#44aaff',
          strokeWidth: 3,
          zIndex: 1,
        }}
      ></rect>
      {pointers.map((pointer) => (
        <circle
          key={`pointer-${pointer.position}`}
          cx={pointer.cx}
          cy={pointer.cy}
          r={20}
          className="circle"
          onMouseDownCapture={() => onMouseDown(pointer.position)}
        ></circle>
      ))}
    </>
  );
}
