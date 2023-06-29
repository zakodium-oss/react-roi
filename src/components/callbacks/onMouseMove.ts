import { DynamicActions } from '../../context/DynamicContext';
import { DynamicStateType } from '../../types/DynamicStateType';
import { dragRectangle } from '../../utilities/dragRectangle';
import { getMousePosition } from '../../utilities/getMousePosition';

export function onMouseMove(draft: DynamicStateType, event: React.MouseEvent) {
  const point = getMousePosition(draft, event);
  switch (draft.action) {
    case DynamicActions.DRAG:
      const { startPoint, endPoint } = dragRectangle(draft, point);
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
