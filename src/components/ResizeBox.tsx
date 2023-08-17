import { useContext, useEffect, useState } from 'react';

import {
  RoiAction,
  Modes,
  RoiStateContext,
  RoiDispatchContext,
} from '../context/RoiContext';
import { useCommitedRois } from '../hooks/useCommitedRois';
import { useRois } from '../hooks/useRois';
import { Point, Ratio } from '../types';
import { CommittedRoi } from '../types/CommittedRoi';
import { Rectangle } from '../types/Rectangle';
import { getPointers } from '../utilities/getPointers';
import { getRectangleFromPoints } from '../utilities/getRectangleFromPoints';
import { getScaledRectangle } from '../utilities/getScaledRectangle';

import { BoxAnnotation } from './BoxAnnotation';
import { Label } from './Label';

export function ResizeBox({ cursorSize }: { cursorSize: number }) {
  const roiState = useContext(RoiStateContext);
  const roiDispatch = useContext(RoiDispatchContext);
  const { ratio, selectedRoi, mode } = roiState;
  const rois = useRois();
  const commitedRois = useCommitedRois();
  const [rectangle, setRectangle] = useState<Rectangle | undefined>(undefined);
  const index = rois.findIndex((roi) => roi.id === selectedRoi);
  const roi = rois[index];
  useEffect(() => {
    const { startPoint, endPoint } = roi
      ? roi.actionData
      : { startPoint: { x: 0, y: 0 }, endPoint: { x: 0, y: 0 } };
    selectRectangle(
      commitedRois[index],
      ratio,
      startPoint,
      endPoint,
      mode,
      setRectangle,
    );
  }, [commitedRois, index, mode, ratio, roi]);

  const isActive = roi?.action === 'moving' || roi?.action === 'resizing';
  const { x, y, width, height } = rectangle ?? {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
  return rectangle ? (
    <>
      <BoxAnnotation
        id={selectedRoi ? selectedRoi : crypto.randomUUID()}
        x={x}
        y={y}
        width={width}
        height={height}
        style={
          !roi
            ? { fill: 'black', opacity: 0.5 }
            : isActive
            ? roi.editStyle
            : roi.style
        }
      />
      {roiState.mode === Modes.SELECT &&
        getPointers(rectangle).map((pointer) => (
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
      {roi?.label && !isActive && (
        <Label
          label={roi.label}
          x={x + width / 2}
          y={y + height / 2}
          width={width / 6}
        />
      )}
    </>
  ) : null;
}

function selectRectangle(
  roi: CommittedRoi,
  ratio: Ratio,
  startPoint: Point,
  endPoint: Point,
  action: RoiAction,
  setRectangle: React.Dispatch<Rectangle>,
) {
  if (startPoint && endPoint) {
    setRectangle(getRectangleFromPoints(startPoint, endPoint));
  } else if (roi && action === Modes.SELECT) {
    setRectangle(getScaledRectangle(roi, ratio));
  } else {
    setRectangle(undefined);
  }
}
