import { Point } from '../types';

export function sortPoints(startPoint: Point, endPoint: Point) {
  const result = { p0: { x: 0, y: 0 }, p1: { x: 0, y: 0 } };
  if (startPoint.x < endPoint.x) {
    result.p0.x = startPoint.x;
    result.p1.x = endPoint.x;
  } else {
    result.p0.x = endPoint.x;
    result.p1.x = startPoint.x;
  }

  if (startPoint.y < endPoint.y) {
    result.p0.y = startPoint.y;
    result.p1.y = endPoint.y;
  } else {
    result.p0.y = endPoint.y;
    result.p1.y = startPoint.y;
  }
  return result;
}
