import { Rectangle } from '../types/Rectangle';
import { getScaledRectangle } from './getScaledRectangle';

export function getReferencePointers(
  rectangle: Rectangle,
  delta: { width: number; height: number },
  index: number,
  rect: {
    offsetLeft: number;
    offsetTop: number;
  }
) {
  const smallRectangle = getScaledRectangle(rectangle, delta, rect);
  const { height, width, origin } = smallRectangle;
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
      p0: {
        x: Math.floor(origin.column),
        y: Math.floor(origin.row),
      },
      p1: {
        x: Math.floor(origin.column + width),
        y: Math.floor(origin.row + height),
      },
    };
  } else if (index === 3) {
    return {
      p0: { x: origin.column, y: origin.row + height },
      p1: { x: origin.column + width, y: origin.row },
    };
  }
}
