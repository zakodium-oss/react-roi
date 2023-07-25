import { RoiStateType } from '../types/RoiStateType';

export function getMousePosition(
  draft: RoiStateType,
  event: React.MouseEvent,
): {
  x: number;
  y: number;
} {
  const { pointerIndex, x, y, endPoint } = draft;
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
