import { RoiActions } from '../../context/RoiContext';
import { RoiStateType } from '../../types/RoiStateType';
import { addObject } from '../../utilities/addObject';
import { checkRectangle } from '../../utilities/checkRectangle';
import { getMousePosition } from '../../utilities/getMousePosition';
import { updateObject } from '../../utilities/updateObject';

export function onMouseUp(draft: RoiStateType, event: React.MouseEvent) {
  const point = getMousePosition(draft, event);
  const { mode, selectedRoi, rois } = draft;
  const currentRoi = rois.find((roi) => roi.id === selectedRoi);
  switch (mode) {
    case RoiActions.DRAW: {
      if (checkRectangle(draft, point)) {
        addObject(draft, crypto.randomUUID());
      } else {
        draft.selectedRoi = undefined;
      }
      break;
    }

    case RoiActions.SELECT: {
      if (currentRoi?.isMoving || currentRoi?.isResizing) {
        draft.selectedRoi = updateObject(draft);
      }
      draft.pointerIndex = undefined;
      break;
    }
    default:
      break;
  }
  if (currentRoi) {
    currentRoi.isMoving = false;
    currentRoi.isResizing = false;
  }
  draft.startPoint = undefined;
  draft.endPoint = undefined;
  draft.delta = undefined;
}
