import {
  DynamicAction,
  DynamicActions,
  DynamicStateType,
} from '../../context/DynamicContext';
import { Ratio } from '../../types/Ratio';
import { getScaledRectangle } from '../../utilities/getScaledRectangle';

export function selectObject(
  event: React.MouseEvent,
  dynamicState: DynamicStateType,
  dynamicDispatch: React.Dispatch<DynamicAction>
) {
  const object = dynamicState.getObject();
  if (!object) return;
  const scaledRectangle = getScaledRectangle(
    object.rectangle,
    dynamicState.ratio as Ratio
  );

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
