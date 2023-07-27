import { Point } from '../types/Point';
import { Rectangle } from '../types/Rectangle';

export function getRectangleFromPoints(p0: Point, p1: Point): Rectangle {
  const result: Rectangle = { x: 0, y: 0, width: 0, height: 0 };
  if (p0.x < p1.x) {
    result.x = p0.x;
    result.width = p1.x - p0.x;
  } else {
    result.x = p1.x;
    result.width = p0.x - p1.x;
  }

  if (p0.y < p1.y) {
    result.y = p0.y;
    result.height = p1.y - p0.y;
  } else {
    result.y = p1.y;
    result.height = p0.y - p1.y;
  }
  return result;
}
