import { PanZoomContext } from '../../context/contexts';
import { Roi } from '../../types/Roi';

export interface CornerSizeOptions {
  handlerSize: number;
  handlerBorderWidth: number;
}

const baseSize: CornerSizeOptions = {
  handlerSize: 12,
  handlerBorderWidth: 3,
};

export function getScaledSizes(
  roi: Roi,
  panZoom: PanZoomContext,
): CornerSizeOptions {
  const minLength = Math.min(roi.x2 - roi.x1, roi.y2 - roi.y1);
  const { handlerSize, handlerBorderWidth } = baseSize;
  const divider = panZoom.initialPanZoom.scale * panZoom.panZoom.scale;
  return {
    handlerSize: Math.floor(
      Math.max(Math.min(handlerSize / divider, minLength / 3 + 1), 1),
    ),
    handlerBorderWidth: handlerBorderWidth / divider,
  };
}
