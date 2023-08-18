import { ReactRoiState } from '../context/roiReducer';

import { getRectangle } from './getRectangle';
import { getRectangleFromPoints } from './getRectangleFromPoints';

export function updateObject(draft: ReactRoiState) {
  const { ratio, selectedRoi, rois, commitedRois } = draft;
  const index = rois.findIndex((roi) => roi.id === selectedRoi);
  const roi = rois[index];
  const commitedRoi = commitedRois[index];
  const { startPoint, endPoint } = roi.actionData;
  if (selectedRoi) {
    const rectangle = getRectangle(
      getRectangleFromPoints(startPoint, endPoint),
      ratio,
    );
    commitedRoi.x = Math.round(rectangle.x);
    commitedRoi.y = Math.round(rectangle.y);
    commitedRoi.width = Math.round(rectangle.width);
    commitedRoi.height = Math.round(rectangle.height);
  }
  return roi.id;
}
