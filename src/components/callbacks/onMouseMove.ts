import { DynamicActions, DynamicStateType } from '../../context/DynamicContext';
import { ObjectStateType } from '../../context/ObjectContext';
import {
  PositionAction,
  PositionStateType,
} from '../../context/PositionContext';
import { DataObject } from '../../types/DataObject';
import { dragRectangle } from '../../utilities/dragRectangle';
import { getScaledRectangle } from '../../utilities/getScaledRectangle';

export function onMouseMove(
  event: React.MouseEvent,
  rect: { offsetLeft: number; offsetTop: number },
  dynamicState: DynamicStateType,
  objectState: ObjectStateType,
  positionState: PositionStateType,
  positionDispatch: React.Dispatch<PositionAction>
) {
  const object = objectState.objects.find(
    (obj) => obj.id === dynamicState.objectID
  ) as DataObject;
  if (dynamicState.isMouseDown) {
    switch (dynamicState.action) {
      case DynamicActions.DRAG:
        const scaledRectangle = getScaledRectangle(
          object.rectangle,
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
      case DynamicActions.DRAW:
      case DynamicActions.RESIZE:
        positionDispatch({
          type: 'setEndPoint',
          payload: { x: event.clientX, y: event.clientY },
        });
        break;
    }
  }
}
