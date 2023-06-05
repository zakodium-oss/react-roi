import { Point } from '../types/Point';

export function getRectangleFromPoints(p0: Point, p1: Point) {
  const width = p1.x - p0.x;
  const height = p1.y - p0.y;
  return {
    origin: { column: p0.x, row: p0.y },
    width,
    height,
  };
}
