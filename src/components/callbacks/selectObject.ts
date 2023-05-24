import {
  DynamicAction,
  DynamicActions,
  DynamicStateType,
} from '../../context/DynamicContext';
import { ObjectActions, ObjectStateType } from '../../context/ObjectContext';
import { PositionStateType } from '../../context/PositionContext';
import { getScaledRectangle } from '../../utilities/getScaledRectangle';

export function selectObject(
  objectID: number | string | undefined,
  event: React.MouseEvent,
  rect: {
    offsetLeft: number;
    offsetTop: number;
  },
  objectState: ObjectStateType,
  objectDispatch: React.Dispatch<ObjectActions>,
  positionState: PositionStateType,
  dynamicState: DynamicStateType,
  dynamicDispatch: React.Dispatch<DynamicAction>
) {
  const object = objectState.objects.find(
    (obj) => obj.id === dynamicState.objectID
  );
  if (!object) return;
  objectDispatch({
    type: 'updateSelection',
    payload: { id: objectID as number, selected: true },
  });
  const scaledRectangle = getScaledRectangle(
    object.rectangle,
    positionState.delta,
    rect
  );
  dynamicDispatch({
    type: 'setDynamicState',
    payload: {
      isMouseDown: true,
      action: DynamicActions.DRAG,
      point: {
        x: event.clientX,
        y: event.clientY,
      },
      delta: {
        dx: event.clientX - scaledRectangle.origin.column,
        dy: event.clientY - scaledRectangle.origin.row,
      },
    },
  });
}
