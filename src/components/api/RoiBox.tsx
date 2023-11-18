import { memo, useEffect } from 'react';

import { useRoiState } from '../../hooks';
import { usePanZoom } from '../../hooks/usePanZoom';
import { useRoiDispatch } from '../../hooks/useRoiDispatch';
import { Roi } from '../../types/Roi';
import { getAllCorners } from '../../utilities/corners';
import { Box } from '../Box';
import { RoiBoxCorner } from '../RoiBoxCorner';

import { RoiListProps } from './RoiList';

interface RoiBoxProps {
  roi: Roi;
  getStyle: RoiListProps['getStyle'];
  getReadOnly: RoiListProps['getReadOnly'];
}

function RoiBoxInternal(props: RoiBoxProps): JSX.Element {
  const { roi, getStyle, getReadOnly } = props;
  const roiState = useRoiState();

  const { x, y, width, height, id, label } = roi;
  const isSelected = id === roiState.selectedRoi;
  const isReadOnly = getReadOnly(roi);

  const roiDispatch = useRoiDispatch();
  const panZoom = usePanZoom();
  useEffect(() => {
    if (isReadOnly) {
      roiDispatch({ type: 'UNSELECT_ROI', payload: id });
    }
  }, [id, isReadOnly, roiDispatch]);

  return (
    <>
      <Box
        id={id}
        x={x}
        y={y}
        width={width}
        height={height}
        label={label}
        isReadOnly={isReadOnly}
        {...getStyle(roi, {
          isReadOnly,
          isSelected,
          scale: panZoom.panZoom.scale * panZoom.initialPanZoom.scale,
        })}
      />
      {roiState.mode === 'select' &&
        isSelected &&
        !isReadOnly &&
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
