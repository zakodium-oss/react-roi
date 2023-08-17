import { CommittedRoi } from '../types/CommittedRoi';
import { Ratio } from '../types/Ratio';
import { Rectangle } from '../types/Rectangle';

/**
 * This function returns a rectangle that is scaled to the size of the SVG, based on a rectangle that is scaled to the size of the image.
 * @param rectangle The rectangle scaled to match the size of the image.
 * @param ratio This parameter contains information about the ratio of the width and height of the image related to the window, measured in pixels
 * @param offset The object contains offset information for the SVG relative to the entire window
 * @returns
 */

export function getScaledRectangle(roi: CommittedRoi, ratio: Ratio): Rectangle {
  const result: Rectangle = { x: 0, y: 0, width: 0, height: 0 };
  const { x, y, width, height } = roi;
  if (x < x + width) {
    result.x = x / ratio.x;
    result.width = width / ratio.x;
  } else {
    result.x = (x + width) / ratio.x;
    result.width = width / ratio.x;
  }
  if (y < y + height) {
    result.y = y / ratio.y;
    result.height = height / ratio.y;
  } else {
    result.y = (y + height) / ratio.y;
    result.height = height / ratio.y;
  }
  return result;
}
