import { useContext, useState } from 'react';

import { selectObject } from './callbacks/selectObject';
import { DynamicActions, DynamicContext } from '../context/DynamicContext';
import { ObjectContext } from '../context/ObjectContext';
import { getPointers } from '../utilities/getPointers';
import { getReferencePointers } from '../utilities/getReferencePointers';
import { getRectangle } from '../utilities/getRectangle';
import { getRectangleFromPoints } from '../utilities/getRectangleFromPoints';
import { Rectangle } from '../types/Rectangle';
import { Ratio } from '../types/Ratio';
import { Point } from '../types/Point';
import { Offset } from '../types/Offset';

import './css/ResizeBox.css';

export function ResizeBox({ cursorSize }: { cursorSize: number }) {
  const { dynamicState, dynamicDispatch } = useContext(DynamicContext);
  const { objectState } = useContext(ObjectContext);
  const { ratio, offset, objectID, action, startPoint, endPoint } =
    dynamicState;

  const object = objectState.objects.find((obj) => obj.id === objectID);

  function onMouseDown(index: number) {
    dynamicDispatch({ type: 'setPointerIndex', payload: index });
    console.log(index);
    const points = getReferencePointers(
      object?.rectangle as Rectangle,
      ratio as Ratio,
      index,
      offset as Offset
    );

    dynamicDispatch({
      type: 'setPosition',
      payload: {
        startPoint: {
          x: points?.p0.x ?? (startPoint?.x || 0),
          y: points?.p0.y ?? (startPoint?.y || 0),
        },
        endPoint: {
          x: points?.p1.x ?? (endPoint?.x || 0),
          y: points?.p1.y ?? (endPoint?.y || 0),
        },
      },
    });
    dynamicDispatch({
      type: 'setAction',
      payload: DynamicActions.RESIZE,
    });
  }

  const rectangle =
    object && action === DynamicActions.SLEEP
      ? object.rectangle
      : getRectangle(
          getRectangleFromPoints(
            startPoint as Point,
            endPoint as Point,
            action === DynamicActions.RESIZE
              ? dynamicState.pointerIndex
              : undefined
          ),
          ratio as Ratio,
          offset as Offset
        );

  const pointers = getPointers(rectangle);

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
          selectObject(event, objectState, dynamicState, dynamicDispatch);
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
          onMouseDownCapture={() => onMouseDown(pointer.position)}
        ></rect>
      ))}
    </>
  );
}
