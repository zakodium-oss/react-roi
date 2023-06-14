import { Delta } from '../types/Delta';
import { Rectangle } from '../types/Rectangle';

/**
 * This function returns the new coordinates of the rectangle on the SVG
 * @param rectangle the rectangle to drag
 * @param origin the event with the new coordinates
 * @param delta This parameter contains information about the offset from the point where the click was made to the top-left corner of the rectangle
 * @returns
 */

export function dragRectangle(
  rectangle: Rectangle,
  origin: { x: number; y: number },
  delta: Delta
) {
  const startPoint = {
    x: origin.x - delta.dx,
    y: origin.y - delta.dy,
  };
  return {
    startPoint,
    endPoint: {
      x: startPoint.x + rectangle.width,
      y: startPoint.y + rectangle.height,
    },
  };
}
