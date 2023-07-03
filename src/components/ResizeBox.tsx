import { useContext, useEffect, useState } from 'react';

import {
  RoiActions,
  RoiContext,
  RoiDispatchContext,
  RoiReducerAction,
} from '../context/RoiContext';
import { Rectangle } from '../types/Rectangle';
import { RoiObject } from '../types/RoiObject';
import { getPointers } from '../utilities/getPointers';
import { getRectangleFromPoints } from '../utilities/getRectangleFromPoints';
import './css/ResizeBox.css';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roiID, endPoint]);

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
            onMouseDownCapture(pointer.position, roiDispatch)
          }
        />
      ))}
    </>
  ) : null;
}

function onMouseDownCapture(
  index: number,
  roiDispatch: React.Dispatch<RoiReducerAction>,
) {
  roiDispatch({ type: 'updatePosition', payload: index });
  roiDispatch({
    type: 'setRoiState',
    payload: {
      action: RoiActions.RESIZE,
      pointerIndex: index,
    },
  });
}
