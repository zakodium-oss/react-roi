import { DynamicActions } from '../../context/DynamicContext';
import { DynamicStateType } from '../../types/DynamicStateType';
import { dragRectangle } from '../../utilities/dragRectangle';
import { getMousePosition } from '../../utilities/getMousePosition';

export function onMouseMove(draft: DynamicStateType, event: React.MouseEvent) {
  const point = getMousePosition(draft, event);
  const { startPoint, endPoint } = dragRectangle(draft, point);
  switch (draft.action) {
    case DynamicActions.DRAG:
      draft.startPoint = startPoint;
      draft.endPoint = endPoint;
      break;
    case DynamicActions.DRAW:
    case DynamicActions.RESIZE:
      draft.endPoint = point;
      break;
    case DynamicActions.SLEEP:
      break;
    default:
      break;
  }
}
