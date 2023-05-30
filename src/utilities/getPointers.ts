import { Rectangle } from '../types/Rectangle';

export function getPointers(rectangle: Rectangle) {
  const { height = 0, width = 0, origin = { column: 0, row: 0 } } = rectangle;
  return [
    {
      position: 0,
      cursor: 'nwse-resize',
      cx: origin.column,
      cy: origin.row,
    },
    {
      position: 1,
      cursor: 'nesw-resize',
      cx: origin.column,
      cy: origin.row + height,
    },
    {
      position: 2,
      cursor: 'nwse-resize',
      cx: origin.column + width,
      cy: origin.row + height,
    },
    {
      position: 3,
      cursor: 'nesw-resize',
      cx: origin.column + width,
      cy: origin.row,
    },
    {
      position: 4,
      cursor: 'ns-resize',
      cx: origin.column + width / 2,
      cy: origin.row,
    },
    {
      position: 5,
      cursor: 'ns-resize',
      cx: origin.column + width / 2,
      cy: origin.row + height,
    },
    {
      position: 6,
      cursor: 'ew-resize',
      cx: origin.column,
      cy: origin.row + height / 2,
    },
    {
      position: 7,
      cursor: 'ew-resize',
      cx: origin.column + width,
      cy: origin.row + height / 2,
    },
  ];
}
