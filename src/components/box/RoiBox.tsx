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
import {
  applyTransformToBox,
  computeTotalPanZoom,
} from '../../utilities/panZoom';

import { BoxSvg } from './BoxSvg';

interface RoiBoxProps {
  roi: Roi;
  isSelected: boolean;
  getStyle: GetStyleCallback;
  getReadOnly: GetReadOnlyCallback;
  renderLabel: RenderLabelCallback;
  allowRotate: boolean;
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
    allowRotate,
  } = props;

  const panzoom = usePanZoom();
  const totalPanzoom = computeTotalPanZoom(panzoom);
  const { id } = roi;

  const roiDispatch = useRoiDispatch();
  const isReadOnly = getReadOnly(roi) || false;

  const roiAdditionalState = {
    isReadOnly,
    isSelected,
    zoomScale: panzoom.panZoom.scale * panzoom.initialPanZoom.scale,
  };

  const shadowOpacity = getOverlayOpacity(roi, roiAdditionalState);

  useEffect(() => {
    if (isReadOnly) {
      roiDispatch({ type: 'UNSELECT_ROI', payload: id });
    }
  }, [id, isReadOnly, roiDispatch]);

  const box = applyTransformToBox(totalPanzoom, roi);

  return (
    <>
      <div
        data-testid={roi.id}
        style={{
          transformOrigin: 'center',
          transform: `rotate(${box.angle}rad)`,
          position: 'absolute',
          left: box.x,
          top: box.y,
          width: box.width,
          height: box.height,
          boxShadow:
            isSelected && shadowOpacity
              ? `0 0 0 ${Math.max(panzoom.containerSize.width * totalPanzoom.scale, panzoom.containerSize.height * totalPanzoom.scale)}px rgba(0,0,0,${shadowOpacity})`
              : 'none',
        }}
      >
        <BoxSvg
          roi={roi}
          box={box}
          isReadOnly={isReadOnly}
          getStyle={getStyle}
          allowRotate={allowRotate}
        />
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
