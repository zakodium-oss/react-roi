import { Roi } from '../../types/Roi';

export interface HandlerSizeOptions {
  handlerSize: number;
  handlerBorderWidth: number;
}

const baseSize: HandlerSizeOptions = {
  handlerSize: 14,
  handlerBorderWidth: 3,
};

export function getHandlerSizes(roi: Roi): HandlerSizeOptions {
  const minLength = Math.min(roi.width, roi.height);
  const { handlerSize, handlerBorderWidth } = baseSize;
  return {
    handlerSize: Math.floor(
      Math.max(Math.min(handlerSize, minLength / 3 + 1), 1),
    ),
    handlerBorderWidth,
  };
}
