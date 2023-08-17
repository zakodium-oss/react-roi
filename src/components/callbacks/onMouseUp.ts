import { Modes } from '../../context/RoiContext';
import { RoiContainerState } from '../../types/RoiContainerState';
import { checkRectangle } from '../../utilities/checkRectangle';
import { getMousePosition } from '../../utilities/getMousePosition';
import { getRectangle } from '../../utilities/getRectangle';
import { getRectangleFromPoints } from '../../utilities/getRectangleFromPoints';
import { updateObject } from '../../utilities/updateObject';

export function onMouseUp(draft: RoiContainerState, event: React.MouseEvent) {
  const { mode, ratio, selectedRoi, rois, commitedRois } = draft;
  const index = rois.findIndex((roi) => roi.id === selectedRoi);
  if (index === -1) return;
  const roi = rois[index];
  const commitedRoi = commitedRois[index];
  const point = getMousePosition(
    event,
    roi.actionData.endPoint,
    roi.actionData.pointerIndex,
  );
  switch (mode) {
    case Modes.DRAW: {
      const { startPoint } = roi.actionData;
      const rectangle = getRectangle(
        getRectangleFromPoints(startPoint, point),
        ratio,
      );
      if (checkRectangle(rectangle)) {
        commitedRoi.x = Math.round(rectangle.x);
        commitedRoi.y = Math.round(rectangle.y);
        commitedRoi.width = Math.round(rectangle.width);
        commitedRoi.height = Math.round(rectangle.height);
        draft.selectedRoi = roi.id;
      } else {
        draft.rois.splice(index, 1);
        draft.selectedRoi = undefined;
      }
      break;
    }

    case Modes.SELECT: {
      if (roi.action !== 'idle') {
        draft.selectedRoi = updateObject(draft);
      }
      break;
    }
    default:
      break;
  }
  if (roi) {
    roi.action = 'idle';
  }
  roi.actionData.startPoint = undefined;
  roi.actionData.endPoint = undefined;
  roi.actionData.delta = undefined;
}
