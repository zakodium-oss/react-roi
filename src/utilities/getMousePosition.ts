import { DynamicStateType } from '../types/DynamicStateType';

export function getMousePosition(
  draft: DynamicStateType,
  event: React.MouseEvent
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
        y: event.clientY - (offset.top as number),
      };
    case 6:
    case 7:
      return {
        x: event.clientX - (offset.left as number) || 0,
        y: endPoint?.y || 0,
      };
    default:
      return {
        x: event.clientX - (offset.left as number),
        y: event.clientY - (offset.top as number),
      };
  }
}
