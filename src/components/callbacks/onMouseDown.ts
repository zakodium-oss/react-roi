import { Modes } from '../../context/RoiContext';
import { Roi } from '../../types/Roi';
import { RoiContainerState } from '../../types/RoiContainerState';
import { commitedRoiTemplate } from '../../utilities/commitedRoiTemplate';
import { getMousePosition } from '../../utilities/getMousePosition';

export function onMouseDown(draft: RoiContainerState, event: React.MouseEvent) {
  const commitedRoi = commitedRoiTemplate(crypto.randomUUID());
  const { x, y, width, height, ...obj } = commitedRoi;
  const point = getMousePosition(
    event,
    { x: event.clientX, y: event.clientY },
    2,
  );
  const roi: Roi = {
    ...obj,
    action: 'drawing',
    actionData: {
      startPoint: point,
      endPoint: point,
      delta: undefined,
      pointerIndex: undefined,
    },
  };

  switch (draft.mode) {
    case Modes.DRAW:
      draft.selectedRoi = commitedRoi.id;
      draft.rois.push(roi);
      draft.commitedRois.push(commitedRoi);
      break;
    case Modes.SELECT: {
      draft.selectedRoi = undefined;
      break;
    }
    default:
      break;
  }
}
