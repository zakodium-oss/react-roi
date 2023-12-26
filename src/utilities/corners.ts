import { CSSProperties } from 'react';

import { CommittedBox } from '..';

import { XCornerPosition, YCornerPosition } from './coordinates';

export interface CornerData {
  xPosition: XCornerPosition;
  yPosition: YCornerPosition;
  cursor: CSSProperties['cursor'];
  cx: number;
  cy: number;
}

export function getAllCorners(roi: CommittedBox): CornerData[] {
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
