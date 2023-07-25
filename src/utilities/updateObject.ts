import { RoiStateType } from '../types/RoiStateType';

import { getRectangle } from './getRectangle';
import { getRectangleFromPoints } from './getRectangleFromPoints';

export function updateObject(draft: RoiStateType) {
  const { startPoint, endPoint, ratio, selectedRoi, rois } = draft;
  const index = rois.findIndex((roi) => roi.id === selectedRoi);
  if (selectedRoi) {
    const rectangle = getRectangle(
      getRectangleFromPoints(startPoint, endPoint),
      ratio,
    );
    rois[index].x = rectangle.x;
    rois[index].y = rectangle.y;
    rois[index].width = rectangle.width;
    rois[index].height = rectangle.height;
  }
  return rois[index].id;
}
