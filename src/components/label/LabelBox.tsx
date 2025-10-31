import type { ReactNode } from 'react';

import type { Roi } from '../../types/Roi.js';
import type { PanZoom } from '../../types/utils.js';
import { applyTransformToBox } from '../../utilities/box.js';
import { getMBRBoundaries } from '../../utilities/rotate.js';

import { LabelContainer } from './LabelContainer.js';

export function LabelBox(props: {
  roi: Roi;
  label: ReactNode;
  panZoom: PanZoom;
}) {
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
      {typeof label === 'string' ? (
        <LabelContainer>{label}</LabelContainer>
      ) : (
        label
      )}
    </div>
  );
}
