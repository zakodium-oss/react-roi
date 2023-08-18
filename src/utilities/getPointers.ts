import { Point } from '../types';

import { sortPoints } from './sortPoints';

export function getPointers(startPoint: Point, endPoint: Point) {
  const { p0, p1 } = sortPoints(startPoint, endPoint);
  const { x, y } = p0;
  const width = p1.x - x;
  const height = p1.y - y;
  return [
    {
      position: 0,
      cursor: 'nwse-resize',
      cx: x,
      cy: y,
    },
    {
      position: 1,
      cursor: 'nesw-resize',
      cx: x,
      cy: y + height,
    },
    {
      position: 2,
      cursor: 'nwse-resize',
      cx: x + width,
      cy: y + height,
    },
    {
      position: 3,
      cursor: 'nesw-resize',
      cx: x + width,
      cy: y,
    },
    {
      position: 4,
      cursor: 'ns-resize',
      cx: x + width / 2,
      cy: y,
    },
    {
      position: 5,
      cursor: 'ns-resize',
      cx: x + width / 2,
      cy: y + height,
    },
    {
      position: 6,
      cursor: 'ew-resize',
      cx: x,
      cy: y + height / 2,
    },
    {
      position: 7,
      cursor: 'ew-resize',
      cx: x + width,
      cy: y + height / 2,
    },
  ];
}
