import { memo, useEffect } from 'react';

import { usePanZoom } from '../../hooks/usePanZoom';
import { useRoiDispatch } from '../../hooks/useRoiDispatch';
import { Roi } from '../../types/Roi';
import { RoiListProps } from '../api';

import { Box } from './Box';
import { getScaledSizes } from './sizes';

interface RoiBoxProps {
  roi: Roi;
  isSelected: boolean;
  getStyle: RoiListProps['getStyle'];
  getReadOnly: RoiListProps['getReadOnly'];
  renderLabel: RoiListProps['renderLabel'];
}

function RoiBoxInternal(props: RoiBoxProps): JSX.Element {
  const { roi, getStyle, getReadOnly, isSelected, renderLabel } = props;

  const panzoom = usePanZoom();
  const { x, y, width, height, id } = roi;
  const isReadOnly = getReadOnly(roi);

  const scaledSizes = getScaledSizes(roi, panzoom.initialPanZoom.scale);
  const roiDispatch = useRoiDispatch();
  useEffect(() => {
    if (isReadOnly) {
      roiDispatch({ type: 'UNSELECT_ROI', payload: id });
    }
  }, [id, isReadOnly, roiDispatch]);

  return (
    <>
      <div
        data-testid={roi.id}
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
      <div
        data-testid={`label-${roi.id}`}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width,
          height,
          pointerEvents: 'none',
        }}
      >
        {renderLabel(roi, { isReadOnly, isSelected, scaledSizes })}
      </div>
    </>
  );
}

export const RoiBox = memo(RoiBoxInternal);
