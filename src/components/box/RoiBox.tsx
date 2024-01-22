import { memo, useEffect } from 'react';

import { RoiListProps } from '../..';
import { usePanZoom } from '../../hooks/usePanZoom';
import { useRoiDispatch } from '../../hooks/useRoiDispatch';
import { Roi } from '../../types/Roi';

import { Box } from './Box';
import { getScaledSizes } from './sizes';
import { roiToFloorBox } from './util';

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
  const { id } = roi;
  const isReadOnly = getReadOnly(roi);

  const scaledSizes = getScaledSizes(roi, panzoom);
  const roiDispatch = useRoiDispatch();
  useEffect(() => {
    if (isReadOnly) {
      roiDispatch({ type: 'UNSELECT_ROI', payload: id });
    }
  }, [id, isReadOnly, roiDispatch]);

  const box = roiToFloorBox(roi);

  return (
    <>
      <div
        data-testid={roi.id}
        style={{
          position: 'absolute',
          left: box.x,
          top: box.y,
          width: box.width,
          height: box.height,
        }}
      >
        <Box roi={roi} isReadOnly={isReadOnly} getStyle={getStyle} />
      </div>
      <div
        data-testid={`label-${roi.id}`}
        style={{
          position: 'absolute',
          left: box.x,
          top: box.y,
          width: box.width,
          height: box.height,
          pointerEvents: 'none',
        }}
      >
        {renderLabel(roi, {
          isReadOnly,
          isSelected,
          scaledSizes,
          zoomScale: panzoom.panZoom.scale * panzoom.initialPanZoom.scale,
        })}
      </div>
    </>
  );
}

export const RoiBox = memo(RoiBoxInternal);
