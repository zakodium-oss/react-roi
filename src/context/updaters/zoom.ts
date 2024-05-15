import { getRectanglePoints } from '../../utilities/box';
import { applyInverseX, applyInverseY } from '../../utilities/panZoom';
import { getBoundaries } from '../../utilities/point';
import { ReactRoiState, ZoomIntoROIPayload, ZoomPayload } from '../roiReducer';

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

export function zoomIntoROI(draft: ReactRoiState, zoom: ZoomIntoROIPayload) {
  const {
    roi,
    options: { margin },
  } = zoom;
  // Avoid dividing by 0
  const sanitizedMargin = Math.min(margin, 1 - Number.EPSILON);
  const { containerSize } = draft;

  const boundaries = Array.isArray(roi)
    ? getBoundaries(roi)
    : getBoundaries(getRectanglePoints(roi));
  const width = boundaries.maxX - boundaries.minX;
  const height = boundaries.maxY - boundaries.minY;
  const center = {
    x: boundaries.minX + width / 2,
    y: boundaries.minY + height / 2,
  };

  const totalScale =
    Math.min(containerSize.width / width, containerSize.height / height) *
    (1 - sanitizedMargin);

  draft.panZoom.scale = totalScale / draft.initialPanZoom.scale;

  // Target translation for initial and transform panzoom combined
  const translationX = containerSize.width / 2 - center.x * totalScale;
  const translationY = containerSize.height / 2 - center.y * totalScale;

  draft.panZoom.translation = [
    translationX - draft.panZoom.scale * draft.initialPanZoom.translation[0],
    translationY - draft.panZoom.scale * draft.initialPanZoom.translation[1],
  ];

  rectifyPanZoom(draft);
}
