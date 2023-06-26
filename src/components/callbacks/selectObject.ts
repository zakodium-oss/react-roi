import { DynamicAction, DynamicActions } from '../../context/DynamicContext';
import { DynamicStateType } from '../../types/DynamicStateType';
import { getScaledRectangle } from '../../utilities/getScaledRectangle';

export function selectObject(
  event: React.MouseEvent,
  dynamicState: DynamicStateType,
  dynamicDispatch: React.Dispatch<DynamicAction>
) {
  const { objects, objectID, ratio } = dynamicState;
  const object = objects.find((obj) => obj.id === objectID);
  if (!object) return;
  const scaledRectangle = getScaledRectangle(object.rectangle, ratio);

  dynamicDispatch({
    type: 'setDynamicState',
    payload: {
      action: DynamicActions.DRAG,
      delta: {
        dx:
          event.clientX -
          scaledRectangle.origin.column -
          (dynamicState.offset?.left as number),
        dy:
          event.clientY -
          scaledRectangle.origin.row -
          (dynamicState.offset?.top as number),
      },
    },
  });
}
