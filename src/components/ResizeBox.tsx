import { useContext, useEffect, useState } from 'react';

import {
  DynamicActions,
  DynamicContext,
  DynamicReducerAction,
} from '../context/DynamicContext';
import { DataObject } from '../types/DataObject';
import { Rectangle } from '../types/Rectangle';
import { getPointers } from '../utilities/getPointers';
import { getRectangleFromPoints } from '../utilities/getRectangleFromPoints';
import './css/ResizeBox.css';
import { getScaledRectangle } from '../utilities/getScaledRectangle';

import { BoxAnnotation } from './BoxAnnotation';

export function ResizeBox({ cursorSize }: { cursorSize: number }) {
  const { dynamicState, dynamicDispatch } = useContext(DynamicContext);
  const { ratio, objectID, action, startPoint, endPoint, objects } =
    dynamicState;
  const [rectangle, setRectangle] = useState<Rectangle | undefined>(undefined);
  const [object, setObject] = useState<DataObject | undefined>(undefined);
  useEffect(() => {
    const object = objects.find((obj) => obj.id === objectID);
    if (startPoint && endPoint) {
      setRectangle(getRectangleFromPoints(startPoint, endPoint));
    } else if (
      object &&
      (action === DynamicActions.SLEEP || action === DynamicActions.DRAG)
    ) {
      setRectangle(getScaledRectangle(object.rectangle, ratio));
    } else {
      setRectangle(undefined);
    }
    if (
      (object && action !== DynamicActions.SLEEP) ||
      action !== DynamicActions.DRAG
    ) {
      setObject(object);
    } else {
      setObject(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectID, endPoint]);

  const isActive =
    action === DynamicActions.DRAG || action === DynamicActions.RESIZE;

  return rectangle ? (
    <>
      {object ? (
        <BoxAnnotation
          id={object.id}
          rectangle={rectangle}
          options={{
            ...object.options,
            label:
              isActive || action === DynamicActions.SLEEP
                ? object.options?.label
                : '',
            fill: isActive ? object.options?.fill : [0, 0, 0, 0],
          }}
        />
      ) : (
        <BoxAnnotation rectangle={rectangle} />
      )}
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
        />
      ))}
    </>
  ) : null;
}

function onMouseDownCapture(
  index: number,
  dynamicDispatch: React.Dispatch<DynamicReducerAction>,
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
