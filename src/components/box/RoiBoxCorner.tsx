import { CSSProperties, MouseEventHandler, useCallback } from 'react';

import { useRoiDispatch } from '../../hooks/useRoiDispatch';
import { CornerData } from '../../utilities/corners';

import { CornerSizeOptions } from './sizes';

type MouseDownCallback = MouseEventHandler<SVGRectElement>;

export function RoiBoxCorner({
  corner,
  scale,
  roiId,
  sizes,
  handlerColor,
}: {
  corner: CornerData;
  scale: number;
  roiId: string;
  sizes: CornerSizeOptions;
  handlerColor?: CSSProperties['color'];
}) {
  const roiDispatch = useRoiDispatch();
  const onMouseDown: MouseDownCallback = useCallback(
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
        onMouseDown={onMouseDown}
        scale={scale}
        sizes={sizes}
        handlerColor={handlerColor}
      />
    );
  }
  return (
    <CornerHandler
      corner={corner}
      onMouseDown={onMouseDown}
      scale={scale}
      sizes={sizes}
      handlerColor={handlerColor}
    />
  );
}

function SideHandler({
  corner,
  scale,
  onMouseDown,
  sizes,
  handlerColor = 'black',
}: {
  corner: CornerData;
  scale: number;
  onMouseDown: MouseDownCallback;
  sizes: CornerSizeOptions;
  handlerColor: CSSProperties['color'] | undefined;
}) {
  const linePoints = getSidePoints(corner, scale, sizes);
  const handlerRect = getHandlerRect(corner, scale, sizes);
  return (
    <>
      <line
        {...linePoints}
        stroke={handlerColor}
        strokeWidth={sizes.handlerBorderWidth / scale}
        strokeLinecap="round"
      />
      <rect
        {...handlerRect}
        cursor={corner.cursor}
        fill="transparent"
        style={{ pointerEvents: 'initial' }}
        onMouseDown={onMouseDown}
      />
    </>
  );
}

function CornerHandler({
  corner,
  scale,
  onMouseDown,
  sizes,
  handlerColor = 'black',
}: {
  corner: CornerData;
  scale: number;
  onMouseDown: MouseDownCallback;
  sizes: CornerSizeOptions;
  handlerColor: CSSProperties['color'] | undefined;
}) {
  const polyline = getCornerPoints(corner, scale, sizes);
  const handlerRect = getHandlerRect(corner, scale, sizes);
  return (
    <>
      <polyline
        points={polyline.map((point) => point.join(',')).join(' ')}
        strokeWidth={sizes.handlerBorderWidth / scale}
        stroke={handlerColor}
        fill="none"
        strokeLinecap="round"
      />
      <rect
        {...handlerRect}
        cursor={corner.cursor}
        fill="transparent"
        style={{ pointerEvents: 'initial' }}
        onMouseDown={onMouseDown}
      />
    </>
  );
}

function getSidePoints(
  corner: CornerData,
  scale: number,
  sizes: CornerSizeOptions,
) {
  const scaledHandlerSize = sizes.handlerSize / scale;
  if (corner.xPosition === 'left' || corner.xPosition === 'right') {
    return {
      x1: corner.cx,
      y1: corner.cy - scaledHandlerSize / 2,
      x2: corner.cx,
      y2: corner.cy + scaledHandlerSize / 2,
    };
  } else {
    return {
      x1: corner.cx - scaledHandlerSize / 2,
      y1: corner.cy,
      x2: corner.cx + scaledHandlerSize / 2,
      y2: corner.cy,
    };
  }
}

function getCornerPoints(
  corner: CornerData,
  scale: number,
  sizes: CornerSizeOptions,
) {
  const scaledHandlerSize = sizes.handlerSize / scale;

  const startOffsetX =
    corner.xPosition === 'left' ? +scaledHandlerSize : -scaledHandlerSize;

  const endOffsetY =
    corner.yPosition === 'top' ? +scaledHandlerSize : -scaledHandlerSize;
  return [
    [corner.cx + startOffsetX, corner.cy],
    [corner.cx, corner.cy],
    [corner.cx, corner.cy + endOffsetY],
  ];
}

function getHandlerRect(
  corner: CornerData,
  scale: number,
  sizes: CornerSizeOptions,
) {
  const scaledHandlerSize = sizes.handlerSize / scale;
  const width = scaledHandlerSize * 2;
  const height = width;

  const x = corner.cx - scaledHandlerSize;
  const y = corner.cy - scaledHandlerSize;

  return {
    x,
    y,
    width,
    height,
  };
}
