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
  const { style, selectedStyle: editStyle, x, y, width, height } = roi;
  const isActive = roi.id === roiState.selectedRoi;
  return (
    <>
      <Box
        id={roi.id}
        x={x}
        y={y}
        width={width}
        height={height}
        style={isActive ? editStyle : style}
        label={roi.label}
      />
      {roiState.mode === 'select' &&
        isActive &&
        getAllCorners(roi).map((corner) => (
          <RoiBoxCorner
            corner={corner}
            roiId={roi.id}
            key={`corner-${corner.xPosition}-${corner.yPosition}`}
          />
        ))}
    </>
  );
}

export const RoiBox = memo(RoiBoxInternal);
