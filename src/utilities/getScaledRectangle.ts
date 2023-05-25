import { Offset } from '../types/Offset';
import { Ratio } from '../types/Ratio';
import { Rectangle } from '../types/Rectangle';

/**
 * This function returns a rectangle that is scaled to the size of the SVG, based on a rectangle that is scaled to the size of the image.
 * @param rectangle The rectangle scaled to match the size of the image.
 * @param delta This parameter contains information about the relationship between the width and height of the image and the SVG in pixels
 * @param rect The object contains offset information regarding the top and left positions of the SVG relative to the entire window
 * @returns
 */

export function getScaledRectangle(
  rectangle: Rectangle,
  ratio: Ratio,
  offset: Offset
): Rectangle {
  const result: Rectangle = {
    origin: { row: 0, column: 0 },
    width: 0,
    height: 0,
  };

  if (offset) {
    if (rectangle.origin.column < rectangle.origin.column + rectangle.width) {
      result.origin.column = Math.floor(
        rectangle.origin.column / ratio.y + offset.left
      );
      result.width = Math.floor(rectangle.width / ratio.x);
    } else {
      result.origin.column = Math.floor(
        (rectangle.origin.column + rectangle.width) / ratio.y + offset.left
      );
      result.width = Math.floor(rectangle.width / ratio.x);
    }
    if (rectangle.origin.row < rectangle.origin.row + rectangle.height) {
      result.origin.row = Math.floor(
        rectangle.origin.row / ratio.x + offset.top
      );
      result.height = Math.floor(rectangle.height / ratio.y);
    } else {
      result.origin.row = Math.floor(
        (rectangle.origin.row + rectangle.height) / ratio.x + offset.top
      );
      result.height = Math.floor(rectangle.height / ratio.y);
    }
  }
  return result;
}
