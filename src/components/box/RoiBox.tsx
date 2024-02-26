import { JSX, memo, useEffect } from 'react';

import {
  GetOverlayOpacity,
  GetReadOnlyCallback,
  GetStyleCallback,
  RenderLabelCallback,
} from '../..';
import { usePanZoom } from '../../hooks/usePanZoom';
import { useRoiDispatch } from '../../hooks/useRoiDispatch';
import { Roi } from '../../types/Roi';

import { Box } from './Box';
import { getScaledSizes } from './sizes';
import { roiToFloorBox } from './util';

interface RoiBoxProps {
  roi: Roi;
  isSelected: boolean;
  getStyle: GetStyleCallback;
  getReadOnly: GetReadOnlyCallback;
  renderLabel: RenderLabelCallback;
  getOverlayOpacity: GetOverlayOpacity;
}

function RoiBoxInternal(props: RoiBoxProps): JSX.Element {
  const {
    roi,
    getStyle,
    getReadOnly,
    isSelected,
    renderLabel,
    getOverlayOpacity,
  } = props;

  const panzoom = usePanZoom();
  const { id } = roi;

  const scaledSizes = getScaledSizes(roi, panzoom);
  const roiDispatch = useRoiDispatch();
  const isReadOnly = getReadOnly(roi) || false;

  const roiAdditionalState = {
    isReadOnly,
    isSelected,
    scaledSizes,
    zoomScale: panzoom.panZoom.scale * panzoom.initialPanZoom.scale,
  };

  const shadowOpacity = getOverlayOpacity(roi, roiAdditionalState);

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
          boxShadow:
            isSelected && shadowOpacity
              ? `0 0 0 ${Math.max(panzoom.containerSize.width, panzoom.containerSize.height)}px rgba(0,0,0,${shadowOpacity})`
              : 'none',
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
          whiteSpace: 'pre',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        {renderLabel(roi, roiAdditionalState)}
      </div>
    </>
  );
}

export const RoiBox = memo(RoiBoxInternal);
