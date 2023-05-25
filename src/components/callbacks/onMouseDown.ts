import {
  DynamicAction,
  DynamicActions,
  DynamicStateType,
} from '../../context/DynamicContext';
import { ObjectActions, ObjectStateType } from '../../context/ObjectContext';
import { Offset } from '../../types/Offset';
import { Ratio } from '../../types/Ratio';
import { Rectangle } from '../../types/Rectangle';
import { dragRectangle } from '../../utilities/dragRectangle';
import { getScaledRectangle } from '../../utilities/getScaledRectangle';

export function onMouseDown(
  event: React.MouseEvent,
  objectState: ObjectStateType,
  objectDispatch: React.Dispatch<ObjectActions>,
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
    dynamicDispatch({ type: 'setStartPoint', payload: initPoint });
    dynamicDispatch({ type: 'setEndPoint', payload: initPoint });
  }
  switch (dynamicState.action) {
    case DynamicActions.DRAG:
      const scaledRectangle = getScaledRectangle(
        object?.rectangle as Rectangle,
        dynamicState.ratio as Ratio,
        dynamicState.offset as Offset
      );
      const position = dragRectangle(
        scaledRectangle,
        { x: event.clientX, y: event.clientY },
        dynamicState.delta || { dx: 0, dy: 0 }
      );
      dynamicDispatch({
        type: 'setStartPoint',
        payload: position.startPoint,
      });
      dynamicDispatch({ type: 'setEndPoint', payload: position.endPoint });
      break;
    case DynamicActions.SLEEP:
      dynamicDispatch({ type: 'setStartPoint', payload: initPoint });
      dynamicDispatch({ type: 'setEndPoint', payload: initPoint });
      break;

    case DynamicActions.DRAW:
    case DynamicActions.RESIZE:
      dynamicDispatch({
        type: 'setEndPoint',
        payload: initPoint,
      });
      break;
  }
}
