import { useContext, useEffect, useState } from 'react';

import {
  RoiAction,
  RoiActions,
  RoiContext,
  RoiDispatchContext,
} from '../context/RoiContext';
import { Point, Ratio } from '../types';
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
  const [roi, setRoi] = useState<RoiObject | undefined>(undefined);
  useEffect(() => {
    const roi = rois.find((obj) => obj.id === roiID);
    selectRoi(roi, action, setRoi);
    selectRectangle(roi, ratio, startPoint, endPoint, action, setRectangle);
  }, [roiID, endPoint, rois, startPoint, action, ratio]);

  const isActive = action === RoiActions.DRAG || action === RoiActions.RESIZE;
  return rectangle ? (
    <>
      {roi ? (
        <BoxAnnotation
          id={roi.id}
          rectangle={rectangle}
          options={{
            ...roi.meta,
            label: isActive ? roi.meta?.label : '',
            rgba: isActive ? roi.meta?.rgba : [0, 0, 0, 0],
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
            roiDispatch({ type: 'resizeRoi', payload: pointer.position })
          }
        />
      ))}
    </>
  ) : null;
}

function selectRoi(
  roi: RoiObject,
  action: RoiAction,
  setRoi: React.Dispatch<RoiObject>,
) {
  if ((roi && action !== RoiActions.SLEEP) || action !== RoiActions.DRAG) {
    setRoi(roi);
  } else {
    setRoi(undefined);
  }
}

function selectRectangle(
  roi: RoiObject,
  ratio: Ratio,
  startPoint: Point,
  endPoint: Point,
  action: RoiAction,
  setRectangle: React.Dispatch<Rectangle>,
) {
  if (startPoint && endPoint) {
    setRectangle(getRectangleFromPoints(startPoint, endPoint));
  } else if (
    roi?.rectangle &&
    (action === RoiActions.SLEEP || action === RoiActions.DRAG)
  ) {
    setRectangle(getScaledRectangle(roi.rectangle, ratio));
  } else {
    setRectangle(undefined);
  }
}
