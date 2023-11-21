import { memo, useEffect } from 'react';

import { useRoiState } from '../../hooks';
import { useRoiDispatch } from '../../hooks/useRoiDispatch';
import { Roi } from '../../types/Roi';
import { RoiListProps } from '../api';

import { Box } from './Box';

interface RoiBoxProps {
  roi: Roi;
  getStyle: RoiListProps['getStyle'];
  getReadOnly: RoiListProps['getReadOnly'];
}

function RoiBoxInternal(props: RoiBoxProps): JSX.Element {
  const { roi, getStyle, getReadOnly } = props;
  const roiState = useRoiState();
  const isSelected = roiState.selectedRoi === roi.id;

  const { x, y, width, height, id } = roi;
  const isReadOnly = getReadOnly(roi);

  const roiDispatch = useRoiDispatch();
  useEffect(() => {
    if (isReadOnly) {
      roiDispatch({ type: 'UNSELECT_ROI', payload: id });
    }
  }, [id, isReadOnly, roiDispatch]);

  return (
    <>
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width,
            height,
            backgroundColor: 'white',
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width,
          height,
        }}
      >
        <Box roi={roi} isReadOnly={isReadOnly} getStyle={getStyle} />
      </div>
    </>
  );
}

export const RoiBox = memo(RoiBoxInternal);
