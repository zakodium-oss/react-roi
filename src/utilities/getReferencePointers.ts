import { Ratio } from '../types/Ratio';
import { Rectangle } from '../types/Rectangle';

import { getScaledRectangle } from './getScaledRectangle';

export function getReferencePointers(
  rectangle: Rectangle,
  ratio: Ratio,
  index: number,
): Pointers {
  const scaledRectangle = getScaledRectangle(rectangle, ratio);
  const { height, width, origin } = scaledRectangle;
  switch (index) {
    case 0:
    case 4:
    case 6:
      return {
        p0: { x: origin.column + width, y: origin.row + height },
        p1: { x: origin.column, y: origin.row },
      };

    case 1:
      return {
        p0: { x: origin.column + width, y: origin.row },
        p1: { x: origin.column, y: origin.row + height },
      };

    case 2:
    case 5:
    case 7:
      return {
        p0: { x: origin.column, y: origin.row },
        p1: { x: origin.column + width, y: origin.row + height },
      };

    case 3:
      return {
        p0: { x: origin.column, y: origin.row + height },
        p1: { x: origin.column + width, y: origin.row },
      };
    default: {
      return { p0: { x: 0, y: 0 }, p1: { x: 0, y: 0 } };
    }
  }
}

type Pointers = { p0: { x: number; y: number }; p1: { x: number; y: number } };
