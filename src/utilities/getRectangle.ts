import { Delta } from '../types/Delta';
import { Rectangle } from '../types/Rectangle';

/**
 * This function returns a rectangle that is scaled to the size of the image, based on a rectangle that is scaled to the size of the SVG
 * @param rectangle The rectangle scaled to match the size of the SVG.
 * @param delta This parameter contains information about the relationship between the width and height of the image and the SVG in pixels
 * @param rect The object contains offset information regarding the top and left positions of the SVG relative to the entire window
 * @returns
 */

export function getRectangle(
  rectangle: Rectangle,
  delta: Delta,
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

  const p0 = {
    x: rectangle.origin.column,
    y: rectangle.origin.row,
  };

  const p1 = {
    x: rectangle.origin.column + rectangle.width,
    y: rectangle.origin.row + rectangle.height,
  };

  if (rect) {
    if (p0.x < p1.x) {
      result.origin.column = Math.floor((p0.x - rect.offsetLeft) * delta.dy);
      result.width = Math.floor((p1.x - p0.x) * delta.dx);
    } else {
      result.origin.column = Math.floor((p1.x - rect.offsetLeft) * delta.dy);
      result.width = Math.floor((p0.x - p1.x) * delta.dx);
    }

    if (p0.y < p1.y) {
      result.origin.row = Math.floor((p0.y - rect.offsetTop) * delta.dx);
      result.height = Math.floor((p1.y - p0.y) * delta.dy);
    } else {
      result.origin.row = Math.floor((p1.y - rect.offsetTop) * delta.dx);
      result.height = Math.floor((p0.y - p1.y) * delta.dy);
    }
  }
  return result;
}
