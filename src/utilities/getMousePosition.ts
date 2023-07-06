import { RoiStateType } from '../types/RoiStateType';

export function getMousePosition(
  draft: RoiStateType,
  event: React.MouseEvent,
): {
  x: number;
  y: number;
} {
  const { pointerIndex, origin, endPoint } = draft;
  switch (pointerIndex) {
    case 4:
    case 5:
      return {
        x: endPoint?.x || 0,
        y: event.clientY - origin.row,
      };
    case 6:
    case 7:
      return {
        x: event.clientX - origin.column || 0,
        y: endPoint?.y || 0,
      };
    default:
      return {
        x: event.clientX - origin.column,
        y: event.clientY - origin.row,
      };
  }
}
