import { Box, CommittedBox, Size } from '..';

export type XCornerPosition = 'left' | 'right' | 'middle';
export type YCornerPosition = 'top' | 'bottom' | 'middle';

export function normalizeValue(value: number, max: number) {
  return value / max;
}

export function denormalizeValue(value: number, max: number) {
  return value * max;
}

export function normalizeBox<T extends Box>(
  position: T,
  size: Size,
): CommittedBox {
  const x1 = Math.floor(position.x1);
  const y1 = Math.floor(position.y1);
  const x2 = Math.floor(position.x2);
  const y2 = Math.floor(position.y2);
  return {
    x: normalizeValue(x1, size.width),
    y: normalizeValue(y1, size.height),
    width: normalizeValue(x2 - x1, size.width),
    height: normalizeValue(y2 - y1, size.height),
  };
}

export function denormalizeBox<T extends CommittedBox>(
  position: T,
  size: Size,
): Box {
  const { x, y, width, height } = position;
  return {
    x1: denormalizeValue(x, size.width),
    y1: denormalizeValue(y, size.height),
    x2: denormalizeValue(x + width, size.width),
    y2: denormalizeValue(y + height, size.height),
  };
}
