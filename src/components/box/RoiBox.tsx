import type { JSX } from 'react';
import { memo, useEffect } from 'react';

import { usePanZoom } from '../../hooks/usePanZoom.js';
import { useRoiDispatch } from '../../hooks/useRoiDispatch.js';
import type {
  GetOverlayOpacity,
  GetReadOnlyCallback,
  GetStyleCallback,
  RenderLabelCallback,
  RoiCallbackPayload,
} from '../../index.js';
import type { Roi } from '../../types/Roi.js';
import { applyTransformToBox } from '../../utilities/box.js';
import type { GetGridLinesOptions } from '../../utilities/grid.ts';
import { computeTotalPanZoom } from '../../utilities/panZoom.js';
import { LabelBox } from '../label/LabelBox.js';

import { BoxSvg } from './BoxSvg.js';

interface RoiBoxProps {
  roi: Roi;
  isSelected: boolean;
  getStyle: GetStyleCallback;
  getReadOnly: GetReadOnlyCallback;
  renderLabel: RenderLabelCallback;
  displayRotationHandle: boolean;
  getOverlayOpacity: GetOverlayOpacity;
  showGrid: boolean;
  gridOptions: GetGridLinesOptions;
}

function RoiBoxInternal(props: RoiBoxProps): JSX.Element {
  const {
    roi,
    getStyle,
    getReadOnly,
    isSelected,
    renderLabel,
    getOverlayOpacity,
    displayRotationHandle,
    showGrid,
    gridOptions,
  } = props;

  const panzoom = usePanZoom();
  const totalPanzoom = computeTotalPanZoom(panzoom);
  const { id } = roi;

  const roiDispatch = useRoiDispatch();
  const isReadOnly = getReadOnly(roi) || false;

  const roiPayload: RoiCallbackPayload = {
    id,
    isReadOnly,
    isSelected,
    box: roi.box,
    label: roi.label,
    action: roi.action.type,
    data: roi.data,
  };

  const globalStatePayload = {
    zoomScale: panzoom.panZoom.scale * panzoom.initialPanZoom.scale,
  };

  const shadowOpacity = getOverlayOpacity(roiPayload, globalStatePayload);

  useEffect(() => {
    if (isReadOnly) {
      roiDispatch({ type: 'UNSELECT_ROI', payload: id });
    }
  }, [id, isReadOnly, roiDispatch]);

  const box = applyTransformToBox(totalPanzoom, roi.box);
  const label = renderLabel(roiPayload, globalStatePayload);
  return (
    <>
      <div
        data-testid={roi.id}
        style={{
          transformOrigin: `${roi.box.xRotationCenter} ${roi.box.yRotationCenter}`,
          transform: `rotate(${roi.box.angle}rad)`,
          position: 'absolute',
          left: box.x,
          top: box.y,
          width: box.width,
          height: box.height,
          boxShadow:
            isSelected && shadowOpacity
              ? `0 0 0 ${Math.max(panzoom.containerSize.width * 4, panzoom.containerSize.height * 4)}px rgba(0,0,0,${shadowOpacity})`
              : 'none',
        }}
      >
        <BoxSvg
          roi={roi}
          box={box}
          isReadOnly={isReadOnly}
          getStyle={getStyle}
          displayRotationHandle={displayRotationHandle}
          showGrid={showGrid}
          gridOptions={gridOptions}
        />
      </div>
      <LabelBox roi={roi} label={label} panZoom={totalPanzoom} />
    </>
  );
}

export const RoiBox = memo(RoiBoxInternal);
