import { useContext, useEffect, useState } from 'react';

import {
  DynamicAction,
  DynamicActions,
  DynamicContext,
} from '../context/DynamicContext';
import { getPointers } from '../utilities/getPointers';
import { getRectangleFromPoints } from '../utilities/getRectangleFromPoints';
import { Rectangle } from '../types/Rectangle';
import { Ratio } from '../types/Ratio';

import './css/ResizeBox.css';
import { getScaledRectangle } from '../utilities/getScaledRectangle';

export function ResizeBox({ cursorSize }: { cursorSize: number }) {
  const { dynamicState, dynamicDispatch } = useContext(DynamicContext);
  const { ratio, objectID, action, startPoint, endPoint, objects } =
    dynamicState;
  const [rectangle, setRectangle] = useState<Rectangle | undefined>(undefined);
  useEffect(() => {
    const object = objects.find((obj) => obj.id === objectID);
    if (startPoint && endPoint) {
      setRectangle(getRectangleFromPoints(startPoint, endPoint));
    } else if (
      object &&
      (action === DynamicActions.SLEEP || action === DynamicActions.DRAG)
    ) {
      setRectangle(getScaledRectangle(object.rectangle, ratio as Ratio));
    }
  }, [objectID, endPoint]);

  return rectangle ? (
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
          dynamicDispatch({
            type: 'selectBoxAnnotation',
            payload: { id: objectID as string, event: event },
          });
        }}
      ></rect>

      {getPointers(rectangle).map((pointer) => (
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
  ) : null;
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
