import { Modes } from '../../context/RoiContext';
import { RoiStateType } from '../../types/RoiStateType';
import { dragRectangle } from '../../utilities/dragRectangle';
import { getMousePosition } from '../../utilities/getMousePosition';

export function onMouseMove(draft: RoiStateType, event: React.MouseEvent) {
  const point = getMousePosition(draft, event);
  const { mode, selectedRoi, rois } = draft;
  const currentRoi = rois.find((roi) => roi.id === selectedRoi);
  switch (mode) {
    case Modes.DRAW:
      if (draft.startPoint) {
        draft.endPoint = point;
      }
      break;
    case Modes.SELECT:
      if (currentRoi?.isResizing) {
        const point = getMousePosition(draft, event);
        draft.endPoint = point;
      } else if (selectedRoi) {
        const { startPoint, endPoint } = dragRectangle(draft, point);
        draft.startPoint = startPoint;
        draft.endPoint = endPoint;
      }
      break;
    default:
      break;
  }
}
