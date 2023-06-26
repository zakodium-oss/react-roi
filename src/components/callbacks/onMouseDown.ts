import { DynamicActions } from '../../context/DynamicContext';
import { DynamicStateType } from '../../types/DynamicStateType';
import { dragRectangle } from '../../utilities/dragRectangle';
import { getMousePosition } from '../../utilities/getMousePosition';

export function onMouseDown(draft: DynamicStateType, event: React.MouseEvent) {
  const point = getMousePosition(draft, event);
  switch (draft.action) {
    case DynamicActions.DRAG:
      const { startPoint, endPoint } = dragRectangle(draft, point);
      draft.startPoint = startPoint;
      draft.endPoint = endPoint;
      break;

    case DynamicActions.DRAW:
    case DynamicActions.RESIZE:
      break;
    case DynamicActions.SLEEP:
      draft.action = DynamicActions.DRAW;
      draft.startPoint = point;
      draft.endPoint = point;
      break;
    default:
      break;
  }
}
