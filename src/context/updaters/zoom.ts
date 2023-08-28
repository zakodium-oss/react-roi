import { applyInverseX, applyInverseY } from '../../utilities/panZoom';
import { ReactRoiState, ZoomPayload } from '../roiReducer';

const MAX_ZOOM = 10;
const MIN_ZOOM = 0.5;

export function zoomAction(draft: ReactRoiState, zoom: ZoomPayload) {
  const { scale: zoomScale, refBoundingClientRect, clientX, clientY } = zoom;
  const { scale, translation } = draft.panZoom;
  const scaleNew = Math.max(MIN_ZOOM, Math.min(scale * zoomScale, MAX_ZOOM));

  const x = clientX - refBoundingClientRect.left;
  const y = clientY - refBoundingClientRect.top;

  // We apply the inverse transformation to the mouse position
  // To obtain the coordinates in the original coordinate system
  const originalX = applyInverseX(draft.panZoom, x);
  const originalY = applyInverseY(draft.panZoom, y);

  // The new scale is already known.
  draft.panZoom.scale = scaleNew;

  // Compute the new translation so that transforming the point under the mouse
  // remains at the same position before and after the zoom.
  //     affine(originalX) = affine_new(originalX)
  //     translation_new = (scale - scale_new) * originalX + translation
  translation[0] = (scale - scaleNew) * originalX + translation[0];
  translation[1] = (scale - scaleNew) * originalY + translation[1];
}

export function resetZoomAction(draft: ReactRoiState) {
  draft.panZoom.scale = 1;
  draft.panZoom.translation = [0, 0];
}
