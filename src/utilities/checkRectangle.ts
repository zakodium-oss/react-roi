import { Point } from '../types/Point';
import { Ratio } from '../types/Ratio';
import { getRectangle } from './getRectangle';
import { getRectangleFromPoints } from './getRectangleFromPoints';

export function checkRectangle(
  startPoint: Point,
  endPoint: Point,
  ratio: Ratio,
  options: { limit?: number } = {}
) {
  const { limit = 10 } = options;
  const rectangle = getRectangleFromPoints(startPoint, endPoint);
  const actualRectangle = getRectangle(rectangle, ratio);
  return actualRectangle.width > limit && actualRectangle.height > limit;
}
