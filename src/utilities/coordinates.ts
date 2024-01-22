import { Box, CommittedBox } from '..';

export type XCornerPosition = 'left' | 'right' | 'middle';
export type YCornerPosition = 'top' | 'bottom' | 'middle';

export function normalizeBox<T extends Box>(position: T): CommittedBox {
  const x1 = Math.floor(position.x1);
  const y1 = Math.floor(position.y1);
  const x2 = Math.floor(position.x2);
  const y2 = Math.floor(position.y2);
  return {
    x: x1,
    y: y1,
    width: x2 - x1,
    height: y2 - y1,
  };
}

export function denormalizeBox<T extends CommittedBox>(position: T): Box {
  const { x, y, width, height } = position;
  return {
    x1: x,
    y1: y,
    x2: x + width,
    y2: y + height,
  };
}
