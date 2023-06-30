import { RoiActions } from '../../context/RoiContext';
import { RoiStateType } from '../../types/RoiStateType';
import { dragRectangle } from '../../utilities/dragRectangle';
import { getMousePosition } from '../../utilities/getMousePosition';

export function onMouseMove(draft: RoiStateType, event: React.MouseEvent) {
  const point = getMousePosition(draft, event);
  const { startPoint, endPoint } = dragRectangle(draft, point);
  switch (draft.action) {
    case RoiActions.DRAG:
      draft.startPoint = startPoint;
      draft.endPoint = endPoint;
      break;
    case RoiActions.DRAW:
    case RoiActions.RESIZE:
      draft.endPoint = point;
      break;
    case RoiActions.SLEEP:
      break;
    default:
      break;
  }
}
