import { Modes } from '../../context/RoiContext';
import { RoiContainerState } from '../../types/RoiContainerState';
import { getMousePosition } from '../../utilities/getMousePosition';

export function onMouseDown(draft: RoiContainerState, event: React.MouseEvent) {
  const point = getMousePosition(draft, event);
  switch (draft.mode) {
    case Modes.DRAW:
      draft.selectedRoi = undefined;
      draft.startPoint = point;
      draft.endPoint = point;
      break;
    case Modes.SELECT: {
      draft.selectedRoi = undefined;
      break;
    }
    default:
      break;
  }
}
