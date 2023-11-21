import { Roi } from '../../types/Roi';

export interface CornerSizeOptions {
  handlerSize: number;
  handlerBorderWidth: number;
}

export function getBaseSize(roi: Roi, scale: number): CornerSizeOptions {
  const minLength = Math.min(roi.width, roi.height);
  const size = minLength * scale;
  if (size <= 21) {
    // 3 * 7
    return {
      handlerSize: size / 3,
      handlerBorderWidth: 2,
    };
  } else if (size < 50) {
    // return small handler
    return {
      handlerSize: 5,
      handlerBorderWidth: 3,
    };
  }
  // Regular sizes
  return {
    handlerSize: 10,
    handlerBorderWidth: 4,
  };
}
