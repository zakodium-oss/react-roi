import {
  DynamicAction,
  DynamicActions,
  DynamicStateType,
} from '../../context/DynamicContext';
import { ObjectActions, ObjectStateType } from '../../context/ObjectContext';
import { Offset } from '../../types/Offset';
import { Ratio } from '../../types/Ratio';
import { getScaledRectangle } from '../../utilities/getScaledRectangle';

export function selectObject(
  objectID: number | string | undefined,
  event: React.MouseEvent,
  objectState: ObjectStateType,
  objectDispatch: React.Dispatch<ObjectActions>,
  dynamicState: DynamicStateType,
  dynamicDispatch: React.Dispatch<DynamicAction>
) {
  const object = objectState.objects.find(
    (obj) => obj.id === dynamicState.objectID
  );
  if (!object) return;
  const scaledRectangle = getScaledRectangle(
    object.rectangle,
    dynamicState.ratio as Ratio,
    dynamicState.offset as Offset
  );
  objectDispatch({
    type: 'updateSelection',
    payload: { id: objectID as number, selected: true },
  });
  dynamicDispatch({
    type: 'setDynamicState',
    payload: {
      action: DynamicActions.DRAG,
      delta: {
        dx: event.clientX - scaledRectangle.origin.column,
        dy: event.clientY - scaledRectangle.origin.row,
      },
    },
  });
}
