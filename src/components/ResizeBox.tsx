import { useContext, useEffect, useState } from 'react';

import {
  RoiAction,
  Modes,
  RoiContext,
  RoiDispatchContext,
} from '../context/RoiContext';
import { Point, Ratio } from '../types';
import { Rectangle } from '../types/Rectangle';
import { Roi } from '../types/Roi';
import { getPointers } from '../utilities/getPointers';
import { getRectangleFromPoints } from '../utilities/getRectangleFromPoints';

import { BoxAnnotation } from './RoiBox';

export function ResizeBox({ cursorSize }: { cursorSize: number }) {
  const { roiState } = useContext(RoiContext);
  const { roiDispatch } = useContext(RoiDispatchContext);
  const { ratio, selectedRoi, mode, startPoint, endPoint, rois } = roiState;
  const [rectangle, setRectangle] = useState<Rectangle | undefined>(undefined);
  const currentRoi = rois.find((roi) => roi.id === selectedRoi);
  useEffect(() => {
    selectRectangle(
      currentRoi,
      ratio,
      startPoint,
      endPoint,
      mode,
      setRectangle,
    );
  }, [endPoint, rois, startPoint, mode, ratio, currentRoi]);

  const isActive = currentRoi?.isMoving || currentRoi?.isResizing;
  return rectangle ? (
    <>
      <BoxAnnotation
        id={selectedRoi ? selectedRoi : crypto.randomUUID()}
        x={rectangle.x}
        y={rectangle.y}
        width={rectangle.width}
        height={rectangle.height}
        style={
          isActive
            ? currentRoi.editStyle
            : selectedRoi
            ? { opacity: 0 }
            : { fill: 'black', opacity: 0.5 }
        }
      />
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
          onMouseDown={(event) => {
            event.stopPropagation();
            roiDispatch({ type: 'resizeRoi', payload: pointer.position });
          }}
        />
      ))}
    </>
  ) : null;
}

function selectRectangle(
  roi: Roi,
  ratio: Ratio,
  startPoint: Point,
  endPoint: Point,
  action: RoiAction,
  setRectangle: React.Dispatch<Rectangle>,
) {
  if (startPoint && endPoint) {
    setRectangle(getRectangleFromPoints(startPoint, endPoint));
  } else if (roi && action === Modes.SELECT) {
    // setRectangle(getScaledRectangle(roi, ratio));
  } else {
    setRectangle(undefined);
  }
}
