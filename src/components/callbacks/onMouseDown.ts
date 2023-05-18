import {
  DynamicAction,
  DynamicActions,
  DynamicStateType,
} from '../../context/DynamicContext';
import { PositionAction } from '../../context/PositionContext';

export function onMouseDown(
  event: React.MouseEvent,
  positionDispatch: React.Dispatch<PositionAction>,
  dynamicState: DynamicStateType,
  dynamicDispatch: React.Dispatch<DynamicAction>
) {
  dynamicDispatch({ type: 'setIsMouseDown', payload: true });
  const initPoint = { x: event.clientX, y: event.clientY };
  if (dynamicState.action === DynamicActions.SLEEP) {
    dynamicDispatch({
      type: 'setAction',
      payload: DynamicActions.DRAW,
    });
  }
  switch (dynamicState.action) {
    case DynamicActions.DRAG:
      positionDispatch({ type: 'setStartPoint', payload: initPoint });
      positionDispatch({ type: 'setEndPoint', payload: initPoint });
      break;
    case DynamicActions.SLEEP:
      positionDispatch({ type: 'setStartPoint', payload: initPoint });
      positionDispatch({ type: 'setEndPoint', payload: initPoint });
      break;
    case DynamicActions.RESIZE:
      positionDispatch({
        type: 'setEndPoint',
        payload: initPoint,
      });
      break;
  }
}
