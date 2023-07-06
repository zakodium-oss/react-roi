import { RoiStateType } from '../types/RoiStateType';

import { getRectangle } from './getRectangle';
import { getRectangleFromPoints } from './getRectangleFromPoints';

export function updateObject(draft: RoiStateType) {
  const { startPoint, endPoint, ratio, rois, roiID } = draft;
  const object = rois.find((obj) => obj.id === roiID);
  if (object) {
    object.rectangle = getRectangle(
      getRectangleFromPoints(startPoint, endPoint),
      ratio,
    );
    return object.id;
  }
}
