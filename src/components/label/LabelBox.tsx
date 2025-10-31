import { ReactNode } from 'react';

import { Roi } from '../../types/Roi';
import { PanZoom } from '../../types/utils';
import { applyTransformToBox } from '../../utilities/box';
import { getMBRBoundaries } from '../../utilities/rotate';

import { LabelContainer } from './LabelContainer';

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
