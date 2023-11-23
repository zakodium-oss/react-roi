import { Roi } from '../../types/Roi';

export interface CornerSizeOptions {
  handlerSize: number;
  handlerBorderWidth: number;
}

export function getBaseSize(roi: Roi): CornerSizeOptions {
  const minLength = Math.min(roi.width, roi.height);
  if (minLength <= 21) {
    return {
      handlerSize: Math.max(3, Math.floor((minLength - 4) / 3)),
      handlerBorderWidth: 1,
    };
  } else if (minLength < 50) {
    // return small handler
    return {
      handlerSize: 5,
      handlerBorderWidth: 2,
    };
  }
  // Regular sizes
  return {
    handlerSize: 10,
    handlerBorderWidth: 3,
  };
}

export function getScaledSizes(roi: Roi, scale: number): CornerSizeOptions {
  const { handlerSize, handlerBorderWidth } = getBaseSize(roi);
  return {
    handlerSize: handlerSize / scale,
    handlerBorderWidth: handlerBorderWidth / scale,
  };
}
