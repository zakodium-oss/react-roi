import { CSSProperties } from 'react';

import { Point } from '../types';
import { Roi } from '../types/Roi';

import { assertUnreachable } from './assert';
import { XAxisCorner, YAxisCorner } from './coordinates';

export interface CornerData {
  xAxis: XAxisCorner;
  yAxis: YAxisCorner;
  cursor: CSSProperties['cursor'];
  cx: number;
  cy: number;
}

export function getAllCorners(roi: Roi): CornerData[] {
  const { x, y, width, height } = roi;
  return [
    {
      xAxis: 'left',
      yAxis: 'top',
      cursor: 'nwse-resize',
      cx: x,
      cy: y,
    },
    {
      xAxis: 'left',
      yAxis: 'bottom',
      cursor: 'nesw-resize',
      cx: x,
      cy: y + height,
    },
    {
      xAxis: 'right',
      yAxis: 'bottom',
      cursor: 'nwse-resize',
      cx: x + width,
      cy: y + height,
    },
    {
      cursor: 'nesw-resize',
      xAxis: 'right',
      yAxis: 'top',
      cx: x + width,
      cy: y,
    },
    {
      xAxis: 'middle',
      yAxis: 'top',
      cursor: 'ns-resize',
      cx: x + width / 2,
      cy: y,
    },
    {
      xAxis: 'middle',
      yAxis: 'bottom',
      cursor: 'ns-resize',
      cx: x + width / 2,
      cy: y + height,
    },
    {
      xAxis: 'left',
      yAxis: 'middle',
      cursor: 'ew-resize',
      cx: x,
      cy: y + height / 2,
    },
    {
      xAxis: 'right',
      yAxis: 'middle',
      cursor: 'ew-resize',
      cx: x + width,
      cy: y + height / 2,
    },
  ];
}

export function getCornerPoint(
  roi: Roi,
  xAxisCorner: XAxisCorner,
  yAxisCorner: YAxisCorner,
): Point {
  return {
    x: getXCornerValue(roi, xAxisCorner),
    y: getYCornerValue(roi, yAxisCorner),
  };
}

function getXCornerValue(roi: Roi, xAxisCorner: XAxisCorner) {
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

function getYCornerValue(roi: Roi, yAxisCorner: YAxisCorner) {
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
