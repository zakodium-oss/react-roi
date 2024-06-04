import { JSX, memo, ReactNode, useEffect } from 'react';

import {
  GetOverlayOpacity,
  GetReadOnlyCallback,
  GetStyleCallback,
  PanZoom,
  RenderLabelCallback,
} from '../..';
import { usePanZoom } from '../../hooks/usePanZoom';
import { useRoiDispatch } from '../../hooks/useRoiDispatch';
import { Roi } from '../../types/Roi';
import { applyTransformToBox } from '../../utilities/box';
import { computeTotalPanZoom } from '../../utilities/panZoom';
import { getMBRBoundaries } from '../../utilities/rotate';

import { BoxSvg } from './BoxSvg';

interface RoiBoxProps {
  roi: Roi;
  isSelected: boolean;
  getStyle: GetStyleCallback;
  getReadOnly: GetReadOnlyCallback;
  renderLabel: RenderLabelCallback;
  allowRotate: boolean;
  getOverlayOpacity: GetOverlayOpacity;
  showGrid: boolean;
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
    showGrid,
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

  const box = applyTransformToBox(totalPanzoom, roi.box);
  const label = renderLabel(roi, roiAdditionalState);
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
          allowRotate={allowRotate}
          showGrid={showGrid}
        />
      </div>
      <LabelBox roi={roi} label={label} panZoom={totalPanzoom} />
    </>
  );
}

function LabelBox(props: { roi: Roi; label: ReactNode; panZoom: PanZoom }) {
  const { roi, label, panZoom } = props;
  if (!label) return null;
  const mbr = getMBRBoundaries(roi.box);
  const box = applyTransformToBox(panZoom, {
    x: mbr.minX,
    y: mbr.minY,
    width: mbr.maxX - mbr.minX,
    height: mbr.maxY - mbr.minY,
  });
  return (
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
      {label}
    </div>
  );
}

export const RoiBox = memo(RoiBoxInternal);
