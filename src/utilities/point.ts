import { assert } from './assert.js';

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

export function subtract(pointA: Point, pointB: Point): Point {
  return {
    x: pointA.x - pointB.x,
    y: pointA.y - pointB.y,
  };
}

export function mulScalar(point: Point, scalar: number): Point {
  return {
    x: point.x * scalar,
    y: point.y * scalar,
  };
}

export function dotProduct(pointA: Point, pointB: Point): number {
  return pointA.x * pointB.x + pointA.y * pointB.y;
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

type Segment = [Point, Point];
export function segmentIntersection(
  seg1: Segment,
  seg2: Segment,
): Point | null {
  const [p1, p2] = seg1;
  const [p3, p4] = seg2;

  const d = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);

  // Parallel or coincident
  if (d === 0) return null;

  const t = ((p3.x - p1.x) * (p4.y - p3.y) - (p3.y - p1.y) * (p4.x - p3.x)) / d;
  const u = ((p3.x - p1.x) * (p2.y - p1.y) - (p3.y - p1.y) * (p2.x - p1.x)) / d;

  // Check if intersection point is on both segments
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return {
      x: p1.x + t * (p2.x - p1.x),
      y: p1.y + t * (p2.y - p1.y),
    };
  }

  return null;
}
