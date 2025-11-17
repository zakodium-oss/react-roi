import type { CSSProperties, PointerEventHandler } from 'react';
import { useCallback } from 'react';

import { useRoiDispatch } from '../../hooks/useRoiDispatch.js';
import { useRoiState } from '../../hooks/useRoiState.js';
import type { EdgeData } from '../../utilities/grid.js';
import { defaultGridLineOpacity } from '../constants.js';

import type { HandlerSizeOptions } from './sizes.js';
import { getCursor } from './utils.js';

interface RoiBoxEdgeProps {
  edge: EdgeData;
  roiId: string;
  sizes: HandlerSizeOptions;
  disabled: boolean;
  handlerColor?: CSSProperties['color'];
  gridLineOpacity?: CSSProperties['opacity'];
}

type PointerDownCallback = PointerEventHandler<SVGRectElement>;

export function RoiBoxEdge(props: RoiBoxEdgeProps) {
  const {
    edge,
    sizes,
    handlerColor,
    roiId,
    disabled,
    gridLineOpacity = defaultGridLineOpacity,
  } = props;
  const roiDispatch = useRoiDispatch();
  const roiState = useRoiState();
  const points = getSidePoints(edge, sizes);
  const handlerRect = getHandlerRect(edge, sizes);
  const transform = getTransform(edge, sizes);

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
          xAxisCorner:
            edge.position === 'top' || edge.position === 'bottom'
              ? 'center'
              : edge.position,
          yAxisCorner:
            edge.position === 'left' || edge.position === 'right'
              ? 'center'
              : edge.position,
        },
      });
    },
    [roiDispatch, edge, roiId, roiState, disabled],
  );
  return (
    <g transform={transform}>
      <line
        {...points}
        stroke={handlerColor}
        strokeWidth={sizes.handlerBorderWidth}
        style={{ opacity: gridLineOpacity }}
        strokeLinecap="round"
      />
      <rect
        {...handlerRect}
        onPointerDown={onPointerDown}
        cursor={getCursor(roiState, edge.cursor, disabled)}
        fill="transparent"
        style={{ pointerEvents: 'initial' }}
      />
    </g>
  );
}

function getSidePoints(edge: EdgeData, scaledSizes: HandlerSizeOptions) {
  if (edge.position === 'left' || edge.position === 'right') {
    return {
      x1: edge.x1,
      y1: edge.y1 + scaledSizes.handlerBorderWidth,
      x2: edge.x2,
      y2: edge.y2 - scaledSizes.handlerBorderWidth,
    };
  } else {
    return {
      x1: edge.x1 + scaledSizes.handlerSize,
      y1: edge.y1,
      x2: edge.x2 - scaledSizes.handlerSize,
      y2: edge.y2,
    };
  }
}

function getTransform(edge: EdgeData, scaledSizes: HandlerSizeOptions) {
  const shift = scaledSizes.handlerBorderWidth / 2;

  let x = 0;
  let y = 0;

  if (edge.position === 'left') {
    x = shift;
  } else if (edge.position === 'right') {
    x = -shift;
  } else if (edge.position === 'top') {
    y = shift;
  } else if (edge.position === 'bottom') {
    y = -shift;
  }

  return `translate(${x}, ${y})`;
}

function getHandlerRect(edge: EdgeData, sizes: HandlerSizeOptions) {
  if (edge.position === 'left' || edge.position === 'right') {
    const width = sizes.handlerSize * 2;
    return {
      width,
      height: Math.max(0, edge.y2 - edge.y1 - 2 * sizes.handlerSize),
      y: edge.y1 + sizes.handlerSize,
      x: edge.x1 - width / 2,
    };
  } else {
    const height = sizes.handlerSize * 2;
    return {
      height,
      width: Math.max(0, edge.x2 - edge.x1 - 2 * sizes.handlerSize),
      x: edge.x1 + sizes.handlerSize,
      y: edge.y1 - height / 2,
    };
  }
}
