import { Point } from '../types/Point';

export function getRectangleFromPoints(p0: Point, p1: Point) {
  return {
    origin: { column: p0.x, row: p0.y },
    width: p1.x - p0.x,
    height: p1.y - p0.y,
  };
}
