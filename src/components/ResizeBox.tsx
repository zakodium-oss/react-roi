import { useContext, useEffect, useState } from 'react';

import {
  RoiActions,
  RoiContext,
  RoiDispatchContext,
} from '../context/RoiContext';
import { Rectangle } from '../types/Rectangle';
import { RoiObject } from '../types/RoiObject';
import { getPointers } from '../utilities/getPointers';
import { getRectangleFromPoints } from '../utilities/getRectangleFromPoints';
import { getScaledRectangle } from '../utilities/getScaledRectangle';

import { BoxAnnotation } from './BoxAnnotation';

export function ResizeBox({ cursorSize }: { cursorSize: number }) {
  const { roiState } = useContext(RoiContext);
  const { roiDispatch } = useContext(RoiDispatchContext);
  const { ratio, roiID, action, startPoint, endPoint, rois } = roiState;
  const [rectangle, setRectangle] = useState<Rectangle | undefined>(undefined);
  const [object, setObject] = useState<RoiObject | undefined>(undefined);
  useEffect(() => {
    const object = rois.find((obj) => obj.id === roiID);
    if (startPoint && endPoint) {
      setRectangle(getRectangleFromPoints(startPoint, endPoint));
    } else if (
      object &&
      (action === RoiActions.SLEEP || action === RoiActions.DRAG)
    ) {
      setRectangle(getScaledRectangle(object.rectangle, ratio));
    } else {
      setRectangle(undefined);
    }
    if ((object && action !== RoiActions.SLEEP) || action !== RoiActions.DRAG) {
      setObject(object);
    } else {
      setObject(undefined);
    }
  }, [roiID, endPoint, rois, startPoint, action, ratio]);

  const isActive = action === RoiActions.DRAG || action === RoiActions.RESIZE;

  return rectangle ? (
    <>
      {object ? (
        <BoxAnnotation
          id={object.id}
          rectangle={rectangle}
          options={{
            ...object.meta,
            label:
              isActive || action === RoiActions.SLEEP ? object.meta?.label : '',
            rgba: isActive ? object.meta?.rgba : [0, 0, 0, 0],
          }}
        />
      ) : (
        <BoxAnnotation id="resize-box" rectangle={rectangle} />
      )}
      {getPointers(rectangle).map((pointer) => (
        <rect
          id={`pointer-${pointer.position}`}
          key={`pointer-${pointer.position}`}
          x={pointer.cx - cursorSize}
          y={pointer.cy - cursorSize}
          cursor={pointer.cursor}
          width={cursorSize * 2}
          height={cursorSize * 2}
          style={{ fill: '#44aaff', stroke: 'black' }}
          onMouseDown={() =>
            roiDispatch({ type: 'updatePosition', payload: pointer.position })
          }
        />
      ))}
    </>
  ) : null;
}
