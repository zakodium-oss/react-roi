import { useContext, useEffect, useState } from 'react';

import { selectObject } from './callbacks/selectObject';
import {
  DynamicAction,
  DynamicActions,
  DynamicContext,
} from '../context/DynamicContext';
import { getPointers } from '../utilities/getPointers';
import { getRectangle } from '../utilities/getRectangle';
import { getRectangleFromPoints } from '../utilities/getRectangleFromPoints';
import { Rectangle } from '../types/Rectangle';
import { Ratio } from '../types/Ratio';
import { Point } from '../types/Point';
import { Offset } from '../types/Offset';

import './css/ResizeBox.css';

export function ResizeBox({ cursorSize }: { cursorSize: number }) {
  const { dynamicState, dynamicDispatch } = useContext(DynamicContext);
  const { ratio, offset, objectID, action, startPoint, endPoint } =
    dynamicState;

  const [rectangle, setRectangle] = useState({
    origin: { row: 0, column: 0 },
    width: 0,
    height: 0,
  } as Rectangle);
  const pointers = getPointers(rectangle);

  useEffect(() => {
    if (!objectID) return;
    const object = dynamicState.getObject({ id: objectID });
    const newRectangle =
      object && action === DynamicActions.SLEEP
        ? object.rectangle
        : getRectangle(
            getRectangleFromPoints(startPoint as Point, endPoint as Point),
            ratio as Ratio,
            offset as Offset
          );
    setRectangle(newRectangle);
  }, [objectID, endPoint]);

  return (
    <>
      <rect
        cursor={'grab'}
        x={rectangle.origin.column}
        y={rectangle.origin.row}
        width={rectangle.width}
        height={rectangle.height}
        style={{
          padding: '10px',
          fill: action !== DynamicActions.SLEEP ? 'rgba(0,0,0,0.4)' : 'black',
          stroke: 'black',
          strokeWidth: 2,
        }}
        onMouseDownCapture={(event) => {
          selectObject(event, dynamicState, dynamicDispatch);
        }}
      ></rect>

      {pointers.map((pointer) => (
        <rect
          key={`pointer-${pointer.position}`}
          x={pointer.cx - cursorSize}
          y={pointer.cy - cursorSize}
          cursor={pointer.cursor}
          width={cursorSize * 2}
          height={cursorSize * 2}
          className="circle"
          onMouseDownCapture={() =>
            onMouseDownCapture(pointer.position, dynamicDispatch)
          }
        ></rect>
      ))}
    </>
  );
}

function onMouseDownCapture(
  index: number,
  dynamicDispatch: React.Dispatch<DynamicAction>
) {
  dynamicDispatch({ type: 'updatePosition', payload: index });
  dynamicDispatch({
    type: 'setDynamicState',
    payload: {
      action: DynamicActions.RESIZE,
      pointerIndex: index,
    },
  });
}
