import { Box, CommittedBox, Point } from '../types/utils';

import { assert } from './assert';
import { add, mulScalar, norm } from './point';

const ANGLE_90_POSITIVE = Math.PI / 2;
const ANGLE_90_NEGATIVE = -Math.PI / 2;

export function rotatePoint(
  point: Point,
  rotationCenter: Point,
  angle: number,
): Point {
  const angleCos = Math.cos(angle);
  const angleSin = Math.sin(angle);

  const x =
    point.x * angleCos -
    point.y * angleSin +
    (1 - angleCos) * rotationCenter.x +
    rotationCenter.y * angleSin;
  const y =
    point.x * angleSin +
    point.y * angleCos +
    (1 - angleCos) * rotationCenter.y -
    rotationCenter.x * angleSin;
  return { x, y };
}

/**
 * Given the mouse position and the position of the box without the angle
 * get the angle knowing that the middle of the top edge of the roi rectangle
 * should pass through the line between the mouse position and the origin of the rectangle
 * @param pointer
 * @param roi
 * @return the angle of the roi in radians
 */
export function computeAngleFromMousePosition(
  pointer: Point,
  roi: Box,
): number {
  const width = roi.width;
  const height = roi.height;
  const centerOrigin = { x: roi.x + width / 2, y: roi.y + height / 2 };
  // O is the origin, P is the pointer. This is the OP vector.
  const OP: Point = {
    x: pointer.x - centerOrigin.x,
    y: pointer.y - centerOrigin.y,
  };
  const factor = height / 2 / norm(OP);

  const topMiddleEdgeAfterRotate: Point = add(
    centerOrigin,
    mulScalar(OP, factor),
  );
  const topMiddleEdgeBeforeRotate: Point = {
    x: roi.x + width / 2,
    y: roi.y,
  };
  const a = topMiddleEdgeBeforeRotate.x - centerOrigin.x;
  const b = centerOrigin.y - topMiddleEdgeBeforeRotate.y;
  const c = topMiddleEdgeAfterRotate.x - centerOrigin.x;
  const d = topMiddleEdgeAfterRotate.y - centerOrigin.y;
  assert(a ** 2 + b ** 2 !== 0);
  const denominator = a ** 2 + b ** 2;
  // The result of the equation was computed with Wolfram alpha: "solve a * cos(t) + b * ((d+b*cos(t))/a)=c for t"
  return Math.acos((a * c - b * d) / denominator) * (OP.x > 0 ? 1 : -1);
}

export function rotatePointCommittedBox(point: Point, box: Box | CommittedBox) {
  const topLeftPoint: Point = {
    x: box.x,
    y: box.y,
  };
  return rotatePoint(point, topLeftPoint, box.angle);
}

interface Boundaries {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}
export function getMBRBoundaries(box: CommittedBox): Boundaries {
  // Box:
  // p0 ------ p1
  // |         |
  // p3 ------ p2
  const p0 = rotatePointCommittedBox({ x: box.x, y: box.y }, box);
  const p1 = rotatePointCommittedBox({ x: box.x + box.width, y: box.y }, box);
  const p2 = rotatePointCommittedBox(
    { x: box.x + box.width, y: box.y + box.height },
    box,
  );

  const p3 = rotatePointCommittedBox({ x: box.x, y: box.y + box.height }, box);

  if (box.angle >= -Math.PI && box.angle < ANGLE_90_NEGATIVE) {
    return {
      minX: p3.x,
      maxX: p1.x,
      minY: p0.y,
      maxY: p2.y,
    };
  } else if (box.angle >= ANGLE_90_NEGATIVE && box.angle < 0) {
    return {
      minX: p0.x,
      maxX: p2.x,
      minY: p1.y,
      maxY: p3.y,
    };
  } else if (box.angle >= 0 && box.angle < ANGLE_90_POSITIVE) {
    return {
      minX: p3.x,
      maxX: p1.x,
      minY: p0.y,
      maxY: p2.y,
    };
  } else if (box.angle >= ANGLE_90_POSITIVE && box.angle < Math.PI) {
    return {
      minX: p2.x,
      maxX: p0.x,
      minY: p3.y,
      maxY: p1.y,
    };
  }
  throw new Error('wrong angle value');
}
