import { Point } from '../types/Point';
import { Rectangle } from '../types/Rectangle';

export function getRectangle(
  p0: Point,
  p1: Point,
  delta: { width: number; height: number },
  rect: {
    offsetLeft: number;
    offsetTop: number;
  }
): Rectangle {
  const result: Rectangle = {
    origin: { row: 0, column: 0 },
    width: 0,
    height: 0,
  };

  if (rect) {
    if (p0.x < p1.x) {
      result.origin.column = Math.floor(
        (p0.x - rect.offsetLeft) * delta.height
      );
      result.width = Math.floor((p1.x - p0.x) * delta.width);
    } else {
      result.origin.column = Math.floor(
        (p1.x - rect.offsetLeft) * delta.height
      );
      result.width = Math.floor((p0.x - p1.x) * delta.width);
    }

    if (p0.y < p1.y) {
      result.origin.row = Math.floor((p0.y - rect.offsetTop) * delta.width);
      result.height = Math.floor((p1.y - p0.y) * delta.height);
    } else {
      result.origin.row = Math.floor((p1.y - rect.offsetTop) * delta.width);
      result.height = Math.floor((p0.y - p1.y) * delta.height);
    }
  }

  return result;
}
