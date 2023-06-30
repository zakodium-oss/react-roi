import { RoiStateType } from '../types/RoiStateType';

export function getMousePosition(
  draft: RoiStateType,
  event: React.MouseEvent,
): {
  x: number;
  y: number;
} {
  const { pointerIndex, offset, endPoint } = draft;
  switch (pointerIndex) {
    case 4:
    case 5:
      return {
        x: endPoint?.x || 0,
        y: event.clientY - offset.top,
      };
    case 6:
    case 7:
      return {
        x: event.clientX - offset.left || 0,
        y: endPoint?.y || 0,
      };
    default:
      return {
        x: event.clientX - offset.left,
        y: event.clientY - offset.top,
      };
  }
}
