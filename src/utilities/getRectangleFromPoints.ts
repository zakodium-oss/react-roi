import { Point } from '../types/Point';

export function getRectangleFromPoints(p0: Point, p1: Point, index?: number) {
  const width = p1.x - p0.x;
  const height = p1.y - p0.y;
  switch (index) {
    case 4:
    case 5:
      return {
        origin: { column: p0.x, row: p0.y },
        width: width * 2,
        height,
      };

    case 6:
    case 7:
      return {
        origin: { column: p0.x, row: p0.y },
        width,
        height: height * 2,
      };
    default:
      return {
        origin: { column: p0.x, row: p0.y },
        width,
        height,
      };
  }
}
