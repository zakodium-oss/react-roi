import { RoiStateType } from '../types/RoiStateType';

import { getRectangle } from './getRectangle';
import { getRectangleFromPoints } from './getRectangleFromPoints';

export function addObject(draft: RoiStateType, id: string) {
  const { startPoint, endPoint, ratio } = draft;
  draft.rois.push({
    id,
    rectangle: getRectangle(
      getRectangleFromPoints(startPoint, endPoint),
      ratio,
    ),
  });
  draft.roiID = id;
}
