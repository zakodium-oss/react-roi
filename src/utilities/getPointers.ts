import { Rectangle } from '../types/Rectangle';

export function getPointers(rectangle: Rectangle) {
  const { height = 0, width = 0, origin = { column: 0, row: 0 } } = rectangle;
  return [
    {
      position: 0,
      cx: origin.column,
      cy: origin.row,
    },
    {
      position: 1,
      cx: origin.column,
      cy: origin.row + height,
    },
    {
      position: 2,
      cx: origin.column + width,
      cy: origin.row + height,
    },
    {
      position: 3,
      cx: origin.column + width,
      cy: origin.row,
    },
  ];
}
