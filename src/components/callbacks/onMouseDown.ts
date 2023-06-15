import {
  DynamicAction,
  DynamicActions,
  DynamicStateType,
} from '../../context/DynamicContext';

export function onMouseDown(
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
      break;
    case DynamicActions.SLEEP:
      dynamicDispatch({ type: 'setAction', payload: DynamicActions.DRAW });
      dynamicDispatch({
        type: 'setPosition',
        payload: { startPoint: mousePosition, endPoint: mousePosition },
      });
      break;
  }
}
