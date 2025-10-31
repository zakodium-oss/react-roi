import type { CSSProperties } from 'react';

import type { Box } from './box.js';
import { getCornerCursor } from './corners.js';

type EdgePosition = 'top' | 'bottom' | 'left' | 'right';

export interface EdgeData {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  position: EdgePosition;
  cursor: CSSProperties['cursor'];
}

export function getAllEdges(roi: Box, angle: number): EdgeData[] {
  const [p1, p2, p3, p4] = [
    { x: roi.x, y: roi.y },
    { x: roi.x + roi.width, y: roi.y },
    { x: roi.x + roi.width, y: roi.y + roi.height },
    { x: roi.x, y: roi.y + roi.height },
  ] as const;
  const edges = [
    {
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y,
      position: 'top' as const,
    },
    {
      x1: p2.x,
      y1: p2.y,
      x2: p3.x,
      y2: p3.y,
      position: 'right' as const,
    },
    {
      x1: p4.x,
      y1: p4.y,
      x2: p3.x,
      y2: p3.y,
      position: 'bottom' as const,
    },
    {
      x1: p1.x,
      y1: p1.y,
      x2: p4.x,
      y2: p4.y,
      position: 'left' as const,
    },
  ];

  return edges.map((edge, idx) => ({
    ...edge,
    cursor: getCornerCursor(angle, idx * 2 + 1),
  }));
}

export type GridLineData = Pick<EdgeData, 'x1' | 'x2' | 'y1' | 'y2'>;

export function getAllGridLines(roi: Box): GridLineData[] {
  const gridSize = 3;
  const lines = [];
  for (let i = 1; i < gridSize; i++) {
    lines.push({
      x1: roi.x + (roi.width * i) / gridSize,
      y1: roi.y,
      x2: roi.x + (roi.width * i) / gridSize,
      y2: roi.y + roi.height,
    });
  }
  for (let j = 1; j < gridSize; j++) {
    lines.push({
      x1: roi.x,
      y1: roi.y + (roi.height * j) / gridSize,
      x2: roi.x + roi.width,
      y2: roi.y + (roi.height * j) / gridSize,
    });
  }
  return lines;
}
