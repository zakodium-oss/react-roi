import type { ReactElement } from 'react';
import { memo, useEffect } from 'react';

import { usePanZoom } from '../../hooks/usePanZoom.js';
import { useRoiDispatch } from '../../hooks/useRoiDispatch.js';
import type {
  GetInteractionsCallback,
  GetOverlayOpacity,
  GetStyleCallback,
  RenderLabelCallback,
} from '../../index.js';
import type { Roi } from '../../types/Roi.js';
import { resolveRoiInteractions } from '../../types/interactions.js';
import { applyTransformToBox } from '../../utilities/box.js';
import type { GetGridLinesOptions } from '../../utilities/grid.ts';
import { computeTotalPanZoom } from '../../utilities/panZoom.js';
import { LabelBox } from '../label/LabelBox.js';

import { BoxSvg } from './BoxSvg.js';

interface RoiBoxProps {
  roi: Roi;
  isSelected: boolean;
  getStyle: GetStyleCallback;
  getInteractions: GetInteractionsCallback;
  renderLabel: RenderLabelCallback;
  showRotationHandle: boolean;
  getOverlayOpacity: GetOverlayOpacity;
  showGrid: boolean;
  gridOptions: GetGridLinesOptions;
}

function RoiBoxInternal(props: RoiBoxProps): ReactElement {
  const {
    roi,
    getStyle,
    getInteractions,
    isSelected,
    renderLabel,
    getOverlayOpacity,
    showRotationHandle,
    showGrid,
    gridOptions,
  } = props;

  const panzoom = usePanZoom();
  const totalPanzoom = computeTotalPanZoom(panzoom);
  const { id } = roi;

  const roiDispatch = useRoiDispatch();

  const baseRoiPayload = {
    id,
    isSelected,
    box: roi.box,
    label: roi.label,
    action: roi.action.type,
    data: roi.data,
  };

  const globalStatePayload = {
    zoomScale: panzoom.panZoom.scale * panzoom.basePanZoom.scale,
  };

  const interactions = resolveRoiInteractions(
    getInteractions(baseRoiPayload, globalStatePayload),
  );
  const roiPayload = {
    ...baseRoiPayload,
    interactions,
  };

  const shadowOpacity = getOverlayOpacity(roiPayload, globalStatePayload);

  const canSelect = interactions.select;
  useEffect(() => {
    if (!canSelect) {
      roiDispatch({ type: 'UNSELECT_ROI', payload: id });
    }
  }, [id, canSelect, roiDispatch]);

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
          interactions={interactions}
          getStyle={getStyle}
          showRotationHandle={showRotationHandle}
          showGrid={showGrid}
          gridOptions={gridOptions}
        />
      </div>
      <LabelBox roi={roi} label={label} panZoom={totalPanzoom} />
    </>
  );
}

export const RoiBox = memo(RoiBoxInternal);
