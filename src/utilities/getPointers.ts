import { Rectangle } from '../types/Rectangle';

export function getPointers(rectangle: Rectangle) {
  const { height = 0, width = 0, x, y } = rectangle;
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
