import { memo } from 'react';

import { useRoiState } from '../../hooks';
import { Roi } from '../../types/Roi';
import { getAllCorners } from '../../utilities/corners';
import { Box } from '../Box';
import { RoiBoxCorner } from '../RoiBoxCorner';

interface RoiBoxProps {
  roi: Roi;
}

function RoiBoxInternal({ roi }: RoiBoxProps): JSX.Element {
  const roiState = useRoiState();
  const {
    style,
    selectedStyle: editStyle,
    x,
    y,
    width,
    height,
    id,
    label,
  } = roi;
  const isActive = id === roiState.selectedRoi;
  return (
    <>
      <Box
        id={id}
        x={x}
        y={y}
        width={width}
        height={height}
        style={isActive ? editStyle : style}
        label={label}
      />
      {roiState.mode === 'select' &&
        isActive &&
        getAllCorners(roi).map((corner) => (
          <RoiBoxCorner
            corner={corner}
            roiId={id}
            key={`corner-${corner.xPosition}-${corner.yPosition}`}
          />
        ))}
    </>
  );
}

export const RoiBox = memo(RoiBoxInternal);
