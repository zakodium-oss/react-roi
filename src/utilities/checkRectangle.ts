import { Rectangle } from '../types';

export function checkRectangle(
  rectangle: Rectangle,
  options: { limit?: number } = {},
) {
  const { limit = 10 } = options;
  if (rectangle === undefined) return false;
  return rectangle.width >= limit && rectangle.height >= limit;
}
