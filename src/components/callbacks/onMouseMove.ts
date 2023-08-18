import { ReactRoiState } from '../../context/roiReducer';
import { dragRectangle } from '../../utilities/dragRectangle';
import { getMousePosition } from '../../utilities/getMousePosition';
import { sortPoints } from '../../utilities/sortPoints';

export function onMouseMove(draft: ReactRoiState, event: React.MouseEvent) {
  const { x, y } = document
    .getElementById('roi-container-svg')
    .getBoundingClientRect();
  const { mode, selectedRoi, rois } = draft;
  const roi = rois.find((roi) => roi.id === draft.selectedRoi);
  if (!roi) return;
  const point = getMousePosition(
    event,
    roi.actionData.endPoint,
    roi.actionData.pointerIndex,
  );
  if (!roi) return;
  switch (mode) {
    case 'draw':
      if (roi.actionData.startPoint) {
        roi.actionData.endPoint = point;
      }
      break;
    case 'select': {
      if (roi.action === 'resizing') {
        roi.actionData.endPoint = point;
      } else if (selectedRoi) {
        const { startPoint, endPoint } = dragRectangle(draft, {
          x: event.clientX - x,
          y: event.clientY - y,
        });
        const { p0, p1 } = sortPoints(startPoint, endPoint);
        roi.actionData.startPoint = p0;
        roi.actionData.endPoint = p1;
      }
      break;
    }
    default:
      break;
  }
}
