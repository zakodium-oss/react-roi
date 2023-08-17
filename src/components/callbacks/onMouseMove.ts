import { Modes } from '../../context/RoiContext';
import { RoiContainerState } from '../../types/RoiContainerState';
import { dragRectangle } from '../../utilities/dragRectangle';
import { getMousePosition } from '../../utilities/getMousePosition';

export function onMouseMove(draft: RoiContainerState, event: React.MouseEvent) {
  const { x, y } = document
    .getElementById('roi-container-svg')
    .getBoundingClientRect();
  const { mode, selectedRoi, rois } = draft;
  const roi = rois.find((roi) => roi.id === draft.selectedRoi);
  const point = getMousePosition(event, roi.actionData.endPoint, roi.actionData.pointerIndex);
  if (!roi) return;
  switch (mode) {
    case Modes.DRAW:
      if (roi.actionData.startPoint) {
        roi.actionData.endPoint = point;
      }
      break;
    case Modes.SELECT:
      if (roi.action === 'resizing') {
        roi.actionData.endPoint = point;
      } else if (selectedRoi) {
        const { startPoint, endPoint } = dragRectangle(draft, { x: event.clientX - x, y: event.clientY - y });
        roi.actionData.startPoint = startPoint;
        roi.actionData.endPoint = endPoint;
      }
      break;
    default:
      break;
  }
}
