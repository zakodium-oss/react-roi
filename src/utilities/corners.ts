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

// Input: -π < angle < π
// Add 2π so that angle is positive and modulo returns positive values
// Add π/8 so that:
// -π/8 <= angle < π/8 becomes 0 <= angle < π/4
// which returns an index of 0 when dividing by π/4 and computing modulo
function getCursorIndex(angle: number, idx: number) {
  return (Math.floor(((17 * Math.PI) / 8 + angle) / (Math.PI / 4)) + idx) % 8;
}

// List of cursors going around the rectangle, starting from the top-left position and moving to the right from there
const cursors: Array<Exclude<CSSProperties['cursor'], undefined>> = [
  'nwse-resize',
  'ns-resize',
  'nesw-resize',
  'ew-resize',
  'nwse-resize',
  'ns-resize',
  'nesw-resize',
  'ew-resize',
];
function getCursor(angle: number, idx: number) {
  return cursors[getCursorIndex(angle, idx)];
}
// (angle + Math.PI/8) / (Math.PI / 4) => 0-7

export function getAllCorners(roi: CommittedBox): CornerData[] {
  const { x, y, width, height } = roi;
  const cursors: Array<Omit<CornerData, 'cursor'>> = [
    {
      xPosition: 'left',
      yPosition: 'top',
      cx: x,
      cy: y,
    },
    {
      xPosition: 'middle',
      yPosition: 'top',
      cx: x + width / 2,
      cy: y,
    },
    {
      xPosition: 'right',
      yPosition: 'top',
      cx: x + width,
      cy: y,
    },
    {
      xPosition: 'right',
      yPosition: 'middle',
      cx: x + width,
      cy: y + height / 2,
    },
    {
      xPosition: 'right',
      yPosition: 'bottom',
      cx: x + width,
      cy: y + height,
    },
    {
      xPosition: 'middle',
      yPosition: 'bottom',
      cx: x + width / 2,
      cy: y + height,
    },
    {
      xPosition: 'left',
      yPosition: 'bottom',
      cx: x,
      cy: y + height,
    },
    {
      xPosition: 'left',
      yPosition: 'middle',
      cx: x,
      cy: y + height / 2,
    },
  ];
  return cursors.map((item, idx) => ({
    ...item,
    cursor: getCursor(roi.angle, idx),
  }));
}
