import { PanZoomContext } from '../../context/contexts';
import { Roi } from '../../types/Roi';

export interface HandlerSizeOptions {
  handlerSize: number;
  handlerBorderWidth: number;
}

export const baseHandlerSizes: HandlerSizeOptions = {
  handlerSize: 14,
  handlerBorderWidth: 3,
};

export function getHandlerSizes(
  roi: Roi,
  panZoom: PanZoomContext,
): HandlerSizeOptions {
  const totalScale = panZoom.panZoom.scale * panZoom.initialPanZoom.scale;
  const minLength = Math.min(roi.box.width, roi.box.height) * totalScale;
  const { handlerSize, handlerBorderWidth } = baseHandlerSizes;
  return {
    handlerSize: Math.floor(
      Math.max(Math.min(handlerSize, minLength / 3 + 1), 1),
    ),
    handlerBorderWidth,
  };
}
