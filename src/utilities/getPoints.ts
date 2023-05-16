import { Rectangle } from '../types/Rectangle';

export function getPoints(rectangle: Rectangle, index: number) {
  const { height, width, origin } = rectangle;
  if (index === 0) {
    return {
      p0: { x: origin.column + width, y: origin.row + height },
      p1: { x: origin.column, y: origin.row },
    };
  } else if (index === 1) {
    return {
      p0: { x: origin.column + width, y: origin.row },
      p1: { x: origin.column, y: origin.row + height },
    };
  } else if (index === 2) {
    return {
      p0: { x: origin.column, y: origin.row },
      p1: { x: origin.column + width, y: origin.row + height },
    };
  } else if (index === 3) {
    return {
      p0: { x: origin.column, y: origin.row + height },
      p1: { x: origin.column + width, y: origin.row },
    };
  }
}
