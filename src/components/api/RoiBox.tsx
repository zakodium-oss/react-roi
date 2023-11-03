import { memo } from 'react';

import { useRoiState } from '../../hooks';
import { Roi } from '../../types/Roi';
import { getAllCorners } from '../../utilities/corners';
import { Box } from '../Box';
import { RoiBoxCorner } from '../RoiBoxCorner';
import { RoiListProps } from './RoiList';

interface RoiBoxProps {
  roi: Roi;
  getStyle: RoiListProps['getStyle'];
}

function RoiBoxInternal(props: RoiBoxProps): JSX.Element {
  const { roi, getStyle } = props;
  const roiState = useRoiState();

  const { x, y, width, height, id, label } = roi;
  const isActive = id === roiState.selectedRoi;

  return (
    <>
      <Box
        id={id}
        x={x}
        y={y}
        width={width}
        height={height}
        label={label}
        {...getStyle(roi, isActive)}
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
