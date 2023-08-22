import { CSSProperties } from 'react';

import { Point } from '../types';
import { Roi } from '../types/Roi';

import { assertUnreachable } from './assert';
import { XCornerPosition, YCornerPosition } from './coordinates';

export interface CornerData {
  xPosition: XCornerPosition;
  yPosition: YCornerPosition;
  cursor: CSSProperties['cursor'];
  cx: number;
  cy: number;
}

export function getAllCorners(roi: Roi): CornerData[] {
  const { x, y, width, height } = roi;
  return [
    {
      xPosition: 'left',
      yPosition: 'top',
      cursor: 'nwse-resize',
      cx: x,
      cy: y,
    },
    {
      xPosition: 'left',
      yPosition: 'bottom',
      cursor: 'nesw-resize',
      cx: x,
      cy: y + height,
    },
    {
      xPosition: 'right',
      yPosition: 'bottom',
      cursor: 'nwse-resize',
      cx: x + width,
      cy: y + height,
    },
    {
      cursor: 'nesw-resize',
      xPosition: 'right',
      yPosition: 'top',
      cx: x + width,
      cy: y,
    },
    {
      xPosition: 'middle',
      yPosition: 'top',
      cursor: 'ns-resize',
      cx: x + width / 2,
      cy: y,
    },
    {
      xPosition: 'middle',
      yPosition: 'bottom',
      cursor: 'ns-resize',
      cx: x + width / 2,
      cy: y + height,
    },
    {
      xPosition: 'left',
      yPosition: 'middle',
      cursor: 'ew-resize',
      cx: x,
      cy: y + height / 2,
    },
    {
      xPosition: 'right',
      yPosition: 'middle',
      cursor: 'ew-resize',
      cx: x + width,
      cy: y + height / 2,
    },
  ];
}

export function getCornerPoint(
  roi: Roi,
  xAxisCorner: XCornerPosition,
  yAxisCorner: YCornerPosition,
): Point {
  return {
    x: getXCornerValue(roi, xAxisCorner),
    y: getYCornerValue(roi, yAxisCorner),
  };
}

function getXCornerValue(roi: Roi, xAxisCorner: XCornerPosition) {
  switch (xAxisCorner) {
    case 'left':
      return roi.x;
    case 'middle':
      return roi.x + roi.width / 2;
      break;
    case 'right':
      return roi.x + roi.width;
    default:
      assertUnreachable(xAxisCorner);
  }
}

function getYCornerValue(roi: Roi, yAxisCorner: YCornerPosition) {
  switch (yAxisCorner) {
    case 'top':
      return roi.y;
    case 'middle':
      return roi.y + roi.height / 2;
    case 'bottom':
      return roi.y + roi.height;
    default:
      assertUnreachable(yAxisCorner);
  }
}
