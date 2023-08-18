import { useContext } from 'react';

import { RoiDispatchContext, RoiStateContext } from '../context/RoiContext';
import { useRois } from '../hooks/useRois';
import { CommittedRoi } from '../types/CommittedRoi';
import { getPointers } from '../utilities/getPointers';
import { getRectangleFromPoints } from '../utilities/getRectangleFromPoints';

import { BoxAnnotation } from './BoxAnnotation';
import { Label } from './Label';

interface RoiBoxProps {
  roi: CommittedRoi;
}

export function RoiBox({ roi }: RoiBoxProps): JSX.Element {
  const roiState = useContext(RoiStateContext);
  const roiDispatch = useContext(RoiDispatchContext);
  const currentRoi = useRois([roi.id])[0];
  const { style, editStyle, actionData } = currentRoi;
  const { startPoint, endPoint } = actionData;
  const { x, y, width, height } = getRectangleFromPoints(startPoint, endPoint);
  const isActive = roi.id === roiState.selectedRoi;
  const cursorSize = 3;
  return (
    <>
      <BoxAnnotation
        id={roi.id}
        x={x}
        y={y}
        width={width}
        height={height}
        style={isActive ? editStyle : style}
      />
      {roi.label && (
        <Label
          label={roi.label}
          x={x + width / 2}
          y={y + height / 2}
          width={width / 6}
        />
      )}
      {roiState.mode === 'select' &&
        isActive &&
        getPointers(startPoint, endPoint).map((pointer) => (
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
  );
}
