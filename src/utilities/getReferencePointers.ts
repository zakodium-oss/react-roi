import { Delta } from '../types/Delta';
import { Offset } from '../types/Offset';
import { Ratio } from '../types/Ratio';
import { Rectangle } from '../types/Rectangle';
import { getScaledRectangle } from './getScaledRectangle';

export function getReferencePointers(
  rectangle: Rectangle,
  ratio: Ratio,
  index: number,
  offset: Offset
) {
  const scaledRectangle = getScaledRectangle(rectangle, ratio, offset);
  const { height, width, origin } = scaledRectangle;
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
