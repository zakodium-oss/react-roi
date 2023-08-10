import { useContext } from 'react';

import { RoiContext } from '../context/RoiContext';
import { Roi } from '../types/Roi';
import { getScaledRectangle } from '../utilities/getScaledRectangle';

import { BoxAnnotation } from './BoxAnnotation';
import { Label } from './Label';

interface RoiBoxProps {
  id?: string;
  roi: Roi;
}

export function RoiBox({ roi }: RoiBoxProps): JSX.Element {
  const { roiState } = useContext(RoiContext);
  const { id, isResizing, isMoving, style } = roi;
  const { x, y, width, height } = getScaledRectangle(roi, roiState.ratio);
  const isActive = isMoving || isResizing;
  return (
    <>
      <BoxAnnotation
        id={id}
        x={x}
        y={y}
        width={width}
        height={height}
        style={isActive ? { opacity: 0 } : style}
      />
      {roi.label && !isActive && (
        <Label
          label={roi.label}
          x={x + width / 2}
          y={y + height / 2}
          width={width / 6}
        />
      )}
    </>
  );
}
