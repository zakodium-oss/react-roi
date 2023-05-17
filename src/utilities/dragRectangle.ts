/**
 * This function returns the new coordinates of the rectangle on the SVG
 * @param object the object to drag
 * @param event the event with the new coordinates
 * @param rect The object contains offset information regarding the top and left positions of the SVG relative to the entire window
 * @param delta This parameter contains information about the relationship between the width and height of the image and the SVG in pixels
 * @returns
 */

import { Delta } from '../context/EventReducer';
import { Rectangle } from '../types/Rectangle';

export function dragRectangle(
  rectangle: Rectangle,
  event: React.MouseEvent,
  delta: Delta
) {
  const startPoint = {
    x: event.clientX - delta.dx,
    y: event.clientY - delta.dy,
  };
  return {
    startPoint,
    endPoint: {
      x: startPoint.x + rectangle.width,
      y: startPoint.y + rectangle.height,
    },
  };
}
