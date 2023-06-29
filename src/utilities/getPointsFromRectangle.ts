import { Rectangle } from '../types/Rectangle';

export function getPointsFromRectangle(rectangle: Rectangle) {
  const { height, width, origin } = rectangle;
  return {
    p0: { x: origin.column, y: origin.row },
    p1: { x: origin.column + width, y: origin.row + height },
  };
}
