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
    if (rectangle.origin.column < rectangle.origin.column + rectangle.width) {
      result.origin.column = Math.floor(
        rectangle.origin.column / delta.height + rect.offsetLeft
      );
      result.width = Math.floor(rectangle.width / delta.width);
    } else {
      result.origin.column = Math.floor(
        (rectangle.origin.column + rectangle.width) / delta.height +
          rect.offsetLeft
      );
      result.width = Math.floor(rectangle.width / delta.width);
    }
    if (rectangle.origin.row < rectangle.origin.row + rectangle.height) {
      result.origin.row = Math.floor(
        rectangle.origin.row / delta.width + rect.offsetTop
      );
      result.height = Math.floor(rectangle.height / delta.height);
    } else {
      result.origin.row = Math.floor(
        (rectangle.origin.row + rectangle.height) / delta.width + rect.offsetTop
      );
      result.height = Math.floor(rectangle.height / delta.height);
    }
  }
  return result;
}
