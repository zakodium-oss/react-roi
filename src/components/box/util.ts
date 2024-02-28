import { Roi } from '../../types/Roi';
import { CommittedBox } from '../../types/utils';

export function roiToFloorBox(roi: Roi): CommittedBox {
  const x1 = Math.floor(roi.x1);
  const y1 = Math.floor(roi.y1);
  const x2 = Math.floor(roi.x2);
  const y2 = Math.floor(roi.y2);
  return {
    x: x1,
    width: x2 - x1,
    y: y1,
    height: y2 - y1,
    angle: roi.angle,
  };
}
