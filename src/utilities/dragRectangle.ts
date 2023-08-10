import { Point } from '../types/Point';
import { RoiContainerState } from '../types/RoiContainerState';

import { getScaledRectangle } from './getScaledRectangle';

/**
 * This function returns the new coordinates of the rectangle on the SVG
 * @param rectangle the rectangle to drag
 * @param origin the event with the new coordinates
 * @param delta This parameter contains information about the offset from the point where the click was made to the top-left corner of the rectangle
 * @returns
 */

export function dragRectangle(
  draft: RoiContainerState,
  origin: Point,
): {
  startPoint: Point;
  endPoint: Point;
} {
  const {
    delta,
    ratio,
    selectedRoi,
    startPoint,
    endPoint,
    width,
    height,
    rois,
  } = draft;
  const currentRoi = rois.find((roi) => roi.id === selectedRoi);
  if (!delta || !selectedRoi) {
    return { startPoint, endPoint };
  }
  const scaledRectangle = getScaledRectangle(currentRoi, ratio);
  const minX = Math.max(origin.x - delta.dx, 0);
  const minY = Math.max(origin.y - delta.dy, 0);
  const maxX = Math.min(minX, width - scaledRectangle.width);
  const maxY = Math.min(minY, height - scaledRectangle.height);
  const start = {
    x: maxX,
    y: maxY,
  };
  return {
    startPoint: start,
    endPoint: {
      x: start.x + scaledRectangle.width,
      y: start.y + scaledRectangle.height,
    },
  };
}
