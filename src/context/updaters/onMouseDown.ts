import { Roi } from '../../types/Roi';
import { commitedRoiTemplate } from '../../utilities/commitedRoiTemplate';
import { getMousePosition } from '../../utilities/getMousePosition';
import { ReactRoiState } from '../roiReducer';

export function onMouseDown(draft: ReactRoiState, event: React.MouseEvent) {
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
    case 'draw':
      draft.selectedRoi = commitedRoi.id;
      draft.rois.push(roi);
      draft.commitedRois.push(commitedRoi);
      break;
    case 'select': {
      draft.selectedRoi = undefined;
      break;
    }
    default:
      break;
  }
}
