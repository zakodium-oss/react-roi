import { assert } from './assert';

export interface Point {
  x: number;
  y: number;
}

export function norm(point: Point): number {
  return Math.sqrt(point.x ** 2 + point.y ** 2);
}

export function add(pointA: Point, pointB: Point): Point {
  return {
    x: pointA.x + pointB.x,
    y: pointA.y + pointB.y,
  };
}

export function mulScalar(point: Point, scalar: number): Point {
  return {
    x: point.x * scalar,
    y: point.y * scalar,
  };
}

export function getBoundaries(points: Point[]) {
  assert(points.length > 1, 'must pass at least 2 points');
  let maxX = 0;
  let minX = Number.MAX_VALUE;
  let maxY = 0;
  let minY = Number.MAX_VALUE;
  for (const { x, y } of points) {
    if (x < minX) {
      minX = x;
    }
    if (x > maxX) {
      maxX = x;
    }
    if (y < minY) {
      minY = y;
    }
    if (y > maxY) {
      maxY = y;
    }
  }
  return {
    minX,
    maxX,
    minY,
    maxY,
  };
}
