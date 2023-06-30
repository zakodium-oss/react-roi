import { Point } from '../types/Point';
import { RoiStateType } from '../types/RoiStateType';

import { getRectangle } from './getRectangle';
import { getRectangleFromPoints } from './getRectangleFromPoints';

export function addObject(draft: RoiStateType, id: string) {
  const { startPoint, endPoint, ratio } = draft;
  draft.rois.push({
    id,
    rectangle: getRectangle(
      getRectangleFromPoints(startPoint as Point, endPoint as Point),
      ratio,
    ),
  });
  draft.roiID = id;
}
