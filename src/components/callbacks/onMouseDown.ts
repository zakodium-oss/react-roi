import { RoiActions } from '../../context/RoiContext';
import { RoiStateType } from '../../types/RoiStateType';
import { getMousePosition } from '../../utilities/getMousePosition';

export function onMouseDown(draft: RoiStateType, event: React.MouseEvent) {
  const point = getMousePosition(draft, event);
  switch (draft.mode) {
    case RoiActions.DRAW:
      draft.startPoint = point;
      draft.endPoint = point;
      break;
    case RoiActions.SELECT: {
      draft.selectedRoi = undefined;
      break;
    }
    default:
      break;
  }
}
