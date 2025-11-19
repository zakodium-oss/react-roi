import type { CommittedBox } from '../types/box.ts';

import { getRectanglePoints } from './box.ts';
import type { Point } from './point.ts';
import { dotProduct, subtract } from './point.ts';

// Check if 2 rectangles intersect based on the separating Axis Theorem (SAT)
export function rectanglesIntersect(
  rect1: CommittedBox,
  rect2: CommittedBox,
): boolean {
  const corners1 = getRectanglePoints(rect1);
  const corners2 = getRectanglePoints(rect2);

  const axes = [...getAxes(corners1), ...getAxes(corners2)];

  for (const axis of axes) {
    const proj1 = projectOntoAxis(corners1, axis);
    const proj2 = projectOntoAxis(corners2, axis);

    if (proj1.max < proj2.min || proj2.max < proj1.min) {
      return false; // Gap found, no intersection
    }
  }

  return true;
}

function getAxes(corners: Point[]): Point[] {
  const axes: Point[] = [];
  for (let i = 0; i < corners.length; i++) {
    const p1 = corners[i];
    const p2 = corners[(i + 1) % corners.length];
    const edge = subtract(p2, p1);
    // Perpendicular axis
    axes.push({ x: -edge.y, y: edge.x });
  }
  return axes;
}

function projectOntoAxis(
  corners: Point[],
  axis: Point,
): { min: number; max: number } {
  const projections = corners.map((c) => dotProduct(c, axis));
  return {
    min: Math.min(...projections),
    max: Math.max(...projections),
  };
}
