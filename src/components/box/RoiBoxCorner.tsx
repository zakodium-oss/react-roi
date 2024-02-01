import { CSSProperties, PointerEventHandler, useCallback } from 'react';

import { useRoiDispatch } from '../../hooks/useRoiDispatch';
import { CornerData } from '../../utilities/corners';

import { CornerSizeOptions } from './sizes';

type PointerDownCallback = PointerEventHandler<SVGRectElement>;

export function RoiBoxCorner({
  corner,
  roiId,
  sizes,
  handlerColor,
}: {
  corner: CornerData;
  roiId: string;
  sizes: CornerSizeOptions;
  handlerColor?: CSSProperties['color'];
}) {
  const roiDispatch = useRoiDispatch();
  const onPointerDown: PointerDownCallback = useCallback(
    (event) => {
      if (event.altKey) {
        return;
      }
      event.stopPropagation();
      roiDispatch({
        type: 'START_RESIZE',
        payload: {
          id: roiId,
          xAxisCorner: corner.xPosition,
          yAxisCorner: corner.yPosition,
        },
      });
    },
    [roiDispatch, corner, roiId],
  );
  if (corner.xPosition === 'middle' || corner.yPosition === 'middle') {
    return (
      <SideHandler
        corner={corner}
        onPointerDown={onPointerDown}
        scaledSizes={sizes}
        handlerColor={handlerColor}
      />
    );
  }
  return (
    <CornerHandler
      corner={corner}
      onPointerDown={onPointerDown}
      scaledSizes={sizes}
      handlerColor={handlerColor}
    />
  );
}

function SideHandler({
  corner,
  onPointerDown,
  scaledSizes,
  handlerColor = 'black',
}: {
  corner: CornerData;
  onPointerDown: PointerDownCallback;
  scaledSizes: CornerSizeOptions;
  handlerColor: CSSProperties['color'] | undefined;
}) {
  const linePoints = getSidePoints(corner, scaledSizes);
  const handlerRect = getHandlerRect(corner, scaledSizes);
  const transform = getTransform(corner, scaledSizes);
  return (
    <g transform={transform}>
      <line
        {...linePoints}
        stroke={handlerColor}
        strokeWidth={scaledSizes.handlerBorderWidth}
        strokeLinecap="round"
      />
      <rect
        {...handlerRect}
        cursor={corner.cursor}
        fill="transparent"
        style={{ pointerEvents: 'initial' }}
        onPointerDown={onPointerDown}
      />
    </g>
  );
}

function CornerHandler({
  corner,
  onPointerDown,
  scaledSizes,
  handlerColor = 'black',
}: {
  corner: CornerData;
  onPointerDown: PointerDownCallback;
  scaledSizes: CornerSizeOptions;
  handlerColor: CSSProperties['color'] | undefined;
}) {
  const polyline = getCornerPoints(corner, scaledSizes);
  const handlerRect = getHandlerRect(corner, scaledSizes);
  const transform = getTransform(corner, scaledSizes);
  return (
    <g transform={transform}>
      <polyline
        points={polyline.map((point) => point.join(',')).join(' ')}
        strokeWidth={scaledSizes.handlerBorderWidth}
        stroke={handlerColor}
        fill="none"
        strokeLinecap="round"
      />
      <rect
        {...handlerRect}
        cursor={corner.cursor}
        fill="transparent"
        style={{ pointerEvents: 'initial' }}
        onPointerDown={onPointerDown}
      />
    </g>
  );
}

function getSidePoints(corner: CornerData, scaledSizes: CornerSizeOptions) {
  if (corner.xPosition === 'left' || corner.xPosition === 'right') {
    return {
      x1: corner.cx,
      y1: corner.cy - scaledSizes.handlerSize / 2,
      x2: corner.cx,
      y2: corner.cy + scaledSizes.handlerSize / 2,
    };
  } else {
    return {
      x1: corner.cx - scaledSizes.handlerSize / 2,
      y1: corner.cy,
      x2: corner.cx + scaledSizes.handlerSize / 2,
      y2: corner.cy,
    };
  }
}

function getCornerPoints(corner: CornerData, scaledSizes: CornerSizeOptions) {
  const { handlerSize } = scaledSizes;

  const startOffsetX =
    corner.xPosition === 'left' ? +handlerSize : -handlerSize;

  const endOffsetY = corner.yPosition === 'top' ? +handlerSize : -handlerSize;
  return [
    [corner.cx + startOffsetX, corner.cy],
    [corner.cx, corner.cy],
    [corner.cx, corner.cy + endOffsetY],
  ];
}

function getHandlerRect(corner: CornerData, scaledSizes: CornerSizeOptions) {
  const width = scaledSizes.handlerSize * 2;
  const height = width;

  const x = corner.cx - scaledSizes.handlerSize;
  const y = corner.cy - scaledSizes.handlerSize;

  return {
    x,
    y,
    width,
    height,
  };
}

function getTransform(corner: CornerData, scaledSizes: CornerSizeOptions) {
  const shift = scaledSizes.handlerBorderWidth / 2;

  let x = 0;
  let y = 0;

  if (corner.xPosition === 'left') {
    x = shift;
  } else if (corner.xPosition === 'right') {
    x = -shift;
  }

  if (corner.yPosition === 'top') {
    y = shift;
  } else if (corner.yPosition === 'bottom') {
    y = -shift;
  }

  return `translate(${x}, ${y})`;
}
