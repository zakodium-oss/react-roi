import {
  DynamicAction,
  DynamicActions,
  DynamicStateType,
} from '../../context/DynamicContext';
import { ObjectStateType } from '../../context/ObjectContext';
import { Offset } from '../../types/Offset';
import { Ratio } from '../../types/Ratio';
import { Rectangle } from '../../types/Rectangle';
import { dragRectangle } from '../../utilities/dragRectangle';
import { getScaledRectangle } from '../../utilities/getScaledRectangle';

export function onMouseDown(
  event: React.MouseEvent,
  objectState: ObjectStateType,
  dynamicState: DynamicStateType,
  dynamicDispatch: React.Dispatch<DynamicAction>
) {
  const object = objectState.objects.find(
    (obj) => obj.id === dynamicState.objectID
  );
  const startPoint = { x: event.clientX, y: event.clientY };
  switch (dynamicState.action) {
    case DynamicActions.SLEEP:
      dynamicDispatch({ type: 'setAction', payload: DynamicActions.DRAW });
      dynamicDispatch({
        type: 'setPosition',
        payload: { startPoint, endPoint: startPoint },
      });
      break;

    case DynamicActions.DRAG:
      const scaledRectangle = getScaledRectangle(
        object?.rectangle as Rectangle,
        dynamicState.ratio as Ratio,
        dynamicState.offset as Offset
      );
      const position = dragRectangle(
        scaledRectangle,
        startPoint,
        dynamicState.delta || { dx: 0, dy: 0 }
      );
      dynamicDispatch({ type: 'setPosition', payload: position });
      break;

    case DynamicActions.DRAW:
    case DynamicActions.RESIZE:
      // dynamicDispatch({ type: 'setEndPoint', payload: startPoint });
      break;
  }
}
