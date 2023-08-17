import { Point } from '../types';

export function getMousePosition(
  event: React.MouseEvent,
  endPoint: Point,
  pointerIndex: number,
): Point {
  const { x, y } = document
    .getElementById('roi-container-svg')
    .getBoundingClientRect();
  switch (pointerIndex) {
    case 4:
    case 5:
      return {
        x: endPoint?.x || 0,
        y: event.clientY - y,
      };
    case 6:
    case 7:
      return {
        x: event.clientX - x || 0,
        y: endPoint?.y || 0,
      };
    default:
      return {
        x: event.clientX - x,
        y: event.clientY - y,
      };
  }
}
