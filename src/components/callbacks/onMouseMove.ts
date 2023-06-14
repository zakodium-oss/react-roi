import {
  DynamicAction,
  DynamicActions,
  DynamicStateType,
} from '../../context/DynamicContext';

export function onMouseMove(
  event: React.MouseEvent,
  dynamicState: DynamicStateType,
  dynamicDispatch: React.Dispatch<DynamicAction>
) {
  const mousePosition = getMousePosition(event, dynamicState);
  switch (dynamicState.action) {
    case DynamicActions.DRAG:
      dynamicDispatch({
        type: 'dragRectangle',
        payload: { point: mousePosition },
      });
      break;
    case DynamicActions.DRAW:
    case DynamicActions.RESIZE:
      dynamicDispatch({
        type: 'setEndPoint',
        payload: mousePosition,
      });
      break;
  }
}

function getMousePosition(
  event: React.MouseEvent,
  dynamicState: DynamicStateType
): { x: number; y: number } {
  switch (dynamicState.pointerIndex) {
    case 4:
    case 5:
      return {
        x: dynamicState.endPoint?.x || 0,
        y: event.clientY - (dynamicState.offset?.top as number),
      };
    case 6:
    case 7:
      return {
        x: event.clientX - (dynamicState.offset?.left as number) || 0,
        y: dynamicState.endPoint?.y || 0,
      };
    default:
      return {
        x: event.clientX - (dynamicState.offset?.left as number),
        y: event.clientY - (dynamicState.offset?.top as number),
      };
  }
}
