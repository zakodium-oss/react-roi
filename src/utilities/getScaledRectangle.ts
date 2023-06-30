import { Ratio } from '../types/Ratio';
import { Rectangle } from '../types/Rectangle';

/**
 * This function returns a rectangle that is scaled to the size of the SVG, based on a rectangle that is scaled to the size of the image.
 * @param rectangle The rectangle scaled to match the size of the image.
 * @param ratio This parameter contains information about the ratio of the width and height of the image related to the window, measured in pixels
 * @param offset The object contains offset information for the SVG relative to the entire window
 * @returns
 */

export function getScaledRectangle(
  rectangle: Rectangle,
  ratio: Ratio,
): Rectangle {
  const result: Rectangle = {
    origin: { row: 0, column: 0 },
    width: 0,
    height: 0,
  };

  if (rectangle.origin.column < rectangle.origin.column + rectangle.width) {
    result.origin.column = rectangle.origin.column / ratio.x;
    result.width = rectangle.width / ratio.x;
  } else {
    result.origin.column =
      (rectangle.origin.column + rectangle.width) / ratio.x;
    result.width = rectangle.width / ratio.x;
  }
  if (rectangle.origin.row < rectangle.origin.row + rectangle.height) {
    result.origin.row = rectangle.origin.row / ratio.y;
    result.height = rectangle.height / ratio.y;
  } else {
    result.origin.row = (rectangle.origin.row + rectangle.height) / ratio.y;
    result.height = rectangle.height / ratio.y;
  }
  return result;
}
