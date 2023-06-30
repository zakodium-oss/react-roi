import { RoiActions } from '../../context/DynamicContext';
import { RoiStateType } from '../../types/RoiStateType';
import { dragRectangle } from '../../utilities/dragRectangle';
import { getMousePosition } from '../../utilities/getMousePosition';

export function onMouseDown(draft: RoiStateType, event: React.MouseEvent) {
  const point = getMousePosition(draft, event);
  const { startPoint, endPoint } = dragRectangle(draft, point);
  switch (draft.action) {
    case RoiActions.DRAG:
      draft.startPoint = startPoint;
      draft.endPoint = endPoint;
      break;

    case RoiActions.DRAW:
    case RoiActions.RESIZE:
      break;
    case RoiActions.SLEEP:
      draft.action = RoiActions.DRAW;
      draft.startPoint = point;
      draft.endPoint = point;
      break;
    default:
      break;
  }
}
