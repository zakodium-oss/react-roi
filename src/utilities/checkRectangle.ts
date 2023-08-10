import { Point } from '../types/Point';
import { RoiContainerState } from '../types/RoiContainerState';

import { getRectangle } from './getRectangle';
import { getRectangleFromPoints } from './getRectangleFromPoints';

export function checkRectangle(
  draft: RoiContainerState,
  point: Point,
  options: { limit?: number } = {},
) {
  const { limit = 10 } = options;
  const { startPoint, ratio } = draft;
  const rectangle = getRectangleFromPoints(startPoint, point);
  const actualRectangle = getRectangle(rectangle, ratio);
  return actualRectangle.width >= limit && actualRectangle.height >= limit;
}
