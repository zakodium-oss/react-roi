import { DynamicActions } from '../../context/DynamicContext';
import { DynamicStateType } from '../../types/DynamicStateType';
import { addObject } from '../../utilities/addObject';
import { checkRectangle } from '../../utilities/checkRectangle';
import { dragRectangle } from '../../utilities/dragRectangle';
import { getMousePosition } from '../../utilities/getMousePosition';
import { updateObject } from '../../utilities/updateObject';

export function onMouseUp(draft: DynamicStateType, event: React.MouseEvent) {
  const point = getMousePosition(draft, event);
  switch (draft.action) {
    case DynamicActions.DRAG: {
      const { startPoint, endPoint } = dragRectangle(draft, point);
      draft.startPoint = startPoint;
      draft.endPoint = endPoint;
      draft.objectID = updateObject(draft) as string;
      break;
    }

    case DynamicActions.DRAW: {
      if (checkRectangle(draft, point)) {
        addObject(draft, crypto.randomUUID());
      } else {
        draft.objectID = undefined;
      }
      break;
    }

    case DynamicActions.RESIZE: {
      draft.objectID = updateObject(draft) as string;
      draft.pointerIndex = undefined;
      break;
    }
    case DynamicActions.SLEEP:
      break;
    default:
      break;
  }
  draft.action = DynamicActions.SLEEP;
  draft.startPoint = undefined;
  draft.endPoint = undefined;
  draft.delta = undefined;
}
