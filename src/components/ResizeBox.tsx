import { useContext, useEffect, useState } from 'react';

import { selectObject } from './callbacks/selectObject';
import {
  DynamicAction,
  DynamicActions,
  DynamicContext,
} from '../context/DynamicContext';
import { getPointers } from '../utilities/getPointers';
import { getRectangleFromPoints } from '../utilities/getRectangleFromPoints';
import { Rectangle } from '../types/Rectangle';
import { Ratio } from '../types/Ratio';
import { Point } from '../types/Point';

import './css/ResizeBox.css';
import { getScaledRectangle } from '../utilities/getScaledRectangle';

export function ResizeBox({ cursorSize }: { cursorSize: number }) {
  const { dynamicState, dynamicDispatch } = useContext(DynamicContext);
  const { ratio, objectID, action, startPoint, endPoint } = dynamicState;
  const [rectangle, setRectangle] = useState({
    origin: { row: 0, column: 0 },
    width: 0,
    height: 0,
  } as Rectangle);
  const pointers = getPointers(rectangle);

  useEffect(() => {
    if (objectID && action === DynamicActions.SLEEP) {
      const object = dynamicState.getObject({ id: objectID as number });
      setRectangle(getScaledRectangle(object.rectangle, ratio as Ratio));
    } else {
      setRectangle(
        getRectangleFromPoints(startPoint as Point, endPoint as Point)
      );
    }
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
          fill:
            action !== DynamicActions.SLEEP
              ? 'rgba(0,0,0,0.4)'
              : 'rgba(0,0,0,0.8)',
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
