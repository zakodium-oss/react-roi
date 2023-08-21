import { Box, Point, Size } from '../types';

export type XAxisCorner = 'left' | 'right' | 'middle';
export type YAxisCorner = 'top' | 'bottom' | 'middle';

export function normalizeClientPoint(point: Point, ref: DOMRect) {
  return {
    x: point.x - ref.x,
    y: point.y - ref.y,
  };
}

export function normalizeValue(value: number, max: number) {
  return value / max;
}

export function denormalizeValue(value: number, max: number) {
  return value * max;
}

export function normalizeBox<T extends Box>(position: T, size: Size) {
  const { x, y, width, height } = position;
  return {
    x: normalizeValue(x, size.width),
    y: normalizeValue(y, size.height),
    width: normalizeValue(width, size.width),
    height: normalizeValue(height, size.height),
  };
}

export function denormalizeBox<T extends Box>(position: T, size: Size) {
  const { x, y, width, height } = position;
  return {
    x: denormalizeValue(x, size.width),
    y: denormalizeValue(y, size.height),
    width: denormalizeValue(width, size.width),
    height: denormalizeValue(height, size.height),
  };
}
