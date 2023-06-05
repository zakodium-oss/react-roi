import { Offset } from '../types/Offset';
import { Ratio } from '../types/Ratio';
import { Rectangle } from '../types/Rectangle';

/**
 * This function returns a rectangle that is scaled to the size of the image, based on a rectangle that is scaled to the size of the SVG
 * @param rectangle The rectangle scaled to match the size of the SVG.
 * @param ratio This parameter contains information about the relationship between the width and height of the image and the SVG in pixels
 * @param rect The object contains offset information regarding the top and left positions of the SVG relative to the entire window
 * @returns
 */

export function getRectangle(
  rectangle: Rectangle,
  ratio: Ratio,
  offset: Offset
): Rectangle {
  const result: Rectangle = {
    origin: { row: 0, column: 0 },
    width: 0,
    height: 0,
  };

  const p0 = {
    x: rectangle.origin.column,
    y: rectangle.origin.row,
  };

  const p1 = {
    x: rectangle.origin.column + rectangle.width,
    y: rectangle.origin.row + rectangle.height,
  };

  if (offset) {
    if (p0.x < p1.x) {
      result.origin.column = Math.ceil(p0.x - offset.left);
      result.width = Math.ceil((p1.x - p0.x) * ratio.x);
    } else {
      result.origin.column = Math.ceil((p1.x - offset.left) * ratio.y);
      result.width = Math.ceil((p0.x - p1.x) * ratio.x);
    }

    if (p0.y < p1.y) {
      result.origin.row = Math.ceil((p0.y - offset.top) * ratio.x);
      result.height = (p1.y - p0.y) * ratio.y;
    } else {
      result.origin.row = Math.ceil((p1.y - offset.top) * ratio.x);
      result.height = Math.ceil((p0.y - p1.y) * ratio.y);
    }
  }
  return result;
}
