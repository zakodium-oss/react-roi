import { Box, Point } from '../types/utils';

import { assert } from './assert';

export function rotatePoint(
  point: Point,
  origin: Point,
  angleRad: number,
): Point {
  const angleCos = Math.cos(angleRad);
  const angleSin = Math.sin(angleRad);

  const x =
    point.x * angleCos -
    point.y * angleSin +
    (1 - angleCos) * origin.x +
    origin.y * angleSin;
  const y =
    point.x * angleSin +
    point.y * angleCos +
    (1 - angleCos) * origin.y -
    origin.x * angleSin;
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
