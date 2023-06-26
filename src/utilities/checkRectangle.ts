import { DynamicStateType } from '../types/DynamicStateType';
import { Point } from '../types/Point';
import { getRectangle } from './getRectangle';
import { getRectangleFromPoints } from './getRectangleFromPoints';

export function checkRectangle(
  draft: DynamicStateType,
  point: Point,
  options: { limit?: number } = {}
) {
  const { limit = 10 } = options;
  const { startPoint, ratio } = draft;
  const rectangle = getRectangleFromPoints(startPoint as Point, point);
  const actualRectangle = getRectangle(rectangle, ratio);
  return actualRectangle.width > limit && actualRectangle.height > limit;
}
