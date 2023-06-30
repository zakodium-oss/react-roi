import { Point } from '../types/Point';
import { RoiStateType } from '../types/RoiStateType';

import { getRectangle } from './getRectangle';
import { getRectangleFromPoints } from './getRectangleFromPoints';

export function checkRectangle(
  draft: RoiStateType,
  point: Point,
  options: { limit?: number } = {},
) {
  const { limit = 10 } = options;
  const { startPoint, ratio } = draft;
  const rectangle = getRectangleFromPoints(startPoint as Point, point);
  const actualRectangle = getRectangle(rectangle, ratio);
  return actualRectangle.width > limit && actualRectangle.height > limit;
}
