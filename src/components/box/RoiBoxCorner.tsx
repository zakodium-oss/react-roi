import type { CSSProperties, PointerEventHandler } from 'react';
import { useCallback } from 'react';

import { useRoiDispatch } from '../../hooks/useRoiDispatch.js';
import { useRoiState } from '../../hooks/useRoiState.js';
import type { CornerData } from '../../utilities/corners.js';
import { defaultHandlerColor } from '../constants.js';

import type { HandlerSizeOptions } from './sizes.js';
import { getCursor } from './utils.js';

type PointerDownCallback = PointerEventHandler<SVGRectElement>;

interface RoiBoxCornerProps {
  corner: CornerData;
  roiId: string;
  sizes: HandlerSizeOptions;
  handlerColor?: CSSProperties['color'];
  disabled: boolean;
}

export function RoiBoxCorner({
  corner,
  roiId,
  sizes,
  handlerColor,
  disabled,
}: RoiBoxCornerProps) {
  const roiDispatch = useRoiDispatch();
  const roiState = useRoiState();
  const onPointerDown: PointerDownCallback = useCallback(
    (event) => {
      if (
        event.altKey ||
        event.button !== 0 ||
        roiState.mode === 'draw' ||
        disabled
      ) {
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
    [roiDispatch, corner, roiId, roiState, disabled],
  );
  if (corner.xPosition === 'center' || corner.yPosition === 'center') {
    return (
      <SideHandler
        corner={corner}
        onPointerDown={onPointerDown}
        scaledSizes={sizes}
        handlerColor={handlerColor}
        disabled={disabled}
      />
    );
  }
  return (
    <CornerHandler
      corner={corner}
      onPointerDown={onPointerDown}
      scaledSizes={sizes}
      disabled={disabled}
      handlerColor={handlerColor}
    />
  );
}

function SideHandler({
  corner,
  onPointerDown,
  scaledSizes,
  disabled,
  handlerColor = defaultHandlerColor,
}: {
  corner: CornerData;
  onPointerDown: PointerDownCallback;
  scaledSizes: HandlerSizeOptions;
  disabled: boolean;
  handlerColor: CSSProperties['color'] | undefined;
}) {
  const roiState = useRoiState();

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
        cursor={getCursor(roiState, corner.cursor, disabled)}
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
  disabled,
  handlerColor = defaultHandlerColor,
}: {
  corner: CornerData;
  onPointerDown: PointerDownCallback;
  scaledSizes: HandlerSizeOptions;
  handlerColor: CSSProperties['color'] | undefined;
  disabled: boolean;
}) {
  const roiState = useRoiState();

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
        cursor={getCursor(roiState, corner.cursor, disabled)}
        fill="transparent"
        style={{ pointerEvents: 'initial' }}
        onPointerDown={onPointerDown}
      />
    </g>
  );
}

function getSidePoints(corner: CornerData, scaledSizes: HandlerSizeOptions) {
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

function getCornerPoints(corner: CornerData, scaledSizes: HandlerSizeOptions) {
  const { handlerSize } = scaledSizes;

  const startOffsetX = corner.xPosition === 'left' ? handlerSize : -handlerSize;

  const endOffsetY = corner.yPosition === 'top' ? handlerSize : -handlerSize;
  return [
    [corner.cx + startOffsetX, corner.cy],
    [corner.cx, corner.cy],
    [corner.cx, corner.cy + endOffsetY],
  ];
}

function getHandlerRect(corner: CornerData, scaledSizes: HandlerSizeOptions) {
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

function getTransform(corner: CornerData, scaledSizes: HandlerSizeOptions) {
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
