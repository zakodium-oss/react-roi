import { Box, CommittedBox, Point } from '../types/utils';

import { assert } from './assert';

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
  const width = roi.x2 - roi.x1;
  const height = roi.y2 - roi.y1;
  const centerOrigin = { x: roi.x1 + width / 2, y: roi.y1 + height / 2 };
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
    x: roi.x1 + width / 2,
    y: roi.y1,
  };
  const a = topMiddleEdgeBeforeRotate.x - centerOrigin.x;
  const b = centerOrigin.y - topMiddleEdgeBeforeRotate.y;
  const c = topMiddleEdgeAfterRotate.x - centerOrigin.x;
  const d = topMiddleEdgeAfterRotate.y - centerOrigin.y;
  assert(a ** 2 + b ** 2 !== 0);
  const denom = a ** 2 + b ** 2;
  // The result of the equation was computed with Wolfram alpha: "solve a * cos(t) + b * ((d+b*cos(t))/a)=c for t"
  return Math.acos((a * c - b * d) / denom) * (OP.x > 0 ? 1 : -1);
}

function norm(point: Point): number {
  return Math.sqrt(point.x ** 2 + point.y ** 2);
}

function add(pointA: Point, pointB: Point): Point {
  return {
    x: pointA.x + pointB.x,
    y: pointA.y + pointB.y,
  };
}

function mulScalar(point: Point, scalar: number): Point {
  return {
    x: point.x * scalar,
    y: point.y * scalar,
  };
}

export function rotatePointBox(point: Point, box: Box) {
  // Box rotates around the top left corner
  const centerPoint: Point = {
    x: box.x1 + (box.x2 - box.x1) / 2,
    y: box.y1 + (box.y2 - box.y1) / 2,
  };
  return rotatePoint(point, centerPoint, box.angle);
}

type RawBox = Omit<Box, 'angle'>;

export function rotateBox(box: RawBox, angle: number): Omit<Box, 'angle'> {
  const boxCenter = {
    x: box.x1 + (box.x2 - box.x1) / 2,
    y: box.y1 + (box.y2 - box.y1) / 2,
  };
  const p1 = rotatePoint({ x: box.x1, y: box.y1 }, boxCenter, angle);
  const p2 = rotatePoint({ x: box.x2, y: box.y2 }, boxCenter, angle);
  return {
    x1: p1.x,
    y1: p1.y,
    x2: p2.x,
    y2: p2.y,
  };
}

export function rotatePointBoxInverse(point: Point, box: Box) {
  // Box rotates around the top left corner
  const centerPoint: Point = {
    x: box.x1 + (box.x2 - box.x1) / 2,
    y: box.y1 + (box.y2 - box.y1) / 2,
  };
  return rotatePoint(point, centerPoint, -box.angle);
}

export function rotatePointCommittedBox(point: Point, box: CommittedBox) {
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
