import { assertUnreachable } from '../../utilities/assert.ts';
import { getRectanglePoints } from '../../utilities/box.js';
import { getIdentityPanzoom, zoomTo } from '../../utilities/panZoom.js';
import { getBoundaries } from '../../utilities/point.js';
import type {
  ReactRoiState,
  ZoomIntoROIPayload,
  ZoomPayload,
} from '../roiReducer.js';

import { rectifyPanZoom } from './rectifyPanZoom.js';

export function zoomAction(draft: ReactRoiState, zoom: ZoomPayload) {
  const { scale: zoomScale, containerBoundingRect, clientX, clientY } = zoom;

  const x = clientX - containerBoundingRect.left;
  const y = clientY - containerBoundingRect.top;
  const newPanZoom = zoomTo(draft, zoomScale, { x, y });
  Object.assign(draft.panZoom, newPanZoom);
  rectifyPanZoom(draft);
}

export function resetZoomAction(draft: ReactRoiState) {
  const stateWithResetPanzoom = {
    ...draft,
    panZoom: getIdentityPanzoom(),
  };
  switch (draft.startPanZoom.origin) {
    case 'top-left':
      draft.panZoom = zoomTo(stateWithResetPanzoom, draft.startPanZoom.scale, {
        x: 0,
        y: 0,
      });
      break;
    case 'center': {
      const point = {
        x: draft.containerSize.width / 2,
        y: draft.containerSize.height / 2,
      };

      draft.panZoom = zoomTo(
        stateWithResetPanzoom,
        draft.startPanZoom.scale,
        point,
      );
      break;
    }
    default:
      assertUnreachable(draft.startPanZoom.origin);
  }
  draft.panZoom.translation[0] += draft.startPanZoom.translation[0];
  draft.panZoom.translation[1] += draft.startPanZoom.translation[1];
  rectifyPanZoom(draft);
}

export function zoomIntoROI(draft: ReactRoiState, zoom: ZoomIntoROIPayload) {
  const {
    roiOrPoints,
    options: { margin },
  } = zoom;
  // Avoid dividing by 0
  const sanitizedMargin = Math.min(margin, 1 - Number.EPSILON);
  const { containerSize } = draft;

  const boundaries = Array.isArray(roiOrPoints)
    ? getBoundaries(roiOrPoints)
    : getBoundaries(getRectanglePoints(roiOrPoints));
  const width = boundaries.maxX - boundaries.minX;
  const height = boundaries.maxY - boundaries.minY;
  const center = {
    x: boundaries.minX + width / 2,
    y: boundaries.minY + height / 2,
  };

  const totalScale =
    Math.min(containerSize.width / width, containerSize.height / height) *
    (1 - sanitizedMargin);

  draft.panZoom.scale = totalScale / draft.basePanZoom.scale;

  // Target translation for initial and transform panzoom combined
  const translationX = containerSize.width / 2 - center.x * totalScale;
  const translationY = containerSize.height / 2 - center.y * totalScale;

  draft.panZoom.translation = [
    translationX - draft.panZoom.scale * draft.basePanZoom.translation[0],
    translationY - draft.panZoom.scale * draft.basePanZoom.translation[1],
  ];

  rectifyPanZoom(draft);
}
