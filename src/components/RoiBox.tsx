import { useContext } from 'react';

import { RoiStateContext } from '../context/RoiContext';
import { CommittedRoi } from '../types/CommittedRoi';
import { getScaledRectangle } from '../utilities/getScaledRectangle';

import { BoxAnnotation } from './BoxAnnotation';
import { Label } from './Label';

interface RoiBoxProps {
  id?: string;
  roi: CommittedRoi;
}

export function RoiBox({ roi }: RoiBoxProps): JSX.Element {
  const roiState = useContext(RoiStateContext);
  const { id, style } = roi;
  const { x, y, width, height } = getScaledRectangle(roi, roiState.ratio);
  const isActive = id === roiState.selectedRoi;
  return (
    <>
      <BoxAnnotation
        id={id}
        x={x}
        y={y}
        width={width}
        height={height}
        style={isActive && roiState.mode === 'select' ? { opacity: 0 } : style}
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
