import { CommittedRoi } from '../types/CommittedRoi';
import { Ratio } from '../types/Ratio';
import { Rectangle } from '../types/Rectangle';

/**
 * This function returns a rectangle that is scaled to the size of the image, based on a rectangle that is scaled to the size of the SVG
 * @param rectangle The rectangle scaled to match the size of the SVG.
 * @param ratio This parameter contains information about the relationship between the width and height of the image and the SVG in pixels
 * @param rect The object contains offset information regarding the top and left positions of the SVG relative to the entire window
 * @returns
 */

export function getRectangle(rectangle: Rectangle, ratio: Ratio): Partial<CommittedRoi> {
  const result: Partial<CommittedRoi> = { x: 0, y: 0, width: 0, height: 0 };

  const p0 = {
    x: rectangle.x,
    y: rectangle.y,
  };

  const p1 = {
    x: rectangle.x + rectangle.width,
    y: rectangle.y + rectangle.height,
  };

  if (p0.x < p1.x) {
    result.x = Math.ceil(p0.x * ratio.x);
    result.width = Math.ceil((p1.x - p0.x) * ratio.x);
  } else {
    result.x = Math.ceil(p1.x * ratio.x);
    result.width = Math.ceil((p0.x - p1.x) * ratio.x);
  }

  if (p0.y < p1.y) {
    result.y = Math.ceil(p0.y * ratio.y);
    result.height = Math.ceil(p1.y - p0.y) * ratio.y;
  } else {
    result.y = Math.ceil(p1.y * ratio.y);
    result.height = Math.ceil((p0.y - p1.y) * ratio.y);
  }
  return result;
}
