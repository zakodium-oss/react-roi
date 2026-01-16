import type { Draft } from 'immer';

import {
  applyTransformX,
  applyTransformY,
  computeTotalPanZoom,
} from '../../utilities/panZoom.js';
import type { ReactRoiState } from '../roiReducer.js';

/**
 * Apply a translation on the zoom so that it fits the constraints given by the zoomDomain configuration
 * @param draft
 */
export function rectifyPanZoom(draft: Draft<ReactRoiState>) {
  const panZoom = computeTotalPanZoom(draft);
  const minX = applyTransformX(panZoom, 0);
  const maxX = applyTransformX(panZoom, draft.targetSize.width);
  const minY = applyTransformY(panZoom, 0);
  const maxY = applyTransformY(panZoom, draft.targetSize.height);

  const shouldUpdateLeft =
    minX / draft.containerSize.width > draft.zoomDomain.spaceAroundTarget;
  const shouldUpdateRight =
    maxX / draft.containerSize.width < 1 - draft.zoomDomain.spaceAroundTarget;
  const shouldUpdateTop =
    minY / draft.containerSize.height > draft.zoomDomain.spaceAroundTarget;
  const shouldUpdateBottom =
    maxY / draft.containerSize.height < 1 - draft.zoomDomain.spaceAroundTarget;

  if (!(shouldUpdateLeft && shouldUpdateRight)) {
    if (shouldUpdateLeft || shouldUpdateRight) {
      const translation1 = computePanZoomTranslation(
        draft,
        0,
        draft.zoomDomain.spaceAroundTarget * draft.containerSize.width,
        0,
      );
      const translation2 = computePanZoomTranslation(
        draft,
        draft.targetSize.width,
        (1 - draft.zoomDomain.spaceAroundTarget) * draft.containerSize.width,
        0,
      );
      const diff1 = abs(translation1 - draft.panZoom.translation[0]);
      const diff2 = abs(translation2 - draft.panZoom.translation[0]);
      if (diff1 < diff2) {
        draft.panZoom.translation[0] = translation1;
      } else {
        draft.panZoom.translation[0] = translation2;
      }
    }
  }

  if (!(shouldUpdateTop && shouldUpdateBottom)) {
    if (shouldUpdateTop || shouldUpdateBottom) {
      const translation1 = computePanZoomTranslation(
        draft,
        0,
        draft.zoomDomain.spaceAroundTarget * draft.containerSize.height,
        1,
      );
      const translation2 = computePanZoomTranslation(
        draft,
        draft.targetSize.height,
        (1 - draft.zoomDomain.spaceAroundTarget) * draft.containerSize.height,
        1,
      );
      const diff1 = abs(translation1 - draft.panZoom.translation[1]);
      const diff2 = abs(translation2 - draft.panZoom.translation[1]);
      if (diff1 < diff2) {
        draft.panZoom.translation[1] = translation1;
      } else {
        draft.panZoom.translation[1] = translation2;
      }
    }
  }
}

function computePanZoomTranslation(
  draft: ReactRoiState,
  target: number,
  container: number,
  dim: 0 | 1,
) {
  const { basePanZoom, panZoom } = draft;
  return (
    container -
    target * basePanZoom.scale * panZoom.scale -
    panZoom.scale * basePanZoom.translation[dim]
  );
}

function abs(value: number) {
  return value < 0 ? -value : value;
}
