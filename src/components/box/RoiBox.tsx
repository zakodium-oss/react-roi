import { memo, useEffect } from 'react';

import { CommittedBox, RoiListProps } from '../..';
import { usePanZoom } from '../../hooks/usePanZoom';
import { useRoiDispatch } from '../../hooks/useRoiDispatch';
import { Roi } from '../../types/Roi';

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
  const { id } = roi;
  const isReadOnly = getReadOnly(roi);

  const scaledSizes = getScaledSizes(roi, panzoom);
  const roiDispatch = useRoiDispatch();
  useEffect(() => {
    if (isReadOnly) {
      roiDispatch({ type: 'UNSELECT_ROI', payload: id });
    }
  }, [id, isReadOnly, roiDispatch]);

  const box = floorRoi(roi);

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
        {renderLabel(roi, { isReadOnly, isSelected, scaledSizes })}
      </div>
    </>
  );
}

export const RoiBox = memo(RoiBoxInternal);

function floorRoi(roi: Roi): CommittedBox {
  console.log(`x1: ${roi.x1}, y1: ${roi.y1}, x2: ${roi.x2}, y2: ${roi.y2}\n`);
  const x1 = Math.floor(roi.x1);
  const y1 = Math.floor(roi.y1);
  const x2 = Math.floor(roi.x2);
  const y2 = Math.floor(roi.y2);
  return {
    x: x1,
    width: x2 - x1,
    y: y1,
    height: y2 - y1,
  };
}
