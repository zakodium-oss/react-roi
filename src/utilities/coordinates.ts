import { Box, CommittedBox, Point } from '..';

import { rotatePoint } from './rotate';

export type XCornerPosition = 'left' | 'right' | 'middle';
export type YCornerPosition = 'top' | 'bottom' | 'middle';

export function normalizeBox<T extends Box>(box: T): CommittedBox {
  const { angle } = box;
  const x1 = Math.floor(box.x1);
  const y1 = Math.floor(box.y1);
  const x2 = Math.floor(box.x2);
  const y2 = Math.floor(box.y2);
  const width = x2 - x1;
  const height = y2 - y1;

  // Origin goes from center to top left
  // Apply rotation on top left point to get the offset
  const topLeftPoint: Point = { x: x1, y: y1 };
  const originPoint: Point = { x: x1 + width / 2, y: y1 + height / 2 };
  const newTopLeft = rotatePoint(topLeftPoint, originPoint, angle);
  const newX = x1 + newTopLeft.x - topLeftPoint.x;
  const newY = y1 + newTopLeft.y - topLeftPoint.y;
  return {
    x: newX,
    y: newY,
    width,
    height,
    angle,
  };
}

export function denormalizeBox<T extends CommittedBox>(position: T): Box {
  const { x, y, width, height, angle } = position;
  // Origin goes from top left to center
  // Apply rotation on center to get the offset
  const centerPoint: Point = { x: x + width / 2, y: y + height / 2 };
  const originPoint: Point = { x, y };
  const newCenter = rotatePoint(centerPoint, originPoint, angle);
  const newX = x + newCenter.x - centerPoint.x;
  const newY = y + newCenter.y - centerPoint.y;
  return {
    x1: newX,
    y1: newY,
    x2: newX + width,
    y2: newY + height,
    angle,
  };
}
