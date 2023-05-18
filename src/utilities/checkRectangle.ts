import { Delta } from '../types/Delta';
import { Point } from '../types/Point';
import { getRectangle } from './getRectangle';
import { getRectangleFromPoints } from './getRectangleFromPoints';

export function checkRectangle(
  startPoint: Point,
  endPoint: Point,
  delta: Delta,
  rect: {
    offsetLeft: number;
    offsetTop: number;
  },
  options: { limit?: number } = {}
) {
  const { limit = 10 } = options;
  const rectangle = getRectangleFromPoints(startPoint, endPoint);
  const actualRectangle = getRectangle(rectangle, delta, rect);
  return actualRectangle.width > limit && actualRectangle.height > limit;
}
