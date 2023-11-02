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
    className,
    selectedClassName: editClassname,
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
        className={isActive ? editClassname : className}
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
