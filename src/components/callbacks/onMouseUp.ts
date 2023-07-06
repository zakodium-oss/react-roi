import { RoiActions } from '../../context/RoiContext';
import { RoiStateType } from '../../types/RoiStateType';
import { addObject } from '../../utilities/addObject';
import { checkRectangle } from '../../utilities/checkRectangle';
import { dragRectangle } from '../../utilities/dragRectangle';
import { getMousePosition } from '../../utilities/getMousePosition';
import { updateObject } from '../../utilities/updateObject';

export function onMouseUp(draft: RoiStateType, event: React.MouseEvent) {
  const point = getMousePosition(draft, event);
  switch (draft.action) {
    case RoiActions.DRAG: {
      const { startPoint, endPoint } = dragRectangle(draft, point);
      draft.startPoint = startPoint;
      draft.endPoint = endPoint;
      draft.roiID = updateObject(draft);
      break;
    }

    case RoiActions.DRAW: {
      if (checkRectangle(draft, point)) {
        addObject(draft, crypto.randomUUID());
      } else {
        draft.roiID = undefined;
      }
      break;
    }

    case RoiActions.RESIZE: {
      draft.roiID = updateObject(draft);
      draft.pointerIndex = undefined;
      break;
    }
    case RoiActions.SLEEP:
      break;
    default:
      break;
  }
  draft.action = RoiActions.SLEEP;
  draft.startPoint = undefined;
  draft.endPoint = undefined;
  draft.delta = undefined;
}
