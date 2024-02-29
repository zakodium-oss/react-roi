import { Roi } from '../../types/Roi';

export interface CornerSizeOptions {
  handlerSize: number;
  handlerBorderWidth: number;
}

const baseSize: CornerSizeOptions = {
  handlerSize: 12,
  handlerBorderWidth: 3,
};

export function getHandlerSizes(roi: Roi): CornerSizeOptions {
  const minLength = Math.min(roi.width, roi.height);
  const { handlerSize, handlerBorderWidth } = baseSize;
  return {
    handlerSize: Math.floor(
      Math.max(Math.min(handlerSize, minLength / 3 + 1), 1),
    ),
    handlerBorderWidth,
  };
}
