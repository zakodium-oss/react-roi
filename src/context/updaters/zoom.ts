import { applyInverseX, applyInverseY } from '../../utilities/panZoom';
import { ReactRoiState, ZoomPayload } from '../roiReducer';

import { rectifyPanZoom } from './rectifyPanZoom';

export function zoomAction(draft: ReactRoiState, zoom: ZoomPayload) {
  const { min: minZoom, max: maxZoom } = draft.zoomDomain;
  const { scale: zoomScale, containerBoundingRect, clientX, clientY } = zoom;
  const { scale, translation } = draft.panZoom;
  const scaleNew = Math.max(minZoom, Math.min(scale * zoomScale, maxZoom));

  const x = clientX - containerBoundingRect.left;
  const y = clientY - containerBoundingRect.top;

  // We apply the inverse transformation to the pointer position
  // To obtain the coordinates in the original coordinate system
  const originalX = applyInverseX(draft.panZoom, x);
  const originalY = applyInverseY(draft.panZoom, y);

  // The new scale is already known.
  draft.panZoom.scale = scaleNew;

  // Compute the new translation so that transforming the point under the pointer
  // remains at the same position before and after the zoom.
  //     affine(originalX) = affine_new(originalX)
  //     translation_new = (scale - scale_new) * originalX + translation
  translation[0] = (scale - scaleNew) * originalX + translation[0];
  translation[1] = (scale - scaleNew) * originalY + translation[1];

  rectifyPanZoom(draft);
}

export function resetZoomAction(draft: ReactRoiState) {
  draft.panZoom.scale = 1;
  draft.panZoom.translation = [0, 0];
}
