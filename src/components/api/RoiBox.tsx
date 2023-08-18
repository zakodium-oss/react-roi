import { memo } from 'react';

import { useRoiState } from '../../hooks';
import { useRoiDispatch } from '../../hooks/useRoiDispatch';
import { Roi } from '../../types/Roi';
import { getPointers } from '../../utilities/getPointers';
import { getRectangleFromPoints } from '../../utilities/getRectangleFromPoints';
import { BoxAnnotation } from '../BoxAnnotation';
import { Label } from '../Label';

interface RoiBoxProps {
  roi: Roi;
}

function RoiBoxInternal({ roi }: RoiBoxProps): JSX.Element {
  const roiState = useRoiState();
  const roiDispatch = useRoiDispatch();
  const { style, editStyle, actionData } = roi;
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

export const RoiBox = memo(RoiBoxInternal);
