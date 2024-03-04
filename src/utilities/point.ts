import { Point } from '../types/utils';

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

export function scalarMultiply(pointA: Point, pointB: Point) {
  return pointA.x * pointB.x + pointA.y * pointB.y;
}
