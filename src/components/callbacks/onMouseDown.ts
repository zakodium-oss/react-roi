import {
  DynamicAction,
  DynamicActions,
  DynamicStateType,
} from '../../context/DynamicContext';
import { ObjectActions, ObjectStateType } from '../../context/ObjectContext';
import {
  PositionAction,
  PositionStateType,
} from '../../context/PositionContext';
import { Rectangle } from '../../types/Rectangle';
import { dragRectangle } from '../../utilities/dragRectangle';
import { getScaledRectangle } from '../../utilities/getScaledRectangle';

export function onMouseDown(
  event: React.MouseEvent,
  rect: { offsetLeft: number; offsetTop: number },
  objectState: ObjectStateType,
  objectDispatch: React.Dispatch<ObjectActions>,
  positionState: PositionStateType,
  positionDispatch: React.Dispatch<PositionAction>,
  dynamicState: DynamicStateType,
  dynamicDispatch: React.Dispatch<DynamicAction>
) {
  const object = objectState.objects.find((obj) => obj.selected);
  const initPoint = { x: event.clientX, y: event.clientY };
  if (dynamicState.action === DynamicActions.SLEEP) {
    dynamicDispatch({
      type: 'setAction',
      payload: DynamicActions.DRAW,
    });
    positionDispatch({ type: 'setStartPoint', payload: initPoint });
    positionDispatch({ type: 'setEndPoint', payload: initPoint });
  }
  switch (dynamicState.action) {
    case DynamicActions.DRAG:
      const scaledRectangle = getScaledRectangle(
        object?.rectangle as Rectangle,
        positionState.delta,
        rect
      );
      const position = dragRectangle(
        scaledRectangle,
        event,
        dynamicState.delta || { dx: 0, dy: 0 }
      );
      positionDispatch({
        type: 'setStartPoint',
        payload: position.startPoint,
      });
      positionDispatch({ type: 'setEndPoint', payload: position.endPoint });
      break;
    case DynamicActions.SLEEP:
      positionDispatch({ type: 'setStartPoint', payload: initPoint });
      positionDispatch({ type: 'setEndPoint', payload: initPoint });
      break;

    case DynamicActions.DRAW:
    case DynamicActions.RESIZE:
      positionDispatch({
        type: 'setEndPoint',
        payload: initPoint,
      });
      break;
  }
  dynamicDispatch({ type: 'setIsMouseDown', payload: true });
}
