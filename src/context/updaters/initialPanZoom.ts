import type { Draft } from 'immer';

import type { Size } from '../../types/utils.js';
import { assertUnreachable } from '../../utilities/assert.js';
import type { ReactRoiState } from '../roiReducer.js';

// Initial values are set to 1 and not 0 to avoid division by 0
export const initialSize: Size = {
  width: 1,
  height: 1,
};

export function updateBasePanZoom(draft: Draft<ReactRoiState>) {
  if (!draft.isInitialized) {
    return;
  }

  switch (draft.resizeStrategy) {
    case 'contain':
      updateBasePanZoomContain(draft);
      break;
    case 'cover':
      updateBasePanZoomCover(draft);
      break;
    case 'center':
      updateBasePanZoomCenter(draft);
      break;
    case 'none':
      updateInitialPanZoomNone(draft);
      break;
    default:
      assertUnreachable(draft.resizeStrategy);
  }
}

function updateBasePanZoomCover(draft: Draft<ReactRoiState>) {
  const { targetSize, containerSize } = draft;
  const wFactor = targetSize.width / containerSize.width;
  const hFactor = targetSize.height / containerSize.height;
  if (wFactor > 1 || hFactor > 1) {
    // Target is bigger than container
    if (wFactor > hFactor) {
      // Target is wider than container
      draft.basePanZoom.scale = 1 / hFactor;
      draft.basePanZoom.translation = [
        -(targetSize.width / hFactor - containerSize.width) / 2,
        0,
      ];
    } else {
      // Target is taller than container
      draft.basePanZoom.scale = 1 / wFactor;
      draft.basePanZoom.translation = [
        0,
        -(targetSize.height / wFactor - containerSize.height) / 2,
      ];
    }
  } else {
    // The image is smaller, just center it
    draft.basePanZoom.scale = 1;
    updateBasePanZoomCenter(draft);
  }
}

function updateBasePanZoomContain(draft: Draft<ReactRoiState>) {
  const { targetSize, containerSize } = draft;
  const wFactor = targetSize.width / containerSize.width;
  const hFactor = targetSize.height / containerSize.height;
  if (wFactor > 1 || hFactor > 1) {
    // Target is bigger than the container
    if (wFactor > hFactor) {
      // Target is wider than the container
      draft.basePanZoom.scale = 1 / wFactor;
      updateBasePanZoomCenter(draft);
    } else {
      // Target is taller than the container
      draft.basePanZoom.scale = 1 / hFactor;
      updateBasePanZoomCenter(draft);
    }
  } else {
    // The image is smaller, just center it
    draft.basePanZoom.scale = 1;
    updateBasePanZoomCenter(draft);
  }
}

function updateBasePanZoomCenter(draft: Draft<ReactRoiState>) {
  const { targetSize, containerSize, basePanZoom } = draft;
  draft.basePanZoom.translation = [
    (containerSize.width - basePanZoom.scale * targetSize.width) / 2,
    (containerSize.height - basePanZoom.scale * targetSize.height) / 2,
  ];
}

function updateInitialPanZoomNone(draft: Draft<ReactRoiState>) {
  draft.basePanZoom.scale = 1;
  draft.basePanZoom.translation = [0, 0];
}
