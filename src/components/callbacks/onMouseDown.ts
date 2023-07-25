import { Modes } from '../../context/RoiContext';
import { RoiStateType } from '../../types/RoiStateType';
import { getMousePosition } from '../../utilities/getMousePosition';

export function onMouseDown(draft: RoiStateType, event: React.MouseEvent) {
  const point = getMousePosition(draft, event);
  switch (draft.mode) {
    case Modes.DRAW:
      draft.startPoint = point;
      draft.endPoint = point;
      break;
    case Modes.SELECT: {
      break;
    }
    default:
      break;
  }
}
