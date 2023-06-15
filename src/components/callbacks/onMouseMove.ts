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
  const mousePosition = dynamicState.getMousePosition(event);
  switch (dynamicState.action) {
    case DynamicActions.DRAG:
      dynamicDispatch({
        type: 'dragRectangle',
        payload: { point: mousePosition },
      });
      break;
    case DynamicActions.DRAW:
    case DynamicActions.RESIZE:
      dynamicDispatch({ type: 'setEndPoint', payload: mousePosition });
      break;
    case DynamicActions.SLEEP:
      break;
  }
}
