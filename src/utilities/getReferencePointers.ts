import { CommittedRoi } from '../types/CommittedRoi';
import { Ratio } from '../types/Ratio';

import { getScaledRectangle } from './getScaledRectangle';

export function getReferencePointers(
  roi: CommittedRoi,
  ratio: Ratio,
  index: number,
): Pointers {
  const scaledRectangle = getScaledRectangle(roi, ratio);
  const { height, width, x, y } = scaledRectangle;
  switch (index) {
    case 0:
    case 4:
    case 6:
      return {
        p0: { x: x + width, y: y + height },
        p1: { x, y },
      };

    case 1:
      return {
        p0: { x: x + width, y },
        p1: { x, y: y + height },
      };

    case 2:
    case 5:
    case 7:
      return {
        p0: { x, y },
        p1: { x: x + width, y: y + height },
      };

    case 3:
      return {
        p0: { x, y: y + height },
        p1: { x: x + width, y },
      };
    default: {
      return { p0: { x: 0, y: 0 }, p1: { x: 0, y: 0 } };
    }
  }
}

interface Pointers {
  p0: { x: number; y: number };
  p1: { x: number; y: number };
}
